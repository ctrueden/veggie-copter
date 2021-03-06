package net.restlesscoder.heli;

public class GeorgeEnemy extends EnemyHead {

  // -- Constructor --

  public GeorgeEnemy(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize George with proper parameters
    super(game, 80 + (int) (Math.random() * 20),
      game.loadImage("george1.png"),
      game.loadImage("george2.png"),
      game.loadImage("george3.png"));
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


  // -- Thing API methods --

  public int getScore() { return 5 * super.getScore(); }

  public void move() {
    super.move();

    // regen
    if (((GeorgeMovement) move).isTurning()) hp++;
  }

}
