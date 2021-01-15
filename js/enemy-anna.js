class AnnaAttack extends AttackStyle {
  constructor(t) {
    super(t);

    /** Probability that this thing will fire a bullet (1=rare, 60=always). */
    this.frequency = 1;
  }

  /** Fires a shot randomly. */
  shoot() {
    if (Math.random() >= 1.0 / (60 - this.frequency)) return [];
    return [new EnemyBullet(thing, null, null)];
  }
}

class AnnaMovement extends MovementStyle {
  constructor(t, y, dir) {
    super(t);
    this.dir = dir;
    this.speed = 2;
    var game = this.thing.game;

    // compute starting position
    int xpos, ypos;
    int w = game.getWindowWidth(), h = game.getWindowHeight();

    if (dir) {
      // appear from right
      xpos = w - thing.getWidth();
      ypos = y;
    }
    else {
      // appear from left
      xpos = 0;
      ypos = y;
    }

    thing.setPos(xpos, ypos);
  }

  /** Moves the given thing according to the bonus movement style. */
  public void move() {
    float xpos = this.thing.xpos, ypos = this.thing.ypos;

    xpos += dir ? -this.speed : this.speed;
    thing.setPos(xpos, ypos);
  }
}

public class AnnaEnemy extends EnemyHead {
  constructor(game, args) {
    super(game, 20,
      game.loadSprite("anna1.png"),
      game.loadSprite("anna2.png"),
      game.loadSprite("anna3.png"));
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

  public int getScore() { return 100 * super.getScore(); }
}

public class AnnaBoss extends BossHead {
  constructor(VeggieCopter game, String[] args) {
    super(game, 200,
      game.loadSprite("anna-boss1.png"),
      game.loadSprite("anna-boss2.png"),
      game.loadSprite("anna-boss3.png"));
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

  /** Gets the attack form left behind by this boss upon defeat. */
  public ColoredAttack getColoredAttack() {
    return new RegenAttack(game.getCopter());
  }

  public int getScore() { return 1000 * super.getScore(); }
}
