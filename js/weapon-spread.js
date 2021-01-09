class CopterSpread extends Thing {

  const var SPREAD_SPEED = 10;

  static BoundedImage image;

  static {
    var size = 9;
    BufferedImage img = ImageTools.makeImage(size, size);
    Graphics g = img.createGraphics();
    g.setColor(Color.blue);
    g.fillRoundRect(0, 0, size, size, size / 2, size / 2);
    g.dispose();
    image = new BoundedImage(img);
    image.addBox(new BoundingBox());
  }

  CopterSpread(thing, angle) {
    super(thing.getGame());
    type = GOOD_BULLET;
    setImage(image);
    var x = thing.getCX() - getWidth() / 2, y = thing.getY();
    var xd = -(float) (100 * Math.cos(angle)) + x;
    var yd = -(float) (100 * Math.sin(angle)) + y;
    move = new BulletMovement(this, x, y, xd, yd, SPREAD_SPEED);
  }

}

/** Defines veggie copter spread attack. */
class SpreadAttack extends ColoredAttack {

  RECHARGE = 10;
  POWER = 3;

  boolean space = false;
  var fired;

  SpreadAttack(t) {
    super(t, Color.blue, t.getGame().loadImage("icon-spread.png").getImage());
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    fired = RECHARGE;
    var pow = getPower();
    var num = pow + 2;

    var widthDeg = 20 * num - 30;
    if (widthDeg > 180) widthDeg = 180;
    var startDeg = (180 - widthDeg) / 2;
    var endDeg = 180 - startDeg;

    var startRad = Math.PI * startDeg / 180;
    var endRad = Math.PI * endDeg / 180;
    var inc = (endRad - startRad) / (num - 1);

    CopterSpread[] shots = new CopterSpread[num];
    for (int s=0; s<num; s++) {
      shots[s] = new CopterSpread(thing, startRad + inc * s);
      shots[s].setPower(POWER);
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
