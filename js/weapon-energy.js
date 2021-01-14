class EnergyMovement extends MovementStyle {
  public static final int FLUX_RADIUS = 5;
  protected static final int FLUX_RATE = 4;

  private Thing owner;
  private long ticks;

  public EnergyMovement(Thing t, Thing owner) {
    super(t);
    this.owner = owner;
    syncPos();
  }

  public void syncPos() {
    float xpos = owner.getCX();
    float ypos = owner.getCY();
    thing.setCPos(xpos, ypos);
  }

  /** Moves the given thing according to the energy movement style. */
  public void move() {
    syncPos();
    ticks++;

    Copter hero = thing.getGame().getCopter();
    float cx1 = hero.getX();
    float cx2 = cx1 + hero.getWidth();
    float cy = hero.getY();
    float x1 = owner.getX();
    float x2 = x1 + owner.getWidth();
    float y = owner.getCY();
    if (owner.isDead() || cx2 < x1 || cx1 > x2 || cy < y) thing.setHP(0);

    if (ticks % FLUX_RATE == 0) {
      // fluctuate
      long t = ticks / FLUX_RATE;
      int ndx = thing.getPower() - 1;
      if (ndx < 0) ndx = 0;
      else if (ndx > 9) ndx = 9;

      boolean dir = t % (2 * FLUX_RADIUS) >= FLUX_RADIUS;
      int amount = (int) (t % FLUX_RADIUS);
      if (dir) amount = FLUX_RADIUS - amount - 1;
      ndx += amount;

      thing.setImageIndex(ndx);
    }
  }
}

class CopterEnergy extends Thing {
  protected static final int MAX_SIZE = 10 + EnergyMovement.FLUX_RADIUS;

  protected static BoundedImage[] images;

  static {
    int red = Color.orange.getRed();
    int green = Color.orange.getGreen();
    int blue = Color.orange.getBlue();

    images = new BoundedImage[MAX_SIZE];
    for (int i=0; i<MAX_SIZE; i++) {
      int size = 4 * i + 30;
      BufferedImage img = ImageTools.makeImage(size, size);
      Graphics g = img.createGraphics();
      int median = size / 2;
      for (int rad=median; rad>=1; rad--) {
        double q = (double) (median - rad) / median;
        g.setColor(new Color(red, green, blue, (int) (128 * q)));
        g.fillOval(median - rad, median - rad, 2 * rad, 2 * rad);
      }
      g.dispose();
      images[i] = new BoundedImage(img);
      images[i].addBox(new BoundingBox(5, 5, 5, 5));
    }
  }

  public CopterEnergy(Thing thing) {
    super(thing.getGame());
    setImageList(images);
    type = GOOD_BULLET;
    move = new EnergyMovement(this, thing);
    maxhp = hp = Integer.MAX_VALUE;
  }

  public void setPower(int power) {
    super.setPower(power);
    int size = power - 1;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImageIndex(size);
    ((EnergyMovement) move).syncPos();
  }

  /** Draws the object onscreen. */
  public void draw(Graphics g) {
    Copter hero = getGame().getCopter();
    float hcx = hero.getCX();
    float cx = getCX();
    float xdiff = hcx - cx;
    if (xdiff < 0) xdiff = -xdiff;
    int red = Color.orange.getRed();
    int green = Color.orange.getGreen();
    int blue = Color.orange.getBlue();
    float maxDiff = (hero.getWidth() + getWidth()) / 2f;
    float q = (maxDiff - xdiff) / maxDiff;
    if (q < 0) q = 0;
    red = (int) (q * red);
    green = (int) (q * green);
    blue = (int) (q * blue);
    g.setColor(new Color(red, green, blue));
    g.drawLine((int) hcx, (int) hero.getY(), (int) cx, (int) getCY());
    super.draw(g);
  }
}

/** Defines veggie copter energy field attack style. */
class EnergyWeapon extends Weapon {

  space, fired;
  CopterEnergy energy;

  EnergyAttack(t) {
    super(t, "Orange", t.game.loadSprite("icon-energy").image);
  }

  clear() {
    space = false;
    fired = false;
    if (energy) energy.hp = 0;
    energy = null;
  }

  /** Begins energy field if space bar is pressed. */
  shoot() {
    if (!space || fired) return [];
    fired = true;

    var game = thing.game;
    var copter = game.copter;
    var cx1 = copter.xpos;
    var cx2 = cx1 + copter.width;
    var cy = copter.ypos;
    var ndx = -1;
    var dist = Integer.MAX_VALUE;
    for (var i=0; i<this.things.length; i++) {
      var thing = things[i];
      if (thing.type != ThingTypes.EVIL) continue;
      var x1 = thing.xpos;
      var x2 = x1 + thing.width;
      var y = thing.cy;
      if (y >= cy || cx2 < x1 || cx1 > x2) continue;
      var ndist = cy - y;
      if (dist < ndist) continue;
      dist = ndist;
      ndx = i;
    }
    if (ndx < 0) return [];
    energy = new CopterEnergy(t[ndx]);
    energy.power = power;
    return [energy];
  }

  set power(power) {
    super.power = power;
    if (energy) energy.power = power;
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) clear();
  }

}
