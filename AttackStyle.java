//
// AttackStyle.java
//

import java.awt.event.*;

/** Encapsulates an attack pattern. */
public abstract class AttackStyle implements KeyListener {

  // -- Fields --

  /** Thing upon which this attack style object operates. */
  protected Thing thing;

  /** Amount of damage the attack style inflicts. */
  protected int power = 1;


  // -- Constructor --

  public AttackStyle(Thing t) { thing = t; }


  // -- AttackStyle API methods --

  /** Instructs the thing to fire a shot (but only if it wants to). */
  public abstract Thing[] shoot();

  /**
   * Instructs the thing to perform a secondary trigger action,
   * if it has one.
   */
  public Thing[] trigger() { return null; }

  /** Sets power level of this attack style. */
  public void setPower(int power) { this.power = power; }

  /** Gets power level of this attack style. */
  public int getPower() { return power; }


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) { }
  public void keyReleased(KeyEvent e) { }
  public void keyTyped(KeyEvent e) { }

}
