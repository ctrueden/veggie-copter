package net.restlesscoder.heli;

public class BushEnemy extends EnemyHead {

  // -- Constructor --

  public BushEnemy(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize Bush with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.loadImage("bush1.png"),
      game.loadImage("bush2.png"),
      game.loadImage("bush3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());
    setMovement(new BushMovement(this));
    setAttack(new BushAttack(this));
  }


  // -- Thing API methods --

  public int getScore() { return 5 * super.getScore(); }

  public void move() {
    super.move();

    // regen
    if (((BushMovement) move).isTurning()) hp++;
  }

}
