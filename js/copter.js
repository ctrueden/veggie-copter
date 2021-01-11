/** Defines veggie copter movement. */
class CopterMovement extends MovementStyle {
  constructor(t) {
    super(t);
    this.speed = 2;
    this.reset();
  }

  reset() {
    this.left = this.right = this.up = this.down = false;
    var game = this.thing.getGame();
    this.thing.setPos(game.width / 2, game.height - 40);
  }

  /** Moves according to the keyboard presses. */
  move() {
    var xpos = this.thing.getX(), ypos = this.thing.getY();
    var xdir = 0, ydir = 0;
    if (left) xdir -= this.speed; if (right) xdir += this.speed;
    if (up) ydir -= this.speed; if (down) ydir += this.speed;
    xpos += xdir; ypos += ydir;

    var game = this.thing.game;
    var w = game.width, h = game.height;
    var width = this.thing.getWidth(), height = this.thing.getHeight();
    if (xpos < 1) xpos = 1; if (xpos + width >= w) xpos = w - width - 1;
    if (ypos < 1) ypos = 1; if (ypos + height >= h) ypos = h - height - 1;
    this.thing.setPos(xpos, ypos);
  }

  keyPressed(e) {
    var code = e.getKeyCode();
    if (code == KeyEvent.VK_LEFT ||
      code == KeyEvent.VK_KP_LEFT) left = true;
    else if (code == KeyEvent.VK_RIGHT ||
      code == KeyEvent.VK_KP_RIGHT) right = true;
    else if (code == KeyEvent.VK_UP ||
      code == KeyEvent.VK_KP_UP) up = true;
    else if (code == KeyEvent.VK_DOWN ||
      code == KeyEvent.VK_KP_DOWN) down = true;
  }

  keyReleased(e) {
    var code = e.getKeyCode();
    if (code == KeyEvent.VK_LEFT ||
      code == KeyEvent.VK_KP_LEFT) left = false;
    else if (code == KeyEvent.VK_RIGHT ||
      code == KeyEvent.VK_KP_RIGHT) right = false;
    else if (code == KeyEvent.VK_UP ||
      code == KeyEvent.VK_KP_UP) up = false;
    else if (code == KeyEvent.VK_DOWN ||
      code == KeyEvent.VK_KP_DOWN) down = false;
  }
}

/** Defines veggie copter attack. */
class CopterAttack extends AttackStyle {
  constructor(t) {
    super(t);
    this.attacks = [];
    this.current = 0;
  }

  /** Gets current attack style. */
  getAttackStyle() {
    return this.current < 0 ? null : this.attacks[this.current];
  }

  /** Gets list of linked attack styles. */
  getAttackStyles() {
    return this.attacks.splice();
  }

  /** Adds an attack style to the list of choices. */
  addAttackStyle(attack) {
    // TODO: check whether copter already has this type of attack
    this.attacks.push(attack);
  }

  /** Sets attack style to the given list index. */
  setAttackStyle(index) {
    if (index < -1 || index >= this.attacks.length) return;
    var attack = this.getAttackStyle();
    if (attack == null) { // all attack styles
      for (var i=0; i<this.attacks.length; i++) {
        this.attacks[i].clear();
      }
    }
    else attack.clear();
    this.current = index;
    attack = this.getAttackStyle();
    if (attack == null) { // all attack styles
      for (var i=0; i<this.attacks.length; i++) {
        this.attacks[i].activate();
      }
    }
    else attack.activate();
  }

  reactivateAttackStyle() { this.setAttackStyle(this.current); }

  drawWeaponStatus(ctx, x, y) {
    var size = this.attacks.length;
    for (var i=0; i<size; i++) {
      this.attacks[i].drawIcon(ctx, x, y, this.current < 0 || i == this.current);
      x += this.attacks[i].iconSize - 1; // one pixel overlap
    }
  }

  shoot() {
    var attack = this.getAttackStyle();
    if (attack == null) { // all attack styles
      var shots = [];
      for (var i=0; i<this.attacks.length; i++) {
        var t = this.attacks[i].shoot();
        if (t != null) for (var j=0; j<t.length; j++) shots.push(t[j]);
      }
      return shots.length == 0 ? null : shots;
    }
    return attack.shoot();
  }

  trigger() {
    var attack = this.getAttackStyle();
    if (attack == null) { // all attack styles
      var triggers = [];
      for (var i=0; i<this.attacks.length; i++) {
        var t = this.attacks[i].trigger();
        if (t != null) for (var j=0; j<t.length; j++) triggers.add(t[j]);
      }
      return triggers.length == 0 ? null : triggers;
    }
    return attack.trigger();
  }

  setPower(power) {
    var attack = this.getAttackStyle();
    if (attack == null) { // all attack styles
      for (var i=0; i<this.attacks.length; i++) {
        this.attacks[i].setPower(power);
      }
    }
    else attack.setPower(power);
  }

  getPower() {
    var attack = this.getAttackStyle();
    if (attack == null) { // all attack styles
      return this.attacks[0].getPower();
    }
    return attack.getPower();
  }

  keyPressed(e) {
    var code = e.getKeyCode();
    var size = this.attacks.length;
    if (code == Keys.ATTACK_STYLE_CYCLE) setAttackStyle((this.current + 1) % size);
    else if (code == Keys.ALL_ATTACK_STYLES) {
      // turn on all attack styles simultaneously
      setAttackStyle(-1);
    }
    else {
      var match = false;
      for (var i=0; i<Keys.ATTACK_STYLES.length; i++) {
        if (code == Keys.ATTACK_STYLES[i]) {
          setAttackStyle(i);
          match = true;
          break;
        }
      }
      if (!match) {
        var attack = this.getAttackStyle();
        if (attack == null) { // all attack styles
          for (var i=0; i<this.attacks.length; i++) {
            this.attacks[i].keyPressed(e);
          }
        }
        else attack.keyPressed(e);
      }
    }
  }

  keyReleased(e) {
    var attack = this.getAttackStyle();
    if (attack == null) { // all attack styles
      for (var i=0; i<this.attacks.length; i++) {
        this.attacks[i].keyReleased(e);
      }
    }
    else attack.keyReleased(e);
  }
}

/** Veggie copter object (the good guy!). */
class Copter extends Thing {

  /** Constructs a copter object. */
  constructor(game) {
    super(game);
    var bi = game.loadImage("../assets/copter.gif");
    bi.addBox(new BoundingBox(2, 6, 2, 5));
    this.setImages({hero: bi}, 'hero');
    this.setMovement(new CopterMovement(this));

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
    this.setAttack(copterAttack);

    this.maxhp = this.hp = 100;
    this.type = ThingTypes.GOOD;
  }

  reset() { this.move.reset(); }

  drawWeaponStatus(ctx, x, y) {
    this.attack.drawWeaponStatus(ctx, x, y);
  }

  /** Handles keyboard presses. */
  keyPressed(e) {
    var code = e.getKeyCode();
    if (code == Keys.POWER_UP) {
      var pow = this.attack.getPower();
      pow++;
      this.attack.setPower(pow);
    }
    else if (code == Keys.POWER_DOWN) {
      var pow = this.attack.getPower();
      if (pow > 1) pow--;
      this.attack.setPower(pow);
    }
    super.keyPressed(e);
  }
}
