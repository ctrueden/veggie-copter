/** Defines veggie copter laser attack style. */
public class LaserAttack extends ColoredAttack {

  protected static final int[] FLUX =
    {0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1};

  protected boolean space;
  protected int flux;

  public LaserAttack(Thing t) {
    super(t, Color.green, t.getGame().loadImage("icon-laser.png").getImage());
  }

  public void clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  public Thing[] shoot() {
    if (!space) return null;
    int size = power - 1;
    if (size > CopterLaser.MAX_SIZE - 3) size = CopterLaser.MAX_SIZE - 3;
    flux = (flux + 1) % FLUX.length;
    size += FLUX[flux];
    CopterLaser laser = new CopterLaser(thing, size);
    laser.setPower(power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {laser};
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
