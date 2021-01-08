class TestMovement extends MovementStyle {

  private boolean timing;
  private long ticks;

  TestMovement(Thing t, int x, int y) {
    super(t);
    thing.setPos(x, y);
  }

  startTimer() { timing = true; }
  printStats() { System.out.println(ticks + " ticks elapsed."); }

  /** Moves the given thing according to the Test movement style. */
  move() { if (timing) ticks++; }

}
