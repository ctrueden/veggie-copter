class SpreadBullet extends Thing {
  constructor(thing, angle) {
    super(thing.game);
    this.speed = 10;
    this.type = ThingTypes.GOOD_SHOT;

    this.setSprite(this.game.retrieve('spread-bullet', this, obj => {
      var size = 9;
      var img = makeImage(size, size);
      var ctx = context2d(img);
      ctx.fillStyle = Colors.Blue;
      roundRect(ctx, 0, 0, size, size, size / 2, true);
      var sprite = new Sprite(img);
      sprite.addBox(new BoxInsets());
      return sprite;
    }));

    var x = thing.cx - this.width / 2, y = thing.ypos;
    var xd = -100 * Math.cos(angle) + x;
    var yd = -100 * Math.sin(angle) + y;
    this.movement = new BulletMovement(this, x, y, xd, yd, this.speed);
  }
}

class SpreadWeapon extends Weapon {
  constructor(t) {
    super(t, Colors.Blue, t.game.loadSprite("icon-spread").image);
    this.recharge = 10;
    this.bulletPower = 3;
    this.space = false;
    this.fired = 0;
  }

  clear() { this.space = false; }

  shoot() {
    if (this.fired > 0) {
      this.fired--;
      return [];
    }
    if (!this.space) return [];
    this.fired = this.recharge;
    var pow = this.power;
    var num = pow + 2;

    var widthDeg = 20 * num - 30;
    if (widthDeg > 180) widthDeg = 180;
    var startDeg = (180 - widthDeg) / 2;
    var endDeg = 180 - startDeg;

    var startRad = Math.PI * startDeg / 180;
    var endRad = Math.PI * endDeg / 180;
    var inc = (endRad - startRad) / (num - 1);

    var shots = [];
    for (var s=0; s<num; s++) {
      var shot = new SpreadBullet(this.thing, startRad + inc * s);
      shot.power = this.bulletPower;
      shots.push(shot);
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
Plugins.weapons.push(SpreadWeapon);
