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
      var index = this.thing.activeSpriteKey;
      if (this.dir) {
        index--;
        if (index == 0) this.dir = !this.dir;
      }
      else {
        index++;
        if (index == this.thing.pulse - 1) this.dir = !this.dir;
      }
      this.thing.activateSprite(index);
    }

    var cx = this.thing.cx;
    var cy = this.thing.cy;
    if (this.center) {
      var game = this.thing.game;
      var w2 = game.width / 2;
      var h2 = game.height / 2;
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
  constructor(game, cx, cy, size, weapon) {
    super(game);
    this.type = ThingTypes.POWER_UP;
    this.weapon = weapon;
    this.pulse = 10; // Number of pulsation sprites.

    // create power-up images
    var sprites = {};
    var col = this.weapon == null ? Colors.White : this.weapon.color;
    for (var i=0; i<this.pulse; i++) {
      sprites[i] = this.game.retrieve(`powerup-${size}-${col}`, this, obj => {
        var rHalf = red(col) / 2;
        var gHalf = green(col) / 2;
        var bHalf = blue(col) / 2;
        var r = rHalf + rHalf * (i + 1) / this.pulse;
        var g = gHalf + gHalf * (i + 1) / this.pulse;
        var b = bHalf + bHalf * (i + 1) / this.pulse;
        var image = makeImage(size, size);
        var ctx = context2d(image);
        var median = size / 2;
        for (var rad=median; rad>=1; rad--) {
          var a = (median - rad) / median;
          ctx.fillStyle = color(r, g, b, a);
          ctx.ellipse(median, median, rad, rad, 0, 0, 2 * Math.PI);
          ctx.fill();
        }
        var sprite = new Sprite(image);
        sprite.addBox(new BoxInsets(1, 1, 1, 1));
        return sprite;
      });
    }
    this.setSprites(sprites, 0);

    this.setPos(cx - size / 2, cy - size / 2);
    this.movement = new PowerUpMovement(this,
      this.xpos, this.ypos, this.weapon != null);
  }
}
