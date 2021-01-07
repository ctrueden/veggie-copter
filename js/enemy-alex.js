package net.restlesscoder.heli;

/** Defines random enemy bullet attack. */
public class AlexAttack extends AttackStyle {

  // -- Constants --

  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  protected static final int FREQUENCY = 1;


  // -- Constructor --

  public AlexAttack(Thing t) { super(t); }


  // -- AttackStyle API methods --

  /** Fires a shot randomly. */
  public Thing[] shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return new Thing[] {new EnemyBullet(thing)};
  }

}

public class AlexMovement extends MovementStyle {

  // -- Constants --

  protected static final int X_STEPS = 40;
  protected static final int Y_STEPS = 30;

  protected static final int SPEED = 2;
  protected static final int LUNGE_RATE = 300;


  // -- Fields --

  protected float xstart, ystart;
  protected float xlen, ylen;
  protected int xinc, yinc;
  protected boolean xdir, ydir;
  protected long ticks;
  protected boolean needsToRun, running, lunging;
  protected float lastX, lastY;


  // -- Constructors --

  public AlexMovement(Thing t) {
    super(t);
    VeggieCopter game = thing.getGame();

    // compute starting position
    int xpos, ypos;
    int w = game.getWindowWidth(), h = game.getWindowHeight();

    double r = Math.random();
    if (r < 1.0 / 3) {
      // appear from top
      int xpad = X_STEPS / 2;
      xpos = (int) ((w - xpad) * Math.random()) + xpad;
      ypos = 0;
      xdir = Math.random() < 0.5;
      ydir = true;
    }
    else if (r < 2.0 / 3) {
      // appear from left
      int ypad = Y_STEPS / 2;
      xpos = 0;
      ypos = (int) ((h / 2 - ypad) * Math.random()) + ypad;
      xdir = true;
      ydir = true;
    }
    else {
      // appear from right
      int ypad = Y_STEPS / 2;
      xpos = w - 1;
      ypos = (int) ((h / 2 - ypad) * Math.random()) + ypad;
      xdir = false;
      ydir = true;
    }

    // compute random starting trajectory
    xstart = xpos; ystart = ypos;
    xlen = (int) (thing.getWidth() * Math.random()) + 2 * X_STEPS;
    ylen = (int) (thing.getHeight() * Math.random()) + 2 * Y_STEPS;
    xinc = 0; yinc = 0;

    lastX = xpos; lastY = ypos;
    thing.setPos(xpos, ypos);
  }


  // -- AlexMovement API methods --

  public boolean isRunning() { return running; }

  public boolean isLunging() { return lunging; }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the bouncing movement style. */
  public void move() {
    float xpos = thing.getX(), ypos = thing.getY();
    VeggieCopter game = thing.getGame();

    // adjust for external movement
    xstart = xstart - lastX + xpos;
    ystart = ystart - lastY + ypos;

    ticks++;
    if (ticks % LUNGE_RATE == 0) {
      // lunge toward ship
      lunging = true;
      Copter hero = game.getCopter();

      xstart = xpos;
      float sx = hero.getX();
      xdir = sx > xpos;
      xlen = 3 * (xdir ? sx - xpos : xpos - sx) / 2;
      xinc = 0;

      ystart = ypos;
      float sy = hero.getY();
      ydir = sy > ypos;
      ylen = 3 * (ydir ? sy - ypos : ypos - sy) / 2;
      yinc = 0;
    }

    double xp = smooth((double) xinc++ / X_STEPS);
    if (xdir) xpos = (float) (xstart + xp * xlen / SPEED);
    else xpos = (float) (xstart - xp * xlen / SPEED);

    double yp = smooth((double) yinc++ / Y_STEPS);
    if (ydir) ypos = (float) (ystart + yp * ylen / SPEED);
    else ypos = (float) (ystart - yp * ylen / SPEED);

    if (thing.isHit() && !running) needsToRun = true;
    int w = game.getWindowWidth();
    int h = game.getWindowHeight();
    int width = thing.getWidth();
    int height = thing.getHeight();

    if (xinc == X_STEPS) {
      if (needsToRun) {
        // run away when being shot
        running = true;
        xstart = xpos;
        xdir = thing.getCX() < w / 2;
        xlen = 2 * (xdir ? w - width - xpos : xpos) - 10;
        xinc = 0;
      }
      else {
        xstart = xpos;
        xdir = !xdir;
        xlen = (float) (width * Math.random()) + X_STEPS;
        xinc = 0;
        running = false;
      }
      needsToRun = false;
      lunging = false;
    }

    if (yinc == Y_STEPS) {
      ystart = ypos;
      ydir = !ydir;
      ylen = (float) (height * Math.random()) + Y_STEPS;
      yinc = 0;
      lunging = false;
    }

    if (xpos < -width) xpos = -width;
    if (ypos < -height) ypos = -height;
    if (xpos > w + width) xpos = w + width;
    if (ypos > h + height) ypos = h + height;
    lastX = xpos; lastY = ypos;
    thing.setPos(xpos, ypos);
  }


