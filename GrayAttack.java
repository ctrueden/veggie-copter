//
// GrayAttack.java
//

import java.awt.*;
import java.awt.event.KeyEvent;

/** Defines veggie copter gray attack style. */
public class GrayAttack extends ColoredAttack {

  // -- Fields --

  protected boolean space;


  // -- Constructor --

  public GrayAttack(Thing t) {
    super(t, Color.lightGray,
      t.getGame().loadImage("icon-gray.png").getImage());
  }


  // -- ColoredAttack API methods --

  public void clear() { space = false; }


  // -- AttackStyle API methods --

  /** Fires a shot if space bar is pressed. */
  public Thing[] shoot() {
    if (!space) return null;
    return null;
  }


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
