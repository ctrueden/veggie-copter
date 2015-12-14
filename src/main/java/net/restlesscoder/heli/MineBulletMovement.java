package net.restlesscoder.heli;

public class MineBulletMovement extends MovementStyle {

  // -- Constants --

  protected static final float SPEED = 2.2f;


  // -- Fields --

  protected float xstart, ystart;
  protected float xtraj, ytraj;
  protected float speed;
  protected int tick;


  // -- Constructors --

  public MineBulletMovement(Thing t, float x, float y,
    float xtarget, float ytarget)
  {
    this(t, x, y, xtarget, ytarget, SPEED);
  }

  public MineBulletMovement(Thing t, float x, float y,
    float xtarget, float ytarget, float speed)
  {
    super(t);
    thing.setCPos(x, y);

    xstart = x; ystart = y;
    float xx = xtarget - x;
    float yy = ytarget - y;
    float c = (float) Math.sqrt((xx * xx + yy * yy) / (speed * speed));

    xtraj = xx / c;
    ytraj = yy / c;
    tick = 0;
  }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the bullet movement style. */
  public void move() {
    float xpos = xstart + tick * xtraj;
    float ypos = ystart + tick * ytraj;
    tick++;
    thing.setImageIndex(tick);
    thing.setCPos(xpos, ypos);
  }

}
