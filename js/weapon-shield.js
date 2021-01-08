

public class ShieldMovement extends MovementStyle {

  protected static final float SPEED = 0.1f;
  protected static final int MIN_RADIUS = 30;
  protected static final int MAX_RADIUS = 63;
  protected static final int RADIUS_INC = 3;

  protected Thing owner;
  protected float angle;
  protected int radius;
  protected boolean extended;

  public ShieldMovement(Thing t, Thing owner, float angle) {
    super(t);
    this.owner = owner;
    this.angle = angle;
    radius = 0;
    float xpos = owner.getCX() + radius * (float) Math.cos(angle);
    float ypos = owner.getCY() + radius * (float) Math.sin(angle);
    thing.setCPos(xpos, ypos);
  }

  public void setExtended(boolean extended) { this.extended = extended; }

  /** Moves the given thing according to the bullet movement style. */
  public void move() {
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

public class CopterShield extends Thing {

  protected static final int SIZE = 7;

  protected static BoundedImage[] images;
  protected static int count = 0;

  public CopterShield(Thing thing, float angle) {
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

  public void setExtended(boolean extended) {
    ((ShieldMovement) move).setExtended(extended);
  }

  /** Shields cannot be destroyed. */
  public void hit(int damage) { }

}

/** Defines veggie copter shield attack style. */
public class ShieldAttack extends ColoredAttack {

  protected static final Color PURPLE = new Color(0.7f, 0, 0.7f);

  protected CopterShield[] shields;
  protected boolean extended;

  public ShieldAttack(Thing t) {
    super(t, PURPLE, t.getGame().loadImage("icon-shield.png").getImage());
  }

  public void setExtended(boolean extended) {
    this.extended = extended;
    if (shields != null) {
      for (int i=0; i<shields.length; i++) shields[i].setExtended(extended);
    }
  }

  public void activate() {
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

  public void clear() {
    if (shields != null) {
      for (int i=0; i<shields.length; i++) shields[i].setHP(0);
      shields = null;
      extended = false;
    }
  }

  public Thing[] shoot() {
    return null;
  }

  public void setPower(int power) {
    super.setPower(power);
    if (shields != null) {
      for (int i=0; i<shields.length; i++) shields[i].setHP(0);
    }
    activate();
  }

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) setExtended(true);
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) setExtended(false);
  }

}
