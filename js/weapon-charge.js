class ChargeMovement extends MovementStyle {
  constructor(t, owner, x, y) {
    super(t);
    this.owner = owner;
    this.launched = false;
    this.thing.setPos(x, y);
  }

  /** Launches the charge forth. */
  launch() { this.launched = true; }

  move() {
    if (this.launched) {
      var xpos = this.thing.getX(), ypos = this.thing.getY();
      ypos -= 5;
      this.thing.setPos(xpos, ypos);
    }
    else {
      this.thing.setPos(this.owner.getCX() - this.thing.getWidth() / 2,
        this.owner.getY() - this.thing.getHeight() / 2);
    }
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
      var img = makeImage(size, size);
      var ctx = context2d(img);
      int bright = 127 + 128 * i / (MAX_SIZE - 1);
      for (var j=size; j>0; j--) {
        var l = (size - j) / 2;
        //int r = (size + j) / 2;
        var q = bright * (size - j) / size;
        ctx.fillColor = color(q, q, q, q / 255);
        ctx.fillOval(l, l, j, j);
      }
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

  launch() { this.move.launch(); }

  setHP(hp) {
    this.hp = Math.min(hp, this.maxhp);
    setPower(this.hp);
    var size = Math.max(hp - 1, 0);
    this.activateImage(size);
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
