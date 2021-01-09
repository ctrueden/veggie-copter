/** Defines Jamesey's attack style. */
class JamesAttack extends AttackStyle {

  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  FREQUENCY = 1;

  JamesAttack(t) { super(t); }

  /** Fires a shot randomly. */
  shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return [new EnemyBullet(thing)];
  }

}

class JamesMovement extends MovementStyle {

  RADIUS2 = 200;
  SPEED = 2;

  JamesMovement(t, y, dir) {
    super(t);
    VeggieCopter game = thing.getGame();

    // compute starting position
    xpos, ypos;
    var w = game.getWindowWidth(), h = game.getWindowHeight();

    if (dir) {
      // appear from right
      xpos = w - thing.getWidth();
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
    var xpos = thing.getCX(), ypos = thing.getCY();

    Copter hero = thing.getGame().getCopter();
    var cxpos = hero.getCX(), cypos = hero.getCY();

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
      game.loadImage("james1.png"),
      game.loadImage("james2.png"),
      game.loadImage("james3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());

    var y = 0;
    boolean dir = false;
    if (args.length >= 1) {
      try { y = parseInt(args[0]); }
      catch (exc) { y = 0; }
    }
    if (args.length >= 2) dir = args[1].equals("true");

    setMovement(new JamesMovement(this, y, dir));
    setAttack(new JamesAttack(this));
  }

  var getScore() { return 3 * super.getScore(); }

}

class JamesBoss extends BossHead {

  JamesBoss(game, args) {
    // CTR TODO parse args and initialize James with proper parameters
    super(game, 250,
      game.loadImage("james-boss1.png"),
      game.loadImage("james-boss2.png"),
      game.loadImage("james-boss3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());

    var y = 0;
    boolean dir = false;
    if (args.length >= 1) {
      try { y = parseInt(args[0]); }
      catch (exc) { y = 0; }
    }
    if (args.length >= 2) dir = args[1].equals("true");

    setMovement(new JamesMovement(this, y, dir));
    setAttack(new JamesAttack(this));
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  ColoredAttack getColoredAttack() {
    return new SplitterAttack(game.getCopter());
  }

  var getScore() { return 30 * super.getScore(); }

}
