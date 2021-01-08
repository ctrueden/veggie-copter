class RegenMovement extends MovementStyle {

  const int FLUX_RADIUS = 5;
  const int FLUX_RATE = 4;

  private Thing owner;
  private long ticks;

  RegenMovement(t, owner) {
    super(t);
    this.owner = owner;
    syncPos();
  }

  syncPos() {
    float xpos = owner.getCX();
    float ypos = owner.getCY();
    thing.setCPos(xpos, ypos);
  }

  /** Moves the given thing according to the regen movement style. */
  move() {
    syncPos();
    ticks++;

    int regenRate = 20 - thing.getPower();
    if (regenRate <= 0) regenRate = 1;
    if (ticks % regenRate == 0) {
      // regenerate copter
      Copter hero = thing.getGame().getCopter();
      int hp = hero.getHP();
      int max = hero.getMaxHP();
      if (hp < max) hero.setHP(hp + 1);
    }

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

class CopterRegen extends Thing {

  const int MAX_SIZE = 10 + RegenMovement.FLUX_RADIUS;

  static BoundedImage[] images;

  static {
    int red = Color.pink.getRed();
    int green = Color.pink.getGreen();
    int blue = Color.pink.getBlue();

    images = new BoundedImage[MAX_SIZE];
    for (int i=0; i<MAX_SIZE; i++) {
      int width = i + 18;
      BufferedImage img = ImageTools.makeImage(width, 2 * width);
      Graphics g = img.createGraphics();
      int median = width / 2;
      for (int rad=median; rad>=1; rad--) {
        double q = (double) (median - rad) / median;
        g.setColor(new Color(red, green, blue, (int) (128 * q)));
        g.fillOval(median - rad, 2 * (median - rad), 2 * rad, 4 * rad);
      }
      g.dispose();
      images[i] = new BoundedImage(img);
      images[i].addBox(new BoundingBox(5, 5, 5, 5));
    }
  }

  CopterRegen(thing) {
    super(thing.getGame());
    setImageList(images);
    type = GOOD_BULLET;
    move = new RegenMovement(this, thing);
  }

  setPower(power) {
    super.setPower(power);
    int size = power - 1;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImageIndex(size);
    ((RegenMovement) move).syncPos();
  }

}

/** Defines veggie copter regen "attack" style. */
class RegenAttack extends ColoredAttack {

  boolean space;
  CopterRegen regen;

  RegenAttack(t) {
    super(t, Color.pink, t.getGame().loadImage("icon-regen.png").getImage());
  }

  clear() {
    space = false;
    if (regen != null) regen.setHP(0);
    regen = null;
  }

  /** Begins regeneration if space bar is pressed. */
  Thing[] shoot() {
    if (!space || regen != null) return null;
    regen = new CopterRegen(thing);
    regen.setPower(power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {regen};
  }

  setPower(power) {
    super.setPower(power);
    if (regen != null) regen.setPower(power);
  }

  keyPressed(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  keyReleased(e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) clear();
  }

}
