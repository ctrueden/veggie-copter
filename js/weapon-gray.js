

/** Defines veggie copter gray attack style. */
public class GrayAttack extends ColoredAttack {

  protected boolean space;

  public GrayAttack(Thing t) {
    super(t, Color.lightGray,
      t.getGame().loadImage("icon-gray.png").getImage());
  }

  public void clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  public Thing[] shoot() {
    if (!space) return null;
    return null;
  }

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
