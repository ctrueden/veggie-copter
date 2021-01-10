class RegenMovement extends MovementStyle {
  FLUX_RADIUS = 5;
  FLUX_RATE = 4;

  RegenMovement(t, owner) {
    super(t);
    this.owner = owner;
    this.ticks = 0;
    syncPos();
  }

  syncPos() {
    var xpos = owner.getCX();
    var ypos = owner.getCY();
    thing.setCPos(xpos, ypos);
  }

  /** Moves the given thing according to the regen movement style. */
  move() {
    syncPos();
    ticks++;

    var regenRate = 20 - thing.getPower();
    if (regenRate <= 0) regenRate = 1;
    if (ticks % regenRate == 0) {
      // regenerate copter
      Copter hero = thing.getGame().getCopter();
      var hp = hero.getHP();
      var max = hero.getMaxHP();
      if (hp < max) hero.setHP(hp + 1);
    }

    if (ticks % FLUX_RATE == 0) {
      // fluctuate
      long t = ticks / FLUX_RATE;
      var ndx = thing.getPower() - 1;
      if (ndx < 0) ndx = 0;
      else if (ndx > 9) ndx = 9;

      boolean dir = t % (2 * FLUX_RADIUS) >= FLUX_RADIUS;
      var amount = (int) (t % FLUX_RADIUS);
      if (dir) amount = FLUX_RADIUS - amount - 1;
      ndx += amount;

      thing.setImageIndex(ndx);
    }
  }

}

class CopterRegen extends Thing {

  MAX_SIZE = 10 + RegenMovement.FLUX_RADIUS;

  static BoundedImage[] images;

  static {
    var red = Color.pink.getRed();
    var green = Color.pink.getGreen();
    var blue = Color.pink.getBlue();

    images = new BoundedImage[MAX_SIZE];
    for (var i=0; i<MAX_SIZE; i++) {
      var width = i + 18;
      BufferedImage img = ImageTools.makeImage(width, 2 * width);
      Graphics g = img.createGraphics();
      var median = width / 2;
      for (int rad=median; rad>=1; rad--) {
        var q = (double) (median - rad) / median;
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
    var size = power - 1;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImageIndex(size);
    ((RegenMovement) move).syncPos();
  }

}

/** Defines veggie copter regen "attack" style. */
class RegenWeapon extends Weapon {
  RegenAttack(t) {
    super(t, Color.pink, t.getGame().loadImage("icon-regen.png").getImage());
    clear();
  }

  clear() {
    this.space = false;
    if (this.regen != null) this.regen.setHP(0);
    this.regen = null;
  }

  /** Begins regeneration if space bar is pressed. */
  shoot() {
    if (!this.space || this.regen != null) return null;
    this.regen = new CopterRegen(this.thing);
    this.regen.setPower(this.power);
    //SoundPlayer.playSound("../assets/laser4.wav");
    return [this.regen];
  }

  setPower(power) {
    super.setPower(power);
    if (this.regen != null) this.regen.setPower(power);
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
