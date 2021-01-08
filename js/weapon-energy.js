/** Defines veggie copter energy field attack style. */
class EnergyAttack extends ColoredAttack {

  space, fired;
  CopterEnergy energy;

  EnergyAttack(t) {
    super(t, Color.orange,
      t.getGame().loadImage("icon-energy.png").getImage());
  }

  clear() {
    space = false;
    fired = false;
    if (energy != null) energy.setHP(0);
    energy = null;
  }

  /** Begins energy field if space bar is pressed. */
  Thing[] shoot() {
    if (!space || fired) return null;
    fired = true;

    VeggieCopter game = thing.getGame();
    Copter copter = game.getCopter();
    float cx1 = copter.getX();
    float cx2 = cx1 + copter.getWidth();
    float cy = copter.getY();
    Thing[] t = game.getThings();
    int ndx = -1;
    float dist = Integer.MAX_VALUE;
    for (int i=0; i<t.length; i++) {
      if (t[i].getType() != Thing.EVIL) continue;
      float x1 = t[i].getX();
      float x2 = x1 + t[i].getWidth();
      float y = t[i].getCY();
      if (y >= cy || cx2 < x1 || cx1 > x2) continue;
      float ndist = cy - y;
      if (dist < ndist) continue;
      dist = ndist;
      ndx = i;
    }
    if (ndx < 0) return null;
    energy = new CopterEnergy(t[ndx]);
    energy.setPower(power);
    return new Thing[] {energy};
  }

  setPower(power) {
    super.setPower(power);
    if (energy != null) energy.setPower(power);
  }

  keyPressed(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  keyReleased(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) clear();
  }

}
