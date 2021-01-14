class LitMovement extends MovementStyle {
  private int[] path;
  private int pIndex;

  public LitMovement(Thing t, float x, float y, int[] path) {
    super(t);
    thing.setPos(x, y);
    this.path = path;
    if (path == null) System.err.println("Warning: path is null");
  }

  /** Moves the given thing according to the laser movement style. */
  public void move() {
    float xpos = thing.getX(), ypos = thing.getY();

    CopterLit lit = (CopterLit) thing;
    int x2 = lit.getX2();
    int y2 = lit.getY2();
    xpos += x2;
    ypos += y2;

    if (path == null) System.err.println("Warning: path is null");
    if (pIndex < path.length) {
      int p = path[pIndex++];
      if (p < 0) lit.arcLeft();
      else if (p > 0) lit.arcRight();
    }
    else {
      double chance = Math.random();
      if (chance < LitAttack.LEFT_CHANCE) lit.arcLeft();
      else if (chance > 1 - LitAttack.RIGHT_CHANCE) lit.arcRight();
    }

    int x1 = lit.getX1();
    int y1 = lit.getY1();
    xpos -= x1;
    ypos -= y1;

    thing.setPos(xpos, ypos);
  }
}

class CopterLit extends Thing {
  protected static final int[] X1 = {2, 2, 1, 0, 0, 0, 0};
  protected static final int[] Y1 = {1, 2, 2, 2, 2, 2, 1};
  protected static final int[] X2 = {0, 0, 0, 0, 1, 2, 2};
  protected static final int[] Y2 = {0, 0, 0, 0, 0, 0, 0};

  protected static final int MULTIPLIER = 5;
  protected static final int START_ANGLE = 3;

  protected static BoundedImage[] images;

  static {
    int len = X1.length;
    images = new BoundedImage[len];
    for (int i=0; i<len; i++) {
      int x1 = MULTIPLIER * X1[i];
      int y1 = MULTIPLIER * Y1[i];
      int x2 = MULTIPLIER * X2[i];
      int y2 = MULTIPLIER * Y2[i];
      int w = (x1 > x2 ? x1 : x2) + 1;
      int h = (y1 > y2 ? y1 : y2) + 1;
      BufferedImage img = ImageTools.makeImage(w, h);
      Graphics g = img.createGraphics();
      g.setColor(Color.cyan);
      g.drawLine(x1, y1, x2, y2);
      g.dispose();
      images[i] = new BoundedImage(img);
      images[i].addBox(new BoundingBox());
    }
  }

  protected int angle = START_ANGLE;

  public CopterLit(Thing thing, int[] path) {
    super(thing.getGame());
    setImageList(images);
    setImageIndex(angle);
    type = GOOD_BULLET;
    float x = thing.getCX() - getWidth() / 2, y = thing.getY() - getHeight();
    move = new LitMovement(this, x, y, path);
  }

  public void arcLeft() { setAngle(angle - 1); }

  public void arcRight() { setAngle(angle + 1); }

  public void setAngle(int angle) {
    if (angle < 0 || angle >= X1.length) return;
    this.angle = angle;
    setImageIndex(angle);
  }

  public int getX1() { return MULTIPLIER * X1[angle]; }
  public int getY1() { return MULTIPLIER * Y1[angle]; }
  public int getX2() { return MULTIPLIER * X2[angle]; }
  public int getY2() { return MULTIPLIER * Y2[angle]; }
}

/** Defines veggie copter lightning attack style. */
class LitWeapon extends Weapon {

  const var LEFT_CHANCE = 0.2;
  const var RIGHT_CHANCE = 0.2;

  POWER = 1;
  PATH_LENGTH = 200;

  ARC_LENGTH = 10;
  DELAY = 10;
  PERIOD = ARC_LENGTH + DELAY;

  var ticks;
  boolean space = false;
  int[][] paths;

  LitAttack(t) {
    super(t, Colors.Cyan, t.game.loadSprite("icon-lit").image);

    paths = new int[1000][];
    generatePath(0);
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
    if (!space) return [];
    ticks++;
    var pow = this.power;
    var q = ticks % PERIOD;
    CopterLit[] lits = new CopterLit[pow];
    for (var i=0; i<pow; i++) {
      var genTick = i * PERIOD / pow;
      if (q < genTick) q += PERIOD;
      var haltTick = genTick + ARC_LENGTH;

      if (q == genTick) generatePath(i);
      else if (q >= haltTick) continue;

      if (paths[i] == null) continue;
      lits[i] = new CopterLit(thing, paths[i]);
      lits[i].power = POWER;
    }
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return lits;
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) {
      space = true;
      ticks = 0;
    }
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = false;
  }

  generatePath(index) {
    paths[index] = new int[PATH_LENGTH];
    for (var i=0; i<paths[index].length; i++) {
      var chance = Math.random();
      if (chance < LEFT_CHANCE) paths[index][i] = -1;
      else if (chance > 1 - RIGHT_CHANCE) paths[index][i] = 1;
      else paths[index][i] = 0;
    }
  }

}
