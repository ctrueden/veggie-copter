class GeorgeAttack extends AttackStyle {
  constructor(t) {
    super(t);
    this.bullets = 5;                  // Number of bullets to fire per spread.
    this.spread = 24;                  // Spread factor for controlling bullet spread width.
    this.franticRate = 5;              // Number of frames to wait between firing bullets in frantic mode.
    this.toFire = [];                  // List of bullets left to fire.
    this.waitTicks = this.franticRate; // Frames to wait until adding another bullet (frantic mode only).
  }

  /** Fires a shot according to George's attack pattern. */
  shoot() {
    if (this.thing.movement.frantic) {
      if (this.waitTicks > 0) {
        this.waitTicks--;
        return [];
      }
      var x = (int) (this.thing.game.width * Math.random());
      var y = (int) (this.thing.game.height * Math.random());
      toFire.add(new Point(x, y));
      waitTicks = FRANTIC_RATE;
    }
    else {
      if (this.thing.movement.turning) {
        // initialize new bullet spread when changing directions
        var hero = this.thing.game.copter;
        var hx = hero.xpos, hy = hero.ypos;
        var dir = this.thing.movement.dir;
        for (var i=0; i<this.bullets; i++) {
          var mod = i - this.bullets / 2f;
          var x = dir ? hx + this.spread * mod : hx;
          var y = dir ? hy : hy + this.spread * mod;
          toFire.add(new Point((int) x, (int) y));
        }
      }
    }

    if (this.toFire.length == 0) return [];
    var p = this.toFire[0];
    this.toFire.removeElementAt(0); // FIXME
    return [new EvilBullet(this.thing, p.x, p.y)];
  }
}

class GeorgeMovement extends MovementStyle {
  constructor(t) {
    super(t);

    this.target = null;
    this.dir = false;
    this.turning = false; // Whether thing is currently changing directions.
    this.speed = 1;       // Movement speed per frame.
    this.lowHP = 30;      // Number of HP considered low enough to enter frantic mode.

    var game = this.thing.game;
    var w = game.getWindowWidth();

    // compute starting position
    var width = this.thing.width;
    var xpos = (float) ((w - 2 * width) * Math.random()) + width;
    var ypos = -this.thing.height;
    this.thing.setPos(xpos, ypos);
    this.doSwitch();
  }

  get frantic() { return this.thing.hp <= this.lowHP; }

  move() {
    if (this.frantic) return;

    var cx = this.thing.cx, cy = this.thing.cy;
    this.turning = false;

    if (dir) {
      if (cy > this.target) {
        if (cy - this.target < this.speed) cy = this.target;
        else cy -= this.speed;
      }
      else if (cy < this.target) {
        if (this.target - cy < this.speed) cy = this.target;
        else cy += this.speed;
      }
      else this.doSwitch();
    }
    else {
      if (cx > this.target) {
        if (cx - this.target < this.speed) cx = this.target;
        else cx -= this.speed;
      }
      else if (cx < this.target) {
        if (this.target - cx < this.speed) cx = this.target;
        else cx += this.speed;
      }
      else this.doSwitch();
    }

    this.thing.setCPos(cx, cy);
  }

  /** Switches between horizontal and vertical movement modes. */
  doSwitch() {
    var hero = this.thing.game.copter;
    this.dir = !this.dir;
    this.target = this.dir ? hero.cy : hero.cx;
    this.turning = true;
  }
}

class GeorgeEnemy extends EnemyHead {
  constructor(game, args) {
    // CTR TODO parse args and initialize George with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.loadSprite("george1"),
      game.loadSprite("george2"),
      game.loadSprite("george3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalSprite.addBox(new BoxInsets());
    this.attackSprite.addBox(new BoxInsets());
    this.hurtSprite.addBox(new BoxInsets());
    this.movement = new GeorgeMovement(this);
    this.attack = new GeorgeAttack(this);
  }

  get score() { return 5 * super.score; }

  move() {
    super.move();
    if (this.movement.turning) hp++; // regen
  }
}

class GeorgeBoss extends BossHead {
  constructor(game, args) {
    // CTR TODO parse args and initialize George with proper parameters
    super(game, 800 + (int) (Math.random() * 200),
      game.loadSprite("george-boss1"),
      game.loadSprite("george-boss2"),
      game.loadSprite("george-boss3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalSprite.addBox(new BoxInsets());
    this.attackSprite.addBox(new BoxInsets());
    this.hurtSprite.addBox(new BoxInsets());
    this.movement = new GeorgeMovement(this);
    this.attack = new GeorgeAttack(this);
    this.weapon = new SpreadWeapon(game.copter);
  }

  move() {
    super.move();
    if (movement.turning) hp++; // regen
  }
}
