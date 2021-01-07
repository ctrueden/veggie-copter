package net.restlesscoder.heli;

import java.awt.event.*;

public class CopterGun extends Thing {

  protected static final int SPEED = 5;
  protected static final int HEIGHT = 7;
  protected static final Color BROWN = Color.yellow.darker();

  protected static BoundedImage image;

  static {
    int len = HEIGHT;
    BufferedImage img = ImageTools.makeImage(1, len);
    Graphics g = img.createGraphics();
    g.setColor(BROWN);
    g.drawLine(0, 0, 0, len);
    g.dispose();
    image = new BoundedImage(img, 1, HEIGHT);
    image.addBox(new BoundingBox());
  }

  public CopterGun(Thing thing, float x, float y, int power) {
    super(thing.getGame());
    type = GOOD_BULLET;
    setImage(image);
    setPower(power);
    move = new BulletMovement(this, x, y + HEIGHT, x, -100, SPEED);
  }

}

/** Defines veggie copter gun attack. */
public class GunAttack extends ColoredAttack {

  // -- Constants --

  protected static final int RECHARGE = 2;


  // -- Fields --

  protected boolean space = false;
  protected int fired;


  // -- Constructor --

  public GunAttack(Thing t) {
    super(t, CopterGun.BROWN,
      t.getGame().loadImage("icon-gun.png").getImage());
  }


  // -- ColoredAttack API methods --

  public void clear() { space = false; }


  // -- AttackStyle API methods --

  /** Fires two shots if space bar is pressed. */
  public Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    int num = getPower() + 1;
    fired = RECHARGE;

    int x = (int) thing.getCX(), y = (int) thing.getY() - 14;

    CopterGun[] shots = new CopterGun[num];
    if (num % 2 == 0) {
      int len = num / 2;
      for (int i=0; i<len; i++) {
        int q = 2 * i;
        shots[q] = new CopterGun(thing, x - q - 1, y, 1);
        shots[q + 1] = new CopterGun(thing, x + q + 1, y, 1);
      }
    }
    else {
      int len = num / 2;
      for (int i=0; i<len; i++) {
        int q = 2 * i;
        shots[q] = new CopterGun(thing, x - q - 2, y, 1);
        shots[q + 1] = new CopterGun(thing, x + q + 2, y, 1);
      }
      shots[num - 1] = new CopterGun(thing, x, y, 1);
    }
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return shots;
  }


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
