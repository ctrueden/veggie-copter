/** Defines veggie copter energy field attack style. */
class EnergyWeapon extends Weapon {

  space, fired;
  CopterEnergy energy;

  EnergyAttack(t) {
    super(t, "orange", t.game.sprite("icon-energy").image);
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

    var game = thing.game;
    var copter = game.copter;
    var cx1 = copter.xpos;
    var cx2 = cx1 + copter.width;
    var cy = copter.ypos;
    var t = game.getThings();
    var ndx = -1;
    var dist = Integer.MAX_VALUE;
    for (var i=0; i<t.length; i++) {
      if (t[i].type != ThingTypes.EVIL) continue;
      var x1 = t[i].xpos;
      var x2 = x1 + t[i].width;
      var y = t[i].cy;
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
    if (Keys.SHOOT.includes(e.keyCode)) space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) clear();
  }

}
