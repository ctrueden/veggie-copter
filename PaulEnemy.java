//
// PaulEnemy.java
//

public class PaulEnemy extends EnemyHead {

  // -- Constructor --

  public PaulEnemy(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize Paul with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.loadImage("paul1.png"),
      game.loadImage("paul2.png"),
      game.loadImage("paul3.png"));
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


  // -- Thing API methods --

  public int getScore() { return 5 * super.getScore(); }

  public void move() {
    super.move();

    // regen
    if (((PaulMovement) move).isTurning()) hp++;
  }

}
