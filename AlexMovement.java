//
// AlexMovement.java
//

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
