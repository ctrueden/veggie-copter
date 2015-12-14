package net.restlesscoder.heli;

public class AlexBoss extends BossHead {

  // -- Constructor --

  public AlexBoss(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize Alex with proper parameters
    super(game, 250,
      game.loadImage("alex-boss1.png"),
      game.loadImage("alex-boss2.png"),
      game.loadImage("alex-boss3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox(95, 3, 100, 60));
    normal.addBox(new BoundingBox(78, 18, 80, 85));
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox(84, 3, 84, 39));
    attacking.addBox(new BoundingBox(69, 15, 69, 51));
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox(96, 3, 81, 39));
    hurting.addBox(new BoundingBox(81, 15, 66, 51));
    setMovement(new AlexMovement(this));
    setAttack(new AlexAttack(this));
  }


  // -- BossHead API methods --

  /** Gets the attack form left behind by this boss upon defeat. */
  public ColoredAttack getColoredAttack() {
    return new EnergyAttack(game.getCopter());
  }


  // -- Thing API methods --

  public int getScore() { return 30 * super.getScore(); }

  public void move() {
    super.move();

    // set proper expression
    AlexMovement am = (AlexMovement) move;
    if (isHit() || am.isRunning()) setImageIndex(HURTING);
    else if (isShooting() || am.isLunging()) setImageIndex(ATTACKING);
    else setImageIndex(NORMAL);

    // regen
    if (game.getTicks() % 20 == 0 && hp < maxhp) hp++;
  }

}
