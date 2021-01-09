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
    PaulMovement pm = (PaulMovement) thing.getMovement();

    if (pm.isFrantic()) {
      if (waitTicks > 0) {
        waitTicks--;
        return null;
      }
      var x = (int) (thing.getGame().getWidth() * Math.random());
      var y = (int) (thing.getGame().getHeight() * Math.random());
      toFire.add(new Point(x, y));
      waitTicks = FRANTIC_RATE;
    }
    else {
      if (pm.isTurning()) {
        // initialize new bullet spread when changing directions
        Copter hero = thing.getGame().getCopter();
        var hx = hero.getX(), hy = hero.getY();
        boolean dir = pm.getDirection();
        for (var i=0; i<BULLETS; i++) {
          var mod = i - BULLETS / 2f;
          var x = dir ? (hx + SPREAD * mod) : hx;
          var y = dir ? hy : (hy + SPREAD * mod);
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
    VeggieCopter game = thing.getGame();
    var w = game.getWindowWidth();

    // compute starting position
    var width = thing.getWidth();
    var xpos = (float) ((w - 2 * width) * Math.random()) + width;
    var ypos = -thing.getHeight();
    thing.setPos(xpos, ypos);
    doSwitch();
  }

  /** Gets whether thing is currently changing directions. */
  boolean isTurning() { return turning; }

  boolean isFrantic() { return thing.getHP() <= LOW_HP; }

  /** Gets movement direction of this thing. */
  boolean getDirection() { return dir; }

  /** Moves the given thing according to the Paul movement style. */
  move() {
    if (isFrantic()) return;

    var cx = thing.getCX(), cy = thing.getCY();
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
    Copter hero = thing.getGame().getCopter();
    dir = !dir;
    target = dir ? hero.getCY() : hero.getCX();
    turning = true;
  }

}

class PaulEnemy extends EnemyHead {

  PaulEnemy(game, args) {
    // CTR TODO parse args and initialize Paul with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.loadImage("paul1.png"),
      game.loadImage("paul2.png"),
      game.loadImage("paul3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox(1, 5, 1, 10));
    normal.addBox(new BoundingBox(8, 1, 8, 1));
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox(1, 5, 1, 10));
    attacking.addBox(new BoundingBox(8, 1, 8, 1));
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());
    setMovement(new PaulMovement(this));
    setAttack(new PaulAttack(this));
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
      game.loadImage("paul-boss1.png"),
      game.loadImage("paul-boss2.png"),
      game.loadImage("paul-boss3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());
    setMovement(new PaulMovement(this));
    setAttack(new PaulAttack(this));
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  ColoredAttack getColoredAttack() {
    return new SpreadAttack(game.getCopter());
  }

  var getScore() { return 50 * super.getScore(); }

  move() {
    super.move();

    // regen
    if (((PaulMovement) move).isTurning()) hp++;
  }

}
