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
    var normal = this.getBoundedImage(0);
    normal.addBox(new BoundingBox(30, 0, 30, 0));
    normal.addBox(new BoundingBox(3, 30, 3, 50));
    normal.addBox(new BoundingBox(15, 10, 15, 15));
    var attacking = this.getBoundedImage(1);
    attacking.addBox(new BoundingBox(30, 0, 30, 0));
    attacking.addBox(new BoundingBox(3, 30, 3, 50));
    attacking.addBox(new BoundingBox(15, 10, 15, 15));
    var hurting = this.getBoundedImage(2);
    hurting.addBox(new BoundingBox(30, 0, 30, 0));
    hurting.addBox(new BoundingBox(3, 30, 3, 50));
    hurting.addBox(new BoundingBox(15, 10, 15, 15));

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
