/** Defines veggie copter homing missile attack style. */
class HomingWeapon extends Weapon {

  RECHARGE = 12;

  boolean space = false;
  var fired;

  HomingAttack(t) {
    super(t, "magenta", t.game.sprite("icon-homing").image);
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    var pow = this.power;
    fired = RECHARGE - pow;

    CopterHoming homing = new CopterHoming(thing);
    homing.power = 8;
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {homing};
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = false;
  }

}
