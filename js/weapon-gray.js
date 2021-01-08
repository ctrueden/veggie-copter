/** Defines veggie copter gray attack style. */
class GrayAttack extends ColoredAttack {

  boolean space;

  GrayAttack(t) {
    super(t, Color.lightGray,
      t.getGame().loadImage("icon-gray.png").getImage());
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
    if (!space) return null;
    return null;
  }

  keyPressed(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  keyReleased(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
