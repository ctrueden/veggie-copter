package net.restlesscoder.heli;

import java.awt.Point;

import java.util.Vector;

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
