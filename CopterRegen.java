//
// CopterRegen.java
//

import java.awt.*;
import java.awt.image.BufferedImage;

public class CopterRegen extends Thing {

  protected static final int MAX_SIZE = 10 + RegenMovement.FLUX_RADIUS;

  protected static BoundedImage[] images;

  static {
    int red = Color.pink.getRed();
    int green = Color.pink.getGreen();
    int blue = Color.pink.getBlue();

    images = new BoundedImage[MAX_SIZE];
    for (int i=0; i<MAX_SIZE; i++) {
      int width = i + 18;
      BufferedImage img =
        new BufferedImage(width, 2 * width, BufferedImage.TYPE_INT_ARGB);
      Graphics g = img.createGraphics();
      int median = width / 2;
      for (int rad=median; rad>=1; rad--) {
        double q = (double) (median - rad) / median;
        g.setColor(new Color(red, green, blue, (int) (128 * q)));
        g.fillOval(median - rad, 2 * (median - rad), 2 * rad, 4 * rad);
      }
      g.dispose();
      images[i] = new BoundedImage(img, width, 2 * width);
      images[i].addBox(new BoundingBox(5, 5, 5, 5));
    }
  }


  // -- Constructor --

  public CopterRegen(Thing thing) {
    super(thing.getGame());
    setImageList(images);
    setEvil(false);
    move = new RegenMovement(this, thing);
  }


  // -- Thing API methods --

  public void setPower(int power) {
    super.setPower(power);
    int size = power - 1;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImageIndex(size);
    ((RegenMovement) move).syncPos();
  }

}
