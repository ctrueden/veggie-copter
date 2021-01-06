// -- StarField --

/** Number of stars in star field. */
const STARS = 50;

/** Minimum star speed. */
const STAR_MIN = 1;

/** Maximum star speed. */
const STAR_MAX = 4;

if (typeof KeyEvent == "undefined") {
  var KeyEvent = {
    DOM_VK_CANCEL: 3,
    DOM_VK_HELP: 6,
    DOM_VK_BACK_SPACE: 8,
    DOM_VK_TAB: 9,
    DOM_VK_CLEAR: 12,
    DOM_VK_RETURN: 13,
    DOM_VK_ENTER: 14,
    DOM_VK_SHIFT: 16,
    DOM_VK_CONTROL: 17,
    DOM_VK_ALT: 18,
    DOM_VK_PAUSE: 19,
    DOM_VK_CAPS_LOCK: 20,
    DOM_VK_ESCAPE: 27,
    DOM_VK_SPACE: 32,
    DOM_VK_PAGE_UP: 33,
    DOM_VK_PAGE_DOWN: 34,
    DOM_VK_END: 35,
    DOM_VK_HOME: 36,
    DOM_VK_LEFT: 37,
    DOM_VK_UP: 38,
    DOM_VK_RIGHT: 39,
    DOM_VK_DOWN: 40,
    DOM_VK_PRINTSCREEN: 44,
    DOM_VK_INSERT: 45,
    DOM_VK_DELETE: 46,
    DOM_VK_0: 48,
    DOM_VK_1: 49,
    DOM_VK_2: 50,
    DOM_VK_3: 51,
    DOM_VK_4: 52,
    DOM_VK_5: 53,
    DOM_VK_6: 54,
    DOM_VK_7: 55,
    DOM_VK_8: 56,
    DOM_VK_9: 57,
    DOM_VK_SEMICOLON: 59,
    DOM_VK_EQUALS: 61,
    DOM_VK_A: 65,
    DOM_VK_B: 66,
    DOM_VK_C: 67,
    DOM_VK_D: 68,
    DOM_VK_E: 69,
    DOM_VK_F: 70,
    DOM_VK_G: 71,
    DOM_VK_H: 72,
    DOM_VK_I: 73,
    DOM_VK_J: 74,
    DOM_VK_K: 75,
    DOM_VK_L: 76,
    DOM_VK_M: 77,
    DOM_VK_N: 78,
    DOM_VK_O: 79,
    DOM_VK_P: 80,
    DOM_VK_Q: 81,
    DOM_VK_R: 82,
    DOM_VK_S: 83,
    DOM_VK_T: 84,
    DOM_VK_U: 85,
    DOM_VK_V: 86,
    DOM_VK_W: 87,
    DOM_VK_X: 88,
    DOM_VK_Y: 89,
    DOM_VK_Z: 90,
    DOM_VK_CONTEXT_MENU: 93,
    DOM_VK_NUMPAD0: 96,
    DOM_VK_NUMPAD1: 97,
    DOM_VK_NUMPAD2: 98,
    DOM_VK_NUMPAD3: 99,
    DOM_VK_NUMPAD4: 100,
    DOM_VK_NUMPAD5: 101,
    DOM_VK_NUMPAD6: 102,
    DOM_VK_NUMPAD7: 103,
    DOM_VK_NUMPAD8: 104,
    DOM_VK_NUMPAD9: 105,
    DOM_VK_MULTIPLY: 106,
    DOM_VK_ADD: 107,
    DOM_VK_SEPARATOR: 108,
    DOM_VK_SUBTRACT: 109,
    DOM_VK_DECIMAL: 110,
    DOM_VK_DIVIDE: 111,
    DOM_VK_F1: 112,
    DOM_VK_F2: 113,
    DOM_VK_F3: 114,
    DOM_VK_F4: 115,
    DOM_VK_F5: 116,
    DOM_VK_F6: 117,
    DOM_VK_F7: 118,
    DOM_VK_F8: 119,
    DOM_VK_F9: 120,
    DOM_VK_F10: 121,
    DOM_VK_F11: 122,
    DOM_VK_F12: 123,
    DOM_VK_F13: 124,
    DOM_VK_F14: 125,
    DOM_VK_F15: 126,
    DOM_VK_F16: 127,
    DOM_VK_F17: 128,
    DOM_VK_F18: 129,
    DOM_VK_F19: 130,
    DOM_VK_F20: 131,
    DOM_VK_F21: 132,
    DOM_VK_F22: 133,
    DOM_VK_F23: 134,
    DOM_VK_F24: 135,
    DOM_VK_NUM_LOCK: 144,
    DOM_VK_SCROLL_LOCK: 145,
    DOM_VK_COMMA: 188,
    DOM_VK_PERIOD: 190,
    DOM_VK_SLASH: 191,
    DOM_VK_BACK_QUOTE: 192,
    DOM_VK_OPEN_BRACKET: 219,
    DOM_VK_BACK_SLASH: 220,
    DOM_VK_CLOSE_BRACKET: 221,
    DOM_VK_QUOTE: 222,
    DOM_VK_META: 224
  };
}

