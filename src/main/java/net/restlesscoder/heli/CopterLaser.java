package net.restlesscoder.heli;

import java.awt.Color;
import java.awt.Graphics;

import java.awt.image.BufferedImage;

public class CopterLaser extends Thing {

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
