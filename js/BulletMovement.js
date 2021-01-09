class BulletMovement extends MovementStyle {

  SPEED = 2.2;

  xstart, ystart;
  xtraj, ytraj;
  speed;
  tick;

  BulletMovement(t, x, y) {
    this(t, x, y, t.getGame().getCopter().getX(),
      t.getGame().getCopter().getY(), SPEED);
  }

  BulletMovement(t, x, y,
    xtarget, ytarget)
  {
    this(t, x, y, xtarget, ytarget, SPEED);
  }

  BulletMovement(t, x, y,
    xtarget, ytarget, speed)
  {
    super(t);
    thing.setPos(x, y);

    xstart = x; ystart = y;
    var xx = xtarget - x;
    var yy = ytarget - y;
    var c = Math.sqrt((xx * xx + yy * yy) / (speed * speed));

    xtraj = xx / c;
    ytraj = yy / c;
    tick = 0;
  }

  /** Moves the given thing according to the bullet movement style. */
  move() {
    var xpos = xstart + tick * xtraj;
    var ypos = ystart + tick * ytraj;
    tick++;
    thing.setPos(xpos, ypos);
  }

}
