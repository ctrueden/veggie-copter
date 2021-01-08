class SplitterMovement extends MovementStyle {

  int xdir, ydir;

  SplitterMovement(Thing t, float x, float y, int xdir, int ydir) {
    super(t);
    thing.setPos(x, y);
    this.xdir = xdir;
    this.ydir = ydir;
  }

  /** Moves the given thing according to the splitter movement style. */
  move() {
    thing.setPos(thing.getX() + xdir, thing.getY() + ydir);
  }

}

class CopterSplitter extends Thing {

  const int MAX_SIZE = 12;

  static BoundedImage[] images;

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

  CopterSplitter(VeggieCopter game, float x, float y,
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
  setPower(int power) {
    super.setPower(power);
    attack.setPower(power);
  }

}

/** Defines splitter attack. */
class SplitterAttack extends ColoredAttack {

  const int RECHARGE = 10;
  const int MAX_SPLIT = 6;
  const int SPEED = 5;
  const int MULTIPLIER = 4;

  boolean space, trigger;
  int fired;
  int xdir, ydir;
  int count;

  SplitterAttack(Thing t) { this(t, 0, 0, 0); }

  SplitterAttack(Thing t, int xdir, int ydir, int count) {
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

  clear() { space = trigger = false; }

  /** Fires a splitter shot. */
  Thing[] shoot() {
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
  Thing[] trigger() {
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

  keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
    else if (code == Keys.TRIGGER) trigger = true;
  }

  keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
    else if (code == Keys.TRIGGER) trigger = false;
  }

}
