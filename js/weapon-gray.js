/** Defines veggie copter gray attack style. */
class GrayWeapon extends Weapon {

  GrayAttack(t) {
    this.space = false;
    super(t, Color.lightGray,
      t.getGame().loadImage("icon-gray.png").getImage());
  }

  clear() { this.space = false; }

  /** Fires a shot if space bar is pressed. */
  var shoot() {
    if (!this.space) return null;
    return null;
  }

  keyPressed(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) this.space = true;
  }

  keyReleased(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) this.space = false;
  }

}
