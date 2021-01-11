class BounceMovement extends MovementStyle {
  constructor(t) {
    super(t);

    this.xSteps = 40;
    this.ySteps = 30;

    var game = this.thing.game;

    // compute starting position
    var xpos, ypos;
    var w = game.getWindowWidth(), h = game.getWindowHeight();

    var r = Math.random();
    if (r < 1.0 / 3) {
      // appear from top
      var xpad = this.xSteps / 2;
      xpos = ((w - xpad) * Math.random()) + xpad;
      ypos = 0;
      this.xdir = Math.random() < 0.5;
      this.ydir = true;
    }
    else if (r < 2.0 / 3) {
      // appear from left
      var ypad = this.ySteps / 2;
      xpos = 0;
      ypos = (h / 2 - ypad) * Math.random() + ypad;
      this.xdir = true;
      this.ydir = true;
    }
    else {
      // appear from right
      var ypad = this.ySteps / 2;
      xpos = w - 1;
      ypos = (h / 2 - ypad) * Math.random() + ypad;
      this.xdir = false;
      this.ydir = true;
    }

    // compute random starting trajectory
    this.xstart = xpos;
    this.ystart = ypos;
    this.xlen = this.thing.width * Math.random() + 2 * this.xSteps;
    this.ylen = this.thing.height * Math.random() + 2 * this.ySteps;
    this.xinc = 0;
    this.yinc = 0;

    this.thing.setPos(xpos, ypos);
  }

  /** Moves the thing according to the bouncing movement style. */
  move() {
    var xpos = this.thing.xpos, ypos = this.thing.ypos;

    var xp = smooth(xinc++ / this.xSteps);
    if (xdir) xpos = xstart + xp * xlen;
    else xpos = xstart - xp * xlen;

    var yp = smooth(yinc++ / this.ySteps);
    if (ydir) ypos = ystart + yp * ylen;
    else ypos = ystart - yp * ylen;

    if (this.xinc == this.xSteps) {
      this.xstart = xpos;
      this.xdir = !this.xdir;
      this.xlen = this.thing.width * Math.random() + this.xSteps;
      this.xinc = 0;
    }

    if (this.yinc == this.ySteps) {
      this.ystart = ypos;
      this.ydir = !this.ydir;
      this.ylen = this.thing.height * Math.random() + this.ySteps;
      this.yinc = 0;
    }

    this.thing.setPos(xpos, ypos);
  }

  /** Converts linear movement into curved movement with a sine function. */
  smooth(p) {
    p = Math.PI * (p - 0.5); // [0, 1] -> [-PI/2, PI/2]
    p = Math.sin(p); // [-PI/2, PI/2] -> [-1, 1] smooth sine
    p = (p + 1) / 2; // [-1, 1] -> [0, 1]
    return p;
  }
}
