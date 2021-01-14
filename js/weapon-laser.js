class LaserMovement extends MovementStyle {
  public LaserMovement(Thing t, float x, float y) {
    super(t);
    thing.setPos(x, y);
  }

  /** Moves the given thing according to the laser movement style. */
  public void move() {
    float xpos = thing.getX(), ypos = thing.getY();
    ypos -= 10;
    thing.setPos(xpos, ypos);
  }
}

class CopterLaser extends Thing {
  protected static final int MAX_SIZE = 11;

  protected static BoundedImage[] images;

  static {
    images = new BoundedImage[MAX_SIZE];
    for (int i=0; i<MAX_SIZE; i++) {
      int width = 2 * i + 1;
      BufferedImage img = ImageTools.makeImage(width, 13);
      Graphics g = img.createGraphics();
      int qi = 64 * i / (MAX_SIZE - 1);
      for (int j=0; j<width; j++) {
        int jj = 2 * (j < width / 2 ? j : (width - 1 - j));
        int qj = width <= 1 ? 0 : (64 * jj / (width - 1));
        g.setColor(new Color(0, 127 + qi + qj, 0));
        g.drawLine(j, 0, j, 12);
      }
      g.dispose();
      images[i] = new BoundedImage(img);
      images[i].addBox(new BoundingBox());
    }
  }

  public CopterLaser(Thing thing, int size) {
    super(thing.getGame());
    type = GOOD_BULLET;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImage(images[size]);
    float x = thing.getCX() - getWidth() / 2f, y = thing.getY() - getHeight();
    move = new LaserMovement(this, x, y);
  }
}

/** Defines veggie copter laser attack style. */
class LaserWeapon extends Weapon {

  const int[] FLUX =
    {0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1};

  boolean space;
  var flux;

  LaserAttack(t) {
    super(t, Colors.Green, t.game.loadSprite("icon-laser").image);
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
    if (!space) return [];
    var size = power - 1;
    if (size > CopterLaser.MAX_SIZE - 3) size = CopterLaser.MAX_SIZE - 3;
    flux = (flux + 1) % FLUX.length;
    size += FLUX[flux];
    CopterLaser laser = new CopterLaser(thing, size);
    laser.power = power;
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {laser};
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = false;
  }

}
