class RailShot extends Thing {
  constructor(thing, power) {
    super(thing.game);
    this.type = ThingTypes.GOOD_SHOT;
    this.power = 5 * power;
    var radius = power - 1;
    var x = thing.cx;
    var y = thing.ypos;
    this._bounds = [new Rectangle(x - radius, -100, 2 * radius + 1, y + 100)];
    this.ticks = 0;
    this.fadeaway = 30;
    this.hp = this.maxHP = Infinity;
  }

  move() { if (this.ticks++ == this.fadeaway) this.hp = 0; }

  harms(t) { return this.ticks == 0 && super.harms(t); }

  get bounds() { return this._bounds; }

  draw(ctx) {
    var c = 255 * (this.fadeaway - this.ticks) / this.fadeaway;
    ctx.fillStyle = color(c, c, c);
    ctx.fillRect(this.bounds[0].x, this.bounds[0].y, this.bounds[0].width, this.bounds[0].height);
  }
}

class RailWeapon extends Weapon {
  constructor(t) {
    super(t, Colors.White, t.game.loadSprite('icon-rail').image);
    this.space = false;
    this.fired = 0;
    this.recharge = 30;
  }

  clear() { this.space = false; }

  shoot() {
    if (this.fired > 0) {
      this.fired--;
      return [];
    }
    if (!this.space) return [];
    this.fired = this.recharge;

    var x = this.thing.cx;
    var y = this.thing.ypos;
    return [new RailShot(this.thing, this.power)];
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = false;
  }
}
Plugins.weapons.push(RailWeapon);
