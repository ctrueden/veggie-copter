//
// PaulMovement.java
//

public class PaulMovement extends MovementStyle {

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

  public PaulMovement(Thing t) {
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


  // -- PaulMovement API methods --

  /** Gets whether thing is currently changing directions. */
  public boolean isTurning() { return turning; }

  public boolean isFrantic() { return thing.getHP() <= LOW_HP; }

  /** Gets movement direction of this thing. */
  public boolean getDirection() { return dir; }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the Paul movement style. */
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
