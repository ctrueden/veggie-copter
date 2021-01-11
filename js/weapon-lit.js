/** Defines veggie copter lightning attack style. */
class LitWeapon extends Weapon {

  const var LEFT_CHANCE = 0.2;
  const var RIGHT_CHANCE = 0.2;

  POWER = 1;
  PATH_LENGTH = 200;

  ARC_LENGTH = 10;
  DELAY = 10;
  PERIOD = ARC_LENGTH + DELAY;

  var ticks;
  boolean space = false;
  int[][] paths;

  LitAttack(t) {
    super(t, "cyan", t.game.sprite("icon-lit").image);

    paths = new int[1000][];
    generatePath(0);
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
    if (!space) return null;
    ticks++;
    var pow = getPower();
    var q = ticks % PERIOD;
    CopterLit[] lits = new CopterLit[pow];
    for (var i=0; i<pow; i++) {
      var genTick = i * PERIOD / pow;
      if (q < genTick) q += PERIOD;
      var haltTick = genTick + ARC_LENGTH;

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
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) {
      space = true;
      ticks = 0;
    }
  }

  keyReleased(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

  generatePath(index) {
    paths[index] = new int[PATH_LENGTH];
    for (var i=0; i<paths[index].length; i++) {
      var chance = Math.random();
      if (chance < LEFT_CHANCE) paths[index][i] = -1;
      else if (chance > 1 - RIGHT_CHANCE) paths[index][i] = 1;
      else paths[index][i] = 0;
    }
  }

}
