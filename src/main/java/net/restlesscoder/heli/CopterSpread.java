package net.restlesscoder.heli;

import java.awt.Color;
import java.awt.Graphics;

import java.awt.image.BufferedImage;

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
