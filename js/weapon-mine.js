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
    this.thing.setImageIndex(this.tick);
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

  static BoundedImage[] images;

  static {
    images = new BoundedImage[LIFE];
    for (var i=0; i<LIFE; i++) {
      BufferedImage img = ImageTools.makeImage(SIZE, SIZE);
      Graphics g = img.createGraphics();
      var alpha = 255 * (LIFE - i) / LIFE;
      g.setColor(new Color(Color.gray.getRed(),
        Color.gray.getGreen(), Color.gray.getBlue(), alpha));
      g.fillRoundRect(0, 0, SIZE, SIZE, SIZE / 2, SIZE / 2);
      g.dispose();
      images[i] = new BoundedImage(img);
      images[i].addBox(new BoundingBox(0, 0, 0, 0));
    }
  }

  MineShard(t, angle, sx, sy) {
    super(t.getGame());
    type = GOOD_BULLET;
    setImageList(images);
    setPower(LIFE / POWER + 1);
    var tx = (float) (sx + 10 * Math.sin(angle));
    var ty = (float) (sy + 10 * Math.cos(angle));
    move = new MineShardMovement(this, sx, sy, tx, ty);
  }

  setImageIndex(index) {
    if (index == LIFE) setHP(0); // shards die when they fade away
    else {
      setPower((LIFE - index) / POWER + 1);
      super.setImageIndex(index);
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

  shoot() { return null; }

  /** Explodes mine when trigger is pressed. */
  trigger() {
    if (!explode) return null;

    // explode in power+2 shards evenly space around a circle
    var num = this.thing.getStrength() + 2;
    var shards = [];
    var cx = this.thing.getCX(), cy = this.thing.getCY();
    for (var i=0; i<num; i++) {
      var angle = 2 * Math.PI * i / num;
      shards.push(new MineShard(this.thing, angle, cx, cy));
    }
    //SoundPlayer.playSound(getClass().getResource("explode.wav"));
    this.thing.setHP(0);
    return shards;
  }

  keyPressed(e) {
    var code = e.getKeyCode();
    if (code == Keys.TRIGGER) explode();
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
    var xpos = this.thing.getX(), ypos = this.thing.getY();
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
    Thing[] t = this.thing.getGame().getThings();
    for (var i=0; i<t.length; i++) {
      if (t[i].getType() != Thing.EVIL) continue;
      var tx = t[i].getCX(), ty = t[i].getCY();
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

  static BoundedImage[] images;

  static {
    images = new BoundedImage[MAX_SIZE];
    for (var i=0; i<MAX_SIZE; i++) {
      var size = i + 10;
      BufferedImage img = ImageTools.makeImage(size, size);
      Graphics g = img.createGraphics();
      g.setColor(Color.gray);
      g.fillOval(0, 0, size, size);
      g.setColor(Color.red);
      var q = size / 3 + 1;
      g.fillOval(q, q, q, q);
      g.dispose();
      images[i] = new BoundedImage(img);
      images[i].addBox(new BoundingBox(0, 0, 0, 0));
    }
  }

  constructor(thing, power) {
    super(thing.getGame());
    type = GOOD_BULLET;
    setPower(power);
    move = new MineMovement(this);
    attack = new MineExplode(this);
    setCPos(thing.getCX(), thing.getCY());
  }

  /** Gets strength (power) of the mine. */
  var getStrength() { return power; }

  /** Changes mine size based on power value. */
  setPower(power) {
    super.setPower(power);
    maxhp = hp = POWER_MULTIPLIER * power;

    var size = power - 1;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImage(images[size]);
  }

  /** Mines do not directly damage enemies. */
  var getPower() { return 0; }

  /** Mines cannot be destroyed. */
  hit(damage) { }
}

/** Defines veggie copter gravity mine attack style. */
class MineAttack extends ColoredAttack {

  RECHARGE = 24;

  boolean space;
  var fired;

  MineAttack(t) {
    super(t, Color.darkGray,
      t.getGame().loadImage("icon-mine.png").getImage());
  }

  clear() { space = false; }

  /** Drops mines while space bar is being pressed. */
  shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    fired = RECHARGE - power / 2;

    var mine = new CopterMine(thing, power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return [mine];
  }

  keyPressed(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  keyReleased(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
