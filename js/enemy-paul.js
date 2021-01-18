class PaulAttack extends AttackStyle {
  constructor(t) {
    super(t);
    this.bullets = 5;                  // Number of bullets to fire per spread.
    this.spread = 24;                  // Spread factor for controlling bullet spread width.
    this.franticRate = 5;              // Number of frames to wait between firing bullets in frantic mode.
    this.toFire = [];                  // List of bullets left to fire.
    this.waitTicks = this.franticRate; // Frames to wait until adding another bullet (frantic mode only).
  }

  shoot() {
    if (this.thing.movement.isFrantic()) {
      if (this.waitTicks > 0) {
        this.waitTicks--;
        return [];
      }
      var x = this.thing.game.width * Math.random();
      var y = this.thing.game.height * Math.random();
      this.toFire.push({x: x, y: y});
      this.waitTicks = this.franticRate;
    }
    else {
      if (this.thing.movement.isTurning()) {
        // initialize new bullet spread when changing directions
        var hero = this.thing.game.copter;
        var hx = hero.xpos, hy = hero.ypos;
        for (var i=0; i<this.bullets; i++) {
          var mod = i - this.bullets / 2;
          var x = this.thing.movement.dir ? (hx + this.spread * mod) : hx;
          var y = this.thing.movement.dir ? hy : (hy + this.spread * mod);
          this.toFire.push({x: x, y: y});
        }
      }
    }

    if (this.toFire.length == 0) return [];
    var p = this.toFire[0];
    this.toFire.splice(0, 1);
    return [new EvilBullet(this.thing, p.x, p.y)];
  }
}

class PaulMovement extends MovementStyle {
  constructor(t) {
    super(t);

    this.target = null;
    this.dir = false;
    this.turning = false;
    this.speed = 1;       // Movement speed per frame.
    this.lowHP = 30;      // Number of HP considered low enough to enter frantic mode.

    var game = this.thing.game;

    // compute starting position
    var width = this.thing.width;
    var xpos = (game.width - 2 * width) * Math.random() + width;
    var ypos = -this.thing.height;
    this.thing.setPos(xpos, ypos);
    this.doSwitch();
  }

  /** Gets whether thing is currently changing directions. */
  isTurning() { return this.turning; }

  isFrantic() { return this.thing.hp <= this.lowHP; }

  move() {
    if (this.isFrantic()) return;

    var cx = this.thing.cx, cy = this.thing.cy;
    this.turning = false;

    if (this.dir) {
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

class PaulEnemy extends EnemyHead {
  constructor(game, args) {
    // CTR TODO parse args and initialize Paul with proper parameters
    super(game, 80 + Math.random() * 20,
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
    if (this.movement.isTurning()) this.hp++; // regen
  }
}
Plugins.enemies.PaulEnemy = PaulEnemy;

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
    if (this.movement.isTurning()) this.hp++; // regen
  }
}
Plugins.enemies.PaulBoss = PaulBoss;
