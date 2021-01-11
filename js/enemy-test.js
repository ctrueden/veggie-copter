class TestMovement extends MovementStyle {
  constructor(t, x, y) {
    super(t);
    this.thing.setPos(x, y);
    this.timing = false;
    this.ticks = 0;
  }

  startTimer() { this.timing = true; }
  printStats() { console.info(this.ticks + " ticks elapsed."); }

  move() { if (this.timing) this.ticks++; }
}

class TestBoss extends BossHead {
  constructor(game, args) {
    super(game, 1000,
      game.loadImage("../assets/test-boss2.png"),
      game.loadImage("../assets/test-boss2.png"),
      game.loadImage("../assets/test-boss2.png"));
    this.normalImage.addBox(new BoundingBox(30, 0, 30, 0));
    this.normalImage.addBox(new BoundingBox(3, 30, 3, 50));
    this.normalImage.addBox(new BoundingBox(15, 10, 15, 15));
    this.attackImage.addBox(new BoundingBox(30, 0, 30, 0));
    this.attackImage.addBox(new BoundingBox(3, 30, 3, 50));
    this.attackImage.addBox(new BoundingBox(15, 10, 15, 15));
    this.hurtImage.addBox(new BoundingBox(30, 0, 30, 0));
    this.hurtImage.addBox(new BoundingBox(3, 30, 3, 50));
    this.hurtImage.addBox(new BoundingBox(15, 10, 15, 15));

    var x = 0, y = 0;
    if (args.length >= 1) {
      try { x = parseInt(args[0]); }
      catch (err) { x = 0; }
    }
    if (args.length >= 2) {
      try { y = parseInt(args[1]); }
      catch (err) { y = 0; }
    }

    this.setMovement(new TestMovement(this, x, y));
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  getWeapon() {
    //return new GunWeapon(game.getCopter());
    return new Weapon();
  }

  /** Draws the object onscreen. */
  draw(ctx) {
    super.draw(ctx);
    ctx.fillColor = "yellow";
    ctx.fillText("" + hp, Math.trunc(this.getCX()) - 15, Math.trunc(this.getCY()) + 20);
  }

  /** Hits this object for the given amount of damage. */
  hit(damage) {
    if (damage > 0) move.startTimer();
    super.hit(damage);
  }

  getScore() {
    move.printStats();
    return 0;
  }
}