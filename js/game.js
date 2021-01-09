/** Width of game window. */
GAME_WIDTH = 400;

/** Height of game window. */
GAME_HEIGHT = 400;

/** Height of status bar. */
STATUS = 24;

class Game {

  constructor(canvas) {
    // Start the music.
    this.player = new SoundPlayer();
    //this.player.playMusic("../assets/metblast.mid");

    this.offscreen = canvas;                              // Offscreen canvas.
    this.buf = canvas.getContext('2d');                   // Offscreen canvas context.
    //this.loader = new ImageLoader();                      // Object for loading images from disk.
    //this.selector = new StageSelector(this);              // Object for handling stage selection.
    this.stage = null;                                    // Current game stage.
    this.stars = new StarField(GAME_WIDTH, GAME_HEIGHT);  // Field of stars in the background.
    //this.copter = new Copter(this);                       // Our hero.
    this.things = [];                                     // List of things onscreen.
    this.messages = [];                                   // List of onscreen text messages.
    this.score = 0;                                       // The player's score.
    this.pause = false;                                   // Whether game is paused.
    this.fast = false;                                    // Whether fast forward is enabled.
    this.debug = false;                                   // Debugging flag.
    this.ticks = 0;                                       // Game frame counter.
    this.keys = new Set();                                // Set of keys current being held.
  }

  /** Loads the given image from disk. */
  loadImage(filename) {
    /*
    return loadImage(filename, 0, 0, new BoundingBox[0]);
    */
  }

  /**
   * Loads the given image from disk, using the specified
   * bounding box insets for collision detection.
   */
  loadImage(filename, xoff, yoff, boxes) {
    /*
    BufferedImage img = loader.getImage(filename);
    BoundedImage bi = new BoundedImage(img, xoff, yoff);
    for (var i=0; i<boxes.length; i++) bi.addBox(boxes[i]);
    return bi;
    */
  }

  /** Gets veggie copter object (our hero!). */
  //getCopter() { return this.copter; }

  /** Gets number of frames since game has started. */
  getTicks() { return this.ticks; }

  /** Adds an object to the list of onscreen things. */
  //addThing(t) { things.add(t); }

  /** Gets objects currently onscreen. */
  getThings() {
    /*
    t = new Thing[things.length];
    things.copyInto(t);
    return t;
    */
  }

  /** Overlays a text message to the screen. */
  /*
  printMessage(m) { messages.add(m); }
  */

  /** Whether there are any enemies currently onscreen. */
  isClear() {
    /*
    boolean clear = true;
    for (var i=0; i<things.length; i++) {
      var t = things[i];
      var type = t.getType();
      if (type != Thing.GOOD && type != Thing.GOOD_BULLET) {
        clear = false;
        break;
      }
    }
    return clear;
    */
  }

  /** Resets the game to its initial state. */
  resetGame() {
    /*
    things.removeAllElements();
    messages.removeAllElements();
    copter = new Copter(this);
    ticks = 0;
    score = 0;
    stage = null;
    selector.reset();
    */
  }

  /** Draws the veggie copter graphics to the image buffer. */
  draw(ctx) {
    this.buf.fillStyle = 'black';
    this.buf.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT + STATUS);

    //var t = getThings();

