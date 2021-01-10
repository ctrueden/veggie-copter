/** Defines veggie copter laser attack style. */
class LaserWeapon extends Weapon {

  const int[] FLUX =
    {0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1};

  boolean space;
  var flux;

  LaserAttack(t) {
    super(t, Color.green, t.getGame().loadImage("icon-laser.png").getImage());
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
    if (!space) return null;
    var size = power - 1;
    if (size > CopterLaser.MAX_SIZE - 3) size = CopterLaser.MAX_SIZE - 3;
    flux = (flux + 1) % FLUX.length;
    size += FLUX[flux];
    CopterLaser laser = new CopterLaser(thing, size);
    laser.setPower(power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {laser};
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
