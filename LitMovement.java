//
// LitMovement.java
//

public class LitMovement extends MovementStyle {

  // -- Fields --

  private int[] path;
  private int pIndex;


  // -- Constructors --

  public LitMovement(Thing t, float x, float y, int[] path) {
    super(t);
    thing.setPos(x, y);
    this.path = path;
    if (path == null) System.err.println("Warning: path is null");
  }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the laser movement style. */
  public void move() {
    float xpos = thing.getX(), ypos = thing.getY();

    CopterLit lit = (CopterLit) thing;
    int x2 = lit.getX2();
    int y2 = lit.getY2();
    xpos += x2;
    ypos += y2;

    if (path == null) System.err.println("Warning: path is null");
    if (pIndex < path.length) {
      int p = path[pIndex++];
      if (p < 0) lit.arcLeft();
      else if (p > 0) lit.arcRight();
    }
    else {
      double chance = Math.random();
      if (chance < LitAttack.LEFT_CHANCE) lit.arcLeft();
      else if (chance > 1 - LitAttack.RIGHT_CHANCE) lit.arcRight();
    }

    int x1 = lit.getX1();
    int y1 = lit.getY1();
    xpos -= x1;
    ypos -= y1;

    thing.setPos(xpos, ypos);
  }

}
