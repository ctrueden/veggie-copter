package net.restlesscoder.heli;

import java.awt.Point;

import java.util.Vector;

/** Defines George's attack style. */
public class GeorgeAttack extends AttackStyle {

  // -- Constants --

  /** Number of bullets to fire per spread. */
  protected static final int BULLETS = 5;

  /** Spread factor for controlling bullet spread width. */
  protected static final int SPREAD = 24;

  /** Number of frames to wait between firing bullets in frantic mode. */
  protected static final int FRANTIC_RATE = 5;


  // -- Fields --

  /** List of bullets left to fire. */
  protected Vector toFire = new Vector();

  /** Frames to wait until adding another bullet (frantic mode only). */
  protected int waitTicks = FRANTIC_RATE;


  // -- Constructor --

  public GeorgeAttack(Thing t) { super(t); }


  // -- AttackStyle API methods --

  /** Fires a shot according to George's attack pattern. */
  public Thing[] shoot() {
    GeorgeMovement pm = (GeorgeMovement) thing.getMovement();

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
          float x = dir ? hx + SPREAD * mod : hx;
          float y = dir ? hy : hy + SPREAD * mod;
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

public class GeorgeMovement extends MovementStyle {

  // -- Constants --

  /** Movement speed per frame. */
  protected static final int SPEED = 1;

  /** Number of HP considered low enough to enter frantic mode. */
  protected static final int LOW_HP = 30;


  // -- Fields --

  protected float target;
  protected boolean dir;
  protected boolean turning;


  // -- Constructors --

  public GeorgeMovement(Thing t) {
    super(t);
    VeggieCopter game = thing.getGame();
    int w = game.getWindowWidth();

    // compute starting position
    int width = thing.getWidth();
    float xpos = (float) ((w - 2 * width) * Math.random()) + width;
    float ypos = -thing.getHeight();
    thing.setPos(xpos, ypos);
    doSwitch();
  }


  // -- GeorgeMovement API methods --

  /** Gets whether thing is currently changing directions. */
  public boolean isTurning() { return turning; }

  public boolean isFrantic() { return thing.getHP() <= LOW_HP; }

  /** Gets movement direction of this thing. */
  public boolean getDirection() { return dir; }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the George movement style. */
  public void move() {
    if (isFrantic()) return;

    float cx = thing.getCX(), cy = thing.getCY();
    turning = false;

    if (dir) {
      if (cy > target) {
        if (cy - target < SPEED) cy = target;
        else cy -= SPEED;
      }
      else if (cy < target) {
        if (target - cy < SPEED) cy = target;
        else cy += SPEED;
      }
      else doSwitch();
    }
    else {
      if (cx > target) {
        if (cx - target < SPEED) cx = target;
        else cx -= SPEED;
      }
      else if (cx < target) {
        if (target - cx < SPEED) cx = target;
        else cx += SPEED;
      }
      else doSwitch();
    }

    thing.setCPos(cx, cy);
  }


  // -- Helper methods --

  /** Switches between horizontal and vertical movement modes. */
  protected void doSwitch() {
    Copter hero = thing.getGame().getCopter();
    dir = !dir;
    target = dir ? hero.getCY() : hero.getCX();
    turning = true;
  }

}

public class GeorgeEnemy extends EnemyHead {

  // -- Constructor --

  public GeorgeEnemy(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize George with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.loadImage("george1.png"),
      game.loadImage("george2.png"),
      game.loadImage("george3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());
    setMovement(new GeorgeMovement(this));
    setAttack(new GeorgeAttack(this));
  }


  // -- Thing API methods --

  public int getScore() { return 5 * super.getScore(); }

  public void move() {
    super.move();

    // regen
    if (((GeorgeMovement) move).isTurning()) hp++;
  }

}

public class GeorgeBoss extends BossHead {

  // -- Constructor --

  public GeorgeBoss(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize George with proper parameters
    super(game, 800 + (int) (Math.random() * 200),
      game.loadImage("george-boss1.png"),
      game.loadImage("george-boss2.png"),
      game.loadImage("george-boss3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());
    setMovement(new GeorgeMovement(this));
    setAttack(new GeorgeAttack(this));
  }


  // -- BossHead API methods --

  /** Gets the attack form left behind by this boss upon defeat. */
  public ColoredAttack getColoredAttack() {
    return new SpreadAttack(game.getCopter());
  }


  // -- Thing API methods --

  public int getScore() { return 50 * super.getScore(); }

  public void move() {
    super.move();

    // regen
    if (((GeorgeMovement) move).isTurning()) hp++;
  }

}