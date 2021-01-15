class AlexAttack extends AttackStyle {
  constructor(t) {
    super(t);

    /** Probability that this thing will fire a bullet (1=rare, 60=always). */
    this.frequency = 1;
  }

  /** Fires a shot randomly. */
  shoot() {
    if (Math.random() >= 1.0 / (60 - this.frequency)) return [];
    return [new EnemyBullet(thing, null, null)];
  }
}

class AlexMovement extends MovementStyle {
  constructor(t) {
    super(t);

    this.xSteps = 40;
    this.ySteps = 30;
    this.speed = 2;
    this.lungeRate = 300;

    var game = thing.game;

    // compute starting position
    var xpos, ypos;
    var w = game.getWindowWidth(), h = game.getWindowHeight();

    var r = Math.random();
    if (r < 1.0 / 3) {
      // appear from top
      var xpad = this.xSteps / 2;
      xpos = (w - xpad) * Math.random() + xpad;
      ypos = 0;
      this.xdir = Math.random() < 0.5;
      this.ydir = true;
    }
    else if (r < 2.0 / 3) {
      // appear from left
      var ypad = this.ySteps / 2;
      xpos = 0;
      ypos = (h / 2 - ypad) * Math.random() + ypad;
      this.xdir = true;
      this.ydir = true;
    }
    else {
      // appear from right
      var ypad = this.ySteps / 2;
      xpos = w - 1;
      ypos = (h / 2 - ypad) * Math.random() + ypad;
      this.xdir = false;
      this.ydir = true;
    }

    // compute random starting trajectory
    this.xstart = xpos;
    this.ystart = ypos;
    this.xlen = this.thing.width * Math.random() + 2 * this.xSteps;
    this.ylen = this.thing.height * Math.random() + 2 * this.ySteps;
    this.xinc = 0;
    this.yinc = 0;

    this.ticks = 0;
    this.needsToRun = false;
    this.running = false;
    this.lunging = false;
    this.lastX = xpos; this.lastY = ypos;
    this.thing.setPos(xpos, ypos);
  }

  /** Moves the given thing according to the bouncing movement style. */
  move() {
    var xpos = thing.xpos, ypos = thing.ypos;
    var game = thing.game;

    // adjust for external movement
    xstart = xstart - lastX + xpos;
    ystart = ystart - lastY + ypos;

    ticks++;
    if (ticks % LUNGE_RATE == 0) {
      // lunge toward ship
      this.lunging = true;
      var hero = game.copter;

      xstart = xpos;
      var sx = hero.xpos;
      xdir = sx > xpos;
      xlen = 3 * (xdir ? sx - xpos : xpos - sx) / 2;
      xinc = 0;

      ystart = ypos;
      var sy = hero.ypos;
      ydir = sy > ypos;
      ylen = 3 * (ydir ? sy - ypos : ypos - sy) / 2;
      yinc = 0;
    }

    var xp = smooth((double) xinc++ / this.xSteps);
    if (xdir) xpos = (float) (xstart + xp * xlen / this.speed);
    else xpos = (float) (xstart - xp * xlen / this.speed);

    var yp = smooth((double) yinc++ / this.ySteps);
    if (ydir) ypos = (float) (ystart + yp * ylen / this.speed);
    else ypos = (float) (ystart - yp * ylen / this.speed);

    if (thing.isHit() && !this.running) this.needsToRun = true;
    var w = game.getWindowWidth();
    var h = game.getWindowHeight();
    var width = thing.width;
    var height = thing.height;

    if (xinc == this.xSteps) {
      if (this.needsToRun) {
        // run away when being shot
        this.running = true;
        xstart = xpos;
        xdir = thing.cx < w / 2;
        xlen = 2 * (xdir ? w - width - xpos : xpos) - 10;
        xinc = 0;
      }
      else {
        xstart = xpos;
        xdir = !xdir;
        xlen = (float) (width * Math.random()) + this.xSteps;
        xinc = 0;
        this.running = false;
      }
      this.needsToRun = false;
      this.lunging = false;
    }

    if (yinc == this.ySteps) {
      ystart = ypos;
      ydir = !ydir;
      ylen = (float) (height * Math.random()) + this.ySteps;
      yinc = 0;
      this.lunging = false;
    }

    if (xpos < -width) xpos = -width;
    if (ypos < -height) ypos = -height;
    if (xpos > w + width) xpos = w + width;
    if (ypos > h + height) ypos = h + height;
    lastX = xpos; lastY = ypos;
    thing.setPos(xpos, ypos);
  }

  /** Converts linear movement into curved movement with a sine function. */
  var smooth(p) {
    p = Math.PI * (p - 0.5); // [0, 1] -> [-PI/2, PI/2]
    p = Math.sin(p); // [-PI/2, PI/2] -> [-1, 1] smooth sine
    p = (p + 1) / 2; // [-1, 1] -> [0, 1]
    return p;
  }

}

class AlexEnemy extends EnemyHead {
  constructor(game, args) {
    // CTR TODO parse args and initialize Alex with proper parameters
    super(game, 25,
      game.loadSprite("alex1"),
      game.loadSprite("alex2"),
      game.loadSprite("alex3"));
    // CTR TODO set proper bounding box and offsets here
    var normal = this.normalSprite();
    normal.addBox(new BoxInsets(30, 1, 30, 20));
    normal.addBox(new BoxInsets(25, 5, 25, 25));
    this.attackSprite.addBox(new BoxInsets(28, 1, 28, 13));
    this.attackSprite.addBox(new BoxInsets(23, 5, 23, 17));
    this.hurtSprite.addBox(new BoxInsets(32, 1, 27, 13));
    this.hurtSprite.addBox(new BoxInsets(27, 5, 22, 17));
    this.movement = new AlexMovement(this);
    this.attack =snew AlexAttack(this);
  }

  get score() { return 3 * super.score; }

  move() {
    super.move();

    // set proper expression
    if (this.isHit() || this.movement.running) this.hurtActivate();
    else if (this.isShooting() || this.movement.lunging) this.attackActivate();
    else this.normalActivate();

    // regen
    if (this.game.ticks % 6 == 0 && this.hp < this.maxHP) this.hp++;
  }
}

class AlexBoss extends BossHead {
  constructor(game, args) {
    // CTR TODO parse args and initialize Alex with proper parameters
    super(game, 250,
      game.loadSprite("alex-boss1"),
      game.loadSprite("alex-boss2"),
      game.loadSprite("alex-boss3"));
    // CTR TODO set proper bounding box and offsets here
    var normal = this.normalSprite();
    normal.addBox(new BoxInsets(95, 3, 100, 60));
    normal.addBox(new BoxInsets(78, 18, 80, 85));
    this.attackSprite.addBox(new BoxInsets(84, 3, 84, 39));
    this.attackSprite.addBox(new BoxInsets(69, 15, 69, 51));
    this.hurtSprite.addBox(new BoxInsets(96, 3, 81, 39));
    this.hurtSprite.addBox(new BoxInsets(81, 15, 66, 51));
    this.movement = new AlexMovement(this);
    this.attack = new AlexAttack(this);
    this.weapon = new EnergyWeapon(game.copter, 0, 0);
  }

  move() {
    super.move();

    // set proper expression
    if (this.isHit() || this.movement.running) this.hurtActivate();
    else if (this.isShooting() || this.movement.lunging) this.attackActivate();
    else this.normalActivate();

    // regen
    if (this.game.ticks % 20 == 0 && this.hp < this.maxHP) this.hp++;
  }
}
