// TODO: Make separate EnemyMovement subclass for each of these.
const ZIGZAG = 1;
const SPIRAL = 2;
const WAVE = 3;

class EnemyMovement extends MovementStyle {
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
      for (var i=0; i<this.params.length-2; i+=3) {
        if (this.params[i] == ticks) {
          this.xmod = this.params[i + 1];
          this.ymod = this.params[i + 2];
        }
      }
      cx += this.xmod;
      cy += this.ymod;
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

// TODO: Better way to cache this statically??
var ENEMY_BULLET_IMAGE = null;
var ENEMY_BULLET_SIZE = 7;

class EnemyBullet extends Thing {
  constructor(t, x2, y2) {
    super(t.getGame());
    this.type = EVIL_BULLET;

    if (ENEMY_BULLET_IMAGE == null) {
      var size = ENEMY_BULLET_SIZE;
      var img = makeImage(size, size);
      var ctx = context2d(img);
      ctx.fillStyle = "red";
      ctx.fillRoundRect(0, 0, size, size, size / 2, size / 2);
      ENEMY_BULLET_IMAGE = new BoundedImage(img);
      ENEMY_BULLET_IMAGE.addBox(new BoundingBox());
    }
    setImage(ENEMY_BULLET_IMAGE);
    setPower(10 * t.getPower());

    var x = t.getCX() - getWidth() / 2;
    var y = t.getCY() - getHeight() / 2;
    this.move = new BulletMovement(this, x, y, x2, y2);
    //this.attack = new RandomBulletAttack(this); // MWAHAHA!
  }
}

/** Defines random enemy bullet attack. */
class RandomBulletAttack extends AttackStyle {
  constructor(t) {
    super(t);
    /** Probability that this thing will fire a bullet (1=rare, 60=always). */
    this.frequency = 3;
  }

  /** Fires a shot randomly. */
  shoot() {
    if (Math.random() >= 1.0 / (60 - this.frequency)) return null;
    return [new EnemyBullet(thing, null, null)];
  }
}

class EnemyHead extends Thing {
  NORMAL = 0;
  ATTACKING = 1;
  HURTING = 2;

  SHOT_DELAY = 18;

  constructor(game, max, normal, attacking, hurting) {
    super(game);
    this.setImages({normal: normal, attacking: attacking, hurting: hurting});
    this.maxhp = this.hp = max;
    this.shooting = 0;
    //this.power = 10;
  }

  isShooting() { return this.shooting > 0; }

  move() {
    super.move();
    if (this.isHit()) this.hurtingActivate();
    else if (this.isShooting()) this.attackingActivate();
    else this.normalActivate();
  }

  get normalImage() { return this.getBoundedImage('normal'); }
  get attackImage() { return this.getBoundedImage('attacking'); }
  get hurtImage() { return this.getBoundedImage('hurting'); }

  normalActivate() { this.activateImage('normal'); }
  attackingActivate() { this.activateImage('attacking'); }
  hurtingActivate() { this.activateImage('hurting'); }

  shoot() {
    var t = super.shoot();
    if (t != null) this.shooting = SHOT_DELAY;
    else if (this.shooting > 0) this.shooting--;
    if (isDead()) {
      // dead head drops a power-up
      t = this.getPowerUp();
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
  constructor(game, args) {
    super(game, parseInt(args[0]),
      game.loadImage(args[1] + "1.png"),
      game.loadImage(args[1] + "2.png"),
      game.loadImage(args[1] + "3.png"));
    this.normalImage.addBox(new BoundingBox());
    this.attackImage.addBox(new BoundingBox());
    this.hurtImage.addBox(new BoundingBox());

    setMovement(new EnemyMovement(this, args.slice(2)));
    setAttack(new RandomBulletAttack(this));
  }

  getPowerUp() { return null; }
}

class BossHead extends EnemyHead {

  constructor(game, max, normal, attacking, hurting) {
    super(game, max, normal, attacking, hurting);
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  getWeapon() { return null; }

  getPowerUp() {
    return [new PowerUp(game, getCX(), getCY(), 50, getWeapon())];
  }

}
