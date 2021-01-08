/** Encapsulates a movement pattern. */
class MovementStyle implements KeyListener {

  /** Thing upon which this movement style object operates. */
  Thing thing;

  MovementStyle(t) { thing = t; }

  /** Moves according to this movement style. */
  move();

  keyPressed(e) { }
  keyReleased(e) { }

}
