//
// JamesEnemy.java
//

public class JamesEnemy extends EnemyHead {

  // -- Constructor --

  public JamesEnemy(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize James with proper parameters
    super(game, 25,
      game.loadImage("james1.png"),
      game.loadImage("james2.png"),
      game.loadImage("james3.png"));
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

    setMovement(new JamesMovement(this, y, dir));
    setAttack(new JamesAttack(this));
  }


  // -- Thing API methods --

  public int getScore() { return 3 * super.getScore(); }

}
