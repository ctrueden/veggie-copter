class BulletMovement extends MovementStyle {

  const float SPEED = 2.2f;

  xstart, ystart;
  xtraj, ytraj;
  float speed;
  int tick;

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
    float xx = xtarget - x;
    float yy = ytarget - y;
    float c = (float) Math.sqrt((xx * xx + yy * yy) / (speed * speed));

    xtraj = xx / c;
    ytraj = yy / c;
    tick = 0;
  }

  /** Moves the given thing according to the bullet movement style. */
  move() {
    float xpos = xstart + tick * xtraj;
    float ypos = ystart + tick * ytraj;
    tick++;
    thing.setPos(xpos, ypos);
  }

}
