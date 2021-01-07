package net.restlesscoder.heli;

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
