//
// CopterCharge.java
//

import java.awt.*;
import java.awt.image.BufferedImage;

public class CopterCharge extends Thing {

  private static final int GROWTH_RATE = 10;
  private static final int MAX_SIZE = 20;

  protected static BoundedImage[] images;

  static {
    images = new BoundedImage[MAX_SIZE];
    for (int i=0; i<MAX_SIZE; i++) {
      int size = 2 * i + 12;
      BufferedImage img =
        new BufferedImage(size, size, BufferedImage.TYPE_INT_ARGB);
      Graphics g = img.createGraphics();
      int bright = 127 + 128 * i / (MAX_SIZE - 1);
      for (int j=size; j>0; j--) {
        int l = (size - j) / 2;
        //int r = (size + j) / 2;
        int q = bright * (size - j) / size;
        g.setColor(new Color(q, q, q, q));
        g.fillOval(l, l, j, j);
      }
      g.dispose();
      images[i] = new BoundedImage(img, size, size);
      images[i].addBox(new BoundingBox(1, 1, 1, 1));
    }
  }

  // -- Fields --

  protected int size;


  // -- Constructor --

  public CopterCharge(Thing thing) {
    super(thing.getGame());
    setImageList(images);
    type = GOOD_BULLET;
    size = -1;
    grow();
    float x = thing.getCX() - getWidth(), y = thing.getY();
    move = new ChargeMovement(this, thing, x, y);
  }


  // -- CopterCharge API methods --

  public boolean grow() {
    if (size == MAX_SIZE - 11 + GROWTH_RATE) return false;
    size++;
    maxhp = size + 1;
    setHP(maxhp);
    return true;
  }

  public void launch() { ((ChargeMovement) move).launch(); }


  // -- Thing API methods --

  public void setHP(int hp) {
    if (hp > maxhp) hp = maxhp;
    this.hp = hp;
    setPower(hp);
    size = hp - 1;
    if (size < 0) size = 0;
    setImageIndex(size);
  }

}
