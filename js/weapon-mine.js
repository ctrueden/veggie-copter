class MineShardMovement extends MovementStyle {
  SPEED = 2.2f;

  xstart, ystart;
  xtraj, ytraj;
  var speed;
  var tick;

  constructor(t, x, y, xtarget, ytarget, speed) {
    super(t);
    if (speed == null) speed = SPEED;
    thing.setCPos(x, y);

    this.xstart = x; this.ystart = y;
    var xx = xtarget - x;
    var yy = ytarget - y;
    var c = (float) Math.sqrt((xx * xx + yy * yy) / (speed * speed));

    this.xtraj = xx / c;
    this.ytraj = yy / c;
    this.tick = 0;
  }

  move() {
    var xpos = this.xstart + this.tick * this.xtraj;
    var ypos = this.ystart + this.tick * this.ytraj;
    this.tick++;
    this.thing.activateSprite(this.tick);
    this.thing.setCPos(xpos, ypos);
  }
}

class MineShard extends Thing {

  /** Size of shard. */
  SIZE = 7;

  /** Number of ticks until shard disappears. */
  LIFE = 20;

  /** Power divisor for each shard. */
  POWER = 4;

  static Sprite[] images;

  static {
    images = new Sprite[LIFE];
    for (var i=0; i<LIFE; i++) {
      var img = makeImage(SIZE, SIZE);
      var ctx = context2d(img);
      var alpha = (LIFE - i) / LIFE;
      ctx.fillStyle = color(128, 128, 128, alpha);
      ctx.fillRoundRect(0, 0, SIZE, SIZE, SIZE / 2, SIZE / 2);
      images[i] = new Sprite(img);
      images[i].addBox(new BoxInsets());
    }
  }

  MineShard(t, angle, sx, sy) {
    super(t.game);
    this.type = GOOD_BULLET;
    setSprites(images);
    this.power = LIFE / POWER + 1;
    var tx = (float) (sx + 10 * Math.sin(angle));
    var ty = (float) (sy + 10 * Math.cos(angle));
    move = new MineShardMovement(this, sx, sy, tx, ty);
  }

  activateSprite(index) {
    if (index == LIFE) setHP(0); // shards die when they fade away
    else {
      power = (LIFE - index) / POWER + 1;
      super.activateSprite(index);
    }
  }

}

/** Defines veggie copter gravity mine explosion behavior. */
class MineExplode extends AttackStyle {
  constructor(t) {
    super(t);
    this.explode = false;
  }

  /** Causes the mine to explode. */
  explode() { this.explode = true; }

  shoot() { return []; }

  /** Explodes mine when trigger is pressed. */
  trigger() {
    if (!explode) return [];

    // explode in power+2 shards evenly space around a circle
    var num = this.thing.getStrength() + 2;
    var shards = [];
    var cx = this.thing.cx, cy = this.thing.cy;
    for (var i=0; i<num; i++) {
      var angle = 2 * Math.PI * i / num;
      shards.push(new MineShard(this.thing, angle, cx, cy));
    }
    //SoundPlayer.playSound(getClass().getResource("explode.wav"));
    this.thing.setHP(0);
    return shards;
  }

  keyPressed(e) {
    if (Keys.TRIGGER.includes(e.keyCode)) explode();
  }
}

class MineMovement extends MovementStyle {
  /** Number of ticks to initially throw mine forward. */
  THROW_DURATION = 20;

  /** Speed at which mine is thrown forward. */
  THROW_SPEED = 8;

  /** Number of ticks until mine blows up automatically. */
  EXPLODE_DELAY = 180;

  /** Rate at which shaking occurs (lower increases shaking more quickly). */
  SHAKE_RATE = 16;

  /** Speed at which mine moves downward after being thrown. */
  const var SPEED = 1;

  /** Strength of drag pulling in enemies. */
  DRAG_STRENGTH = 20;

  constructor(t) {
    super(t);
    this.ticks = 0;
    this.adjX = this.adjY = 0;
  }

  /** Drags nearby enemies closer to the mine. */
  move() {
    var xpos = this.thing.xpos, ypos = this.thing.ypos;
    this.ticks++;

    var pow = this.thing.getStrength();
    if (ticks <= THROW_DURATION) {
      // initially throw mine forward
      var throwSpeed = THROW_SPEED + pow;
      var q = (float) Math.sqrt((double) ticks / THROW_DURATION);
      this.thing.setPos(xpos, ypos - throwSpeed * (1 - q));
      return;
    }
    else if (ticks == EXPLODE_DELAY + 6 * pow) {
      // mine automatically explodes
      ((MineExplode) this.thing.getAttack()).explode();
    }

    var shake = (float) ticks / SHAKE_RATE;
    xpos -= adjX; ypos -= adjY; // correct for last time
    adjX = shake * (float) (Math.random() - 0.5);
    adjY = shake * (float) (Math.random() - 0.5);
    var x = xpos + adjX;
    var y = ypos + adjY;
    this.thing.setPos(x, y + SPEED);

    // use distance squared function to drag in enemies
    Thing[] t = this.thing.game.getThings();
    for (var i=0; i<t.length; i++) {
      if (t[i].type != ThingTypes.EVIL) continue;
      var tx = t[i].cx, ty = t[i].cy;
      var xx = xpos - tx, yy = ypos - ty;
      var dist2 = xx * xx + yy * yy;
      if (dist2 < 1) continue;
      var dist = (float) Math.sqrt(dist2);
      var drag = DRAG_STRENGTH * pow / dist2;
      if (drag > 1) drag = 1;
      tx += drag * xx / dist;
      ty += drag * yy / dist;
      t[i].setCPos(tx, ty);
    }
  }

}

class CopterMine extends Thing {

  POWER_MULTIPLIER = 10;
  MAX_SIZE = 11;

  static Sprite[] images;

  static {
    images = new Sprite[MAX_SIZE];
    for (var i=0; i<MAX_SIZE; i++) {
      var size = i + 10;
      var img = makeImage(size, size);
      var ctx = context2d(img);
      ctx.fillStyle = "gray";
      ctx.fillOval(0, 0, size, size);
      ctx.fillStyle = "red";
      var q = size / 3 + 1;
      ctx.fillOval(q, q, q, q);
      images[i] = new Sprite(img);
      images[i].addBox(new BoxInsets());
    }
  }

  constructor(thing, power) {
    super(thing.game);
    this.type = GOOD_BULLET;
    this.power = power;
    this.movement = new MineMovement(this);
    this.attack = new MineExplode(this);
    setCPos(thing.cx, thing.cy);
  }

  /** Gets strength (power) of the mine. */
  var getStrength() { return power; }

  /** Changes mine size based on power value. */
  set power(power) {
    super.power = power;
    this.maxHP = this.hp = POWER_MULTIPLIER * power;

    var size = power - 1;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setSprite(images[size]);
  }

  /** Mines do not directly damage enemies. */
  get power() { return 0; }

  /** Mines cannot be destroyed. */
  hit(damage) { }
}

/** Defines veggie copter gravity mine attack style. */
class MineAttack extends Weapon {

  RECHARGE = 24;

  boolean space;
  var fired;

  MineAttack(t) {
    super(t, "darkgray", t.game.loadSprite("icon-mine").image);
  }

  clear() { space = false; }

  /** Drops mines while space bar is being pressed. */
  shoot() {
    if (fired > 0) {
      fired--;
      return [];
    }
    if (!space) return [];
    fired = RECHARGE - power / 2;

    var mine = new CopterMine(thing, power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return [mine];
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = false;
  }

}
