/** Defines veggie copter charge attack style. */
class ChargeAttack extends ColoredAttack {
  GROW_SPEED = 11;

  constructor(t) {
    super(t, Color.white, t.getGame().loadImage("icon-charge.png").getImage());
    this.charge = null;
    this.space = false;
    this.ticks = 0;
  }

  launch() {
    if (this.charge == null) return;
    this.charge.launch();
    this.charge = null;
  }

  clear() {
    this.space = false;
    launch();
  }

  /** Fires a shot if space bar is pressed. */
  shoot() {
    if (!this.space) return null;

    if (this.charge == null) {
      this.ticks = 0;
      this.charge = new CopterCharge(thing);
      return [this.charge];
    }
    this.ticks++;
    var rate = GROW_SPEED - this.power;
    if (rate <= 0) rate = 1;
    if (this.ticks % rate == 0) {
      if (!this.charge.grow()) launch();
    }
    return null;
  }

  keyPressed(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) this.space = true;
  }

  keyReleased(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) clear();
  }
}
