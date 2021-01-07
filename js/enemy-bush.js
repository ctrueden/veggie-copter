public class BushMovement extends MovementStyle {

  /** Movement speed per frame. */
  protected static final int SPEED = 1;

  /** Number of HP considered low enough to enter frantic mode. */
  protected static final int LOW_HP = 25;

  protected float target;
  protected boolean dir;
  protected boolean turning;

  public BushMovement(Thing t) {
    super(t);
    VeggieCopter game = thing.getGame();
    int w = game.getWindowWidth();

    // compute starting position
    int width = thing.getWidth();
    int xpos = (int) ((w - 2 * width) * Math.random()) + width;
    int ypos = -thing.getHeight();
    doSwitch();
    thing.setPos(xpos, ypos);
  }

  /** Moves the given thing according to the Bush movement style. */
  public void move() {
    if (isFrantic()) return;

    float cx = thing.getCX(), cy = thing.getCY();
    turning = false;

    if (dir) {
      if (cy > target) cy -= SPEED;
      else if (cy < target) cy += SPEED;
      else doSwitch();
    }
    else {
      if (cx > target) cx -= SPEED;
      else if (cx < target) cx += SPEED;
      else doSwitch();
    }

    thing.setCPos(cx, cy);
  }

  /** Gets whether thing is currently changing directions. */
  public boolean isTurning() { return turning; }

  public boolean isFrantic() { return thing.getHP() <= LOW_HP; }

  /** Gets movement direction of this thing. */
  public boolean getDirection() { return dir; }

  /** Switches between horizontal and vertical movement modes. */
  protected void doSwitch() {
    Copter hero = thing.getGame().getCopter();
    dir = !dir;
    target = dir ? hero.getCY() : hero.getCX();
    turning = true;
  }

}

/** Defines Bush's attack style. */
public class BushAttack extends AttackStyle {

  /** Number of bullets to fire per spread. */
  protected static final int BULLETS = 5;

  /** Spread factor for controlling bullet spread width. */
  protected static final int SPREAD = 24;

  /** Number of frames to wait between firing bullets in frantic mode. */
  protected static final int FRANTIC_RATE = 5;

  /** List of bullets left to fire. */
  protected Vector toFire = new Vector();

  /** Frames to wait until adding another bullet (frantic mode only). */
  protected int waitTicks = FRANTIC_RATE;

  public BushAttack(Thing t) { super(t); }

  /** Fires a shot according to Bush's attack pattern. */
  public Thing[] shoot() {
    BushMovement pm = (BushMovement) thing.getMovement();

    if (pm.isFrantic()) {
      if (waitTicks > 0) {
        waitTicks--;
        return null;
      }
      int x = (int) (thing.getGame().getWidth() * Math.random());
      int y = (int) (thing.getGame().getHeight() * Math.random());
      toFire.add(new Point(x, y));
      waitTicks = FRANTIC_RATE;
    }
    else {
      if (pm.isTurning()) {
        // initialize new bullet spread when changing directions
        Copter hero = thing.getGame().getCopter();
        float hx = hero.getX(), hy = hero.getY();
        boolean dir = pm.getDirection();
        for (int i=0; i<BULLETS; i++) {
          float mod = i - BULLETS / 2f;
          float x = dir ? (hx + SPREAD * mod) : hx;
          float y = dir ? hy : (hy + SPREAD * mod);
          toFire.add(new Point((int) x, (int) y));
        }
      }
    }

    if (toFire.isEmpty()) return null;
    Point p = (Point) toFire.elementAt(0);
    toFire.removeElementAt(0);
    return new Thing[] {new EnemyBullet(thing, p.x, p.y)};
  }

}

public class BushEnemy extends EnemyHead {

  public BushEnemy(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize Bush with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.loadImage("bush1.png"),
      game.loadImage("bush2.png"),
      game.loadImage("bush3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());
    setMovement(new BushMovement(this));
    setAttack(new BushAttack(this));
  }

  public int getScore() { return 5 * super.getScore(); }

  public void move() {
    super.move();

    // regen
    if (((BushMovement) move).isTurning()) hp++;
  }

}
