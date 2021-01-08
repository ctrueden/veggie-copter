public class MineBulletMovement extends MovementStyle {

  protected static final float SPEED = 2.2f;

  protected float xstart, ystart;
  protected float xtraj, ytraj;
  protected float speed;
  protected int tick;

  public MineBulletMovement(Thing t, float x, float y,
    float xtarget, float ytarget)
  {
    this(t, x, y, xtarget, ytarget, SPEED);
  }

  public MineBulletMovement(Thing t, float x, float y,
    float xtarget, float ytarget, float speed)
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
  public void move() {
    float xpos = xstart + tick * xtraj;
    float ypos = ystart + tick * ytraj;
    tick++;
    thing.setImageIndex(tick);
    thing.setCPos(xpos, ypos);
  }

}

public class MineBullet extends Thing {

  /** Size of bullet. */
  protected static final int SIZE = 7;

  /** Number of ticks until bullet disappears. */
  protected static final int LIFE = 20;

  /** Power divisor for each bullet. */
  protected static final int POWER = 4;

  protected static BoundedImage[] images;

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

  public MineBullet(Thing t, float angle, float sx, float sy) {
    super(t.getGame());
    type = GOOD_BULLET;
    setImageList(images);
    setPower(LIFE / POWER + 1);
    float tx = (float) (sx + 10 * Math.sin(angle));
    float ty = (float) (sy + 10 * Math.cos(angle));
    move = new MineBulletMovement(this, sx, sy, tx, ty);
  }

  public void setImageIndex(int index) {
    if (index == LIFE) setHP(0); // bullets die when they fade away
    else {
      setPower((LIFE - index) / POWER + 1);
      super.setImageIndex(index);
    }
  }

}

/** Defines veggie copter gravity mine explosion behavior. */
public class MineExplode extends AttackStyle {

  protected boolean explode;

  public MineExplode(Thing t) { super(t); }

  /** Causes the mine to explode. */
  public void explode() { explode = true; }

  public Thing[] shoot() { return null; }

  /** Explodes mine when trigger is pressed. */
  public Thing[] trigger() {
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

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.TRIGGER) explode();
  }

}

public class MineMovement extends MovementStyle {

  /** Number of ticks to initially throw mine forward. */
  protected static final int THROW_DURATION = 20;

  /** Speed at which mine is thrown forward. */
  protected static final int THROW_SPEED = 8;

  /** Number of ticks until mine blows up automatically. */
  protected static final int EXPLODE_DELAY = 180;

  /** Rate at which shaking occurs (lower increases shaking more quickly). */
  protected static final int SHAKE_RATE = 16;

  /** Speed at which mine moves downward after being thrown. */
  protected static final float SPEED = 1;

  /** Strength of drag pulling in enemies. */
  protected static final int DRAG_STRENGTH = 20;

  protected long ticks;
  protected float adjX, adjY;

  public MineMovement(Thing t) { super(t); }

  /** Drags nearby enemies closer to the mine. */
  public void move() {
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

public class CopterMine extends Thing {

  protected static final int POWER_MULTIPLIER = 10;
  protected static final int MAX_SIZE = 11;

  protected static BoundedImage[] images;

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

  public CopterMine(Thing thing, int power) {
    super(thing.getGame());
    type = GOOD_BULLET;
    setPower(power);
    move = new MineMovement(this);
    attack = new MineExplode(this);
    setCPos(thing.getCX(), thing.getCY());
  }

  /** Gets strength (power) of the mine. */
  public int getStrength() { return power; }

  /** Changes mine size based on power value. */
  public void setPower(int power) {
    super.setPower(power);
    maxhp = hp = POWER_MULTIPLIER * power;

    int size = power - 1;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImage(images[size]);
  }

  /** Mines do not directly damage enemies. */
  public int getPower() { return 0; }

  /** Mines cannot be destroyed. */
  public void hit(int damage) { }
}

/** Defines veggie copter gravity mine attack style. */
public class MineAttack extends ColoredAttack {

  protected static final int RECHARGE = 24;

  protected boolean space;
  protected int fired;

  public MineAttack(Thing t) {
    super(t, Color.darkGray,
      t.getGame().loadImage("icon-mine.png").getImage());
  }

  public void clear() { space = false; }

  /** Drops mines while space bar is being pressed. */
  public Thing[] shoot() {
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

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
