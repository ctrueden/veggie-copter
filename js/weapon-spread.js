package net.restlesscoder.heli;

import java.awt.*;
import java.awt.event.*;

public class CopterSpread extends Thing {

  protected static final double SPREAD_SPEED = 10;

  protected static BoundedImage image;

  static {
    int size = 9;
    BufferedImage img = ImageTools.makeImage(size, size);
    Graphics g = img.createGraphics();
    g.setColor(Color.blue);
    g.fillRoundRect(0, 0, size, size, size / 2, size / 2);
    g.dispose();
    image = new BoundedImage(img);
    image.addBox(new BoundingBox());
  }

  public CopterSpread(Thing thing, double angle) {
    super(thing.getGame());
    type = GOOD_BULLET;
    setImage(image);
    float x = thing.getCX() - getWidth() / 2, y = thing.getY();
    float xd = -(float) (100 * Math.cos(angle)) + x;
    float yd = -(float) (100 * Math.sin(angle)) + y;
    move = new BulletMovement(this, x, y, xd, yd, SPREAD_SPEED);
  }

}

/** Defines veggie copter spread attack. */
public class SpreadAttack extends ColoredAttack {

  // -- Constants --

  protected static final int RECHARGE = 10;
  protected static final int POWER = 3;


  // -- Fields --

  protected boolean space = false;
  protected int fired;


  // -- Constructor --

  public SpreadAttack(Thing t) {
    super(t, Color.blue, t.getGame().loadImage("icon-spread.png").getImage());
  }


  // -- ColoredAttack API methods --

  public void clear() { space = false; }


  // -- AttackStyle API methods --

  /** Fires a shot if space bar is pressed. */
  public Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    fired = RECHARGE;
    int pow = getPower();
    int num = pow + 2;

    int widthDeg = 20 * num - 30;
    if (widthDeg > 180) widthDeg = 180;
    int startDeg = (180 - widthDeg) / 2;
    int endDeg = 180 - startDeg;

    double startRad = Math.PI * startDeg / 180;
    double endRad = Math.PI * endDeg / 180;
    double inc = (endRad - startRad) / (num - 1);

    CopterSpread[] shots = new CopterSpread[num];
    for (int s=0; s<num; s++) {
      shots[s] = new CopterSpread(thing, startRad + inc * s);
      shots[s].setPower(POWER);
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
