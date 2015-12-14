package net.restlesscoder.heli;

public class GeorgeBoss extends BossHead {

  // -- Constructor --

  public GeorgeBoss(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize George with proper parameters
    super(game, 800 + (int) (Math.random() * 200),
      game.loadImage("george-boss1.png"),
      game.loadImage("george-boss2.png"),
      game.loadImage("george-boss3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());
    setMovement(new GeorgeMovement(this));
    setAttack(new GeorgeAttack(this));
  }


  // -- BossHead API methods --

  /** Gets the attack form left behind by this boss upon defeat. */
  public ColoredAttack getColoredAttack() {
    return new SpreadAttack(game.getCopter());
  }


  // -- Thing API methods --

  public int getScore() { return 50 * super.getScore(); }

  public void move() {
    super.move();

    // regen
    if (((GeorgeMovement) move).isTurning()) hp++;
  }

}
