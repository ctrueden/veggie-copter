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
      game.loadSprite("test-boss2"),
      game.loadSprite("test-boss2"),
      game.loadSprite("test-boss2"));
    this.normalSprite.addBox(new BoxInsets(30, 0, 30, 0));
    this.normalSprite.addBox(new BoxInsets(3, 30, 3, 50));
    this.normalSprite.addBox(new BoxInsets(15, 10, 15, 15));
    this.attackSprite.addBox(new BoxInsets(30, 0, 30, 0));
    this.attackSprite.addBox(new BoxInsets(3, 30, 3, 50));
    this.attackSprite.addBox(new BoxInsets(15, 10, 15, 15));
    this.hurtSprite.addBox(new BoxInsets(30, 0, 30, 0));
    this.hurtSprite.addBox(new BoxInsets(3, 30, 3, 50));
    this.hurtSprite.addBox(new BoxInsets(15, 10, 15, 15));

    var x = 0, y = 0;
    if (args.length >= 1) {
      try { x = parseInt(args[0]); }
      catch (err) { x = 0; }
    }
    if (args.length >= 2) {
      try { y = parseInt(args[1]); }
      catch (err) { y = 0; }
    }

    this.movement = new TestMovement(this, x, y);
    this.weapon = new GunWeapon(this.game.copter);
  }

  /** Draws the object onscreen. */
  draw(ctx) {
    super.draw(ctx);
    ctx.fillStyle = Colors.Yellow;
    ctx.fillText(`${this.hp}`, Math.trunc(this.cx) - 15, Math.trunc(this.cy) + 20);
  }

  /** Hits this object for the given amount of damage. */
  damage(amount) {
    if (amount > 0) this.movement.startTimer();
    super.damage(amount);
  }

  get score() {
    this.movement.printStats();
    return 0;
  }
}
