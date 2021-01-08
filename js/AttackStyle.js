/** Encapsulates an attack pattern. */
class AttackStyle {

  constructor(t) {
    this.thing = t; // Thing upon which this attack style object operates.
    this.power = 1; // Amount of damage the attack style inflicts.
  }

  /** Instructs the thing to fire a shot (but only if it wants to). */
  shoot();

  /**
   * Instructs the thing to perform a secondary trigger action,
   * if it has one.
   */
  trigger() { return null; }

  /** Sets power level of this attack style. */
  setPower(power) { this.power = power; }

  /** Gets power level of this attack style. */
  getPower() { return this.power; }

  keyPressed(e) { }
  keyReleased(e) { }

}
