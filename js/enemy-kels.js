class KelsMovement extends MovementStyle {
  constructor(t, y, dir) {
    super(t);
    var game = this.thing.game;

    // compute starting position
    this.xpos = this.ypos = 0;
    var w = game.width, h = game.height;

    if (dir) {
      // appear from right
      this.xpos = w - this.thing.width;
      this.ypos = y;
    }
    else {
      // appear from left
      xpos = 0;
      ypos = y;
    }

    this.thing.setPos(xpos, ypos);
  }

  move() {
    var cx = this.thing.cx, cy = this.thing.cy;
    var hero = this.thing.game.copter;
    var xdist = cx - hero.cx;
    var ydist = cy - hero.cy;
    var dist2 = xdist * xdist + ydist * ydist;
    var dist = Math.sqrt(dist2);
    var xd = xdist / dist;
    var yd = ydist / dist;
    cx -= xd;
    cy -= yd;
    this.thing.setCPos(cx, cy);
  }
}

class KelsEnemy extends EnemyHead {
  constructor(game, args) {
    // CTR TODO parse args and initialize Kels with proper parameters
    super(game, 25,
      game.loadSprite("kels1"),
      game.loadSprite("kels2"),
      game.loadSprite("kels3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalSprite.addBox(new BoxInsets());
    this.attackSprite.addBox(new BoxInsets());
    this.hurtSprite.addBox(new BoxInsets());

    var y = 0;
    var dir = false;
    if (args.length >= 1) {
      try { y = parseInt(args[0]); }
      catch (exc) { y = 0; }
    }
    if (args.length >= 2) dir = args[1].equals("true");

    this.movement = new KelsMovement(this, y, dir);
    this.attack = new RandomBulletAttack(this, 1);
  }

  get score() { return 3 * super.score; }
}

class KelsBoss extends BossHead {
  constructor(game, args) {
    // CTR TODO parse args and initialize Kels with proper parameters
    super(game, 250,
      game.loadSprite("kels-boss1"),
      game.loadSprite("kels-boss2"),
      game.loadSprite("kels-boss3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalSprite.addBox(new BoxInsets());
    this.attackSprite.addBox(new BoxInsets());
    this.hurtSprite.addBox(new BoxInsets());

    var y = 0;
    var dir = false;
    if (args.length >= 1) {
      try { y = parseInt(args[0]); }
      catch (exc) { y = 0; }
    }
    if (args.length >= 2) dir = args[1].equals("true");

    this.movement = new KelsMovement(this, y, dir);
    this.attack = new RandomBulletAttack(this, 1);
    this.weapon = new SplitterWeapon(game.copter);
  }
}
