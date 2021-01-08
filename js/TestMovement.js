public class TestMovement extends MovementStyle {

  private boolean timing;
  private long ticks;

  public TestMovement(Thing t, int x, int y) {
    super(t);
    thing.setPos(x, y);
  }

  public void startTimer() { timing = true; }
  public void printStats() { System.out.println(ticks + " ticks elapsed."); }

  /** Moves the given thing according to the Test movement style. */
  public void move() { if (timing) ticks++; }

}
