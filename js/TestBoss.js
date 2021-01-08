public class TestBoss extends BossHead {

  public TestBoss(VeggieCopter game, String[] args) {
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

    int x = 0, y = 0;
    if (args.length >= 1) {
      try { x = Integer.parseInt(args[0]); }
      catch (NumberFormatException exc) { x = 0; }
    }
    if (args.length >= 2) {
      try { y = Integer.parseInt(args[1]); }
      catch (NumberFormatException exc) { y = 0; }
    }

    setMovement(new TestMovement(this, x, y));
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  public ColoredAttack getColoredAttack() {
    return new GunAttack(game.getCopter());
  }

  /** Draws the object onscreen. */
  public void draw(Graphics g) {
    super.draw(g);
    g.setColor(Color.yellow);
    g.drawString("" + hp, (int) getCX() - 15, (int) getCY() + 20);
  }

  /** Hits this object for the given amount of damage. */
  public void hit(int damage) {
    if (damage > 0) ((TestMovement) move).startTimer();
    super.hit(damage);
  }

  public int getScore() {
    ((TestMovement) move).printStats();
    return 0;
  }

}
