//
// CopterHoming.java
//

import java.awt.*;
import java.awt.image.BufferedImage;

public class CopterHoming extends Thing {

  protected static BoundedImage image;

  static {
    BufferedImage img = ImageTools.makeImage(8, 8);
    Graphics g = img.createGraphics();
    g.setColor(Color.magenta);
    g.fillRoundRect(0, 0, 8, 8, 4, 4);
    g.dispose();
    image = new BoundedImage(img);
    image.addBox(new BoundingBox());
  }

  public CopterHoming(Thing thing) {
    super(thing.getGame());
    setImage(image);
    type = GOOD_BULLET;
    setPower(2);
    maxhp = 5;
    float x = thing.getCX() - getWidth() / 2f, y = thing.getY() - getHeight();
    move = new HomingMovement(this, x, y);
  }

}
