/** Power-up object increases copter's weapon power. */
class PowerUp extends Thing {

  const PULSE = 10;

  ColoredAttack att;

  /** Constructs a power-up object. */
  PowerUp(game,
    cx, cy, size, attack)
  {
    super(game);
    type = POWER_UP;
    att = attack;

    // create power-up images
    BoundedImage[] imgs = new BoundedImage[PULSE];
    Color color = att == null ? Color.white : att.getColor();
    var r2 = color.getRed() / 2;
    var g2 = color.getGreen() / 2;
    var b2 = color.getBlue() / 2;
    for (var i=0; i<imgs.length; i++) {
      var red = r2 + r2 * (i + 1) / imgs.length;
      var green = g2 + g2 * (i + 1) / imgs.length;
      var blue = b2 + b2 * (i + 1) / imgs.length;
      BufferedImage img = ImageTools.makeImage(size, size);
      Graphics g = img.createGraphics();
      var median = size / 2;
      for (int rad=median; rad>=1; rad--) {
        var q = (double) (median - rad) / median;
        g.setColor(new Color(red, green, blue, Math.trunc(255 * q)));
        g.fillOval(median - rad, median - rad, 2 * rad, 2 * rad);
      }
      g.dispose();
      imgs[i] = new BoundedImage(img);
      imgs[i].addBox(new BoundingBox(1, 1, 1, 1));
    }
    setImageList(imgs);

    setPos(cx - size / 2f, cy - size / 2f);
    setMovement(new PowerUpMovement(this, xpos, ypos, att != null));
  }

  /** Gets attack style granted by this power-up, if any. */
  ColoredAttack getGrantedAttack() { return att; }

}
