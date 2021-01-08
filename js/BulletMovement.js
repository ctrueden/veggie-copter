public class BulletMovement extends MovementStyle {

  protected static final float SPEED = 2.2f;

  protected float xstart, ystart;
  protected float xtraj, ytraj;
  protected float speed;
  protected int tick;

  public BulletMovement(Thing t, float x, float y) {
    this(t, x, y, t.getGame().getCopter().getX(),
      t.getGame().getCopter().getY(), SPEED);
  }

  public BulletMovement(Thing t, float x, float y,
    float xtarget, float ytarget)
  {
    this(t, x, y, xtarget, ytarget, SPEED);
  }

  public BulletMovement(Thing t, float x, float y,
    float xtarget, float ytarget, double speed)
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
  public void move() {
    float xpos = xstart + tick * xtraj;
    float ypos = ystart + tick * ytraj;
    tick++;
    thing.setPos(xpos, ypos);
  }

}
