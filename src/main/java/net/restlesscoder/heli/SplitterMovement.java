package net.restlesscoder.heli;

public class SplitterMovement extends MovementStyle {

  // -- Fields --

  protected int xdir, ydir;


  // -- Constructors --

  public SplitterMovement(Thing t, float x, float y, int xdir, int ydir) {
    super(t);
    thing.setPos(x, y);
    this.xdir = xdir;
    this.ydir = ydir;
  }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the splitter movement style. */
  public void move() {
    thing.setPos(thing.getX() + xdir, thing.getY() + ydir);
  }

}
