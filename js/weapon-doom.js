/** Defines veggie copter doom attack style. */
public class DoomAttack extends ColoredAttack {

  protected boolean space;
  protected CopterDoom doom;

  public DoomAttack(Thing t) {
    super(t, Color.black,
      t.getGame().loadImage("icon-doom.png").getImage());
  }

  public void clear() {
    space = false;
    if (doom != null) doom.setHP(0);
    doom = null;
  }

  /** Fires a shot if space bar is pressed. */
  public Thing[] shoot() {
    if (!space || doom != null || thing.getHP() == 1) return null;
    doom = new CopterDoom(thing);
    doom.setPower(power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {doom};
  }

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) clear();
  }

}
