package net.restlesscoder.heli;

public class AnnaEnemy extends EnemyHead {

  // -- Constructor --

  public AnnaEnemy(VeggieCopter game, String[] args) {
    super(game, 20,
      game.loadImage("anna1.png"),
      game.loadImage("anna2.png"),
      game.loadImage("anna3.png"));
    // CTR TODO set proper bounding box and offsets here
    BoundedImage normal = getBoundedImage(0);
    normal.addBox(new BoundingBox());
    BoundedImage attacking = getBoundedImage(1);
    attacking.addBox(new BoundingBox());
    BoundedImage hurting = getBoundedImage(2);
    hurting.addBox(new BoundingBox());

    int y = 0;
    boolean dir = false;
    if (args.length >= 1) {
      try { y = Integer.parseInt(args[0]); }
      catch (NumberFormatException exc) { y = 0; }
    }
    if (args.length >= 2) dir = args[1].equals("true");

    setMovement(new AnnaMovement(this, y, dir));
    setAttack(new AnnaAttack(this));
  }


  // -- Thing API methods --

  public int getScore() { return 100 * super.getScore(); }

}
