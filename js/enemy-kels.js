/** Defines Kelsey's attack style. */
class KelsAttack extends AttackStyle {

  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  FREQUENCY = 1;

  KelsAttack(t) { super(t); }

  /** Fires a shot randomly. */
  shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return [new EnemyBullet(thing, null, null)];
  }

}

class KelsMovement extends MovementStyle {

  RADIUS2 = 200;
  SPEED = 2;

  KelsMovement(t, y, dir) {
    super(t);
    VeggieCopter game = thing.game;

    // compute starting position
    xpos, ypos;
    var w = game.getWindowWidth(), h = game.getWindowHeight();

    if (dir) {
      // appear from right
      xpos = w - thing.width;
      ypos = y;
    }
    else {
      // appear from left
      xpos = 0;
      ypos = y;
    }

    thing.setPos(xpos, ypos);
  }

  /** Moves the given thing according to the bouncing movement style. */
  move() {
    var xpos = thing.cx, ypos = thing.cy;

    Copter hero = thing.game.copter;
    var cxpos = hero.cx, cypos = hero.cy;

    var xdist = xpos - cxpos;
    var ydist = ypos - cypos;
    var dist2 = xdist * xdist + ydist * ydist;
    var dist = (float) Math.sqrt(dist2);
    var xd = xdist / dist;
    var yd = ydist / dist;
    xpos -= xd;
    ypos -= yd;

    thing.setCPos(xpos, ypos);
  }

}

class KelsEnemy extends EnemyHead {

  KelsEnemy(game, args) {
    // CTR TODO parse args and initialize Kels with proper parameters
    super(game, 25,
      game.loadSprite("kels1"),
      game.loadSprite("kels2"),
      game.loadSprite("kels3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalImage.addBox(new BoundingBox());
    this.attackImage.addBox(new BoundingBox());
    this.hurtImage.addBox(new BoundingBox());

    var y = 0;
    boolean dir = false;
    if (args.length >= 1) {
      try { y = parseInt(args[0]); }
      catch (exc) { y = 0; }
    }
    if (args.length >= 2) dir = args[1].equals("true");

    this.movement = new KelsMovement(this, y, dir);
    this.attack = new KelsAttack(this);
  }

  var getScore() { return 3 * super.getScore(); }

}

class KelsBoss extends BossHead {

  KelsBoss(game, args) {
    // CTR TODO parse args and initialize Kels with proper parameters
    super(game, 250,
      game.loadSprite("kels-boss1"),
      game.loadSprite("kels-boss2"),
      game.loadSprite("kels-boss3"));
    // CTR TODO set proper bounding box and offsets here
    this.normalImage.addBox(new BoundingBox());
    this.attackImage.addBox(new BoundingBox());
    this.hurtImage.addBox(new BoundingBox());

    var y = 0;
    boolean dir = false;
    if (args.length >= 1) {
      try { y = parseInt(args[0]); }
      catch (exc) { y = 0; }
    }
    if (args.length >= 2) dir = args[1].equals("true");

    this.movement = new KelsMovement(this, y, dir);
    this.attack = new KelsAttack(this);
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  Weapon getWeapon() {
    return new SplitterAttack(game.copter);
  }

  var getScore() { return 30 * super.getScore(); }

}
