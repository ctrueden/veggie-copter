package net.restlesscoder.heli;

public class ChargeMovement extends MovementStyle {

  // -- Fields --

  private Thing owner;
  private boolean launched = false;


  // -- Constructor --

  public ChargeMovement(Thing t, Thing owner, float x, float y) {
    super(t);
    this.owner = owner;
    thing.setPos(x, y);
  }


  // -- ChargeMovement API methods --

  /** Launches the charge forth. */
  public void launch() { launched = true; }


  // -- MovementStyle API methods --

  /** Moves the charge according to the charge movement style. */
  public void move() {
    if (launched) {
      float xpos = thing.getX(), ypos = thing.getY();
      ypos -= 5;
      thing.setPos(xpos, ypos);
    }
    else thing.setPos(owner.getCX() - thing.getWidth() / 2f,
      owner.getY() - thing.getHeight() / 2f);
  }

}
