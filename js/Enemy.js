package net.restlesscoder.heli;

public class Enemy extends EnemyHead {

  // -- Constructor --

  /**
   * Constructs a new enemy head.
   * args[0] = number of hit points
   * args[1] = name of graphic to use
   * args[2+] = movement parameters (see EnemyMovement)
   */
  public Enemy(VeggieCopter game, String[] args) {
    super(game, Integer.parseInt(args[0]),
      game.loadImage(args[1] + "1.png"),
      game.loadImage(args[1] + "2.png"),
      game.loadImage(args[1] + "3.png"));
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());

    String[] params = new String[args.length - 2];
    System.arraycopy(args, 2, params, 0, params.length);
    setMovement(new EnemyMovement(this, params));
    setAttack(new RandomBulletAttack(this));
  }

  public Thing[] getPowerUp() { return null; }

}
