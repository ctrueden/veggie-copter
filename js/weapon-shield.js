class ShieldMovement extends MovementStyle {

  const float SPEED = 0.1f;
  const int MIN_RADIUS = 30;
  const int MAX_RADIUS = 63;
  const int RADIUS_INC = 3;

  Thing owner;
  float angle;
  int radius;
  boolean extended;

  ShieldMovement(Thing t, Thing owner, float angle) {
    super(t);
    this.owner = owner;
    this.angle = angle;
    radius = 0;
    float xpos = owner.getCX() + radius * (float) Math.cos(angle);
    float ypos = owner.getCY() + radius * (float) Math.sin(angle);
    thing.setCPos(xpos, ypos);
  }

  setExtended(boolean extended) { this.extended = extended; }

  /** Moves the given thing according to the bullet movement style. */
  move() {
    float speed = SPEED - thing.getPower() * SPEED / 20;
    if (speed < 0) speed = 0;
    angle += speed;
    int targetRadius = extended ? MAX_RADIUS : MIN_RADIUS;
    if (radius < targetRadius) radius += RADIUS_INC;
    else if (radius > targetRadius) radius -= RADIUS_INC;
    while (angle > 2 * Math.PI) angle -= 2 * Math.PI;
    float xpos = owner.getCX() + radius * (float) Math.cos(angle);
    float ypos = owner.getCY() + radius * (float) Math.sin(angle);
    thing.setCPos(xpos, ypos);
  }

}

class CopterShield extends Thing {

  const int SIZE = 7;

  static BoundedImage[] images;
  static int count = 0;

  CopterShield(Thing thing, float angle) {
    super(thing.getGame());
    type = GOOD;
    move = new ShieldMovement(this, thing, angle);
    if (images == null) {
      images = new BoundedImage[] {
        game.loadImage("james-spade.png"),
        game.loadImage("james-heart.png"),
        game.loadImage("james-diamond.png"),
        game.loadImage("james-club.png")
      };
      for (int i=0; i<images.length; i++) images[i].addBox(new BoundingBox());
    }
    setImage(images[count % images.length]);
    count++;
  }

  setExtended(boolean extended) {
    ((ShieldMovement) move).setExtended(extended);
  }

  /** Shields cannot be destroyed. */
  hit(int damage) { }

}

/** Defines veggie copter shield attack style. */
class ShieldAttack extends ColoredAttack {

  const Color PURPLE = new Color(0.7f, 0, 0.7f);

  CopterShield[] shields;
  boolean extended;

  ShieldAttack(Thing t) {
    super(t, PURPLE, t.getGame().loadImage("icon-shield.png").getImage());
  }

  setExtended(boolean extended) {
    this.extended = extended;
    if (shields != null) {
      for (int i=0; i<shields.length; i++) shields[i].setExtended(extended);
    }
  }

  activate() {
    int num = power + 1;
    shields = new CopterShield[num];
    VeggieCopter game = thing.getGame();
    for (int i=0; i<num; i++) {
      shields[i] = new CopterShield(thing, (float) (2 * Math.PI * i / num));
      shields[i].setPower(1);
      game.addThing(shields[i]);
    }
    setExtended(extended);
  }

  clear() {
    if (shields != null) {
      for (int i=0; i<shields.length; i++) shields[i].setHP(0);
      shields = null;
      extended = false;
    }
  }

  Thing[] shoot() {
    return null;
  }

  setPower(int power) {
    super.setPower(power);
    if (shields != null) {
      for (int i=0; i<shields.length; i++) shields[i].setHP(0);
    }
    activate();
  }

  keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) setExtended(true);
  }

  keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) setExtended(false);
  }

}