    // star field
    this.stars.drawStars(this.buf);

/*
    // redraw things
    for (var i=0; i<t.length; i++) t[i].draw(this.buf);

    if (debug) {
      for (var i=0; i<t.length; i++) {
        // draw bounding box
        this.buf.setColor(Color.red);
        var r = t[i].getBoxes();
        for (int j=0; j<r.length; j++) {
          this.buf.drawRect(r[j].x, r[j].y, r[j].width, r[j].height);
        }

        // draw power level
        this.buf.setColor(Color.white);
        var xint = Math.trunc(t[i].getCX()) - 3;
        var yint = Math.trunc(t[i].getCY()) + 6;
        this.buf.drawString("" + t[i].getPower(), xint, yint);
      }
    }

    // draw text messages
    var m = new Message[messages.length];
    messages.copyInto(m);
    for (var i=0; i<m.length; i++) m[i].draw(this.buf);

    // draw stage selection
    if (stage == null) selector.draw(this.buf);

    // draw status bar
    this.buf.setColor(Color.darkGray);
    this.buf.fillRect(0, GAME_HEIGHT + 1, GAME_WIDTH, 24);
    this.buf.setColor(Color.white);
    this.buf.drawLine(0, GAME_HEIGHT, GAME_WIDTH, GAME_HEIGHT);

    // draw life bar
    var x = 1;
    this.buf.drawRect(x, GAME_HEIGHT + 2, 103, 20);
    this.buf.setColor(Color.black);
    this.buf.fillRect(x + 1, GAME_HEIGHT + 3, 102, 19);
    var hp = copter.getHP();
    for (var i=0; i<hp; i++) {
      var q = (double) i / 99;
      var red = Math.trunc(255 * (1 - q));
      var green = Math.trunc(255 * q);
      this.buf.setColor(new Color(red, green, 0));
      this.buf.drawLine(x + 2 + i, GAME_HEIGHT + 4, x + 2 + i, GAME_HEIGHT + 20);
    }

    // draw weapon selector
    copter.drawWeaponStatus(this.buf, x + 107, GAME_HEIGHT + 2);
*/

