class PaulAttack extends AttackStyle {
  /** Number of bullets to fire per spread. */
  BULLETS = 5;

  /** Spread factor for controlling bullet spread width. */
  SPREAD = 24;

  /** Number of frames to wait between firing bullets in frantic mode. */
  FRANTIC_RATE = 5;

  /** List of bullets left to fire. */
  Vector toFire = new Vector();

  /** Frames to wait until adding another bullet (frantic mode only). */
  var waitTicks = FRANTIC_RATE;

  constructor(t) { super(t); }

  /** Fires a shot according to Paul's attack pattern. */
  shoot() {
    if (thing.move.isFrantic()) {
      if (waitTicks > 0) {
        waitTicks--;
        return [];
      }
      var x = (int) (thing.game.width * Math.random());
      var y = (int) (thing.game.height * Math.random());
      toFire.add(new Point(x, y));
      waitTicks = FRANTIC_RATE;
    }
    else {
      if (thing.move.isTurning()) {
        // initialize new bullet spread when changing directions
        var hero = thing.game.copter;
        var hx = hero.xpos, hy = hero.ypos;
        for (var i=0; i<BULLETS; i++) {
          var mod = i - BULLETS / 2f;
          var x = thing.move.dir ? (hx + SPREAD * mod) : hx;
          var y = thing.move.dir ? hy : (hy + SPREAD * mod);
          toFire.add(new Point((int) x, (int) y));
        }
      }
    }

    if (toFire.isEmpty()) return [];
    var p = toFire[0];
    toFire.removeElementAt(0);
    return [new EnemyBullet(thing, p.x, p.y)];
  }
}

class PaulMovement extends MovementStyle {
  /** Movement speed per frame. */
  SPEED = 1;

  /** Number of HP considered low enough to enter frantic mode. */
  LOW_HP = 30;

  var target;
  boolean dir;
  boolean turning;

  constructor(t) {
    super(t);
    VeggieCopter game = thing.game;
    var w = game.getWindowWidth();

    // compute starting position
    var width = thing.width;
    var xpos = (float) ((w - 2 * width) * Math.random()) + width;
    var ypos = -thing.height;
    thing.setPos(xpos, ypos);
    doSwitch();
  }

  /** Gets whether thing is currently changing directions. */
  boolean isTurning() { return turning; }

  boolean isFrantic() { return thing.hp <= LOW_HP; }

  /** Moves the given thing according to the Paul movement style. */
  move() {
    if (isFrantic()) return;

    var cx = thing.cx, cy = thing.cy;
    turning = false;

    if (this.dir) {
      if (cy > target) {
        if (cy - target < SPEED) cy = target;
        else cy -= SPEED;
      }
      else if (cy < target) {
        if (target - cy < SPEED) cy = target;
        else cy += SPEED;
      }
      else doSwitch();
    }
    else {
      if (cx > target) {
        if (cx - target < SPEED) cx = target;
        else cx -= SPEED;
      }
      else if (cx < target) {
        if (target - cx < SPEED) cx = target;
        else cx += SPEED;
      }
      else doSwitch();
    }

    thing.setCPos(cx, cy);
  }

  /** Switches between horizontal and vertical movement modes. */
  doSwitch() {
    var hero = thing.game.copter;
    this.dir = !this.dir;
    this.target = this.dir ? hero.cy : hero.cx;
    this.turning = true;
  }
}

class PaulEnemy extends EnemyHead {
  constructor(game, args) {
    // CTR TODO parse args and initialize Paul with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.loadSprite("paul1"),
      game.loadSprite("paul2"),
      game.loadSprite("paul3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalSprite.addBox(new BoxInsets(1, 5, 1, 10));
    this.normalSprite.addBox(new BoxInsets(8, 1, 8, 1));
    this.attackSprite.addBox(new BoxInsets(1, 5, 1, 10));
    this.attackSprite.addBox(new BoxInsets(8, 1, 8, 1));
    this.hurtSprite.addBox(new BoxInsets());
    this.movement = new PaulMovement(this);
    this.attack = new PaulAttack(this);
  }

  get score() { return 5 * super.score; }

  move() {
    super.move();

    // regen
    if (((PaulMovement) move).isTurning()) hp++;
  }
}

class PaulBoss extends BossHead {
  constructor(game, args) {
    // CTR TODO parse args and initialize Paul with proper parameters
    super(game, 800 + (int) (Math.random() * 200),
      game.loadSprite("paul-boss1"),
      game.loadSprite("paul-boss2"),
      game.loadSprite("paul-boss3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalSprite.addBox(new BoxInsets());
    this.attackSprite.addBox(new BoxInsets());
    this.hurtSprite.addBox(new BoxInsets());
    this.movement = new PaulMovement(this);
    this.attack = new PaulAttack(this);
    this.weapon = new SpreadAttack(game.copter);
  }

  move() {
    super.move();

    // regen
    if (((PaulMovement) move).isTurning()) hp++;
  }
}
