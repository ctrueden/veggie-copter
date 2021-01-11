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
    var xpos = owner.cx;
    var ypos = owner.cy;
    thing.setCPos(xpos, ypos);
  }

  /** Moves the given thing according to the regen movement style. */
  move() {
    this.syncPos();
    ticks++;

    var regenRate = 20 - thing.power;
    if (regenRate <= 0) regenRate = 1;
    if (ticks % regenRate == 0) {
      // regenerate copter
      var hero = thing.game.copter;
      var hp = hero.hp;
      var max = hero.maxHP;
      if (hp < max) hero.setHP(hp + 1);
    }

    if (ticks % FLUX_RATE == 0) {
      // fluctuate
      long t = ticks / FLUX_RATE;
      var ndx = thing.power - 1;
      if (ndx < 0) ndx = 0;
      else if (ndx > 9) ndx = 9;

      boolean dir = t % (2 * FLUX_RADIUS) >= FLUX_RADIUS;
      var amount = (int) (t % FLUX_RADIUS);
      if (dir) amount = FLUX_RADIUS - amount - 1;
      ndx += amount;

      thing.activateSprite(ndx);
    }
  }

}

class CopterRegen extends Thing {
  MAX_SIZE = 10 + RegenMovement.FLUX_RADIUS;

  static Sprite[] images;

  static {
    var red = Color.pink.getRed();
    var green = Color.pink.getGreen();
    var blue = Color.pink.getBlue();

    images = new Sprite[MAX_SIZE];
    for (var i=0; i<MAX_SIZE; i++) {
      var width = i + 18;
      var img = makeImage(width, 2 * width);
      var ctx = context2d(img);
      var median = width / 2;
      for (var rad=median; rad>=1; rad--) {
        var q = (median - rad) / median;
        ctx.fillStyle = color(red, green, blue, 0.5 * q);
        ctx.fillOval(median - rad, 2 * (median - rad), 2 * rad, 4 * rad);
      }
      images[i] = new Sprite(img);
      images[i].addBox(new BoundingBox(5, 5, 5, 5));
    }
  }

  CopterRegen(thing) {
    super(thing.game);
    setSprites(images);
    type = GOOD_BULLET;
    move = new RegenMovement(this, thing);
  }

  set power(power) {
    super.power = power;
    var size = power - 1;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    activateSprite(size);
    this.move.syncPos();
  }
}

/** Defines veggie copter regen "attack" style. */
class RegenWeapon extends Weapon {
  RegenAttack(t) {
    super(t, "pink", t.game.sprite("icon-regen").image);
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
    this.regen.power = this.power;
    //SoundPlayer.playSound("../assets/laser4.wav");
    return [this.regen];
  }

  set power(power) {
    super.power = power;
    if (this.regen != null) this.regen.power = power;
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) clear();
  }
}
