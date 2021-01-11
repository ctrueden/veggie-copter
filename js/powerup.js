class PowerUpMovement extends MovementStyle {
  constructor(t, x, y, center) {
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
      this.thing.activateImage(index);
    }

    var cx = this.thing.getCX();
    var cy = this.thing.getCY();
    if (center) {
      var game = this.thing.getGame();
      var w2 = game.getWidth() / 2;
      var h2 = game.getHeight() / 2;
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
  constructor(game, cx, cy, size, attack) {
    super(game);
    this.type = ThingTypes.POWER_UP;
    this.att = attack;

    // create power-up images
    var imgs = {};
    var pulse = 10; // Number of ticks of pulsation.
    var color = this.att == null ? "white" : this.att.getColor();
    var r2 = color.getRed() / 2;
    var g2 = color.getGreen() / 2;
    var b2 = color.getBlue() / 2;
    for (var i=0; i<pulse; i++) {
      var red = r2 + r2 * (i + 1) / pulse;
      var green = g2 + g2 * (i + 1) / pulse;
      var blue = b2 + b2 * (i + 1) / pulse;
      var img = makeImage(size, size);
      var ctx = context2d(img);
      var median = size / 2;
      for (var rad=median; rad>=1; rad--) {
        var alpha = (median - rad) / median;
        ctx.fillStyle = color(red, green, blue, alpha);
        ctx.fillOval(median - rad, median - rad, 2 * rad, 2 * rad);
      }
      var img = new BoundedImage(img);
      img.addBox(new BoundingBox(1, 1, 1, 1));
      imgs[i] = img;
    }
    this.setImages(imgs, 0);

    this.setPos(cx - size / 2, cy - size / 2);
    this.setMovement(new PowerUpMovement(this, this.xpos, this.ypos, this.att != null));
  }

  /** Gets attack style granted by this power-up, if any. */
  getGrantedAttack() { return this.att; }
}
