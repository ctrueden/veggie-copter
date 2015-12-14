package net.restlesscoder.heli;

public class ShieldMovement extends MovementStyle {

  // -- Constants --

  protected static final float SPEED = 0.1f;
  protected static final int MIN_RADIUS = 30;
  protected static final int MAX_RADIUS = 63;
  protected static final int RADIUS_INC = 3;


  // -- Fields --

  protected Thing owner;
  protected float angle;
  protected int radius;
  protected boolean extended;


  // -- Constructors --

  public ShieldMovement(Thing t, Thing owner, float angle) {
    super(t);
    this.owner = owner;
    this.angle = angle;
    radius = 0;
    float xpos = owner.getCX() + radius * (float) Math.cos(angle);
    float ypos = owner.getCY() + radius * (float) Math.sin(angle);
    thing.setCPos(xpos, ypos);
  }


  // -- CopterMovement API methods --

  public void setExtended(boolean extended) { this.extended = extended; }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the bullet movement style. */
  public void move() {
    float speed = SPEED - (float) thing.getPower() * SPEED / 20;
    if (speed < 0) speed = 0;
    angle += speed;
    int targetRadius = extended ? MAX_RADIUS : MIN_RADIUS;
    if (radius < targetRadius) radius += RADIUS_INC;
    else if (radius > targetRadius) radius -= RADIUS_INC;
    while (angle > 2 * Math.PI) angle -= 2 * Math.PI;
    float xpos = owner.getCX() + radius * (float) Math.cos(angle);
    float ypos = owner.getCY() + radius * (float) Math.sin(angle);
    thing.setCPos(xpos, ypos);
  }


}
