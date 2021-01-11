/** Defines veggie copter doom attack style. */
class DoomWeapon extends Weapon {

  boolean space;
  CopterDoom doom;

  DoomAttack(t) {
    super(t, "black", t.game.sprite("icon-doom").image);
  }

  clear() {
    space = false;
    if (doom != null) doom.setHP(0);
    doom = null;
  }

  /** Fires a shot if space bar is pressed. */
  shoot() {
    if (!this.space || this.doom != null || this.thing.hp == 1) return null;
    var doom = new CopterDoom(thing);
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
