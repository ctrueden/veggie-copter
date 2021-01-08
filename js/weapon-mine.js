class MineBulletMovement extends MovementStyle {

  const float SPEED = 2.2f;

  xstart, ystart;
  xtraj, ytraj;
  float speed;
  int tick;

  MineBulletMovement(t, x, y,
    xtarget, ytarget)
  {
    this(t, x, y, xtarget, ytarget, SPEED);
  }

  MineBulletMovement(t, x, y,
    xtarget, ytarget, speed)
  {
    super(t);
    thing.setCPos(x, y);

    xstart = x; ystart = y;
    float xx = xtarget - x;
    float yy = ytarget - y;
    float c = (float) Math.sqrt((xx * xx + yy * yy) / (speed * speed));

    xtraj = xx / c;
    ytraj = yy / c;
    tick = 0;
  }

  /** Moves the given thing according to the bullet movement style. */
  move() {
    float xpos = xstart + tick * xtraj;
    float ypos = ystart + tick * ytraj;
    tick++;
    thing.setImageIndex(tick);
    thing.setCPos(xpos, ypos);
  }

}

class MineBullet extends Thing {

  /** Size of bullet. */
  const int SIZE = 7;

  /** Number of ticks until bullet disappears. */
  const int LIFE = 20;

  /** Power divisor for each bullet. */
  const int POWER = 4;

  static BoundedImage[] images;

  static {
    images = new BoundedImage[LIFE];
    for (int i=0; i<LIFE; i++) {
      BufferedImage img = ImageTools.makeImage(SIZE, SIZE);
      Graphics g = img.createGraphics();
      int alpha = 255 * (LIFE - i) / LIFE;
      g.setColor(new Color(Color.gray.getRed(),
        Color.gray.getGreen(), Color.gray.getBlue(), alpha));
      g.fillRoundRect(0, 0, SIZE, SIZE, SIZE / 2, SIZE / 2);
      g.dispose();
      images[i] = new BoundedImage(img);
      images[i].addBox(new BoundingBox());
    }
  }

  MineBullet(t, angle, sx, sy) {
    super(t.getGame());
    type = GOOD_BULLET;
    setImageList(images);
    setPower(LIFE / POWER + 1);
    float tx = (float) (sx + 10 * Math.sin(angle));
    float ty = (float) (sy + 10 * Math.cos(angle));
    move = new MineBulletMovement(this, sx, sy, tx, ty);
  }

  setImageIndex(index) {
    if (index == LIFE) setHP(0); // bullets die when they fade away
    else {
      setPower((LIFE - index) / POWER + 1);
      super.setImageIndex(index);
    }
  }

}

/** Defines veggie copter gravity mine explosion behavior. */
class MineExplode extends AttackStyle {

  boolean explode;

  MineExplode(t) { super(t); }

  /** Causes the mine to explode. */
  explode() { explode = true; }

  Thing[] shoot() { return null; }

  /** Explodes mine when trigger is pressed. */
  Thing[] trigger() {
    if (!explode) return null;

    // explode in power+2 bullets evenly space around a circle
    int num = thing.getStrength() + 2;
    Thing[] bullets = new Thing[num];
    float cx = thing.getCX(), cy = thing.getCY();
    for (int i=0; i<num; i++) {
      float angle = (float) (2 * Math.PI * i / num);
      bullets[i] = new MineBullet(thing, angle, cx, cy);
    }
    //SoundPlayer.playSound(getClass().getResource("explode.wav"));
    thing.setHP(0);
    return bullets;
  }

  keyPressed(e) {
    int code = e.getKeyCode();
    if (code == Keys.TRIGGER) explode();
  }

}

class MineMovement extends MovementStyle {

  /** Number of ticks to initially throw mine forward. */
  const int THROW_DURATION = 20;

  /** Speed at which mine is thrown forward. */
  const int THROW_SPEED = 8;

  /** Number of ticks until mine blows up automatically. */
  const int EXPLODE_DELAY = 180;

