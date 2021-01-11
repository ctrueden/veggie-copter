/** Defines Paul's attack style. */
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

  PaulAttack(t) { super(t); }

  /** Fires a shot according to Paul's attack pattern. */
  shoot() {
    if (thing.move.isFrantic()) {
      if (waitTicks > 0) {
        waitTicks--;
        return null;
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

    if (toFire.isEmpty()) return null;
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

  PaulMovement(t) {
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

  PaulEnemy(game, args) {
    // CTR TODO parse args and initialize Paul with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.sprite("paul1"),
      game.sprite("paul2"),
      game.sprite("paul3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalImage.addBox(new BoundingBox(1, 5, 1, 10));
    this.normalImage.addBox(new BoundingBox(8, 1, 8, 1));
    this.attackImage.addBox(new BoundingBox(1, 5, 1, 10));
    this.attackImage.addBox(new BoundingBox(8, 1, 8, 1));
    this.hurtImage.addBox(new BoundingBox());
    this.movement = new PaulMovement(this);
    this.attack = new PaulAttack(this);
  }

  var getScore() { return 5 * super.getScore(); }

  move() {
    super.move();

    // regen
    if (((PaulMovement) move).isTurning()) hp++;
  }

}

class PaulBoss extends BossHead {

  PaulBoss(game, args) {
    // CTR TODO parse args and initialize Paul with proper parameters
    super(game, 800 + (int) (Math.random() * 200),
      game.sprite("paul-boss1"),
      game.sprite("paul-boss2"),
      game.sprite("paul-boss3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalImage.addBox(new BoundingBox());
    this.attackImage.addBox(new BoundingBox());
    this.hurtImage.addBox(new BoundingBox());
    this.movement = new PaulMovement(this);
    this.attack = new PaulAttack(this);
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  Weapon getWeapon() {
    return new SpreadAttack(game.copter);
  }

  var getScore() { return 50 * super.getScore(); }

  move() {
    super.move();

    // regen
    if (((PaulMovement) move).isTurning()) hp++;
  }

}
