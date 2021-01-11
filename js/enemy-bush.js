class BushMovement extends MovementStyle {
  constructor(t) {
    super(t);

    this.speed = 1;       // Movement speed per frame.
    this.lowhp = = 25;    // Number of HP considered low enough to enter frantic mode.
    this.target = 0;
    this.dir = false;     // Movement direction.
    this.turning = false;

    var game = thing.game;
    var w = game.getWindowWidth();

    // compute starting position
    var width = thing.width;
    var xpos = (int) ((w - 2 * width) * Math.random()) + width;
    var ypos = -thing.height;
    doSwitch();
    thing.setPos(xpos, ypos);
  }

  /** Moves the given thing according to the Bush movement style. */
  move() {
    if (isFrantic()) return;

    var cx = this.thing.cx, cy = this.thing.cy;
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

  isFrantic() { return this.thing.hp <= this.lowhp; }

  /** Switches between horizontal and vertical movement modes. */
  doSwitch() {
    var hero = this.thing.game.copter;
    this.dir = !this.dir;
    this.target = this.dir ? hero.cy : hero.cx;
    this.turning = true;
  }
}

/** Defines Bush's attack style. */
class BushAttack extends AttackStyle {
  constructor(t) {
    super(t);
    this.bullets = 5;                  // Number of bullets to fire per spread.
    this.spread = 24;                  // Spread factor for controlling bullet spread width.
    this.franticRate = 5;              // Number of frames to wait between firing bullets in frantic mode.
    this.toFire = [];                  // List of bullets left to fire.
    this.waitTicks = this.franticRate; // Frames to wait until adding another bullet (frantic mode only).
  }

  /** Fires a shot according to Bush's attack pattern. */
  shoot() {
    var move = this.thing.move;

    if (this.thing.isFrantic()) {
      if (this.waitTicks > 0) {
        this.waitTicks--;
        return null;
      }
      var x = Math.trunc(thing.game.width * Math.random());
      var y = Math.trunc(thing.game.height * Math.random());
      toFire.add(new Point(x, y));
      waitTicks = this.franticRate;
    }
    else {
      if (move.isTurning()) {
        // initialize new bullet spread when changing directions
        Copter hero = thing.game.copter;
        var hx = hero.xpos, hy = hero.ypos;
        for (var i=0; i<this.bullets; i++) {
          var mod = i - this.bullets / 2f;
          var x = move.dir ? (hx + this.spread * mod) : hx;
          var y = move.dir ? hy : (hy + this.spread * mod);
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
  constructor(game, args) {
    // CTR TODO parse args and initialize Bush with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.sprite("bush1"),
      game.sprite("bush2"),
      game.sprite("bush3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalImage.addBox(new BoundingBox());
    this.attackImage.addBox(new BoundingBox());
    this.hurtImage.addBox(new BoundingBox());
    setMovement(new BushMovement(this));
    setAttack(new BushAttack(this));
  }

  getScore() { return 5 * super.getScore(); }

  move() {
    super.move();
    if (this.move.isTurning()) this.hp++; // regen
  }
}
