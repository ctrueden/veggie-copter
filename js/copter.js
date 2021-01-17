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

/**
 * The veggie copter attack style. It consists of a bundle of weapons,
 * only one of which is active at a time.
 */
class CopterAttack extends AttackStyle {
  constructor(t) {
    super(t);
    this.weapons = [];    // the list of available weapons
    this.weaponIndex = 0; // index of the active weapon
  }

  /** Gets the active weapon. */
  get weapon() {
    return this.weaponIndex == null ? null : this.weapons[this.weaponIndex];
  }

  /** Adds a weapon to the list of choices. */
  addWeapon(weapon) {
    // TODO: check whether copter already has this type of weapon
    this.weapons.push(weapon);
  }

  /** Sets weapon to the given list index. */
  activate(index) {
    if (index >= this.weapons.length) return; // out of bounds
    if (this.weapon) this.weapon.clear();
    else this.weapons.forEach(weapon => weapon.clear());
    this.weaponIndex = index;
    if (this.weapon) {
      if (this.thing.game.debug) {
        console.info(`Activating ${this.weapon.constructor.name}`);
      }
      this.weapon.activate();
    }
    else {
      if (this.thing.game.debug) console.info(`Activating ALL WEAPONS MODE!`);
      this.weapons.forEach(weapon => weapon.activate());
    }
  }

  reactivate() { this.activate(this.weaponIndex); }

  drawWeaponStatus(ctx, x, y) {
    for (var i=0; i<this.weapons.length; i++) {
      var active = this.weaponIndex == i || this.weaponIndex == null;
      this.weapons[i].drawIcon(ctx, x, y, active);
      x += this.weapons[i].iconSize - 1; // one pixel overlap
    }
  }

  shoot() {
    if (this.weapon) return this.weapon.shoot();
    // all weapons
    var shots = [];
    this.weapons.forEach(weapon => append(shots, weapon.shoot()));
    return shots;
  }

  trigger() {
    if (this.weapon) return this.weapon.trigger();
    // all weapons
    var triggers = [];
    this.weapons.forEach(weapon => append(triggers, weapon.trigger()));
    return triggers;
  }

  set power(power) {
    if (this.weapon) this.weapon.power = power;
    else if (this.weapons) this.weapons.forEach(weapon => weapon.power = power);
  }

  get power() {
    return this.weapon ? this.weapon.power : this.weapons[0].power;
  }

  keyPressed(e) {
    if (Keys.WEAPON_CYCLE.includes(e.keyCode)) {
      // roll to the next weapon
      this.activate((this.weaponIndex + 1) % this.weapons.length);
    }
    else if (Keys.ALL_WEAPONS.includes(e.keyCode)) {
      // turn on all weapons simultaneously
      this.activate(null);
    }
    else {
      var index = Keys.WEAPONS.indexOf(e.keyCode);
      if (index >= 0) this.activate(index);
      else {
        if (this.weapon) this.weapon.keyPressed(e);
        else this.weapons.forEach(weapon => weapon.keyPressed(e));
      }
    }
  }

  keyReleased(e) {
    if (this.weapon) this.weapon.keyReleased(e);
    else { // all weapons
      this.weapons.forEach(weapon => weapon.keyReleased(e));
    }
  }
}

/** Veggie copter object (the good guy!). */
class Copter extends Thing {
  constructor(game) {
    super(game);
    var sprite = game.loadSprite("copter.gif");
    sprite.addBox(new BoxInsets(2, 6, 2, 5));
    this.setSprite(sprite);
    this.movement = new CopterMovement(this);

    this.attack = new CopterAttack(this);
    this.attack.addWeapon(new GunWeapon(this)); // brown
    //this.attack.addWeapon(new EnergyWeapon(this)); // orange
    //this.attack.addWeapon(new SplitterWeapon(this)); // yellow
    //this.attack.addWeapon(new LaserWeapon(this)); // green
    this.attack.addWeapon(new TornadoWeapon(this)); // spring green
    this.attack.addWeapon(new LitWeapon(this)); // cyan
    //this.attack.addWeapon(new SpreadWeapon(this)); // blue
    //this.attack.addWeapon(new ShieldWeapon(this)); // purple
    //this.attack.addWeapon(new HomingWeapon(this)); // magenta
    //this.attack.addWeapon(new RegenWeapon(this)); // pink
    //this.attack.addWeapon(new ChargeWeapon(this)); // white
    this.attack.addWeapon(new RailWeapon(this)); // white
    //this.attack.addWeapon(new GrayWeapon(this)); // gray
    //this.attack.addWeapon(new MineWeapon(this)); // dark gray
    //this.attack.addWeapon(new DoomWeapon(this)); // black

    this.hp = this.maxHP = 100;
    this.type = ThingTypes.GOOD;
  }

  reset() { this.movement.reset(); }

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
