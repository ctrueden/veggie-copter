class CopterGun extends Thing {

  const int SPEED = 5;
  const int HEIGHT = 7;
  const Color BROWN = Color.yellow.darker();

  static BoundedImage image;

  static {
    int len = HEIGHT;
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

  const int RECHARGE = 2;

  boolean space = false;
  int fired;

  GunAttack(t) {
    super(t, CopterGun.BROWN,
      t.getGame().loadImage("icon-gun.png").getImage());
  }

  clear() { space = false; }

  /** Fires two shots if space bar is pressed. */
  Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    int num = getPower() + 1;
    fired = RECHARGE;

    int x = (int) thing.getCX(), y = (int) thing.getY() - 14;

    CopterGun[] shots = new CopterGun[num];
    if (num % 2 == 0) {
      int len = num / 2;
      for (int i=0; i<len; i++) {
        int q = 2 * i;
        shots[q] = new CopterGun(thing, x - q - 1, y, 1);
        shots[q + 1] = new CopterGun(thing, x + q + 1, y, 1);
      }
    }
    else {
      int len = num / 2;
      for (int i=0; i<len; i++) {
        int q = 2 * i;
        shots[q] = new CopterGun(thing, x - q - 2, y, 1);
        shots[q + 1] = new CopterGun(thing, x + q + 2, y, 1);
      }
      shots[num - 1] = new CopterGun(thing, x, y, 1);
    }
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return shots;
  }

  keyPressed(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  keyReleased(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
