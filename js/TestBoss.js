class TestBoss extends BossHead {

  TestBoss(game, String[] args) {
    super(game, 1000,
      game.loadImage("test-boss2.png"),
      game.loadImage("test-boss2.png"),
      game.loadImage("test-boss2.png"));
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox(30, 0, 30, 0));
    normal.addBox(new BoundingBox(3, 30, 3, 50));
    normal.addBox(new BoundingBox(15, 10, 15, 15));
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox(30, 0, 30, 0));
    attacking.addBox(new BoundingBox(3, 30, 3, 50));
    attacking.addBox(new BoundingBox(15, 10, 15, 15));
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox(30, 0, 30, 0));
    hurting.addBox(new BoundingBox(3, 30, 3, 50));
    hurting.addBox(new BoundingBox(15, 10, 15, 15));

    var x = 0, y = 0;
    if (args.length >= 1) {
      try { x = parseInt(args[0]); }
      catch (exc) { x = 0; }
    }
    if (args.length >= 2) {
      try { y = parseInt(args[1]); }
      catch (exc) { y = 0; }
    }

    setMovement(new TestMovement(this, x, y));
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  ColoredAttack getColoredAttack() {
    return new GunAttack(game.getCopter());
  }

  /** Draws the object onscreen. */
  draw(g) {
    super.draw(g);
    g.setColor(Color.yellow);
    g.drawString("" + hp, Math.trunc(getCX()) - 15, Math.trunc(getCY()) + 20);
  }

  /** Hits this object for the given amount of damage. */
  hit(damage) {
    if (damage > 0) ((TestMovement) move).startTimer();
    super.hit(damage);
  }

  var getScore() {
    ((TestMovement) move).printStats();
    return 0;
  }

}
