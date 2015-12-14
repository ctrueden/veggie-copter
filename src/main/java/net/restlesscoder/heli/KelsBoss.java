package net.restlesscoder.heli;

public class KelsBoss extends BossHead {

  // -- Constructor --

  public KelsBoss(VeggieCopter game, String[] args) {
    // CTR TODO parse args and initialize Kels with proper parameters
    super(game, 250,
      game.loadImage("kels-boss1.png"),
      game.loadImage("kels-boss2.png"),
      game.loadImage("kels-boss3.png"));
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

    setMovement(new KelsMovement(this, y, dir));
    setAttack(new KelsAttack(this));
  }


  // -- BossHead API methods --

  /** Gets the attack form left behind by this boss upon defeat. */
  public ColoredAttack getColoredAttack() {
    return new SplitterAttack(game.getCopter());
  }


  // -- Thing API methods --

  public int getScore() { return 30 * super.getScore(); }

}
