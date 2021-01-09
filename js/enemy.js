class EnemyMovement extends MovementStyle {
  static const ZIGZAG = 1;
  static const SPIRAL = 2;
  static const WAVE = 3;

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
  constructor(t, params) {
    super(t);
    this.ticks = 0;
    this.xmod = 0, this.ymod = 1; // for zigzag

    // determine movement style
    if (equalsIgnoreCase(params[0], "zigzag")) this.style = ZIGZAG;
    else if (equalsIgnoreCase(params[0], "spiral")) this.style = SPIRAL;
    else if (equalsIgnoreCase(params[0], "wave")) this.style = WAVE;

    // set starting position
    var xpos = Float.parseFloat(params[1]);
    var ypos = Float.parseFloat(params[2]);

    // prepare additional parameters
    this.params = [];
    for (var i=3; i<params.length; i++) {
      this.params.push(parseFloat(params[i]));
    }

    // starting position
    var game = this.thing.getGame();
    this.thing.setPos(xpos, ypos);
  }

  /** Moves the given thing according to the enemy type A movement style. */
  move() {
    this.ticks++;
    var cx = this.thing.getCX(), cy = this.thing.getCY();

    if (this.style == ZIGZAG) {
      // tick1, xmod1, ymod1, tick2, xmod2, ymod2, ...
      for (var i=0; i<params.length-2; i+=3) {
        if (params[i] == ticks) {
          xmod = params[i + 1];
          ymod = params[i + 2];
        }
      }
      cx += xmod;
      cy += ymod;
    }

    else if (this.style == SPIRAL) {
      // TODO
    }

    else if (this.style == WAVE) {
      // TODO
    }

    this.thing.setCPos(cx, cy);
  }
}

class EnemyBullet extends Thing {

  const SIZE = 7;

  static image;

  static {
    var img = ImageTools.makeImage(SIZE, SIZE);
    var g = img.createGraphics();
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

    var x = t.getCX() - getWidth() / 2f;
    var y = t.getCY() - getHeight() / 2f;
    move = new BulletMovement(this, x, y);
    //attack = new RandomBulletAttack(this); // MWAHAHA!
  }

  EnemyBullet(t, x2, y2) {
    super(t.getGame());
    type = EVIL_BULLET;
    setImage(image);
    setPower(10 * t.getPower());

    var x = t.getCX() - getWidth() / 2f;
    var y = t.getCY() - getHeight() / 2f;
    move = new BulletMovement(this, x, y, x2, y2);
    //attack = new RandomBulletAttack(this); // MWAHAHA!
  }

}

/** Defines random enemy bullet attack. */
class RandomBulletAttack extends AttackStyle {
  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  static const FREQUENCY = 3;

  constructor(t) { super(t); }

  /** Fires a shot randomly. */
  shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return [new EnemyBullet(thing)];
  }
}

class EnemyHead extends Thing {
  static const NORMAL = 0;
  static const ATTACKING = 1;
  static const HURTING = 2;

  static const SHOT_DELAY = 18;

  constructor(game, max, normal, attacking, hurting) {
    super(game);
    setImageList([normal, attacking, hurting]);
    this.maxhp = this.hp = max;
    this.shooting = 0;
    //this.power = 10;
  }

  boolean isShooting() { return shooting > 0; }

  move() {
    super.move();
    if (isHit()) setImageIndex(HURTING);
    else if (isShooting()) setImageIndex(ATTACKING);
    else setImageIndex(NORMAL);
  }

  shoot() {
    var t = super.shoot();
    if (t != null) this.shooting = SHOT_DELAY;
    else if (this.shooting > 0) this.shooting--;
    if (isDead()) {
      // dead head drops a power-up
      t = getPowerUp();
    }
    return t;
  }

  getPowerUp() {
    return [new PowerUp(game, getCX(), getCY(), 20, null)];
  }
}

class Enemy extends EnemyHead {
  /**
   * Constructs a new enemy head.
   * args[0] = number of hit points
   * args[1] = name of graphic to use
   * args[2+] = movement parameters (EnemyMovement)
   */
  Enemy(game, args) {
    super(game, parseInt(args[0]),
      game.loadImage(args[1] + "1.png"),
      game.loadImage(args[1] + "2.png"),
      game.loadImage(args[1] + "3.png"));
    var normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    var attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    var hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());

    setMovement(new EnemyMovement(this, args.slice(2)));
    setAttack(new RandomBulletAttack(this));
  }

  getPowerUp() { return null; }
}

class BossHead extends EnemyHead {

  BossHead(game, max,
    normal, attacking, hurting)
  {
    super(game, max, normal, attacking, hurting);
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  ColoredAttack getColoredAttack();

  getPowerUp() {
    return [new PowerUp(game, getCX(), getCY(), 50, getColoredAttack())];
  }

}
