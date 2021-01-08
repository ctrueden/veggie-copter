/** Encapsulates an attack pattern. */
class AttackStyle implements KeyListener {

  /** Thing upon which this attack style object operates. */
  Thing thing;

  /** Amount of damage the attack style inflicts. */
  int power = 1;

  AttackStyle(Thing t) { thing = t; }

  /** Instructs the thing to fire a shot (but only if it wants to). */
  Thing[] shoot();

  /**
   * Instructs the thing to perform a secondary trigger action,
   * if it has one.
   */
  Thing[] trigger() { return null; }

  /** Sets power level of this attack style. */
  setPower(int power) { this.power = power; }

  /** Gets power level of this attack style. */
  int getPower() { return power; }

  keyPressed(KeyEvent e) { }
  keyReleased(KeyEvent e) { }
  keyTyped(KeyEvent e) { }

}
