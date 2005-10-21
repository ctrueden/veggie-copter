//
// BoundedImage.java
//

import java.awt.*;
import java.awt.image.ImageObserver;
import java.util.Vector;

/** An image with associated bounding box insets. */
public class BoundedImage {

  // -- Fields --

  /** Image. */
  protected Image img;

  /** Image dimensions. */
  protected int width, height;

  /** X and Y offsets. */
  protected int xoff, yoff;

  /** Bounding boxes. */
  protected Vector boxes = new Vector();


  // -- Constructor --

  /** Constructs a bounded image with default parameters. */
  public BoundedImage(ImageObserver obs, Image img) {
    this(img, img.getWidth(obs), img.getHeight(obs), 0, 0);
  }

  /** Constructs a bounded image with default parameters. */
  public BoundedImage(Image img, int width, int height) {
    this(img, width, height, 0, 0);
  }

  /** Constructs an image with accompanying bounding box information. */
  public BoundedImage(ImageObserver obs, Image img, int xoff, int yoff) {
    this(img, img.getWidth(obs), img.getHeight(obs), xoff, yoff);
  }

  /** Constructs an image with accompanying bounding box information. */
  public BoundedImage(Image img, int width, int height, int xoff, int yoff) {
    this.img = img;
    this.width = width;
    this.height = height;
    this.xoff = xoff; this.yoff = yoff;
  }


  // -- BoundedImage API methods --

  /** Adds a bounding box to the image. */
  public void addBox(BoundingBox box) { boxes.add(box); }

  /** Gets image. */
  public Image getImage() { return img; }

  /** Gets image width. */
  public int getWidth() { return width; }

  /** Gets image height. */
  public int getHeight() { return height; }

  /** Gets X offset. */
  public int getOffsetX() { return xoff; }

  /** Gets Y offset. */
  public int getOffsetY() { return yoff; }

  /** Gets bounding boxes given the image's top left coordinate. */
  public Rectangle[] getBoxes(int x, int y) {
    int len = boxes.size();
    Rectangle[] r = new Rectangle[len];
    for (int i=0; i<len; i++) {
      BoundingBox box = (BoundingBox) boxes.elementAt(i);
      r[i] = box.getBox(x, y, width, height);
    }
    return r;
  }

}
