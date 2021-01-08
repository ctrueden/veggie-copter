/** Defines veggie copter lightning attack style. */
class LitAttack extends ColoredAttack {

  const double LEFT_CHANCE = 0.2;
  const double RIGHT_CHANCE = 0.2;

  const int POWER = 1;
  const int PATH_LENGTH = 200;

  const int ARC_LENGTH = 10;
  const int DELAY = 10;
  const int PERIOD = ARC_LENGTH + DELAY;

  int ticks;
  boolean space = false;
  int[][] paths;

  LitAttack(t) {
    super(t, Color.cyan, t.getGame().loadImage("icon-lit.png").getImage());

    paths = new int[1000][];
    generatePath(0);
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
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

  keyPressed(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) {
      space = true;
      ticks = 0;
    }
  }

  keyReleased(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

  generatePath(index) {
    paths[index] = new int[PATH_LENGTH];
    for (int i=0; i<paths[index].length; i++) {
      double chance = Math.random();
      if (chance < LEFT_CHANCE) paths[index][i] = -1;
      else if (chance > 1 - RIGHT_CHANCE) paths[index][i] = 1;
      else paths[index][i] = 0;
    }
  }

}
