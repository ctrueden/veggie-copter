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
    var game = this.thing.game;
    this.thing.setPos(xpos, ypos);
  }

  /** Moves the given thing according to the enemy type A movement style. */
  move() {
    this.ticks++;
    var cx = this.thing.cx, cy = this.thing.cy;

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

class EnemyHead extends Thing {
  constructor(game, max, normal, attacking, hurting) {
    super(game);
    this.setSprites({normal: normal, attacking: attacking, hurting: hurting});
    this.hp = this.maxHP = max;
    this.shooting = 0;
    this.shotDelay = 18;
    //this.power = 10;
  }

  isShooting() { return this.shooting > 0; }

  move() {
    super.move();
    if (this.isHit()) this.hurtActivate();
    else if (this.isShooting()) this.attackActivate();
    else this.normalActivate();
  }

  get normalSprite() { return this.sprite('normal'); }
  get attackSprite() { return this.sprite('attacking'); }
  get hurtSprite() { return this.sprite('hurting'); }

  normalActivate() { this.activateSprite('normal'); }
  attackActivate() { this.activateSprite('attacking'); }
  hurtActivate() { this.activateSprite('hurting'); }

  shoot() {
    var shots = super.shoot();
    if (shots.length > 0) this.shooting = this.shotDelay;
    else if (this.shooting > 0) this.shooting--;
    if (this.isDead()) {
      // dead head drops a power-up
      shots = this.powerup;
    }
    return shots;
  }

  get powerup() {
    return [new PowerUp(this.game, this.cx, this.cy, 20, null)];
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
      game.loadSprite(`${args[1]}1`),
      game.loadSprite(`${args[1]}2`),
      game.loadSprite(`${args[1]}3`));
    this.normalSprite.addBox(new BoxInsets());
    this.attackSprite.addBox(new BoxInsets());
    this.hurtSprite.addBox(new BoxInsets());

    this.movement = new EnemyMovement(this, args.slice(2));
    this.attack = new RandomBulletAttack(this);
  }

  get powerup() { return []; }
}

class BossHead extends EnemyHead {
  constructor(game, max, normal, attacking, hurting) {
    super(game, max, normal, attacking, hurting);
  }

  get score() { return 30 * super.score; }

  get powerup() {
    return [new PowerUp(this.game, this.cx, this.cy, 50, this.weapon)];
  }
}
