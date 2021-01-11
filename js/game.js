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
   * Loads the given sprite image from disk, using the
   * specified bounding box insets for collision detection.
   */
  sprite(name, xoff, yoff, boxes) {
    if (name.indexOf('.') < 0) name += '.png';
    var path = `../assets/${name}`;
    if (xoff == null) xoff = 0;
    if (yoff == null) yoff = 0;
    if (boxes == null) boxes = [];
    var image = this.loader.image(path);
    var sprite = new Sprite(image, xoff, yoff);
    for (var i=0; i<boxes.length; i++) sprite.addBox(boxes[i]);
    return sprite;
  }

  /** Overlays a text message to the screen. */
  printMessage(m) { this.messages.push(m); }

  /** Whether there are any enemies currently onscreen. */
  isClear() {
    for (var i=0; i<this.things.length; i++) {
      var t = this.things[i];
      if (t.type != ThingTypes.GOOD && t.type != ThingTypes.GOOD_BULLET) {
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
    this.buf.fillStyle = 'black';
    this.buf.fillRect(0, 0, this.offscreen.width, this.offscreen.height);

    // star field
    this.stars.drawStars(this.buf);

    // redraw things
    this.things.forEach(t => t.draw(this.buf));

    if (this.debug) {
      this.things.forEach(t => {
        // draw bounding box
        this.buf.strokeStyle = "red";
        var r = t.boxes;
        for (var j=0; j<r.length; j++) {
          this.buf.beginPath();
          this.buf.rect(r[j].x, r[j].y, r[j].width, r[j].height);
          this.buf.stroke();
        }

        // draw power level
        this.buf.strokeStyle = "white";
        var xint = Math.trunc(t.cx) - 3;
        var yint = Math.trunc(t.cy) + 6;
        this.buf.fillText("" + t.power, xint, yint);
      });
    }

    // draw text messages
    var m = this.messages.slice();
    for (var i=0; i<m.length; i++) m[i].draw(this.buf);

    // draw stage selection
    if (this.stage == null) this.selector.draw(this.buf);

    // draw status bar
    this.buf.fillStyle = "darkgray";
    this.buf.fillRect(0, this.height + 1, this.width, 24);
    this.buf.beginPath();
    this.buf.strokeStyle = "white";
    this.buf.moveTo(0, this.height);
    this.buf.lineTo(this.width, this.height);
    this.buf.stroke();

    // draw life bar
    var x = 1;
    this.buf.beginPath();
    this.buf.rect(x, this.height + 2, 103, 20);
    this.buf.stroke();
    this.buf.strokeStyle = "black";
    this.buf.fillRect(x + 1, this.height + 3, 102, 19);
    for (var i=0; i<this.copter.hp; i++) {
      var q = i / 99;
      var red = Math.trunc(255 * (1 - q));
      var green = Math.trunc(255 * q);
      this.buf.beginPath();
      this.buf.strokeStyle = color(red, green, 0);
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
    this.checkAllCollisions(things);

    // update star field
    this.stars.moveStars();

    // move things
    things.forEach(t => { console.info(`Moving thing of type ${t.name}`); t.move(); });

    // update text messages
    this.messages.slice().forEach(m => {
      if (m.checkFinished()) this.messages.remove(m);
    });

    // allow things the chance to attack
    things.forEach(t => {
      var shots = t.shoot();
      if (shots != null) {
        shots.forEach(shot => { if (shot != null) this.things.add(shot); });
      }
      shots = t.trigger();
      if (shots != null) {
        shots.forEach(shot => { if (shot != null) this.things.add(shot); });
      }
    });

    // purge dead things
    for (var i=0; i<this.things.length; i++) {
      var thing = this.things[i];
      if (thing.isDead()) {
        this.things.splice(i, 1);
        if (thing == this.copter) {
          this.printMessage(new Message("Game Over",
            (this.width - 250) / 2, (this.height - 30) / 2 + 30,
            48, "red", Infinity));
          this.printMessage(new Message("Press space to play again",
            (this.width - 170) / 2, (this.height - 30) / 2 + 50,
            16, "gray", Infinity));
        }
      }
    }

    if (this.stage != null && !this.copter.isDead()) {
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
      this.things.slice().forEach(t => t.keyPressed(e));

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
    this.things.slice().forEach(t => t.keyReleased(e));
    if (Keys.FAST_FORWARD.includes(e.keyCode)) this.fast = false;
  }

  /** Does collision detection between the given objects. */
  checkAllCollisions(t) {
    /*
    // divide things into types, and build rectangle lists
    var tt = new Thing[ThingTypes.length][];
    var counts = new int[ThingTypes.length];
    for (var i=0; i<t.length; i++) {
      var type = t[i].type;
      counts[type]++;
    }
    var boxes = new Rectangle[ThingTypes.length][][];
    for (var i=0; i<counts.length; i++) {
      tt[i] = new Thing[counts[i]];
      boxes[i] = new Rectangle[counts[i]][];
    }
    for (var i=0; i<t.length; i++) {
      var type = t[i].type;
      var ndx = --counts[type];
      tt[type][ndx] = t[i];
      boxes[type][ndx] = t[i].boxes;
    }

    // do collision detection between copter and power-ups
    var rcop = this.copter.boxes;
    var rups = boxes[ThingTypes.POWER_UP];
    for (var i=0; i<rups.length; i++) {
      if (rups[i] == null) continue;
      boolean collision = false;
      for (int k=0; k<rups[i].length; k++) {
        for (int l=0; l<rcop.length; l++) {
          if (rups[i][k].intersects(rcop[l])) {
            collision = true;
            break;
          }
        }
        if (collision) break;
      }
      if (collision) {
        var powerup = tt[ThingTypes.POWER_UP][i];
        var attack = powerup.getGrantedAttack();
        if (attack == null) {
          // increase power of selected attack style by one
          if (this.copter.attack.power < 10) this.copter.attack.power++;
        }
        else {
          // grant new attack style to copter
          this.copter.attack.addAttackStyle(attack);
        }
        tt[ThingTypes.POWER_UP][i].setHP(0);
        rups[i] = null;
      }
    }

    // do collision detection between good and evil objects
    checkCollisions(tt[ThingTypes.GOOD], boxes[ThingTypes.GOOD],
      tt[ThingTypes.EVIL], boxes[ThingTypes.EVIL]);
    checkCollisions(tt[ThingTypes.GOOD_BULLET], boxes[ThingTypes.GOOD_BULLET],
      tt[ThingTypes.EVIL], boxes[ThingTypes.EVIL]);
    checkCollisions(tt[ThingTypes.GOOD], boxes[ThingTypes.GOOD],
      tt[ThingTypes.EVIL_BULLET], boxes[ThingTypes.EVIL_BULLET]);
    */
  }

  /** Does collision detection between the given objects. */
  checkCollisions(t1, r1, t2, r2) {
    /*
    for (var i=0; i<r1.length; i++) {
      for (var j=0; j<r2.length; j++) {
        if (r1[i] == null) break;
        if (r2[j] == null) continue;
        boolean collision = false;
        for (int k=0; k<r1[i].length; k++) {
          for (int l=0; l<r2[j].length; l++) {
            if (r1[i][k].intersects(r2[j][l])) {
              collision = true;
              break;
            }
          }
          if (collision) break;
        }
        if (collision) {
          boolean hurt1 = t2[j].harms(t1[i]);
          boolean hurt2 = t1[i].harms(t2[j]);
          if (hurt1 && smack(t2[j], t1[i])) r1[i] = null;
          if (hurt2 && smack(t1[i], t2[j])) r2[j] = null;
        }
      }
    }
    */
  }

  /** Instructs the given attacker to damage the specified defender. */
  smack(attacker, defender) {
    /*
    defender.hit(attacker.power);
    if (defender.isDead()) {
      if (defender.type == ThingTypes.EVIL) score += defender.getScore();
      return true;
    }
    */
    return false;
  }
}

var game = null;

function animate() {
  requestAnimationFrame(animate);
  game.update();
  game.draw();
}

window.onload = function() {
  game = new Game(document.getElementById('canvas'));
  window.onkeydown = function(e) { game.keyPressed(e); }
  window.onkeyup = function(e) { game.keyReleased(e); }
  animate();
};
