/** Defines veggie copter gray attack style. */
class GrayAttack extends ColoredAttack {

  boolean space;

  GrayAttack(Thing t) {
    super(t, Color.lightGray,
      t.getGame().loadImage("icon-gray.png").getImage());
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
    if (!space) return null;
    return null;
  }

  keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
