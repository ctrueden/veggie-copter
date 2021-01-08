public class SplitterMovement extends MovementStyle {

  protected int xdir, ydir;

  public SplitterMovement(Thing t, float x, float y, int xdir, int ydir) {
    super(t);
    thing.setPos(x, y);
    this.xdir = xdir;
    this.ydir = ydir;
  }

  /** Moves the given thing according to the splitter movement style. */
  public void move() {
    thing.setPos(thing.getX() + xdir, thing.getY() + ydir);
  }

}

public class CopterSplitter extends Thing {

  protected static final int MAX_SIZE = 12;

  protected static BoundedImage[] images;

  static {
    images = new BoundedImage[MAX_SIZE];
    for (int i=0; i<MAX_SIZE; i++) {
      int size = i + 4;
      BufferedImage img = ImageTools.makeImage(size, size);
      Graphics g = img.createGraphics();
      g.setColor(Color.yellow);
      g.fillRoundRect(0, 0, size, size, size / 2, size / 2);
      g.dispose();
      images[i] = new BoundedImage(img);
      images[i].addBox(new BoundingBox());
    }
  }

  public CopterSplitter(VeggieCopter game, float x, float y,
    int xdir, int ydir, int count, int size)
  {
    super(game);
    type = GOOD_BULLET;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImage(images[size]);
    if (count == 1) y -= getHeight();
    move = new SplitterMovement(this, x - getWidth() / 2f, y, xdir, ydir);
    attack = new SplitterAttack(this, xdir, ydir, count);
  }

  /** Assigns object's power. */
  public void setPower(int power) {
    super.setPower(power);
    attack.setPower(power);
  }

}

/** Defines splitter attack. */
public class SplitterAttack extends ColoredAttack {

  protected static final int RECHARGE = 10;
  public static final int MAX_SPLIT = 6;
  protected static final int SPEED = 5;
  protected static final int MULTIPLIER = 4;

  protected boolean space, trigger;
  protected int fired;
  protected int xdir, ydir;
  protected int count;

  public SplitterAttack(Thing t) { this(t, 0, 0, 0); }

  public SplitterAttack(Thing t, int xdir, int ydir, int count) {
    super(t, Color.yellow, t.getGame().loadImage("icon-split.png").getImage());
    if (xdir == 0 && ydir == 0) {
      this.xdir = SPEED;
      this.ydir = 0;
    }
    else {
      this.xdir = xdir;
      this.ydir = ydir;
    }
    this.count = count;
  }

  public void clear() { space = trigger = false; }

  /** Fires a splitter shot. */
  public Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    if (count != 0) return null;
    fired = RECHARGE;

    CopterSplitter splitter = new CopterSplitter(thing.getGame(),
      thing.getCX(), thing.getY(), 0, -SPEED, 1, power + 1);
    splitter.setPower(MULTIPLIER * (power + 2));
    return new Thing[] {splitter};
  }

  /** Splits existing splitter shots. */
  public Thing[] trigger() {
    if (!trigger) return null;
    if (count == 0 || power <= 2 * MULTIPLIER) return null;
    thing.setHP(0);

    VeggieCopter game = thing.getGame();
    float x = thing.getCX(), y = thing.getCY();
    int xd = ydir, yd = xdir;
    int size = power / MULTIPLIER - 3;

    CopterSplitter[] cs = {
      new CopterSplitter(game, x, y, xd, yd, count + 1, size),
      new CopterSplitter(game, x, y, -xd, -yd, count + 1, size),
      // MWAHAHA!
      //new CopterSplitter(game, x, y, yd, xd, count + 1, size),
      //new CopterSplitter(game, x, y, -yd, -xd, count + 1, size),
      //new CopterSplitter(game, x, y, SPEED, SPEED, count + 1, size),
      //new CopterSplitter(game, x, y, -SPEED, -SPEED, count + 1, size),
      //new CopterSplitter(game, x, y, -SPEED, SPEED, count + 1, size),
      //new CopterSplitter(game, x, y, SPEED, -SPEED, count + 1, size)
    };
    for (int i=0; i<cs.length; i++) cs[i].setPower(power - 2 * MULTIPLIER);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return cs;
  }

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
    else if (code == Keys.TRIGGER) trigger = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
    else if (code == Keys.TRIGGER) trigger = false;
  }

}
