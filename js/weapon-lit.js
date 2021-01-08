

/** Defines veggie copter lightning attack style. */
public class LitAttack extends ColoredAttack {

  public static final double LEFT_CHANCE = 0.2;
  public static final double RIGHT_CHANCE = 0.2;

  protected static final int POWER = 1;
  protected static final int PATH_LENGTH = 200;

  protected static final int ARC_LENGTH = 10;
  protected static final int DELAY = 10;
  protected static final int PERIOD = ARC_LENGTH + DELAY;

  protected int ticks;
  protected boolean space = false;
  protected int[][] paths;

  public LitAttack(Thing t) {
    super(t, Color.cyan, t.getGame().loadImage("icon-lit.png").getImage());

    paths = new int[1000][];
    generatePath(0);
  }

  public void clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  public Thing[] shoot() {
    if (!space) return null;
    ticks++;
    int pow = getPower();
    int q = ticks % PERIOD;
    CopterLit[] lits = new CopterLit[pow];
    for (int i=0; i<pow; i++) {
      int genTick = i * PERIOD / pow;
      if (q < genTick) q += PERIOD;
      int haltTick = genTick + ARC_LENGTH;

      if (q == genTick) generatePath(i);
      else if (q >= haltTick) continue;

      if (paths[i] == null) continue;
      lits[i] = new CopterLit(thing, paths[i]);
      lits[i].setPower(POWER);
    }
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return lits;
  }

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) {
      space = true;
      ticks = 0;
    }
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

  protected void generatePath(int index) {
    paths[index] = new int[PATH_LENGTH];
    for (int i=0; i<paths[index].length; i++) {
      double chance = Math.random();
      if (chance < LEFT_CHANCE) paths[index][i] = -1;
      else if (chance > 1 - RIGHT_CHANCE) paths[index][i] = 1;
      else paths[index][i] = 0;
    }
  }

}
