class CopterGun extends Thing {

  const SPEED = 5;
  const HEIGHT = 7;
  const Color BROWN = Color.yellow.darker();

  static BoundedImage image;

  static {
    var len = HEIGHT;
    BufferedImage img = ImageTools.makeImage(1, len);
    Graphics g = img.createGraphics();
    g.setColor(BROWN);
    g.drawLine(0, 0, 0, len);
    g.dispose();
    image = new BoundedImage(img, 1, HEIGHT);
    image.addBox(new BoundingBox());
  }

  CopterGun(thing, x, y, power) {
    super(thing.getGame());
    type = GOOD_BULLET;
    setImage(image);
    setPower(power);
    move = new BulletMovement(this, x, y + HEIGHT, x, -100, SPEED);
  }

}

/** Defines veggie copter gun attack. */
class GunAttack extends ColoredAttack {

  const RECHARGE = 2;

  boolean space = false;
  var fired;

  GunAttack(t) {
    super(t, CopterGun.BROWN,
      t.getGame().loadImage("icon-gun.png").getImage());
  }

  clear() { space = false; }

  /** Fires two shots if space bar is pressed. */
  shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    var num = getPower() + 1;
    fired = RECHARGE;

    var xint = thing.getCX(), yint = thing.getY() - 14;

    CopterGun[] shots = new CopterGun[num];
    if (num % 2 == 0) {
      var len = num / 2;
      for (var i=0; i<len; i++) {
        var q = 2 * i;
        shots[q] = new CopterGun(thing, xint - q - 1, yint, 1);
        shots[q + 1] = new CopterGun(thing, xint + q + 1, yint, 1);
      }
    }
    else {
      var len = num / 2;
      for (var i=0; i<len; i++) {
        var q = 2 * i;
        shots[q] = new CopterGun(thing, xint - q - 2, yint, 1);
        shots[q + 1] = new CopterGun(thing, xint + q + 2, yint, 1);
      }
      shots[num - 1] = new CopterGun(thing, xint, yint, 1);
    }
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return shots;
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
