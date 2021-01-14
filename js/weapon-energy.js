/** Defines veggie copter energy field attack style. */
class EnergyWeapon extends Weapon {

  space, fired;
  CopterEnergy energy;

  EnergyAttack(t) {
    super(t, "Orange", t.game.loadSprite("icon-energy").image);
  }

  clear() {
    space = false;
    fired = false;
    if (energy) energy.hp = 0;
    energy = null;
  }

  /** Begins energy field if space bar is pressed. */
  shoot() {
    if (!space || fired) return [];
    fired = true;

    var game = thing.game;
    var copter = game.copter;
    var cx1 = copter.xpos;
    var cx2 = cx1 + copter.width;
    var cy = copter.ypos;
    var ndx = -1;
    var dist = Integer.MAX_VALUE;
    for (var i=0; i<this.things.length; i++) {
      var thing = things[i];
      if (thing.type != ThingTypes.EVIL) continue;
      var x1 = thing.xpos;
      var x2 = x1 + thing.width;
      var y = thing.cy;
      if (y >= cy || cx2 < x1 || cx1 > x2) continue;
      var ndist = cy - y;
      if (dist < ndist) continue;
      dist = ndist;
      ndx = i;
    }
    if (ndx < 0) return [];
    energy = new CopterEnergy(t[ndx]);
    energy.power = power;
    return [energy];
  }

  set power(power) {
    super.power = power;
    if (energy) energy.power = power;
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) clear();
  }

}
