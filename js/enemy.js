class EnemyMovement extends MovementStyle {

  const int ZIGZAG = 1;
  const int SPIRAL = 2;
  const int WAVE = 3;

  long ticks;
  int style;
  float[] params;

  float xmod = 0, ymod = 1; // for zigzag

  /**
   * Constructs a new enemy movement handler.
   * params[0] = movement style (e.g., zigzag, spiral, wave, etc.)
   * params[1] = starting X coordinate
   * params[2] = starting Y coordinate
   * params[3+] = additional style parameters
   *   zigzag: tick1, xmod1, ymod1, tick2, xmod2, ymod2, ...
   *   spiral: TODO
   *   wave: TODO
   */
  EnemyMovement(t, String[] params) {
    super(t);

    // determine movement style
    if (params[0].equalsIgnoreCase("zigzag")) style = ZIGZAG;
    else if (params[0].equalsIgnoreCase("spiral")) style = SPIRAL;
    else if (params[0].equalsIgnoreCase("wave")) style = WAVE;

    // set starting position
    float xpos = Float.parseFloat(params[1]);
    float ypos = Float.parseFloat(params[2]);

    // prepare additional parameters
    this.params = new float[params.length - 3];
    for (int i=0; i<this.params.length; i++) {
      this.params[i] = Float.parseFloat(params[i + 3]);
    }

    // starting position
    VeggieCopter game = thing.getGame();
    thing.setPos(xpos, ypos);
  }

  /** Moves the given thing according to the enemy type A movement style. */
  move() {
    ticks++;
    float cx = thing.getCX(), cy = thing.getCY();

    if (style == ZIGZAG) {
      // tick1, xmod1, ymod1, tick2, xmod2, ymod2, ...
      for (int i=0; i<params.length-2; i+=3) {
        if (params[i] == ticks) {
          xmod = params[i + 1];
          ymod = params[i + 2];
        }
      }
      cx += xmod;
      cy += ymod;
    }

    else if (style == SPIRAL) {
      // TODO
    }

    else if (style == WAVE) {
      // TODO
    }

    thing.setCPos(cx, cy);
  }

}

class EnemyBullet extends Thing {

  const int SIZE = 7;

  static BoundedImage image;

  static {
    BufferedImage img = ImageTools.makeImage(SIZE, SIZE);
    Graphics g = img.createGraphics();
    g.setColor(Color.red);
    g.fillRoundRect(0, 0, SIZE, SIZE, SIZE / 2, SIZE / 2);
    g.dispose();
    image = new BoundedImage(img);
    image.addBox(new BoundingBox());
  }

  EnemyBullet(t) {
    super(t.getGame());
    type = EVIL_BULLET;
    setImage(image);
    setPower(10 * t.getPower());

    float x = t.getCX() - getWidth() / 2f;
    float y = t.getCY() - getHeight() / 2f;
    move = new BulletMovement(this, x, y);
    //attack = new RandomBulletAttack(this); // MWAHAHA!
  }

  EnemyBullet(t, x2, y2) {
    super(t.getGame());
    type = EVIL_BULLET;
    setImage(image);
    setPower(10 * t.getPower());

    float x = t.getCX() - getWidth() / 2f;
    float y = t.getCY() - getHeight() / 2f;
    move = new BulletMovement(this, x, y, x2, y2);
    //attack = new RandomBulletAttack(this); // MWAHAHA!
  }

}

/** Defines random enemy bullet attack. */
class RandomBulletAttack extends AttackStyle {

  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  const int FREQUENCY = 3;

  RandomBulletAttack(t) { super(t); }

  /** Fires a shot randomly. */
  Thing[] shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return new Thing[] {new EnemyBullet(thing)};
  }

}

class EnemyHead extends Thing {

  const int NORMAL = 0;
  const int ATTACKING = 1;
  const int HURTING = 2;

  const int SHOT_DELAY = 18;

  int shooting;

  EnemyHead(game, max,
    normal, attacking, hurting)
  {
    super(game);
    setImageList(new BoundedImage[] {normal, attacking, hurting});
    maxhp = hp = max;
    //power = 10;
  }

  boolean isShooting() { return shooting > 0; }

  move() {
    super.move();
    if (isHit()) setImageIndex(HURTING);
    else if (isShooting()) setImageIndex(ATTACKING);
    else setImageIndex(NORMAL);
  }

  Thing[] shoot() {
    Thing[] t = super.shoot();
    if (t != null) shooting = SHOT_DELAY;
    else if (shooting > 0) shooting--;
    if (isDead()) {
      // dead head drops a power-up
      t = getPowerUp();
    }
    return t;
  }

  Thing[] getPowerUp() {
    return new Thing[] {new PowerUp(game, getCX(), getCY(), 20, null)};
  }

}

class Enemy extends EnemyHead {

  /**
   * Constructs a new enemy head.
   * args[0] = number of hit points
   * args[1] = name of graphic to use
   * args[2+] = movement parameters (EnemyMovement)
   */
  Enemy(game, String[] args) {
    super(game, Integer.parseInt(args[0]),
      game.loadImage(args[1] + "1.png"),
      game.loadImage(args[1] + "2.png"),
      game.loadImage(args[1] + "3.png"));
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());

    String[] params = new String[args.length - 2];
    System.arraycopy(args, 2, params, 0, params.length);
    setMovement(new EnemyMovement(this, params));
    setAttack(new RandomBulletAttack(this));
  }

  Thing[] getPowerUp() { return null; }

}

class BossHead extends EnemyHead {

  BossHead(game, max,
    normal, attacking, hurting)
  {
    super(game, max, normal, attacking, hurting);
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  ColoredAttack getColoredAttack();

  Thing[] getPowerUp() {
    return new Thing[] {
      new PowerUp(game, getCX(), getCY(), 50, getColoredAttack())
    };
  }

}
