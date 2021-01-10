/** Defines veggie copter energy field attack style. */
class EnergyWeapon extends Weapon {

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
  shoot() {
    if (!space || fired) return null;
    fired = true;

    var game = thing.getGame();
    var copter = game.getCopter();
    var cx1 = copter.getX();
    var cx2 = cx1 + copter.getWidth();
    var cy = copter.getY();
    var t = game.getThings();
    var ndx = -1;
    var dist = Integer.MAX_VALUE;
    for (var i=0; i<t.length; i++) {
      if (t[i].getType() != Thing.EVIL) continue;
      var x1 = t[i].getX();
      var x2 = x1 + t[i].getWidth();
      var y = t[i].getCY();
      if (y >= cy || cx2 < x1 || cx1 > x2) continue;
      var ndist = cy - y;
      if (dist < ndist) continue;
      dist = ndist;
      ndx = i;
    }
    if (ndx < 0) return null;
    energy = new CopterEnergy(t[ndx]);
    energy.setPower(power);
    return [energy];
  }

  setPower(power) {
    super.setPower(power);
    if (energy != null) energy.setPower(power);
  }

  keyPressed(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  keyReleased(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) clear();
  }

}