var Keys = {
  SHOOT: KeyEvent.DOM_VK_SPACE,
  TRIGGER: KeyEvent.DOM_VK_B,
  MOVE_LEFT: KeyEvent.DOM_VK_LEFT,
  MOVE_RIGHT: KeyEvent.DOM_VK_RIGHT,
  FAST_FORWARD: KeyEvent.DOM_VK_BACK_QUOTE,
  TOGGLE_MUTE: KeyEvent.DOM_VK_M,
  TOGGLE_DEBUG: KeyEvent.DOM_VK_SLASH,
  PAUSE: KeyEvent.DOM_VK_P,
  POWER_UP: KeyEvent.DOM_VK_Q,
  POWER_DOWN: KeyEvent.DOM_VK_A,
  ATTACK_STYLE_CYCLE: KeyEvent.DOM_VK_Z,
  ATTACK_STYLES: [
    KeyEvent.DOM_VK_1, KeyEvent.DOM_VK_2, KeyEvent.DOM_VK_3, KeyEvent.DOM_VK_4,
    KeyEvent.DOM_VK_5, KeyEvent.DOM_VK_6, KeyEvent.DOM_VK_7, KeyEvent.DOM_VK_8,
    KeyEvent.DOM_VK_9, KeyEvent.DOM_VK_0, KeyEvent.DOM_VK_MINUS, KeyEvent.DOM_VK_EQUALS,
    KeyEvent.DOM_VK_BACK_SPACE
  ],
  ALL_ATTACK_STYLES: KeyEvent.DOM_VK_END
};

class StarField {

  /** Constructs a star field. */
  constructor(w, h) {
    this.width = w;
    this.height = h;
    this.starY = []; // Y values
    this.starV = []; // velocities
    for (var i=0; i<STARS; i++) {
      this.starY[i] = this.height * Math.random();
      this.starV[i] = (STAR_MAX - STAR_MIN + 1) * Math.random() + STAR_MIN;
    }
  }

  /** Draws stars to the given graphics context. */
  drawStars(ctx) {
    for (var i=0; i<STARS; i++) {
      var x = i * this.width / STARS;
      ctx.beginPath();
      ctx.strokeStyle = 'gray';
      ctx.moveTo(x, this.starY[i]);
      ctx.lineTo(x, this.starY[i] - 2 * this.starV[i]);
      ctx.stroke();
    }
  }

  /** Updates star positions. */
  moveStars() {
    for (var i=0; i<STARS; i++) {
      this.starY[i] += this.starV[i];
      if (this.starY[i] - 2 * this.starV[i] > this.height) {
        this.starY[i] = 0;
        this.starV[i] = (STAR_MAX - STAR_MIN + 1) * Math.random() + STAR_MIN;
      }
    }
  }
}

// -- VeggieCopter --

/** Width of game window. */
const GAME_WIDTH = 400;

/** Height of game window. */
const GAME_HEIGHT = 400;

/** Height of status bar. */
const STATUS = 24;

class VeggieCopter {

