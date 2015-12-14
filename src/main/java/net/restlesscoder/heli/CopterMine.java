package net.restlesscoder.heli;

import java.awt.*;

import java.awt.image.BufferedImage;

public class CopterMine extends Thing {

  protected static final int POWER_MULTIPLIER = 10;
  protected static final int MAX_SIZE = 11;

  protected static BoundedImage[] images;

  static {
    images = new BoundedImage[MAX_SIZE];
    for (int i=0; i<MAX_SIZE; i++) {
      int size = i + 10;
      BufferedImage img = ImageTools.makeImage(size, size);
      Graphics g = img.createGraphics();
      g.setColor(Color.gray);
      g.fillOval(0, 0, size, size);
      g.setColor(Color.red);
      int q = size / 3 + 1;
      g.fillOval(q, q, q, q);
      g.dispose();
      images[i] = new BoundedImage(img);
      images[i].addBox(new BoundingBox());
    }
  }


  // -- Constructor --

  public CopterMine(Thing thing, int power) {
    super(thing.getGame());
    type = GOOD_BULLET;
    setPower(power);
    move = new MineMovement(this);
    attack = new MineExplode(this);
    setCPos(thing.getCX(), thing.getCY());
  }


  // -- CopterMine API methods --

  /** Gets strength (power) of the mine. */
  public int getStrength() { return power; }


  // -- Thing API methods --

  /** Changes mine size based on power value. */
  public void setPower(int power) {
    super.setPower(power);
    maxhp = hp = POWER_MULTIPLIER * power;

    int size = power - 1;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setImage(images[size]);
  }

  /** Mines do not directly damage enemies. */
  public int getPower() { return 0; }

  /** Mines cannot be destroyed. */
  public void hit(int damage) { }

}