  // -- Helper methods --

  /** Converts linear movement into curved movement with a sine function. */
  protected double smooth(double p) {
    p = Math.PI * (p - 0.5); // [0, 1] -> [-PI/2, PI/2]
    p = Math.sin(p); // [-PI/2, PI/2] -> [-1, 1] smooth sine
    p = (p + 1) / 2; // [-1, 1] -> [0, 1]
    return p;
  }

}

public class AlexEnemy extends EnemyHead {

  // -- Constructor --

  public AlexEnemy(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize Alex with proper parameters
    super(game, 25,
      game.loadImage("alex1.png"),
      game.loadImage("alex2.png"),
      game.loadImage("alex3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox(30, 1, 30, 20));
    normal.addBox(new BoundingBox(25, 5, 25, 25));
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox(28, 1, 28, 13));
    attacking.addBox(new BoundingBox(23, 5, 23, 17));
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox(32, 1, 27, 13));
    hurting.addBox(new BoundingBox(27, 5, 22, 17));
    setMovement(new AlexMovement(this));
    setAttack(new AlexAttack(this));
  }


  // -- Thing API methods --

  public int getScore() { return 3 * super.getScore(); }

  public void move() {
    super.move();

    // set proper expression
    AlexMovement am = (AlexMovement) move;
    if (isHit() || am.isRunning()) setImageIndex(HURTING);
    else if (isShooting() || am.isLunging()) setImageIndex(ATTACKING);
    else setImageIndex(NORMAL);

    // regen
    if (game.getTicks() % 6 == 0 && hp < maxhp) hp++;
  }

}

public class AlexBoss extends BossHead {

  // -- Constructor --

  public AlexBoss(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize Alex with proper parameters
    super(game, 250,
      game.loadImage("alex-boss1.png"),
      game.loadImage("alex-boss2.png"),
      game.loadImage("alex-boss3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox(95, 3, 100, 60));
    normal.addBox(new BoundingBox(78, 18, 80, 85));
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox(84, 3, 84, 39));
    attacking.addBox(new BoundingBox(69, 15, 69, 51));
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox(96, 3, 81, 39));
    hurting.addBox(new BoundingBox(81, 15, 66, 51));
    setMovement(new AlexMovement(this));
    setAttack(new AlexAttack(this));
  }


  // -- BossHead API methods --

  /** Gets the attack form left behind by this boss upon defeat. */
  public ColoredAttack getColoredAttack() {
    return new EnergyAttack(game.getCopter());
  }


  // -- Thing API methods --

  public int getScore() { return 30 * super.getScore(); }

  public void move() {
    super.move();

    // set proper expression
    AlexMovement am = (AlexMovement) move;
    if (isHit() || am.isRunning()) setImageIndex(HURTING);
    else if (isShooting() || am.isLunging()) setImageIndex(ATTACKING);
    else setImageIndex(NORMAL);

    // regen
    if (game.getTicks() % 20 == 0 && hp < maxhp) hp++;
  }

}
