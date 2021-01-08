/** Defines veggie copter movement. */
class CopterMovement extends MovementStyle {

  const int SPEED = 2;

  boolean left = false;
  boolean right = false;
  boolean up = false;
  boolean down = false;

  CopterMovement(Thing t) {
    super(t);
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
    if (left) xdir -= SPEED; if (right) xdir += SPEED;
    if (up) ydir -= SPEED; if (down) ydir += SPEED;
    xpos += xdir; ypos += ydir;

    var game = this.thing.game;
    var w = game.getWindowWidth(), h = game.getWindowHeight();
    var width = this.thing.getWidth(), height = this.thing.getHeight();
    if (xpos < 1) xpos = 1; if (xpos + width >= w) xpos = w - width - 1;
    if (ypos < 1) ypos = 1; if (ypos + height >= h) ypos = h - height - 1;
    this.thing.setPos(xpos, ypos);
  }

  keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == KeyEvent.VK_LEFT ||
      code == KeyEvent.VK_KP_LEFT) left = true;
    else if (code == KeyEvent.VK_RIGHT ||
      code == KeyEvent.VK_KP_RIGHT) right = true;
    else if (code == KeyEvent.VK_UP ||
      code == KeyEvent.VK_KP_UP) up = true;
    else if (code == KeyEvent.VK_DOWN ||
      code == KeyEvent.VK_KP_DOWN) down = true;
  }

  keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
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
  int current = 0;

  constructor(Thing t) { super(t); }

  /** Gets current attack style. */
  getAttackStyle() {
    if (current < 0) return null;
    return attacks.elementAt(current);
  }

  /** Gets list of linked attack styles. */
  getAttackStyles() {
    var att = new ColoredAttack[attacks.size()];
    attacks.copyInto(att);
    return att;
  }

  /** Adds an attack style to the list of choices. */
  addAttackStyle(ColoredAttack attack) {
    // check whether copter already has this type of attack
    Class c = attack.getClass();
    int size = attacks.size();
    for (int i=0; i<size; i++) {
      if (attacks.elementAt(i).getClass().equals(c)) return;
    }
    attacks.add(attack);
  }

  /** Sets attack style to the given list index. */
  setAttackStyle(int index) {
    if (index < -1 || index >= attacks.size()) return;
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      for (int i=0; i<attacks.size(); i++) {
        ((ColoredAttack) attacks.elementAt(i)).clear();
      }
    }
    else attack.clear();
    current = index;
    attack = getAttackStyle();
    if (attack == null) { // all attack styles
      for (int i=0; i<attacks.size(); i++) {
        ((ColoredAttack) attacks.elementAt(i)).activate();
      }
    }
    else attack.activate();
  }

  reactivateAttackStyle() { setAttackStyle(current); }

  drawWeaponStatus(Graphics g, int x, int y) {
    int size = attacks.size();
    for (int i=0; i<size; i++) {
      ColoredAttack attack = (ColoredAttack) attacks.elementAt(i);
      attack.drawIcon(g, x, y, current < 0 || i == current);
      x += ColoredAttack.ICON_SIZE - 1; // one pixel overlap
    }
  }

  shoot() {
    var attack = getAttackStyle();
    if (attack == null) { // all attack styles
      var v = new Vector();
      for (int i=0; i<attacks.size(); i++) {
        var t = ((ColoredAttack) attacks.elementAt(i)).shoot();
        if (t != null) for (int j=0; j<t.length; j++) v.add(t[j]);
      }
      if (v.size() == 0) return null;
      var shots = new Thing[v.size()];
      v.copyInto(shots);
      return shots;
    }
    return attack.shoot();
  }

  trigger() {
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      Vector v = new Vector();
      for (int i=0; i<attacks.size(); i++) {
        Thing[] t = ((ColoredAttack) attacks.elementAt(i)).trigger();
        if (t != null) for (int j=0; j<t.length; j++) v.add(t[j]);
      }
      if (v.size() == 0) return null;
      Thing[] triggers = new Thing[v.size()];
      v.copyInto(triggers);
      return triggers;
    }
    return attack.trigger();
  }

  setPower(int power) {
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      Vector v = new Vector();
      for (int i=0; i<attacks.size(); i++) {
        ((ColoredAttack) attacks.elementAt(i)).setPower(power);
      }
    }
    else attack.setPower(power);
  }

  getPower() {
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      return ((ColoredAttack) attacks.elementAt(0)).getPower();
    }
    return attack.getPower();
  }

  keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    int size = attacks.size();
    if (code == Keys.ATTACK_STYLE_CYCLE) setAttackStyle((current + 1) % size);
    else if (code == Keys.ALL_ATTACK_STYLES) {
      // turn on all attack styles simultaneously
      setAttackStyle(-1);
    }
    else {
      boolean match = false;
      for (int i=0; i<Keys.ATTACK_STYLES.length; i++) {
        if (code == Keys.ATTACK_STYLES[i]) {
          setAttackStyle(i);
          match = true;
          break;
        }
      }
      if (!match) {
        ColoredAttack attack = getAttackStyle();
        if (attack == null) { // all attack styles
          for (int i=0; i<attacks.size(); i++) {
            ((ColoredAttack) attacks.elementAt(i)).keyPressed(e);
          }
        }
        else attack.keyPressed(e);
      }
    }
  }

  keyReleased(KeyEvent e) {
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      for (int i=0; i<attacks.size(); i++) {
        ((ColoredAttack) attacks.elementAt(i)).keyReleased(e);
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