  /** Rate at which shaking occurs (lower increases shaking more quickly). */
  const int SHAKE_RATE = 16;

  /** Speed at which mine moves downward after being thrown. */
  const float SPEED = 1;

  /** Strength of drag pulling in enemies. */
  const int DRAG_STRENGTH = 20;

  long ticks;
  adjX, adjY;

  MineMovement(t) { super(t); }

  /** Drags nearby enemies closer to the mine. */
  move() {
    float xpos = thing.getX(), ypos = thing.getY();
    ticks++;

    int pow = thing.getStrength();
    if (ticks <= THROW_DURATION) {
      // initially throw mine forward
      int throwSpeed = THROW_SPEED + pow;
      float q = (float) Math.sqrt((double) ticks / THROW_DURATION);
      thing.setPos(xpos, ypos - throwSpeed * (1 - q));
      return;
    }
    else if (ticks == EXPLODE_DELAY + 6 * pow) {
      // mine automatically explodes
      ((MineExplode) thing.getAttack()).explode();
    }

    float shake = (float) ticks / SHAKE_RATE;
    xpos -= adjX; ypos -= adjY; // correct for last time
    adjX = shake * (float) (Math.random() - 0.5);
    adjY = shake * (float) (Math.random() - 0.5);
    float x = xpos + adjX;
    float y = ypos + adjY;
    thing.setPos(x, y + SPEED);

    // use distance squared function to drag in enemies
    Thing[] t = thing.getGame().getThings();
    for (int i=0; i<t.length; i++) {
      if (t[i].getType() != Thing.EVIL) continue;
      float tx = t[i].getCX(), ty = t[i].getCY();
      float xx = xpos - tx, yy = ypos - ty;
      float dist2 = xx * xx + yy * yy;
      if (dist2 < 1) continue;
      float dist = (float) Math.sqrt(dist2);
      float drag = DRAG_STRENGTH * pow / dist2;
      if (drag > 1) drag = 1;
      tx += drag * xx / dist;
      ty += drag * yy / dist;
      t[i].setCPos(tx, ty);
    }
  }

}

class CopterMine extends Thing {

  const int POWER_MULTIPLIER = 10;
  const int MAX_SIZE = 11;

  static BoundedImage[] images;

  static {
    images = new BoundedImage[MAX_SIZE];
    for (int i=0; i<MAX_SIZE; i++) {
      int size = i + 10;
      BufferedImage img = ImageTools.makeImage(size, size);
      Graphics g = img.createGraphics();
      g.setColor(Color.gray);
      g.fillOval(0, 0, size, size);
      g.setColor(Color.red);
      int q = size / 3 + 1;
      g.fillOval(q, q, q, q);
      g.dispose();
      images[i] = new BoundedImage(img);
      images[i].addBox(new BoundingBox());
    }
  }

  CopterMine(thing, power) {
    super(thing.getGame());
    type = GOOD_BULLET;
    setPower(power);
    move = new MineMovement(this);
    attack = new MineExplode(this);
    setCPos(thing.getCX(), thing.getCY());
  }

  /** Gets strength (power) of the mine. */
  int getStrength() { return power; }

  /** Changes mine size based on power value. */
  setPower(power) {
    super.setPower(power);
    maxhp = hp = POWER_MULTIPLIER * power;

    int size = power - 1;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImage(images[size]);
  }

  /** Mines do not directly damage enemies. */
  int getPower() { return 0; }

  /** Mines cannot be destroyed. */
  hit(damage) { }
}

/** Defines veggie copter gravity mine attack style. */
class MineAttack extends ColoredAttack {

  const int RECHARGE = 24;

  boolean space;
  int fired;

  MineAttack(t) {
    super(t, Color.darkGray,
      t.getGame().loadImage("icon-mine.png").getImage());
  }

  clear() { space = false; }

  /** Drops mines while space bar is being pressed. */
  Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    fired = RECHARGE - power / 2;

    CopterMine mine = new CopterMine(thing, power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {mine};
  }

  keyPressed(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  keyReleased(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
