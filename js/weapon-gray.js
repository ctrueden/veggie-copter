/** Defines veggie copter gray attack style. */
class GrayWeapon extends Weapon {
  constructor(t) {
    this.space = false;
    super(t, Colors.LightGray, t.game.loadSprite("icon-gray").image);
  }

  clear() { this.space = false; }

  /** Fires a shot if space bar is pressed. */
  var shoot() {
    if (!this.space) return [];
    return [];
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = false;
  }
}
