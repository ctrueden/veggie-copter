package net.restlesscoder.heli;

public class AlexEnemy extends EnemyHead {

  // -- Constructor --

  public AlexEnemy(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize Alex with proper parameters
    super(game, 25,
      game.loadImage("alex1.png"),
      game.loadImage("alex2.png"),
      game.loadImage("alex3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox(30, 1, 30, 20));
    normal.addBox(new BoundingBox(25, 5, 25, 25));
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox(28, 1, 28, 13));
    attacking.addBox(new BoundingBox(23, 5, 23, 17));
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox(32, 1, 27, 13));
    hurting.addBox(new BoundingBox(27, 5, 22, 17));
    setMovement(new AlexMovement(this));
    setAttack(new AlexAttack(this));
  }


  // -- Thing API methods --

  public int getScore() { return 3 * super.getScore(); }

  public void move() {
    super.move();

    // set proper expression
    AlexMovement am = (AlexMovement) move;
    if (isHit() || am.isRunning()) setImageIndex(HURTING);
    else if (isShooting() || am.isLunging()) setImageIndex(ATTACKING);
    else setImageIndex(NORMAL);

    // regen
    if (game.getTicks() % 6 == 0 && hp < maxhp) hp++;
  }

}
