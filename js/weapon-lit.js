class LitMovement extends MovementStyle {
   constructor(t, x, y, path) {
    super(t);
    this.thing.setPos(x, y);
    this.path = path;
    this.pIndex = 0;
  }

  move() {
    var lit = this.thing;
    var xpos = lit.xpos, ypos = lit.ypos;

    xpos += lit.x2;
    ypos += lit.y2;

    if (this.pIndex < this.path.length) {
      var p = this.path[this.pIndex++];
      if (p < 0) lit.arcLeft();
      else if (p > 0) lit.arcRight();
    }
    else {
      var chance = Math.random();
      if (chance < lit.leftChance) lit.arcLeft();
      else if (chance > 1 - lit.rightChance) lit.arcRight();
    }

    var x1 = lit.x1;
    var y1 = lit.y1;
    xpos -= x1;
    ypos -= y1;

    lit.setPos(xpos, ypos);
  }
}

class LitShot extends Thing {
  constructor(thing, path) {
    super(thing.game);
    this.angles = [
      {x1: 2, y1: 1, x2: 0, y2: 0},
      {x1: 2, y1: 2, x2: 0, y2: 0},
      {x1: 1, y1: 2, x2: 0, y2: 0},
      {x1: 0, y1: 2, x2: 0, y2: 0},
      {x1: 0, y1: 2, x2: 1, y2: 0},
      {x1: 0, y1: 2, x2: 2, y2: 0},
      {x1: 0, y1: 1, x2: 2, y2: 0},
    ];
    this.multiplier = 5;
    this._angle = this.startAngle = 3;

    var sprites = {};
    for (var i=0; i<this.angles.length; i++) {
      sprites[i] = this.game.retrieve(`lit-shot${i}`, this, obj => {
        var x1 = obj.multiplier * obj.angles[i].x1;
        var y1 = obj.multiplier * obj.angles[i].y1;
        var x2 = obj.multiplier * obj.angles[i].x2;
        var y2 = obj.multiplier * obj.angles[i].y2;
        var w = Math.max(x1, x2) + 1;
        var h = Math.max(y1, y2) + 1;
        var img = makeImage(w, h);
        var ctx = context2d(img);
        ctx.strokeStyle = Colors.Cyan;
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        var sprite = new Sprite(img);
        sprite.addBox(new BoxInsets());
        return sprite;
      });
    }
    this.setSprites(sprites, this.angle);

    this.type = ThingTypes.GOOD_BULLET;
    var x = thing.cx - this.width / 2;
    var y = thing.ypos - this.height;
    this.movement = new LitMovement(this, x, y, path);
  }

  arcLeft() { this.angle--; }
  arcRight() { this.angle++; }

  get angle() { return this._angle; }

  set angle(angle) {
    if (angle < 0 || angle >= this.angles.length) return;
    this._angle = angle;
    this.activateSprite(angle);
  }

  get x1() { return this.multiplier * this.angles[this.angle].x1; }
  get y1() { return this.multiplier * this.angles[this.angle].y1; }
  get x2() { return this.multiplier * this.angles[this.angle].x2; }
  get y2() { return this.multiplier * this.angles[this.angle].y2; }
}

/** Defines veggie copter lightning attack style. */
class LitWeapon extends Weapon {
  constructor(t) {
    super(t, Colors.Cyan, t.game.loadSprite("icon-lit").image);

    this.leftChance = 0.2;
    this.rightChance = 0.2;

    this.power = 1;
    this.pathLength = 200;

    this.arcLength = 10;
    this.delay = 10;
    this.period = this.arcLength + this.delay;

    this.ticks = 0;
    this.space = false;
    this.paths = [];
    for (var i=0; i<1000; i++) this.paths.push(null);
    this.generatePath(0);
  }

  clear() { this.space = false; }

  shoot() {
    if (!this.space) return [];
    this.ticks++;
    var pow = this.power;
    var q = this.ticks % this.period;
    var shots = [];
    for (var i=0; i<pow; i++) {
      var genTick = i * this.period / pow;
      if (q < genTick) q += this.period;
      var haltTick = genTick + this.arcLength;

      if (q == genTick) this.generatePath(i);
      else if (q >= haltTick) continue;

      if (!this.paths[i]) continue;
      shots.push(new LitShot(this.thing, this.paths[i]));
      shots[i].power = this.power;
    }
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return shots;
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) {
      this.space = true;
      this.ticks = 0;
    }
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = false;
  }

  generatePath(index) {
    this.paths[index] = [];
    for (var i=0; i<this.pathLength; i++) {
      var chance = Math.random();
      if (chance < this.leftChance) this.paths[index].push(-1);
      else if (chance > 1 - this.rightChance) this.paths[index].push(1);
      else this.paths[index].push(0);
    }
  }
}
