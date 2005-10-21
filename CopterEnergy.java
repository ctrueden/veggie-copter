//
// CopterEnergy.java
//

import java.awt.*;
import java.awt.image.BufferedImage;

public class CopterEnergy extends Thing {

  protected static final int MAX_SIZE = 10 + EnergyMovement.FLUX_RADIUS;

  protected static BoundedImage[] images;

  static {
    int red = Color.orange.getRed();
    int green = Color.orange.getGreen();
    int blue = Color.orange.getBlue();

    images = new BoundedImage[MAX_SIZE];
    for (int i=0; i<MAX_SIZE; i++) {
      int size = 4 * i + 30;
      BufferedImage img =
        new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
      Graphics g = img.createGraphics();
      int median = size / 2;
      for (int rad=median; rad>=1; rad--) {
        double q = (double) (median - rad) / median;
        g.setColor(new Color(red, green, blue, (int) (128 * q)));
        g.fillOval(median - rad, median - rad, 2 * rad, 2 * rad);
      }
      g.dispose();
      images[i] = new BoundedImage(img, size, size);
      images[i].addBox(new BoundingBox(5, 5, 5, 5));
    }
  }


  // -- Constructor --

  public CopterEnergy(Thing thing) {
    super(thing.getGame());
    setImageList(images);
    type = GOOD_BULLET;
    move = new EnergyMovement(this, thing);
    maxhp = hp = Integer.MAX_VALUE;
  }


  // -- Thing API methods --

  public void setPower(int power) {
    super.setPower(power);
    int size = power - 1;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImageIndex(size);
    ((EnergyMovement) move).syncPos();
  }

  /** Draws the object onscreen. */
  public void draw(Graphics g) {
    Copter hero = getGame().getCopter();
    float hcx = hero.getCX();
    float cx = getCX();
    float xdiff = hcx - cx;
    if (xdiff < 0) xdiff = -xdiff;
    int red = Color.orange.getRed();
    int green = Color.orange.getGreen();
    int blue = Color.orange.getBlue();
    float maxDiff = (hero.getWidth() + getWidth()) / 2f;
    float q = (float) (maxDiff - xdiff) / maxDiff;
    if (q < 0) q = 0;
    red = (int) (q * red);
    green = (int) (q * green);
    blue = (int) (q * blue);
    g.setColor(new Color(red, green, blue));
    g.drawLine((int) hcx, (int) hero.getY(), (int) cx, (int) getCY());
    super.draw(g);
  }

}
