package net.restlesscoder.heli;

import java.awt.*;
import java.awt.image.BufferedImage;

public class CopterLit extends Thing {

  // -- Constants --

  protected static final int[] X1 = {2, 2, 1, 0, 0, 0, 0};
  protected static final int[] Y1 = {1, 2, 2, 2, 2, 2, 1};
  protected static final int[] X2 = {0, 0, 0, 0, 1, 2, 2};
  protected static final int[] Y2 = {0, 0, 0, 0, 0, 0, 0};

  protected static final int MULTIPLIER = 5;
  protected static final int START_ANGLE = 3;


  // -- Static fields --

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


  // -- Fields --

  protected int angle = START_ANGLE;


  // -- Constructor --

  public CopterLit(Thing thing, int[] path) {
    super(thing.getGame());
    setImageList(images);
    setImageIndex(angle);
    type = GOOD_BULLET;
    float x = thing.getCX() - getWidth() / 2, y = thing.getY() - getHeight();
    move = new LitMovement(this, x, y, path);
  }


  // -- CopterLit API methods --

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