    // blit the offscreen canvas to the on-screen canvas
    ctx.drawImage(this.offscreen, 0, 0);
  }

  /** Updates the game state. */
  update() {
    if (this.pause) return;
    this.tick();
    if (this.fast) this.tick();
  }

  /** Advances the game state by one tick. */
  tick() {
    // collision detection
    //checkAllCollisions(t);

    // update star field
    this.stars.moveStars();

    /*
    // move things
    for (var i=0; i<t.length; i++) t[i].move();

    // update text messages
    for (var i=0; i<m.length; i++) {
      if (m[i].checkFinished()) messages.remove(m[i]);
    }

    // allow things the chance to attack
    for (var i=0; i<t.length; i++) {
      var shots = t[i].shoot();
      if (shots != null) {
        for (int j=0; j<shots.length; j++) {
          if (shots[j] != null) things.add(shots[j]);
        }
      }
      shots = t[i].trigger();
      if (shots != null) {
        for (int j=0; j<shots.length; j++) {
          if (shots[j] != null) things.add(shots[j]);
        }
      }
    }

    // purge dead things
    for (var i=0; i<things.length; i++) {
      var thing = things[i];
      if (thing.isDead()) {
        things.removeElementAt(i);
        if (thing == copter) {
          printMessage(new Message("Game Over",
            (GAME_WIDTH - 250) / 2, (GAME_HEIGHT - 30) / 2 + 30,
            48, Color.red, Integer.MAX_VALUE));
          printMessage(new Message("Press space to play again",
            (GAME_WIDTH - 170) / 2, (GAME_HEIGHT - 30) / 2 + 50,
            16, Color.gray, Integer.MAX_VALUE));
        }
      }
    }

    if (stage != null && !copter.isDead()) {
      boolean done = stage.executeScript();
      if (done) {
        stage.setCompleted(true);
        selector.adjustStage(true);
        stage = null;
        things.removeAllElements();
        copter.reset();
      }
    }
    */
    this.ticks++;
  }

  /** Handles key presses. */
  keyPressed(e) {
    const code = e.keyCode;
    if (!this.keys.has(code)) {
      this.keys.add(code);
      /*
      var t = getThings();
      for (var i=0; i<t.length; i++) t[i].keyPressed(e);
      */

      if (code == Keys.SHOOT) {
        /*
        if (stage == null) {
          stage = selector.getSelectedStage();
          stage.resetScript();
          things.add(copter);
          copter.getAttack().reactivateAttackStyle();
          copter.getAttack().reactivateAttackStyle();
        }
        else if (copter.isDead()) resetGame();
        */
      }
      else if (code == Keys.PAUSE) {
        this.pause = !this.pause;
      }
      else if (code == Keys.MOVE_LEFT) {
        //if (stage == null) selector.adjustStage(false);
      }
      else if (code == Keys.MOVE_RIGHT) {
        //if (stage == null) selector.adjustStage(true);
      }
      else if (code == Keys.FAST_FORWARD) this.fast = true;
      else if (code == Keys.TOGGLE_DEBUG) this.debug = !this.debug;
      //else if (code == Keys.TOGGLE_MUTE) SoundPlayer.toggleMute();
    }
  }

  /** Handles key releases. */
  keyReleased(e) {
    const code = e.keyCode;
    this.keys.delete(code);
    /*
    var t = getThings();
    for (var i=0; i<t.length; i++) t[i].keyReleased(e);
    */

    if (code == Keys.FAST_FORWARD) this.fast = false;
  }

  /** Does collision detection between the given objects. */
  checkAllCollisions(t) {
    /*
    // divide things into types, and build rectangle lists
    var tt = new Thing[Thing.TYPES.length][];
    var counts = new int[Thing.TYPES.length];
    for (var i=0; i<t.length; i++) {
      var type = t[i].getType();
      counts[type]++;
    }
    var boxes = new Rectangle[Thing.TYPES.length][][];
    for (var i=0; i<counts.length; i++) {
      tt[i] = new Thing[counts[i]];
      boxes[i] = new Rectangle[counts[i]][];
    }
    for (var i=0; i<t.length; i++) {
      var type = t[i].getType();
      var ndx = --counts[type];
      tt[type][ndx] = t[i];
      boxes[type][ndx] = t[i].getBoxes();
    }

    // do collision detection between copter and power-ups
    var rcop = copter.getBoxes();
    var rups = boxes[Thing.POWER_UP];
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
        PowerUp powerUp = (PowerUp) tt[Thing.POWER_UP][i];
        ColoredAttack attack = powerUp.getGrantedAttack();
        if (attack == null) {
          // increase power of selected attack style by one
          var power = copter.getAttack().getPower();
          if (power < 10) copter.getAttack().setPower(power + 1);
        }
        else {
          // grant new attack style to copter
          CopterAttack copterAttack = (CopterAttack) copter.getAttack();
          copterAttack.addAttackStyle(attack);
        }
        tt[Thing.POWER_UP][i].setHP(0);
        rups[i] = null;
      }
    }

    // do collision detection between good and evil objects
    checkCollisions(tt[Thing.GOOD], boxes[Thing.GOOD],
      tt[Thing.EVIL], boxes[Thing.EVIL]);
    checkCollisions(tt[Thing.GOOD_BULLET], boxes[Thing.GOOD_BULLET],
      tt[Thing.EVIL], boxes[Thing.EVIL]);
    checkCollisions(tt[Thing.GOOD], boxes[Thing.GOOD],
      tt[Thing.EVIL_BULLET], boxes[Thing.EVIL_BULLET]);
    */
  }

  /** Does collision detection between the given objects. */
  checkCollisions(t1, r1, t2, r2) {
    /*
    for (var i=0; i<r1.length; i++) {
      for (int j=0; j<r2.length; j++) {
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
    defender.hit(attacker.getPower());
    if (defender.isDead()) {
      if (defender.getType() == Thing.EVIL) score += defender.getScore();
      return true;
    }
    return false;
    */
  }
}

var game = null;

function animate() {
  requestAnimationFrame(animate);
  game.update();
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  game.draw(ctx);
}

window.onload = function() {
    var offscreen = document.createElement('canvas')
    offscreen.width = GAME_WIDTH;
    offscreen.height = GAME_HEIGHT + STATUS;
    game = new Game(offscreen);
    window.onkeydown = function(e) { game.keyPressed(e); }
    window.onkeyup = function(e) { game.keyReleased(e); }
    animate();
};
