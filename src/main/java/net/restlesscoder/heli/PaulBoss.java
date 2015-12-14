package net.restlesscoder.heli;

public class PaulBoss extends BossHead {

  // -- Constructor --

  public PaulBoss(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize Paul with proper parameters
    super(game, 800 + (int) (Math.random() * 200),
      game.loadImage("paul-boss1.png"),
      game.loadImage("paul-boss2.png"),
      game.loadImage("paul-boss3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());
    setMovement(new PaulMovement(this));
    setAttack(new PaulAttack(this));
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
    if (((PaulMovement) move).isTurning()) hp++;
  }

}
