/** Defines veggie copter gray attack style. */
class GrayWeapon extends Weapon {

  GrayAttack(t) {
    this.space = false;
    super(t, "lightgray", t.game.loadSprite("icon-gray").image);
  }

  clear() { this.space = false; }

  /** Fires a shot if space bar is pressed. */
  var shoot() {
    if (!this.space) return null;
    return null;
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = false;
  }

}
