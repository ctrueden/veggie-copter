//
// LaserMovement.java
//

public class LaserMovement extends MovementStyle {

  // -- Constructors --

  public LaserMovement(Thing t, float x, float y) {
    super(t);
    thing.setPos(x, y);
  }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the laser movement style. */
  public void move() {
    float xpos = thing.getX(), ypos = thing.getY();
    ypos -= 10;
    thing.setPos(xpos, ypos);
  }

}
