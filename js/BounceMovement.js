class BounceMovement extends MovementStyle {

  static X_STEPS = 40;
  static Y_STEPS = 30;

  BounceMovement(t) {
    super(t);
    var game = thing.getGame();

    // compute starting position
    var xpos, ypos;
    var w = game.getWindowWidth(), h = game.getWindowHeight();

    var r = Math.random();
    if (r < 1.0 / 3) {
      // appear from top
      var xpad = X_STEPS / 2;
      xpos = (int) ((w - xpad) * Math.random()) + xpad;
      ypos = 0;
      this.xdir = Math.random() < 0.5;
      this.ydir = true;
    }
    else if (r < 2.0 / 3) {
      // appear from left
      var ypad = Y_STEPS / 2;
      xpos = 0;
      ypos = (int) ((h / 2 - ypad) * Math.random()) + ypad;
      this.xdir = true;
      this.ydir = true;
    }
    else {
      // appear from right
      var ypad = Y_STEPS / 2;
      xpos = w - 1;
      ypos = (int) ((h / 2 - ypad) * Math.random()) + ypad;
      this.xdir = false;
      this.ydir = true;
    }

    // compute random starting trajectory
    this.xstart = xpos;
    this.ystart = ypos;
    this.xlen = (int) (thing.getWidth() * Math.random()) + 2 * X_STEPS;
    this.ylen = (int) (thing.getHeight() * Math.random()) + 2 * Y_STEPS;
    this.xinc = 0;
    this.yinc = 0;

    thing.setPos(xpos, ypos);
  }

  /** Moves the given thing according to the bouncing movement style. */
  move() {
    var xpos = thing.getX(), ypos = thing.getY();

    var xp = (float) smooth((double) xinc++ / X_STEPS);
    if (xdir) xpos = xstart + xp * xlen;
    else xpos = xstart - xp * xlen;

    var yp = (float) smooth((double) yinc++ / Y_STEPS);
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

  /** Converts linear movement into curved movement with a sine function. */
  smooth(p) {
    p = Math.PI * (p - 0.5); // [0, 1] -> [-PI/2, PI/2]
    p = Math.sin(p); // [-PI/2, PI/2] -> [-1, 1] smooth sine
    p = (p + 1) / 2; // [-1, 1] -> [0, 1]
    return p;
  }

}
