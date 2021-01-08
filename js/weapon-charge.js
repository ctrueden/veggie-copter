/** Defines veggie copter charge attack style. */
class ChargeAttack extends ColoredAttack {

  private const int GROW_SPEED = 11;

  CopterCharge charge;
  boolean space;
  int ticks;

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
  Thing[] shoot() {
    if (!space) return null;

    if (charge == null) {
      ticks = 0;
      charge = new CopterCharge(thing);
      return new Thing[] {charge};
    }
    ticks++;
    int rate = GROW_SPEED - power;
    if (rate <= 0) rate = 1;
    if (ticks % rate == 0) {
      if (!charge.grow()) launch();
    }
    return null;
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
