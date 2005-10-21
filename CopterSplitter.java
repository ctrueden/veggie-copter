//
// CopterSplitter.java
//

import java.awt.Color;
import java.awt.Graphics;

import java.awt.image.BufferedImage;

public class CopterSplitter extends Thing {

  protected static final int MAX_SIZE = 12;

  protected static BoundedImage[] images;

  static {
    images = new BoundedImage[MAX_SIZE];
    for (int i=0; i<MAX_SIZE; i++) {
      int size = i + 4;
      BufferedImage img =
        new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
      Graphics g = img.createGraphics();
      g.setColor(Color.yellow);
      g.fillRoundRect(0, 0, size, size, size / 2, size / 2);
      g.dispose();
      images[i] = new BoundedImage(img, size, size);
      images[i].addBox(new BoundingBox());
    }
  }


  // -- Constructor --

  public CopterSplitter(VeggieCopter game, float x, float y,
    int xdir, int ydir, int count, int size)
  {
    super(game);
    evil = false;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImage(images[size]);
    if (count == 1) y -= getHeight();
    move = new SplitterMovement(this, x - getWidth() / 2f, y, xdir, ydir);
    attack = new SplitterAttack(this, xdir, ydir, count);
  }


  // -- Thing API methods --

  /** Assigns object's power. */
  public void setPower(int power) {
    super.setPower(power);
    attack.setPower(power);
  }

}
