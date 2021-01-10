class ChargeMovement extends MovementStyle {

  private Thing owner;
  private boolean launched = false;


  // -- Constructor --

  public ChargeMovement(Thing t, Thing owner, float x, float y) {
    super(t);
    this.owner = owner;
    thing.setPos(x, y);
  }


  // -- ChargeMovement API methods --

  /** Launches the charge forth. */
  public void launch() { launched = true; }


  // -- MovementStyle API methods --

  /** Moves the charge according to the charge movement style. */
  public void move() {
    if (launched) {
      float xpos = thing.getX(), ypos = thing.getY();
      ypos -= 5;
      thing.setPos(xpos, ypos);
    }
    else thing.setPos(owner.getCX() - thing.getWidth() / 2f,
      owner.getY() - thing.getHeight() / 2f);
  }
}

class CopterCharge extends Thing {
  private static final int GROWTH_RATE = 10;
  private static final int MAX_SIZE = 20;

  protected static BoundedImage[] images;

  static {
    images = new BoundedImage[MAX_SIZE];
    for (int i=0; i<MAX_SIZE; i++) {
      int size = 2 * i + 12;
      BufferedImage img = ImageTools.makeImage(size, size);
      Graphics g = img.createGraphics();
      int bright = 127 + 128 * i / (MAX_SIZE - 1);
      for (int j=size; j>0; j--) {
        int l = (size - j) / 2;
        //int r = (size + j) / 2;
        int q = bright * (size - j) / size;
        g.setColor(new Color(q, q, q, q));
        g.fillOval(l, l, j, j);
      }
      g.dispose();
      images[i] = new BoundedImage(img);
      images[i].addBox(new BoundingBox(1, 1, 1, 1));
    }
  }

  protected int size;

  public CopterCharge(Thing thing) {
    super(thing.getGame());
    setImageList(images);
    type = GOOD_BULLET;
    size = -1;
    grow();
    float x = thing.getCX() - getWidth(), y = thing.getY();
    move = new ChargeMovement(this, thing, x, y);
  }

  public boolean grow() {
    if (size == MAX_SIZE - 11 + GROWTH_RATE) return false;
    size++;
    maxhp = size + 1;
    setHP(maxhp);
    return true;
  }

  public void launch() { ((ChargeMovement) move).launch(); }

  public void setHP(int hp) {
    if (hp > maxhp) hp = maxhp;
    this.hp = hp;
    setPower(hp);
    size = hp - 1;
    if (size < 0) size = 0;
    setImageIndex(size);
  }
}

/** Defines veggie copter charge attack style. */
class ChargeWeapon extends Weapon {
  GROW_SPEED = 11;

  constructor(t) {
    super(t, Color.white, t.getGame().loadImage("icon-charge.png").getImage());
    this.charge = null;
    this.space = false;
    this.ticks = 0;
  }

  launch() {
    if (this.charge == null) return;
    this.charge.launch();
    this.charge = null;
  }

  clear() {
    this.space = false;
    launch();
  }

  /** Fires a shot if space bar is pressed. */
  shoot() {
    if (!this.space) return null;

    if (this.charge == null) {
      this.ticks = 0;
      this.charge = new CopterCharge(thing);
      return [this.charge];
    }
    this.ticks++;
    var rate = GROW_SPEED - this.power;
    if (rate <= 0) rate = 1;
    if (this.ticks % rate == 0) {
      if (!this.charge.grow()) launch();
    }
    return null;
  }

  keyPressed(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) this.space = true;
  }

  keyReleased(e) {
    var code = e.getKeyCode();
    if (code == Keys.SHOOT) clear();
  }
}
