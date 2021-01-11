/** Defines Jamesey's attack style. */
class JamesAttack extends AttackStyle {

  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  FREQUENCY = 1;

  JamesAttack(t) { super(t); }

  /** Fires a shot randomly. */
  shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return [new EnemyBullet(thing, null, null)];
  }

}

class JamesMovement extends MovementStyle {

  RADIUS2 = 200;
  SPEED = 2;

  JamesMovement(t, y, dir) {
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

class JamesEnemy extends EnemyHead {

  JamesEnemy(game, args) {
    // CTR TODO parse args and initialize James with proper parameters
    super(game, 25,
      game.sprite("james1"),
      game.sprite("james2"),
      game.sprite("james3"));
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

    this.move = new JamesMovement(this, y, dir);
    this.attack = new JamesAttack(this);
  }

  var getScore() { return 3 * super.getScore(); }

}

class JamesBoss extends BossHead {

  JamesBoss(game, args) {
    // CTR TODO parse args and initialize James with proper parameters
    super(game, 250,
      game.sprite("james-boss1.png"),
      game.sprite("james-boss2.png"),
      game.sprite("james-boss3.png"));
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

    this.move = new JamesMovement(this, y, dir);
    this.attack = new JamesAttack(this);
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  Weapon getWeapon() {
    return new SplitterAttack(game.copter);
  }

  var getScore() { return 30 * super.getScore(); }

}
