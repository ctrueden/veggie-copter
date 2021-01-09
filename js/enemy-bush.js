class BushMovement extends MovementStyle {

  /** Movement speed per frame. */
  SPEED = 1;

  /** Number of HP considered low enough to enter frantic mode. */
  LOW_HP = 25;

  target;
  dir;
  turning;

  BushMovement(t) {
    super(t);
    var game = thing.getGame();
    var w = game.getWindowWidth();

    // compute starting position
    var width = thing.getWidth();
    var xpos = (int) ((w - 2 * width) * Math.random()) + width;
    var ypos = -thing.getHeight();
    doSwitch();
    thing.setPos(xpos, ypos);
  }

  /** Moves the given thing according to the Bush movement style. */
  move() {
    if (isFrantic()) return;

    var cx = thing.getCX(), cy = thing.getCY();
    turning = false;

    if (dir) {
      if (cy > target) cy -= SPEED;
      else if (cy < target) cy += SPEED;
      else doSwitch();
    }
    else {
      if (cx > target) cx -= SPEED;
      else if (cx < target) cx += SPEED;
      else doSwitch();
    }

    thing.setCPos(cx, cy);
  }

  /** Gets whether thing is currently changing directions. */
  isTurning() { return turning; }

  isFrantic() { return thing.getHP() <= LOW_HP; }

  /** Gets movement direction of this thing. */
  getDirection() { return dir; }

  /** Switches between horizontal and vertical movement modes. */
  doSwitch() {
    var hero = thing.getGame().getCopter();
    dir = !dir;
    target = dir ? hero.getCY() : hero.getCX();
    turning = true;
  }

}

/** Defines Bush's attack style. */
class BushAttack extends AttackStyle {

  /** Number of bullets to fire per spread. */
  BULLETS = 5;

  /** Spread factor for controlling bullet spread width. */
  SPREAD = 24;

  /** Number of frames to wait between firing bullets in frantic mode. */
  FRANTIC_RATE = 5;

  /** List of bullets left to fire. */
  toFire = [];

  /** Frames to wait until adding another bullet (frantic mode only). */
  waitTicks = FRANTIC_RATE;

  BushAttack(t) { super(t); }

  /** Fires a shot according to Bush's attack pattern. */
  shoot() {
    var pm = thing.getMovement();

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
        var dir = pm.getDirection();
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

class BushEnemy extends EnemyHead {

  BushEnemy(game, args) {
    // CTR TODO parse args and initialize Bush with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.loadImage("bush1.png"),
      game.loadImage("bush2.png"),
      game.loadImage("bush3.png"));
    // CTR TODO set proper bounding box and offsets here
    var normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    var attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    var hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());
    setMovement(new BushMovement(this));
    setAttack(new BushAttack(this));
  }

  var getScore() { return 5 * super.getScore(); }

  move() {
    super.move();

    // regen
    if (((BushMovement) move).isTurning()) hp++;
  }

}
