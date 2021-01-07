package net.restlesscoder.heli;

public class TestMovement extends MovementStyle {

  // -- Fields --

  private boolean timing;
  private long ticks;


  // -- Constructors --

  public TestMovement(Thing t, int x, int y) {
    super(t);
    thing.setPos(x, y);
  }


  // -- TestMovement API methods --

  public void startTimer() { timing = true; }
  public void printStats() { System.out.println(ticks + " ticks elapsed."); }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the Test movement style. */
  public void move() { if (timing) ticks++; }

}
