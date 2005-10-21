//
// PurpleAttack.java
//

import java.awt.*;
import java.awt.event.KeyEvent;

/** Defines veggie copter purple attack style. */
public class PurpleAttack extends ColoredAttack {

  // -- Fields --

  protected boolean space;


  // -- Constructor --

  public PurpleAttack(Thing t) {
    super(t, new Color(128, 0, 128),
      t.getGame().loadImage("icon-purple.png").getImage());
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
