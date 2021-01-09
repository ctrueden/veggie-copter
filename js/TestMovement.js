class TestMovement extends MovementStyle {
  constructor(t, x, y) {
    super(t);
    this.thing.setPos(x, y);
    this.timing = false;
    this.ticks = 0;
  }

  startTimer() { this.timing = true; }
  printStats() { console.info(this.ticks + " ticks elapsed."); }

  /** Moves the given thing according to the Test movement style. */
  move() { if (this.timing) this.ticks++; }
}
