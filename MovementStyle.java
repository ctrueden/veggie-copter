//
// MovementStyle.java
//

import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;

/** Encapsulates a movement pattern. */
public abstract class MovementStyle implements KeyListener {

  /** Thing upon which this movement style object operates. */
  protected Thing thing;


  // -- Constructor --

  public MovementStyle(Thing t) { thing = t; }


  // -- MovementStyle API methods --

  /** Moves according to this movement style. */
  public abstract void move();


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) { }
  public void keyReleased(KeyEvent e) { }
  public void keyTyped(KeyEvent e) { }

}
