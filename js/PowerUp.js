class PowerUpMovement extends MovementStyle {
  PowerUpMovement(t, x, y, center) {
    super(t);
    this.thing.setPos(x, y);
    this.center = center;
    this.ticks = 0;
    this.dir = false;
    this.period = 3;
  }

  move() {
    this.ticks++;

    if (this.ticks % this.period == 0) {
      // do power-up pulsing
      var index = this.thing.getImageIndex();
      if (dir) {
        index--;
        if (index == 0) dir = !dir;
      }
      else {
        index++;
        if (index == this.thing.getImageCount() - 1) dir = !dir;
      }
      this.thing.setImageIndex(index);
    }

    var cx = this.thing.getCX();
    var cy = this.thing.getCY();
    if (center) {
      VeggieCopter game = this.thing.getGame();
      var w2 = game.getWidth() / 2f;
      var h2 = game.getHeight() / 2f;
      if (cx > w2) {
        if (cx - w2 < 1) cx = w2;
        else cx--;
      }
      if (cx < w2) {
        if (w2 - cx < 1) cx = w2;
        else cx++;
      }
      if (cy > h2) {
        if (cy - h2 < 1) cy = h2;
        else cy--;
      }
      if (cy < h2) {
        if (h2 - cy < 1) cy = h2;
        cy++;
      }
    }
    else cy++;
    this.thing.setCPos(cx, cy);
  }
}

/** Power-up object increases copter's weapon power. */
class PowerUp extends Thing {
  PULSE = 10;

  /** Constructs a power-up object. */
  PowerUp(game, cx, cy, size, attack) {
    super(game);
    this.type = POWER_UP;
    this.att = attack;

    // create power-up images
    var imgs = [];
    var color = att == null ? Color.white : att.getColor();
    var r2 = color.getRed() / 2;
    var g2 = color.getGreen() / 2;
    var b2 = color.getBlue() / 2;
    for (var i=0; i<PULSE; i++) {
      var red = r2 + r2 * (i + 1) / PULSE;
      var green = g2 + g2 * (i + 1) / PULSE;
      var blue = b2 + b2 * (i + 1) / PULSE;
      var img = ImageTools.makeImage(size, size);
      var g = img.createGraphics();
      var median = size / 2;
      for (var rad=median; rad>=1; rad--) {
        var q = (double) (median - rad) / median;
        g.setColor(new Color(red, green, blue, Math.trunc(255 * q)));
        g.fillOval(median - rad, median - rad, 2 * rad, 2 * rad);
      }
      g.dispose();
      var img = new BoundedImage(img);
      img.addBox(new BoundingBox(1, 1, 1, 1));
      imgs.push(img);
    }
    setImageList(imgs);

    setPos(cx - size / 2f, cy - size / 2f);
    setMovement(new PowerUpMovement(this, this.xpos, this.ypos, this.att != null));
  }

  /** Gets attack style granted by this power-up, if any. */
  getGrantedAttack() { return att; }
}
