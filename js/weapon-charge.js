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
      var xpos = this.thing.xpos, ypos = this.thing.ypos;
      ypos -= 5;
      this.thing.setPos(xpos, ypos);
    }
    else {
      this.thing.setPos(this.owner.cx - this.thing.width / 2,
        this.owner.getY() - this.thing.height / 2);
    }
  }
}

class CopterCharge extends Thing {
  private static final int GROWTH_RATE = 10;
  private static final int MAX_SIZE = 20;

  protected static Sprite[] sprites;

  static {
    sprites = new Sprite[MAX_SIZE];
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
      sprites[i] = new Sprite(img);
      sprites[i].addBox(new BoundingBox(1, 1, 1, 1));
    }
  }

  protected int size;

  public CopterCharge(Thing thing) {
    super(thing.game);
    setSprites(sprites);
    type = GOOD_BULLET;
    size = -1;
    grow();
    float x = thing.cx - width, y = thing.getY();
    move = new ChargeMovement(this, thing, x, y);
  }

  public boolean grow() {
    if (size == MAX_SIZE - 11 + GROWTH_RATE) return false;
    size++;
    maxHP = size + 1;
    setHP(maxHP);
    return true;
  }

  launch() { this.movement.launch(); }

  setHP(hp) {
    this.hp = Math.min(hp, this.maxHP);
    this.power = this.hp;
    var size = Math.max(hp - 1, 0);
    this.activateSprite(size);
  }
}

/** Defines veggie copter charge attack style. */
class ChargeWeapon extends Weapon {
  GROW_SPEED = 11;

  constructor(t) {
    super(t, "white", t.game.loadSprite("icon-charge").image);
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
    if (!this.space) return [];

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
    return [];
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) clear();
  }
}
