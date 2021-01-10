class BushMovement extends MovementStyle {
  constructor(t) {
    super(t);

    // Movement speed per frame.
    this.speed = 1;

    // Number of HP considered low enough to enter frantic mode.
    this.lowhp = = 25;

    this.target = 0;
    this.dir = false;
    this.turning = false;

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

    var cx = this.thing.getCX(), cy = this.thing.getCY();
    this.turning = false;

    if (this.dir) {
      if (cy > this.target) cy -= this.speed;
      else if (cy < this.target) cy += this.speed;
      else doSwitch();
    }
    else {
      if (cx > this.target) cx -= this.speed;
      else if (cx < this.target) cx += this.speed;
      else doSwitch();
    }

    this.thing.setCPos(cx, cy);
  }

  /** Gets whether thing is currently changing directions. */
  isTurning() { return this.turning; }

  isFrantic() { return this.thing.getHP() <= this.lowhp; }

  /** Gets movement direction of this thing. */
  getDirection() { return this.dir; }

  /** Switches between horizontal and vertical movement modes. */
  doSwitch() {
    var hero = this.thing.getGame().getCopter();
    this.dir = !this.dir;
    this.target = this.dir ? hero.getCY() : hero.getCX();
    this.turning = true;
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
    normal.addBox(new BoundingBox(0, 0, 0, 0));
    var attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox(0, 0, 0, 0));
    var hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox(0, 0, 0, 0));
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
