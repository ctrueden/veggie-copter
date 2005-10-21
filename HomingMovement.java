//
// HomingMovement.java
//

public class HomingMovement extends MovementStyle {

  // -- Constants --

  protected static final float SPEED = 4;

  /**
   * Number between 0 and 1 indicating turning proficiency of the missile.
   * 1 = perfect turning, 0 = impossible to turn
   */
  protected static final float TURNING = 0.1f;


  // -- Fields --

  protected Thing target;
  protected float velX, velY;


  // -- Constructors --

  public HomingMovement(Thing t, float x, float y) {
    super(t);
    velX = 0; velY = -SPEED;
    thing.setPos(x, y);
  }


  // -- HomingMovement API methods --

  public float getVelocityX() { return velX; }
  public float getVelocityY() { return velY; }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the laser movement style. */
  public void move() {
    if (target != null && target.isDead()) target = null;

    if (target == null) {
      // locate new target
      Thing[] t = thing.getGame().getThings();
      float mindist2 = Float.MAX_VALUE;
      float x = thing.getCX(), y = thing.getCY();
      for (int i=0; i<t.length; i++) {
        if (!t[i].isEvil()) continue;
        float cx = t[i].getCX(), cy = t[i].getCY();
        float xx = cx - x, yy = cy - y;
        float dist2 = xx * xx + yy * yy;
        if (dist2 < mindist2) {
          mindist2 = dist2;
          target = t[i];
        }
      }
    }

    if (target != null) {
      // adjust velocity vector to angle toward target
      float x = thing.getCX(), y = thing.getCY();
      float cx = target.getCX(), cy = target.getCY();
      float xx = cx - x, yy = cy - y;
      float dist = (float) Math.sqrt(xx * xx + yy * yy);
      if (dist == 0) dist = 0.1f; // avoid divide by zero
      float factor = TURNING * SPEED / dist;

      velX += factor * xx; velY += factor * yy;
      dist = (float) Math.sqrt(velX * velX + velY * velY);
      factor = SPEED / dist;
      velX *= factor; velY *= factor;
    }

    // update position based on velocity vector
    float xpos = thing.getX(), ypos = thing.getY();
    xpos += velX; ypos += velY;
    thing.setPos((int) xpos, (int) ypos);
  }

}