  /** Constructs a veggie copter frame. */
  constructor(canvas) {
    // Start this music.
    //SoundPlayer.playMidi(getClass().getResource("metblast.mid"), true);

    // Offscreen canvas.
    this.offscreen = canvas;

    // Offscreen canvas context.
    this.buf = canvas.getContext('2d');

    // Object for loading images from disk.
    //this.loader = new ImageLoader();

    // Object for handling stage selection.
    //this.selector = new StageSelector(this);

    // Current game stage.
    //this.stage = null;

    // Field of stars in the background.
    this.stars = new StarField(GAME_WIDTH, GAME_HEIGHT);

    // Our hero.
    //this.copter = new Copter(this);

    // List of things onscreen.
    //this.things = [];

    // List of onscreen text messages.
    //this.messages = [];

    // The player's score.
    //this.score = 0;

    // Whether game is paused.
    this.pause = false;

    // Whether fast forward is enabled.
    this.fast = false;

    // Debugging flag.
    this.debug = false;

    // Game frame counter.
    this.ticks = 0;

    // Set of keys current being held.
    this.keys = new Set();
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
    for (int i=0; i<boxes.length; i++) bi.addBox(boxes[i]);
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
    t = new Thing[things.size()];
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
    for (int i=0; i<things.size(); i++) {
      Thing t = (Thing) things.elementAt(i);
      int type = t.getType();
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

    //Thing[] t = getThings();

    // star field
    this.stars.drawStars(this.buf);

/*
    // redraw things
    for (int i=0; i<t.length; i++) t[i].draw(this.buf);

    if (debug) {
      for (int i=0; i<t.length; i++) {
        // draw bounding box
        this.buf.setColor(Color.red);
        Rectangle[] r = t[i].getBoxes();
        for (int j=0; j<r.length; j++) {
          this.buf.drawRect(r[j].x, r[j].y, r[j].width, r[j].height);
        }

        // draw power level
        this.buf.setColor(Color.white);
        int x = (int) t[i].getCX() - 3;
        int y = (int) t[i].getCY() + 6;
        this.buf.drawString("" + t[i].getPower(), x, y);
      }
    }

    // draw text messages
    Message[] m = new Message[messages.size()];
    messages.copyInto(m);
    for (int i=0; i<m.length; i++) m[i].draw(this.buf);

    // draw stage selection
    if (stage == null) selector.draw(this.buf);

    // draw status bar
    this.buf.setColor(Color.darkGray);
    this.buf.fillRect(0, GAME_HEIGHT + 1, GAME_WIDTH, 24);
    this.buf.setColor(Color.white);
    this.buf.drawLine(0, GAME_HEIGHT, GAME_WIDTH, GAME_HEIGHT);

    // draw life bar
    int x = 1;
    this.buf.drawRect(x, GAME_HEIGHT + 2, 103, 20);
    this.buf.setColor(Color.black);
    this.buf.fillRect(x + 1, GAME_HEIGHT + 3, 102, 19);
    int hp = copter.getHP();
    for (int i=0; i<hp; i++) {
      double q = (double) i / 99;
      int red = (int) (255 * (1 - q));
      int green = (int) (255 * q);
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
    for (int i=0; i<t.length; i++) t[i].move();

    // update text messages
    for (int i=0; i<m.length; i++) {
      if (m[i].checkFinished()) messages.remove(m[i]);
    }

    // allow things the chance to attack
    for (int i=0; i<t.length; i++) {
      Thing[] shots = t[i].shoot();
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
    for (int i=0; i<things.size(); i++) {
      Thing thing = (Thing) things.elementAt(i);
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
      Thing[] t = getThings();
      for (int i=0; i<t.length; i++) t[i].keyPressed(e);
      */

      if (code == Keys.SHOOT) {
        /*
        if (stage == null) {
          stage = selector.getSelectedStage();
          stage.resetScript();
          things.add(copter);
          ((CopterAttack) copter.getAttack()).reactivateAttackStyle();
          ((CopterAttack) copter.getAttack()).reactivateAttackStyle();
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
    Thing[][] tt = new Thing[Thing.TYPES.length][];
    int[] counts = new int[Thing.TYPES.length];
    for (int i=0; i<t.length; i++) {
      int type = t[i].getType();
      counts[type]++;
    }
    Rectangle[][][] boxes = new Rectangle[Thing.TYPES.length][][];
    for (int i=0; i<counts.length; i++) {
      tt[i] = new Thing[counts[i]];
      boxes[i] = new Rectangle[counts[i]][];
    }
    for (int i=0; i<t.length; i++) {
      int type = t[i].getType();
      int ndx = --counts[type];
      tt[type][ndx] = t[i];
      boxes[type][ndx] = t[i].getBoxes();
    }

    // do collision detection between copter and power-ups
    Rectangle[] rcop = copter.getBoxes();
    Rectangle[][] rups = boxes[Thing.POWER_UP];
    for (int i=0; i<rups.length; i++) {
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
          int power = copter.getAttack().getPower();
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
    for (int i=0; i<r1.length; i++) {
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

var copter = null;

function animate() {
  requestAnimationFrame(animate);
  copter.update();
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  copter.draw(ctx);
}

window.onload = function() {
    var offscreen = document.createElement('canvas')
    offscreen.width = GAME_WIDTH;
    offscreen.height = GAME_HEIGHT + STATUS;
    copter = new VeggieCopter(offscreen);
    window.onkeydown = function(e) { copter.keyPressed(e); }
    window.onkeyup = function(e) { copter.keyReleased(e); }
    animate();
};
