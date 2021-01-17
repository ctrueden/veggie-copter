class TornadoMovement extends MovementStyle {
  constructor(t, x, y) {
    super(t);
    this.launched = false;
    this.thing.setPos(x, y);
    this.xcore = x;
    this.ycore = y;
    this.ticks = 0;
    this.period = 24;
    this.xgrowth = 0.3;
    this.ygrowth = 0.1;
    this.speed = 1.5;
  }

  move() {
    this.ticks++;
    this.ycore -= this.speed;
    var q = (this.ticks % this.period) / this.period;
    var angle = 2 * Math.PI * q;
    var xscale = Math.sqrt(this.thing.power) * this.xgrowth * this.ticks + 5;
    var yscale = Math.sqrt(this.thing.power) * this.ygrowth * this.ticks + 5;
    var x = this.xcore + xscale * Math.cos(angle);
    var y = this.ycore + yscale * Math.sin(angle);
    this.thing.setPos(x, y);
  }
}

class TornadoShot extends Thing {
  constructor(thing, x, y, power) {
    super(thing.game);
    this.type = ThingTypes.GOOD_SHOT;
    this.setSprite(this.game.retrieve('tornado-shot', this, obj => {
      var img = makeImage(9, 3);
      var ctx = context2d(img);
      ctx.beginPath();
      ctx.fillStyle = Colors.SpringGreen;
      ctx.ellipse(4, 1, 4, 1, 0, 0, 2 * Math.PI);
      ctx.fill();
      var sprite = new Sprite(img);
      sprite.addBox(new BoxInsets());
      return sprite;
    }));
    this.power = power;
    this.movement = new TornadoMovement(this, x, y);
  }
}

class TornadoWeapon extends Weapon {
  constructor(t) {
    super(t, Colors.SpringGreen, t.game.loadSprite('icon-tornado').image);
    this.space = false;
    this.fired = 0;
    this.recharge = 4;
  }

  clear() { this.space = false; }

  shoot() {
    if (this.fired > 0) {
      this.fired--;
      return [];
    }
    if (!this.space) return [];
    this.fired = this.recharge;

    var x = this.thing.cx - 7;
    var y = this.thing.ypos;
    return [new TornadoShot(this.thing, x, y, this.power)];
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = false;
  }
}
