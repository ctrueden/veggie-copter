/** Encapsulates a movement pattern. */
class MovementStyle implements KeyListener {

  /** Thing upon which this movement style object operates. */
  Thing thing;

  MovementStyle(Thing t) { thing = t; }

  /** Moves according to this movement style. */
  move();

  keyPressed(KeyEvent e) { }
  keyReleased(KeyEvent e) { }
  keyTyped(KeyEvent e) { }

}
