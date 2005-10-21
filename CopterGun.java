//
// CopterGun.java
//

import java.awt.Color;
import java.awt.Graphics;

import java.awt.image.BufferedImage;

public class CopterGun extends Thing {

  protected static final int SPEED = 5;
  protected static final int HEIGHT = 7;
  protected static final Color BROWN = Color.yellow.darker();

  protected static BoundedImage image;

  static {
    int len = HEIGHT;
    BufferedImage img = new BufferedImage(1, len, BufferedImage.TYPE_INT_RGB);
    Graphics g = img.createGraphics();
    g.setColor(BROWN);
    g.drawLine(0, 0, 0, len);
    g.dispose();
    image = new BoundedImage(img, 1, HEIGHT);
    image.addBox(new BoundingBox());
  }

  public CopterGun(Thing thing, float x, float y, int power) {
    super(thing.getGame());
    evil = false;
    setImage(image);
    setPower(power);
    move = new BulletMovement(this, x, y + HEIGHT, x, -100, SPEED);
  }

}
