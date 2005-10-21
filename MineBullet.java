//
// MineBullet.java
//

import java.awt.Color;
import java.awt.Graphics;

import java.awt.image.BufferedImage;

public class MineBullet extends Thing {

  // -- Constants --

  /** Size of bullet. */
  protected static final int SIZE = 7;

  /** Number of ticks until bullet disappears. */
  protected static final int LIFE = 20;

  /** Power divisor for each bullet. */
  protected static final int POWER = 4;


  // -- Fields --

  protected static BoundedImage[] images;

  static {
    images = new BoundedImage[LIFE];
    for (int i=0; i<LIFE; i++) {
      BufferedImage img =
        new BufferedImage(SIZE, SIZE, BufferedImage.TYPE_INT_ARGB);
      Graphics g = img.createGraphics();
      int alpha = 255 * (LIFE - i) / LIFE;
      g.setColor(new Color(Color.gray.getRed(),
        Color.gray.getGreen(), Color.gray.getBlue(), alpha));
      g.fillRoundRect(0, 0, SIZE, SIZE, SIZE / 2, SIZE / 2);
      g.dispose();
      images[i] = new BoundedImage(img, SIZE, SIZE);
      images[i].addBox(new BoundingBox());
    }
  }


  // -- Constructor --

  public MineBullet(Thing t, float angle, float sx, float sy) {
    super(t.getGame());
    type = GOOD_BULLET;
    setImageList(images);
    setPower((int) (LIFE / POWER) + 1);
    float tx = (float) (sx + 10 * Math.sin(angle));
    float ty = (float) (sy + 10 * Math.cos(angle));
    move = new MineBulletMovement(this, sx, sy, tx, ty);
  }


  // -- Thing API methods --

  public void setImageIndex(int index) {
    if (index == LIFE) setHP(0); // bullets die when they fade away
    else {
      setPower((LIFE - index) / POWER + 1);
      super.setImageIndex(index);
    }
  }

}
