class GunBullet extends Thing {
  constructor(thing, x, y, power) {
    super(thing.game);
    this.type = ThingTypes.GOOD_BULLET;
    this.speed = 5;
    this.tallness = 7;
    this.setSprite(this.game.retrieve('gun-bullet', this, obj => {
      var len = obj.tallness;
      var img = makeImage(1, len);
      var ctx = context2d(img);
      ctx.beginPath();
      ctx.strokeStyle = Colors.Brown;
      ctx.moveTo(0, 0);
      ctx.lineTo(0, len);
      ctx.stroke();
      var sprite = new Sprite(img, 1, len);
      sprite.addBox(new BoxInsets());
      return sprite;
    }));
    this.power = power;
    this.movement = new BulletMovement(this,
      x, y + this.tallness, x, -100, this.speed);
  }
}

/** Defines veggie copter gun attack. */
class GunWeapon extends Weapon {
  constructor(t) {
    super(t, Colors.Brown, t.game.loadSprite("icon-gun").image);
    this.space = false;
    this.fired = 0;
    this.recharge = 2;
  }

  clear() { this.space = false; }

  /** Fires two shots if space bar is pressed. */
  shoot() {
    if (this.fired > 0) {
      this.fired--;
      return [];
    }
    if (!this.space) return [];
    var num = this.power + 1;
    this.fired = this.recharge;

    var xint = this.thing.cx;
    var yint = this.thing.ypos - 14;

    var shots = [];
    if (num % 2 == 0) {
      var len = num / 2;
      for (var i=0; i<len; i++) {
        var q = 2 * i;
        shots.push(new GunBullet(this.thing, xint - q - 1, yint, 1));
        shots.push(new GunBullet(this.thing, xint + q + 1, yint, 1));
      }
    }
    else {
      var len = num / 2;
      for (var i=0; i<len; i++) {
        var q = 2 * i;
        shots.push(new GunBullet(this.thing, xint - q - 2, yint, 1));
        shots.push(new GunBullet(this.thing, xint + q + 2, yint, 1));
      }
      shots.push(new GunBullet(this.thing, xint, yint, 1));
    }
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return shots;
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = false;
  }
}
