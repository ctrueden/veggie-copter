/** Defines veggie copter homing missile attack style. */
class HomingAttack extends ColoredAttack {

  const int RECHARGE = 12;

  boolean space = false;
  int fired;

  HomingAttack(Thing t) {
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
    int pow = getPower();
    fired = RECHARGE - pow;

    CopterHoming homing = new CopterHoming(thing);
    homing.setPower(8);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {homing};
  }

  keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
