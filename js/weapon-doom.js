/** Defines veggie copter doom attack style. */
class DoomWeapon extends Weapon {

  boolean space;
  CopterDoom doom;

  DoomAttack(t) {
    super(t, "black", t.game.loadSprite("icon-doom").image);
  }

  clear() {
    space = false;
    if (doom) doom.setHP(0);
    doom = null;
  }

  /** Fires a shot if space bar is pressed. */
  shoot() {
    if (!this.space || this.doom || this.thing.hp == 1) return [];
    var doom = new CopterDoom(thing);
    doom.power = power;
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return [doom];
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) clear();
  }

}
