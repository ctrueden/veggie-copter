/** Defines veggie copter charge attack style. */
class ChargeAttack extends ColoredAttack {

  private const GROW_SPEED = 11;

  CopterCharge charge;
  boolean space;
  var ticks;

  ChargeAttack(t) {
    super(t, Color.white, t.getGame().loadImage("icon-charge.png").getImage());
  }

  launch() {
    if (charge == null) return;
    charge.launch();
    charge = null;
  }

  clear() {
    space = false;
    launch();
  }

  /** Fires a shot if space bar is pressed. */
  shoot() {
    if (!space) return null;

    if (charge == null) {
      ticks = 0;
      charge = new CopterCharge(thing);
      return [charge];
    }
    ticks++;
    var rate = GROW_SPEED - power;
    if (rate <= 0) rate = 1;
    if (ticks % rate == 0) {
      if (!charge.grow()) launch();
    }
    return null;
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
