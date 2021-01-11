/** Defines veggie copter movement. */
class CopterMovement extends MovementStyle {
  constructor(t) {
    super(t);
    this.speed = 2;
    this.reset();
  }

  reset() {
    this.left = this.right = this.up = this.down = false;
    var game = this.thing.game;
    this.thing.setPos(game.width / 2, game.height - 40);
  }

  /** Moves according to the keyboard presses. */
  move() {
    var xpos = this.thing.xpos, ypos = this.thing.ypos;
    var xdir = 0, ydir = 0;
    if (this.left) xdir -= this.speed;
    if (this.right) xdir += this.speed;
    if (this.up) ydir -= this.speed;
    if (this.down) ydir += this.speed;
    xpos += xdir; ypos += ydir;

    var game = this.thing.game;
    var w = game.width, h = game.height;
    var width = this.thing.width, height = this.thing.height;
    if (xpos < 1) xpos = 1; if (xpos + width >= w) xpos = w - width - 1;
    if (ypos < 1) ypos = 1; if (ypos + height >= h) ypos = h - height - 1;
    this.thing.setPos(xpos, ypos);
  }

  keyPressed(e) {
    if (Keys.MOVE_LEFT.includes(e.keyCode)) this.left = true;
    else if (Keys.MOVE_RIGHT.includes(e.keyCode)) this.right = true;
    else if (Keys.MOVE_UP.includes(e.keyCode)) this.up = true;
    else if (Keys.MOVE_DOWN.includes(e.keyCode)) this.down = true;
  }

  keyReleased(e) {
    if (Keys.MOVE_LEFT.includes(e.keyCode)) this.left = false;
    else if (Keys.MOVE_RIGHT.includes(e.keyCode)) this.right = false;
    else if (Keys.MOVE_UP.includes(e.keyCode)) this.up = false;
    else if (Keys.MOVE_DOWN.includes(e.keyCode)) this.down = false;
  }
}

/** Defines veggie copter attack. */
class CopterAttack extends AttackStyle {
  constructor(t) {
    super(t);
    this.attacks = [];
    this.activeIndex = 0;
  }

  /** Gets the active attack style. */
  get activeAttack() {
    return this.activeIndex == null ? null : this.attacks[this.activeIndex];
  }

  /** Adds an attack style to the list of choices. */
  addAttackStyle(attack) {
    // TODO: check whether copter already has this type of attack
    this.attacks.push(attack);
  }

  /** Sets attack style to the given list index. */
  activate(index) {
    if (index >= this.attacks.length) return; // out of bounds
    if (this.activeAttack != null) this.activeAttack.clear();
    else this.attacks.forEach(attack => attack.clear());
    this.activeIndex = index;
    if (this.activeAttack != null) this.activeAttack.activate();
    else this.attacks.forEach(attack => attack.activate());
  }

  reactivate() { this.activate(this.activeIndex); }

  drawWeaponStatus(ctx, x, y) {
    var size = this.attacks.length;
    for (var i=0; i<size; i++) {
      this.attacks[i].drawIcon(ctx, x, y, this.activeIndex == null || i == this.activeIndex);
      x += this.attacks[i].iconSize - 1; // one pixel overlap
    }
  }

  shoot() {
    if (this.activeAttack != null) return this.activeAttack.shoot();
    // all attack styles
    var shots = [];
    for (var i=0; i<this.attacks.length; i++) {
      var t = this.attacks[i].shoot();
      if (t != null) for (var j=0; j<t.length; j++) shots.push(t[j]);
    }
    return shots.length == 0 ? null : shots;
  }

  trigger() {
    if (this.activeAttack != null) return this.activeAttack.trigger();
    // all attack styles
    var triggers = [];
    for (var i=0; i<this.attacks.length; i++) {
      var t = this.attacks[i].trigger();
      if (t != null) for (var j=0; j<t.length; j++) triggers.add(t[j]);
    }
    return triggers.length == 0 ? null : triggers;
  }

  set power(power) {
    if (this.activeAttack != null) this.activeAttack.power = power;
    else if (this.attacks) this.attacks.forEach(attack => attack.power = power);
  }

  get power() {
    return this.activeAttack != null ? this.activeAttack.power : this.attacks[0].power;
  }

  keyPressed(e) {
    if (Keys.WEAPON_CYCLE.includes(e.keyCode)) {
      // roll to the next attack mode
      this.activate((this.activeIndex + 1) % this.attacks.length);
    }
    else if (Keys.ALL_WEAPONS.includes(e.keyCode)) {
      // turn on all attack styles simultaneously
      this.activate(null);
    }
    else {
      var index = Keys.WEAPONS.indexOf(e.keyCode);
      if (index >= 0) this.activate(index);
      else {
        if (this.activeAttack != null) this.activeAttack.keyPressed(e);
        else this.attacks.forEach(attack => attack.keyPressed(e));
      }
    }
  }

  keyReleased(e) {
    var attack = this.attackStyle;
    if (attack == null) { // all attack styles
      this.attacks.forEach(attack => attack.keyReleased(e));
    }
    else attack.keyReleased(e);
  }
}

/** Veggie copter object (the good guy!). */
class Copter extends Thing {

  /** Constructs a copter object. */
  constructor(game) {
    super(game);
    var sprite = game.sprite("copter.gif");
    sprite.addBox(new BoundingBox(2, 6, 2, 5));
    this.setSprite(sprite);
    this.move = new CopterMovement(this);

    var copterAttack = new CopterAttack(this);
    /*
    copterAttack.addAttackStyle(new GunAttack(this)); // brown
    copterAttack.addAttackStyle(new EnergyAttack(this)); // orange
    copterAttack.addAttackStyle(new SplitterAttack(this)); // yellow
    copterAttack.addAttackStyle(new LaserAttack(this)); // green
    copterAttack.addAttackStyle(new LitAttack(this)); // cyan
    copterAttack.addAttackStyle(new SpreadAttack(this)); // blue
    copterAttack.addAttackStyle(new ShieldAttack(this)); // purple
    copterAttack.addAttackStyle(new HomingAttack(this)); // magenta
    copterAttack.addAttackStyle(new RegenAttack(this)); // pink
    copterAttack.addAttackStyle(new ChargeAttack(this)); // white
    copterAttack.addAttackStyle(new GrayAttack(this)); // gray
    copterAttack.addAttackStyle(new MineAttack(this)); // dark gray
    copterAttack.addAttackStyle(new DoomAttack(this)); // black
    */
    this.attack = copterAttack;

    this.maxHP = this.hp = 100;
    this.type = ThingTypes.GOOD;
  }

  reset() { this.move.reset(); }

  drawWeaponStatus(ctx, x, y) {
    this.attack.drawWeaponStatus(ctx, x, y);
  }

  /** Handles keyboard presses. */
  keyPressed(e) {
    if (Keys.POWER_UP.includes(e.keyCode)) this.attack.power++;
    else if (Keys.POWER_DOWN.includes(e.keyCode)) this.attack.power--;
    super.keyPressed(e);
  }
}
