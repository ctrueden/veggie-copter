// A *bullet* is a shot that moves in a straight line at a constant speed.

class BulletMovement extends MovementStyle {
  constructor(t, x, y, xtarget, ytarget, speed) {
    super(t);

    this.thing.setPos(x, y);
    if (xtarget == null) xtarget = t.game.copter.cx;
    if (ytarget == null) ytarget = t.game.copter.cy;
    this.speed = speed == null ? 2.2 : speed;
    this.xstart = x; this.ystart = y;
    var xx = xtarget - x;
    var yy = ytarget - y;
    var c = Math.sqrt((xx * xx + yy * yy) / (this.speed * this.speed));
    this.xtraj = xx / c;
    this.ytraj = yy / c;
    this.tick = 0;
  }

  move() {
    var xpos = this.xstart + this.tick * this.xtraj;
    var ypos = this.ystart + this.tick * this.ytraj;
    this.tick++;
    this.thing.setPos(xpos, ypos);
  }
}

class EvilBullet extends Thing {
  constructor(shooter, xtarget, ytarget) {
    super(shooter.game);
    this.type = ThingTypes.EVIL_SHOT;
    this.setSprite(this.game.retrieve('evil-bullet', this, obj => {
      var size = 9;
      var image = makeImage(size, size);
      var ctx = context2d(image);
      ctx.fillStyle = Colors.Red;
      roundRect(ctx, 0, 0, size, size, size / 2, 2, true, true);
      var sprite = new Sprite(image);
      sprite.addBox(new BoxInsets());
      return sprite;
    }));
    this.power = 10 * shooter.power;

    // Align the bullet's center with the shooter's center.
    var x = this.xpos = shooter.cx - this.width / 2;
    var y = this.ypos = shooter.cy - this.height / 2;

    this.movement = new BulletMovement(this, x, y, xtarget, ytarget);
    //this.attack = new RandomBulletAttack(this); // MWAHAHA!
  }
}

class RandomBulletAttack extends AttackStyle {
  constructor(t, frequency) {
    super(t);
    // Probability that the thing will fire a bullet (1=rare, 60=always).
    this.frequency = frequency ? frequency : 3;
  }

  shoot() {
    if (Math.random() >= 1.0 / (60 - this.frequency)) return [];
    return [new EvilBullet(this.thing)];
  }
}
