/** Defines Kelsey's attack style. */
class KelsAttack extends AttackStyle {

  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  const int FREQUENCY = 1;

  KelsAttack(t) { super(t); }

  /** Fires a shot randomly. */
  Thing[] shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return new Thing[] {new EnemyBullet(thing)};
  }

}

class KelsMovement extends MovementStyle {

  const int RADIUS2 = 200;
  const int SPEED = 2;

  KelsMovement(t, y, dir) {
    super(t);
    VeggieCopter game = thing.getGame();

    // compute starting position
    xpos, ypos;
    int w = game.getWindowWidth(), h = game.getWindowHeight();

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
    float xpos = thing.getCX(), ypos = thing.getCY();

    Copter hero = thing.getGame().getCopter();
    float cxpos = hero.getCX(), cypos = hero.getCY();

    float xdist = xpos - cxpos;
    float ydist = ypos - cypos;
    float dist2 = xdist * xdist + ydist * ydist;
    float dist = (float) Math.sqrt(dist2);
    float xd = xdist / dist;
    float yd = ydist / dist;
    xpos -= xd;
    ypos -= yd;

    thing.setCPos(xpos, ypos);
  }

}

class KelsEnemy extends EnemyHead {

  KelsEnemy(game, String[] args) {
    // CTR TODO parse args and initialize Kels with proper parameters
    super(game, 25,
      game.loadImage("kels1.png"),
      game.loadImage("kels2.png"),
      game.loadImage("kels3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());

    int y = 0;
    boolean dir = false;
    if (args.length >= 1) {
      try { y = Integer.parseInt(args[0]); }
      catch (exc) { y = 0; }
    }
    if (args.length >= 2) dir = args[1].equals("true");

    setMovement(new KelsMovement(this, y, dir));
    setAttack(new KelsAttack(this));
  }

  int getScore() { return 3 * super.getScore(); }

}

class KelsBoss extends BossHead {

  KelsBoss(game, String[] args) {
    // CTR TODO parse args and initialize Kels with proper parameters
    super(game, 250,
      game.loadImage("kels-boss1.png"),
      game.loadImage("kels-boss2.png"),
      game.loadImage("kels-boss3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());

    int y = 0;
    boolean dir = false;
    if (args.length >= 1) {
      try { y = Integer.parseInt(args[0]); }
      catch (exc) { y = 0; }
    }
    if (args.length >= 2) dir = args[1].equals("true");

    setMovement(new KelsMovement(this, y, dir));
    setAttack(new KelsAttack(this));
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  ColoredAttack getColoredAttack() {
    return new SplitterAttack(game.getCopter());
  }

  int getScore() { return 30 * super.getScore(); }

}
