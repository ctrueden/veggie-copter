//
// CopterLaser.java
//

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
      BufferedImage img =
        new BufferedImage(width, 13, BufferedImage.TYPE_INT_RGB);
      Graphics g = img.createGraphics();
      g.setColor(new Color(0, 127 + 128 * i / (MAX_SIZE - 1), 0));
      g.fillRect(0, 0, width, 12);
      g.dispose();
      images[i] = new BoundedImage(img, width, 13);
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
