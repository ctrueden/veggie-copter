/** Defines veggie copter homing missile attack style. */
class HomingAttack extends ColoredAttack {

  RECHARGE = 12;

  boolean space = false;
  var fired;

  HomingAttack(t) {
    super(t, Color.magenta,
      t.getGame().loadImage("icon-homing.png").getImage());
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    var pow = getPower();
    fired = RECHARGE - pow;

    CopterHoming homing = new CopterHoming(thing);
    homing.setPower(8);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {homing};
  }

  keyPressed(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  keyReleased(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
