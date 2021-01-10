/** Defines veggie copter movement. */
class CopterMovement extends MovementStyle {
  constructor(t) {
    super(t);
    this.speed = 2;
    reset();
  }

  reset() {
    this.left = this.right = this.up = this.down = false;
    var game = this.thing.getGame();
    this.thing.setPos(game.getWindowWidth() / 2, game.getWindowHeight() - 40);
  }

  /** Moves according to the keyboard presses. */
  move() {
    var xpos = this.thing.getX(), ypos = this.thing.getY();
    var xdir = 0, ydir = 0;
    if (left) xdir -= this.speed; if (right) xdir += this.speed;
    if (up) ydir -= this.speed; if (down) ydir += this.speed;
    xpos += xdir; ypos += ydir;

    var game = this.thing.game;
    var w = game.getWindowWidth(), h = game.getWindowHeight();
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

  Vector attacks = new Vector();
  var current = 0;

  constructor(t) { super(t); }

  /** Gets current attack style. */
  getAttackStyle() {
    return current < 0 ? null : attacks[current];
  }

  /** Gets list of linked attack styles. */
  getAttackStyles() {
    var att = new ColoredAttack[attacks.length];
    attacks.copyInto(att);
    return att;
  }

  /** Adds an attack style to the list of choices. */
  addAttackStyle(attack) {
    // check whether copter already has this type of attack
    Class c = attack.getClass();
    var size = attacks.length;
    for (var i=0; i<size; i++) {
      if (attacks[i].getClass().equals(c)) return;
    }
    attacks.add(attack);
  }

  /** Sets attack style to the given list index. */
  setAttackStyle(index) {
    if (index < -1 || index >= attacks.length) return;
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      for (var i=0; i<attacks.length; i++) {
        attacks[i].clear();
      }
    }
    else attack.clear();
    current = index;
    attack = getAttackStyle();
    if (attack == null) { // all attack styles
      for (var i=0; i<attacks.length; i++) {
        attacks[i].activate();
      }
    }
    else attack.activate();
  }

  reactivateAttackStyle() { setAttackStyle(current); }

  drawWeaponStatus(ctx, x, y) {
    var size = attacks.length;
    for (var i=0; i<size; i++) {
      attacks[i].drawIcon(ctx, x, y, current < 0 || i == current);
      x += ColoredAttack.ICON_SIZE - 1; // one pixel overlap
    }
  }

  shoot() {
    var attack = getAttackStyle();
    if (attack == null) { // all attack styles
      var shots = [];
      for (var i=0; i<attacks.length; i++) {
        var t = attacks[i].shoot();
        if (t != null) for (int j=0; j<t.length; j++) shots.push(t[j]);
      }
      return shots.length == 0 ? null : shots;
    }
    return attack.shoot();
  }

  trigger() {
    var attack = getAttackStyle();
    if (attack == null) { // all attack styles
      var triggers = [];
      for (var i=0; i<attacks.length; i++) {
        var t = attacks[i].trigger();
        if (t != null) for (int j=0; j<t.length; j++) triggers.add(t[j]);
      }
      return triggers.length == 0 ? null : triggers;
    }
    return attack.trigger();
  }

  setPower(power) {
    var attack = getAttackStyle();
    if (attack == null) { // all attack styles
      for (var i=0; i<attacks.length; i++) {
        attacks[i].setPower(power);
      }
    }
    else attack.setPower(power);
  }

  getPower() {
    var attack = getAttackStyle();
    if (attack == null) { // all attack styles
      return attacks[0].getPower();
    }
    return attack.getPower();
  }

  keyPressed(e) {
    var code = e.getKeyCode();
    var size = attacks.length;
    if (code == Keys.ATTACK_STYLE_CYCLE) setAttackStyle((current + 1) % size);
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
        var attack = getAttackStyle();
        if (attack == null) { // all attack styles
          for (var i=0; i<attacks.length; i++) {
            attacks[i].keyPressed(e);
          }
        }
        else attack.keyPressed(e);
      }
    }
  }

  keyReleased(e) {
    var attack = getAttackStyle();
    if (attack == null) { // all attack styles
      for (var i=0; i<attacks.length; i++) {
        attacks[i].keyReleased(e);
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
    var bi = game.loadImage("copter.gif");
    bi.addBox(new BoundingBox(2, 6, 2, 5));
    setImage(bi);
    setMovement(new CopterMovement(this));

    var copterAttack = new CopterAttack(this);
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
    setAttack(copterAttack);

    this.maxhp = this.hp = 100;
    this.type = GOOD;
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
