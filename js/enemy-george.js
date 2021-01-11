/** Defines George's attack style. */
class GeorgeAttack extends AttackStyle {

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

  GeorgeAttack(t) { super(t); }

  /** Fires a shot according to George's attack pattern. */
  shoot() {
    if (thing.move.isFrantic()) {
      if (this.waitTicks > 0) {
        this.waitTicks--;
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
        Copter hero = thing.game.copter;
        var hx = hero.xpos, hy = hero.ypos;
        boolean dir = thing.move.dir;
        for (var i=0; i<BULLETS; i++) {
          var mod = i - BULLETS / 2f;
          var x = dir ? hx + SPREAD * mod : hx;
          var y = dir ? hy : hy + SPREAD * mod;
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

class GeorgeMovement extends MovementStyle {

  /** Movement speed per frame. */
  SPEED = 1;

  /** Number of HP considered low enough to enter frantic mode. */
  LOW_HP = 30;

  var target;
  boolean dir;
  boolean turning;

  GeorgeMovement(t) {
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

  /** Moves the given thing according to the George movement style. */
  move() {
    if (isFrantic()) return;

    var cx = thing.cx, cy = thing.cy;
    turning = false;

    if (dir) {
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
    Copter hero = thing.game.copter;
    dir = !dir;
    target = dir ? hero.cy : hero.cx;
    turning = true;
  }

}

class GeorgeEnemy extends EnemyHead {

  GeorgeEnemy(game, args) {
    // CTR TODO parse args and initialize George with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.sprite("george1"),
      game.sprite("george2"),
      game.sprite("george3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalImage.addBox(new BoundingBox());
    this.attackImage.addBox(new BoundingBox());
    this.hurtImage.addBox(new BoundingBox());
    this.move = new GeorgeMovement(this);
    this.attack = new GeorgeAttack(this);
  }

  var getScore() { return 5 * super.getScore(); }

  move() {
    super.move();

    // regen
    if (((GeorgeMovement) move).isTurning()) hp++;
  }

}

class GeorgeBoss extends BossHead {

  GeorgeBoss(game, args) {
    // CTR TODO parse args and initialize George with proper parameters
    super(game, 800 + (int) (Math.random() * 200),
      game.sprite("george-boss1.png"),
      game.sprite("george-boss2.png"),
      game.sprite("george-boss3.png"));
    // CTR TODO set proper bounding box and offsets here
    this.normalImage.addBox(new BoundingBox());
    this.attackImage.addBox(new BoundingBox());
    this.hurtImage.addBox(new BoundingBox());
    this.move = new GeorgeMovement(this);
    this.attack = new GeorgeAttack(this);
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  Weapon getWeapon() {
    return new SpreadAttack(game.copter);
  }

  var getScore() { return 50 * super.getScore(); }

  move() {
    super.move();

    // regen
    if (((GeorgeMovement) move).isTurning()) hp++;
  }

}
