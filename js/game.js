class Game {
  constructor(canvas) {
    this.width = 400;                                     // Width of game area.
    this.height = 400;                                    // Height of game area.
    this.statusHeight = 24;                               // Height of status bar.

    this.canvas = canvas;                                 // Canvas onto which the game is drawn.
    this.canvas.width = this.width;
    this.canvas.height = this.height + this.statusHeight;
    this.offscreen = makeImage(this.canvas.width,         // Offscreen canvas, for double buffering.
                               this.canvas.height);
    this.ctx = context2d(this.canvas);                    // Original canvas context.
    this.buf = context2d(this.offscreen);                 // Offscreen canvas context.

    this.cache = {};                                      // Data cache, for use by game components.
    this.loader = new ImageLoader();                      // Object for loading images from disk.
    this.selector = new StageSelector(this);              // Object for handling stage selection.
    this.stage = null;                                    // Current game stage.
    this.stars = new StarField(this.width, this.height);  // Field of stars in the background.
    this.copter = new Copter(this);                       // Our hero.
    this.things = [];                                     // List of things onscreen.
    this.messages = [];                                   // List of onscreen text messages.
    this.score = 0;                                       // The player's score.
    this.pause = false;                                   // Whether game is paused.
    this.fast = false;                                    // Whether fast forward is enabled.
    this.debug = false;                                   // Debugging flag.
    this.ticks = 0;                                       // Game frame counter.
    this.keys = new Set();                                // Set of keys current being held.

    // Start the music.
    this.player = new SoundPlayer();
    //this.player.playMusic("../assets/metblast.mid");
  }

  /**
   * Loads the given sprite image from an external source.
   * Images are loaded once and then cached for subsequent access.
   */
  loadSprite(name) {
    if (name.indexOf('.') < 0) name += '.png';
    var path = `../assets/${name}`;
    var image = this.loader.image(path);
    return new Sprite(image);
  }

  /**
   * Obtains the value associated with the given key, creating it via
   * the specified generator function if it does not already exist.
   * Useful for caching the results of expensive computations.
   */
  retrieve(key, obj, generate) {
    if (!(key in this.cache)) this.cache[key] = generate(obj);
    return this.cache[key];
  }

  /** Overlays a text message to the screen. */
  printMessage(m) { this.messages.push(m); }

  /** Whether there are any enemies currently onscreen. */
  isClear() {
    for (var i=0; i<this.things.length; i++) {
      var type = this.things[i].type;
      if (type != ThingTypes.GOOD && type != ThingTypes.GOOD_SHOT) {
        return false;
      }
    }
    return true;
  }

  /** Resets the game to its initial state. */
  resetGame() {
    this.things = [];
    this.messages = [];
    this.copter = new Copter(this);
    this.ticks = 0;
    this.score = 0;
    this.stage = null;
    this.selector.reset();
  }

  /** Draws the veggie copter graphics to the linked canvas. */
  draw() {
    this.buf.fillStyle = Colors.Black;
    this.buf.fillRect(0, 0, this.offscreen.width, this.offscreen.height);

    // star field
    this.stars.draw(this.buf);

    // redraw things
    this.things.forEach(thing => thing.draw(this.buf));

    if (this.debug) {
      this.things.forEach(thing => {
        // draw bounding box
        this.buf.strokeStyle = Colors.Red;
        thing.bounds.forEach(rect => {
          this.buf.beginPath();
          this.buf.rect(rect.x, rect.y, rect.width, rect.height);
          this.buf.stroke();
        });

        // draw power level
        this.buf.strokeStyle = Colors.White;
        var xint = Math.trunc(thing.cx) - 3;
        var yint = Math.trunc(thing.cy) + 6;
        this.buf.fillText("" + thing.power, xint, yint);
      });
    }

    // draw text messages
    var m = this.messages.slice();
    for (var i=0; i<m.length; i++) m[i].draw(this.buf);

    // draw stage selection
    if (this.stage == null) this.selector.draw(this.buf);

    // draw status bar
    this.buf.fillStyle = Colors.DarkGray;
    this.buf.fillRect(0, this.height + 1, this.width, 24);
    this.buf.beginPath();
    this.buf.strokeStyle = Colors.White;
    this.buf.moveTo(0, this.height);
    this.buf.lineTo(this.width, this.height);
    this.buf.stroke();

    // draw life bar
    var x = 1;
    this.buf.beginPath();
    this.buf.rect(x, this.height + 2, 103, 20);
    this.buf.stroke();
    this.buf.strokeStyle = Colors.Black;
    this.buf.fillRect(x + 1, this.height + 3, 102, 19);
    for (var i=0; i<this.copter.hp; i++) {
      var q = i / 99;
      var r = Math.trunc(255 * (1 - q));
      var g = Math.trunc(255 * q);
      this.buf.beginPath();
      this.buf.strokeStyle = color(r, g, 0);
      this.buf.moveTo(x + 2 + i, this.height + 4);
      this.buf.lineTo(x + 2 + i, this.height + 20);
      this.buf.stroke();
    }

    // draw weapon selector
    this.copter.drawWeaponStatus(this.buf, x + 107, this.height + 2);

    // blit the offscreen canvas to the on-screen canvas
    this.ctx.drawImage(this.offscreen, 0, 0);
  }

  /** Updates the game state. */
  update() {
    if (this.pause) return;
    this.tick();
    if (this.fast) this.tick();
  }

  /** Advances the game state by one tick. */
  tick() {
    var things = this.things.slice(); // NB: Make a copy!

    // collision detection
    this.checkCollisions(things);

    // update star field
    this.stars.move();

    // move things
    things.forEach(thing => thing.move());

    // update text messages
    this.messages.slice().forEach(m => {
      if (m.checkFinished()) this.messages.remove(m);
    });

    // allow things the chance to attack
    things.forEach(thing => {
      append(this.things, thing.shoot());
      append(this.things, thing.trigger());
    });

    // purge dead things
    things.filter(thing => thing.isDead()).forEach(thing => {
      var index = this.things.indexOf(thing);
      if (index >= 0) this.things.splice(index, 1);
      if (thing == this.copter) {
        this.printMessage(new Message("Game Over",
          (this.width - 250) / 2, (this.height - 30) / 2 + 30,
          48, Colors.Red, Infinity));
        this.printMessage(new Message("Press space to play again",
          (this.width - 170) / 2, (this.height - 30) / 2 + 50,
          16, Colors.Gray, Infinity));
      }
    });

    if (this.stage && !this.copter.isDead()) {
      var done = this.stage.executeScript();
      if (done) {
        this.stage.setCompleted(true);
        this.selector.adjustStage(true);
        this.stage = null;
        this.things = [];
        this.copter.reset();
      }
    }

    this.ticks++;
  }

  /** Handles key presses. */
  keyPressed(e) {
    if (!this.keys.has(e.keyCode)) {
      this.keys.add(e.keyCode);
      if (this.debug) console.info(`key pressed: ${e.keyCode}`);
      this.things.slice().forEach(thing => thing.keyPressed(e));

      if (Keys.SHOOT.includes(e.keyCode)) {
        if (this.stage == null) {
          this.stage = this.selector.selectedStage;
          this.stage.resetScript();
          this.things.push(this.copter);
          this.copter.attack.reactivate();
        }
        else if (this.copter.isDead()) this.resetGame();
      }
      else if (Keys.PAUSE.includes(e.keyCode)) {
        this.pause = !this.pause;
      }
      else if (Keys.MOVE_LEFT.includes(e.keyCode)) {
        if (this.stage == null) this.selector.adjustStage(false);
      }
      else if (Keys.MOVE_RIGHT.includes(e.keyCode)) {
        if (this.stage == null) this.selector.adjustStage(true);
      }
      else if (Keys.FAST_FORWARD.includes(e.keyCode)) this.fast = true;
      else if (Keys.TOGGLE_DEBUG.includes(e.keyCode)) {
        this.debug = !this.debug;
        console.info(`Debug mode ${this.debug ? 'enabled' : 'disabled'}`);
      }
      else if (Keys.TOGGLE_MUTE.includes(e.keyCode)) this.player.toggleMute();
    }
  }

  /** Handles key releases. */
  keyReleased(e) {
    this.keys.delete(e.keyCode);
    if (this.debug) console.info(`key released: ${e.keyCode}`);
    this.things.slice().forEach(thing => thing.keyReleased(e));
    if (Keys.FAST_FORWARD.includes(e.keyCode)) this.fast = false;
  }

  /** Does collision detection between the given things. */
  checkCollisions(things) {
    // sort things into types
    var tt = {};
    Object.values(ThingTypes).forEach(type => tt[type] = []);
    things.forEach(thing => tt[thing.type].push(thing));

    // do collision detection between copter and power-ups
    this.doCollisions([this.copter], tt[ThingTypes.POWER_UP], this.applyPowerUp);

    // do collision detection between good and evil objects
    this.doCollisions(tt[ThingTypes.GOOD], tt[ThingTypes.EVIL], this.crash);
    this.doCollisions(tt[ThingTypes.GOOD_SHOT], tt[ThingTypes.EVIL], this.crash);
    this.doCollisions(tt[ThingTypes.GOOD], tt[ThingTypes.EVIL_SHOT], this.crash);
  }

  /**
   * Executes collisions between two lists of things. The given collide
   * function is invoked with each pair of intersecting things.
   */
  doCollisions(aThings, bThings, collide) {
    for (var a=0; a<aThings.length; a++) {
      var aThing = aThings[a];
      for (var b=0; b<bThings.length; b++) {
        var bThing = bThings[b];
        if (aThing.isDead()) break; // go to next aThing
        if (bThing.isDead()) continue; // go to the next bThing
        if (this.intersects(aThing.bounds, bThing.bounds)) {
          collide(aThing, bThing);
        }
      }
    }
  }

  /** Checks whether any rectangle of A intersects with any rectangle of B. */
  intersects(aBounds, bBounds) {
    for (var a=0; a<aBounds.length; a++) {
      for (var b=0; b<bBounds.length; b++) {
        if (aBounds[a].intersects(bBounds[b])) return true;
      }
    }
    return false;
  }

  applyPowerUp(hero, powerup) {
    if (powerup.weapon) {
      // grant new weapon to copter
      hero.attack.addWeapon(powerup.weapon);
    }
    else {
      // increase power of selected weapon by one
      if (hero.attack.power < 10) hero.attack.power++;
    }
    powerup.hp = 0;
  }

  /**
   * Calculates the effect of two things crashing into each other.
   * Each thing might take damage, depending on their type.
   */
  crash(aThing, bThing) {
    var aHurts = bThing.harms(aThing);
    var bHurts = aThing.harms(bThing);
    // NB: We cannot use `this` for the game here, because the crash method
    // is passed to the doCollisions method as a function, and apparently
    // that results in some scoping difference where `this` is not defined.
    if (aHurts) bThing.game.smack(bThing, aThing);
    if (bHurts) aThing.game.smack(aThing, bThing);
  }

  /** Instructs the given attacker to damage the specified defender. */
  smack(attacker, defender) {
    var beforeHP = defender.hp;
    defender.damage(attacker.power);
    if (defender.isDead() && defender.type == ThingTypes.EVIL) {
      this.score += defender.score;
    }
  }
}

var game = null;

function animate() {
  try {
    game.update();
    game.draw();
    requestAnimationFrame(animate);
  }
  catch (error) {
    console.error(error);
  }
}

window.onload = function() {
  game = new Game(document.getElementById('canvas'));
  window.onkeydown = function(e) { game.keyPressed(e); }
  window.onkeyup = function(e) { game.keyReleased(e); }
  animate();
};
