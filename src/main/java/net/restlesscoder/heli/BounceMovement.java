package net.restlesscoder.heli;

public class BounceMovement extends MovementStyle {

  // -- Constants --

  protected static final int X_STEPS = 40;
  protected static final int Y_STEPS = 30;


  // -- Fields --

  protected float xstart, ystart;
  protected float xlen, ylen;
  protected int xinc, yinc;
  protected boolean xdir, ydir;


  // -- Constructors --

  public BounceMovement(Thing t) {
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

    thing.setPos(xpos, ypos);
  }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the bouncing movement style. */
  public void move() {
    float xpos = thing.getX(), ypos = thing.getY();

    float xp = (float) smooth((double) xinc++ / X_STEPS);
    if (xdir) xpos = xstart + xp * xlen;
    else xpos = xstart - xp * xlen;

    float yp = (float) smooth((double) yinc++ / Y_STEPS);
    if (ydir) ypos = ystart + yp * ylen;
    else ypos = ystart - yp * ylen;

    if (xinc == X_STEPS) {
      xstart = xpos;
      xdir = !xdir;
      xlen = (int) (thing.getWidth() * Math.random()) + X_STEPS;
      xinc = 0;
    }

    if (yinc == Y_STEPS) {
      ystart = ypos;
      ydir = !ydir;
      ylen = (int) (thing.getHeight() * Math.random()) + Y_STEPS;
      yinc = 0;
    }

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
