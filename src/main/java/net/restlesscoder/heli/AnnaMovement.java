package net.restlesscoder.heli;

public class AnnaMovement extends MovementStyle {

  // -- Constants --

  protected static final int SPEED = 2;


  // -- Fields --

  protected boolean dir;


  // -- Constructors --

  public AnnaMovement(Thing t, int y, boolean dir) {
    super(t);
    this.dir = dir;
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

  /** Moves the given thing according to the bonus movement style. */
  public void move() {
    float xpos = thing.getX(), ypos = thing.getY();

    xpos += dir ? -SPEED : SPEED;
    thing.setPos(xpos, ypos);
  }

}
