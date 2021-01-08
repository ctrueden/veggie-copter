/** Encapsulates a movement pattern. */
public abstract class MovementStyle implements KeyListener {

  /** Thing upon which this movement style object operates. */
  protected Thing thing;

  public MovementStyle(Thing t) { thing = t; }

  /** Moves according to this movement style. */
  public abstract void move();

  public void keyPressed(KeyEvent e) { }
  public void keyReleased(KeyEvent e) { }
  public void keyTyped(KeyEvent e) { }

}
