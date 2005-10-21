//
// EnemyBullet.java
//

import java.awt.Color;
import java.awt.Graphics;

import java.awt.image.BufferedImage;

public class EnemyBullet extends Thing {

  protected static final int SIZE = 7;

  protected static BoundedImage image;

  static {
    BufferedImage img =
      new BufferedImage(SIZE, SIZE, BufferedImage.TYPE_INT_ARGB);
    Graphics g = img.createGraphics();
    g.setColor(Color.red);
    g.fillRoundRect(0, 0, SIZE, SIZE, SIZE / 2, SIZE / 2);
    g.dispose();
    image = new BoundedImage(img, SIZE, SIZE);
    image.addBox(new BoundingBox());
  }

  public EnemyBullet(Thing t) {
    super(t.getGame());
    type = EVIL_BULLET;
    setImage(image);
    setPower(10 * t.getPower());

    float x = t.getCX() - getWidth() / 2f;
    float y = t.getCY() - getHeight() / 2f;
    move = new BulletMovement(this, x, y);
    //attack = new RandomBulletAttack(this); // MWAHAHA!
  }

  public EnemyBullet(Thing t, int x2, int y2) {
    super(t.getGame());
    type = EVIL_BULLET;
    setImage(image);
    setPower(10 * t.getPower());

    float x = t.getCX() - getWidth() / 2f;
    float y = t.getCY() - getHeight() / 2f;
    move = new BulletMovement(this, x, y, x2, y2);
    //attack = new RandomBulletAttack(this); // MWAHAHA!
  }

}
