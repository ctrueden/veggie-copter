//
// CopterHoming.java
//

import java.awt.*;
import java.awt.image.BufferedImage;

public class CopterHoming extends Thing {

  protected static BoundedImage image;

  static {
    BufferedImage img = new BufferedImage(8, 8, BufferedImage.TYPE_INT_ARGB);
    Graphics g = img.createGraphics();
    g.setColor(Color.magenta);
    g.fillRoundRect(0, 0, 8, 8, 4, 4);
    g.dispose();
    image = new BoundedImage(img, 8, 8);
    image.addBox(new BoundingBox());
  }

  public CopterHoming(Thing thing) {
    super(thing.getGame());
    setImage(image);
    setEvil(false);
    setPower(2);
    maxhp = 5;
    float x = thing.getCX() - getWidth() / 2f, y = thing.getY() - getHeight();
    move = new HomingMovement(this, x, y);
  }

}
