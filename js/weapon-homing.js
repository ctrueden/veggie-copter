class HomingMovement extends MovementStyle {
  protected static final float SPEED = 4;

  /**
   * Number between 0 and 1 indicating turning proficiency of the missile.
   * 1 = perfect turning, 0 = impossible to turn
   */
  protected static final float TURNING = 0.1f;

  protected Thing target;
  protected float velX, velY;

  public HomingMovement(Thing t, float x, float y) {
    super(t);
    velX = 0; velY = -SPEED;
    thing.setPos(x, y);
  }

  public float getVelocityX() { return velX; }
  public float getVelocityY() { return velY; }

  /** Moves the given thing according to the laser movement style. */
  public void move() {
    if (target != null && target.isDead()) target = null;

    if (target == null) {
      // locate new target
      Thing[] t = thing.getGame().getThings();
      float mindist2 = Float.MAX_VALUE;
      float x = thing.getCX(), y = thing.getCY();
      for (int i=0; i<t.length; i++) {
        int type = t[i].getType();
        boolean bigPowerUp = type == Thing.POWER_UP &&
          ((PowerUp) t[i]).getGrantedAttack() != null;
        if (type != Thing.EVIL && !bigPowerUp) continue;
        float cx = t[i].getCX(), cy = t[i].getCY();
        float xx = cx - x, yy = cy - y;
        float dist2 = xx * xx + yy * yy;
        if (dist2 < mindist2) {
          mindist2 = dist2;
          target = t[i];
        }
      }
    }

    if (target != null) {
      // adjust velocity vector to angle toward target
      float x = thing.getCX(), y = thing.getCY();
      float cx = target.getCX(), cy = target.getCY();
      float xx = cx - x, yy = cy - y;
      float dist = (float) Math.sqrt(xx * xx + yy * yy);
      if (dist == 0) dist = 0.1f; // avoid divide by zero
      float factor = TURNING * SPEED / dist;

      velX += factor * xx; velY += factor * yy;
      dist = (float) Math.sqrt(velX * velX + velY * velY);
      factor = SPEED / dist;
      velX *= factor; velY *= factor;
    }

    // update position based on velocity vector
    float xpos = thing.getX(), ypos = thing.getY();
    xpos += velX; ypos += velY;
    thing.setPos((int) xpos, (int) ypos);
  }
}

class CopterHoming extends Thing {
  protected static BoundedImage image;

  static {
    BufferedImage img = ImageTools.makeImage(8, 8);
    Graphics g = img.createGraphics();
    g.setColor(Color.magenta);
    g.fillRoundRect(0, 0, 8, 8, 4, 4);
    g.dispose();
    image = new BoundedImage(img);
    image.addBox(new BoundingBox());
  }

  public CopterHoming(Thing thing) {
    super(thing.getGame());
    setImage(image);
    type = GOOD_BULLET;
    setPower(2);
    maxhp = 5;
    float x = thing.getCX() - getWidth() / 2f, y = thing.getY() - getHeight();
    move = new HomingMovement(this, x, y);
  }
}

/** Defines veggie copter homing missile attack style. */
class HomingWeapon extends Weapon {

  RECHARGE = 12;

  boolean space = false;
  var fired;

  HomingAttack(t) {
    super(t, Colors.Magenta, t.game.loadSprite("icon-homing").image);
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return [];
    }
    if (!space) return [];
    var pow = this.power;
    fired = RECHARGE - pow;

    CopterHoming homing = new CopterHoming(thing);
    homing.power = 8;
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {homing};
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = false;
  }

}
