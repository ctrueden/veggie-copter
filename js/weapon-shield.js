class ShieldMovement extends MovementStyle {

  const var SPEED = 0.1f;
  MIN_RADIUS = 30;
  MAX_RADIUS = 63;
  RADIUS_INC = 3;

  Thing owner;
  var angle;
  var radius;
  boolean extended;

  ShieldMovement(t, owner, angle) {
    super(t);
    this.owner = owner;
    this.angle = angle;
    radius = 0;
    var xpos = owner.cx + radius * (float) Math.cos(angle);
    var ypos = owner.cy + radius * (float) Math.sin(angle);
    thing.setCPos(xpos, ypos);
  }

  setExtended(extended) { this.extended = extended; }

  /** Moves the given thing according to the bullet movement style. */
  move() {
    var speed = SPEED - thing.getPower() * SPEED / 20;
    if (speed < 0) speed = 0;
    angle += speed;
    var targetRadius = extended ? MAX_RADIUS : MIN_RADIUS;
    if (radius < targetRadius) radius += RADIUS_INC;
    else if (radius > targetRadius) radius -= RADIUS_INC;
    while (angle > 2 * Math.PI) angle -= 2 * Math.PI;
    var xpos = owner.cx + radius * (float) Math.cos(angle);
    var ypos = owner.cy + radius * (float) Math.sin(angle);
    thing.setCPos(xpos, ypos);
  }

}

class CopterShield extends Thing {

  SIZE = 7;

  static Sprite[] images;
  static var count = 0;

  CopterShield(thing, angle) {
    super(thing.game);
    type = GOOD;
    move = new ShieldMovement(this, thing, angle);
    if (images == null) {
      images = new Sprite[] {
        game.sprite("james-spade"),
        game.sprite("james-heart"),
        game.sprite("james-diamond"),
        game.sprite("james-club")
      };
      for (var i=0; i<images.length; i++) images[i].addBox(new BoundingBox());
    }
    setSprite(images[count % images.length]);
    count++;
  }

  setExtended(extended) {
    this.move.setExtended(extended);
  }

  /** Shields cannot be destroyed. */
  hit(damage) { }

}

/** Defines veggie copter shield attack style. */
class ShieldWeapon extends Weapon {

  const Color PURPLE = new Color(0.7f, 0, 0.7f);

  CopterShield[] shields;
  boolean extended;

  ShieldAttack(t) {
    super(t, PURPLE, t.game.sprite("icon-shield.png").image);
  }

  setExtended(extended) {
    this.extended = extended;
    if (shields != null) {
      for (var i=0; i<shields.length; i++) shields[i].setExtended(extended);
    }
  }

  activate() {
    var num = power + 1;
    shields = new CopterShield[num];
    VeggieCopter game = thing.game;
    for (var i=0; i<num; i++) {
      shields[i] = new CopterShield(thing, (float) (2 * Math.PI * i / num));
      shields[i].setPower(1);
      game.addThing(shields[i]);
    }
    setExtended(extended);
  }

  clear() {
    if (shields != null) {
      for (var i=0; i<shields.length; i++) shields[i].setHP(0);
      shields = null;
      extended = false;
    }
  }

  Thing[] shoot() {
    return null;
  }

  setPower(power) {
    super.setPower(power);
    if (shields != null) {
      for (var i=0; i<shields.length; i++) shields[i].setHP(0);
    }
    activate();
  }

  keyPressed(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) setExtended(true);
  }

  keyReleased(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) setExtended(false);
  }

}
