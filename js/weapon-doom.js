/** Defines veggie copter doom attack style. */
class DoomWeapon extends Weapon {

  boolean space;
  CopterDoom doom;

  DoomAttack(t) {
    super(t, Color.black,
      t.getGame().loadImage("icon-doom.png").getImage());
  }

  clear() {
    space = false;
    if (doom != null) doom.setHP(0);
    doom = null;
  }

  /** Fires a shot if space bar is pressed. */
  shoot() {
    if (!space || doom != null || thing.getHP() == 1) return null;
    doom = new CopterDoom(thing);
    doom.setPower(power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return [doom];
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
