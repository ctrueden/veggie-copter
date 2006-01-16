//
// JamesMovement.java
//

public class JamesMovement extends MovementStyle {

  // -- Constants --

  protected static final int RADIUS2 = 200;
  protected static final int SPEED = 2;


  // -- Constructors --

  public JamesMovement(Thing t, int y, boolean dir) {
    super(t);
    VeggieCopter game = thing.getGame();

    // compute starting position
    int xpos, ypos;
    int w = game.getWindowWidth(), h = game.getWindowHeight();

    if (dir) {
      // appear from right
      xpos = w - thing.getWidth();
      ypos = y;
    }
    else {
      // appear from left
      xpos = 0;
      ypos = y;
    }

    thing.setPos(xpos, ypos);
  }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the bouncing movement style. */
  public void move() {
    float xpos = thing.getCX(), ypos = thing.getCY();

    Copter hero = thing.getGame().getCopter();
    float cxpos = hero.getCX(), cypos = hero.getCY();

    float xdist = xpos - cxpos;
    float ydist = ypos - cypos;
    float dist2 = xdist * xdist + ydist * ydist;
    float dist = (float) Math.sqrt(dist2);
    float xd = xdist / dist;
    float yd = ydist / dist;
    xpos -= xd;
    ypos -= yd;

    thing.setCPos(xpos, ypos);
  }

}
