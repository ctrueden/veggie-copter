/** An image with associated bounding box insets. */
class BoundedImage {

  /** Image. */
  BufferedImage img;

  /** Image dimensions. */
  int width, height;

  /** X and Y offsets. */
  int xoff, yoff;

  /** Bounding boxes. */
  Vector boxes = new Vector();

  /** Constructs a bounded image with default parameters. */
  BoundedImage(BufferedImage img) {
    this(img, img.getWidth(), img.getHeight(), 0, 0);
  }

  /** Constructs an image with accompanying bounding box information. */
  BoundedImage(BufferedImage img, int xoff, int yoff) {
    this(img, img.getWidth(), img.getHeight(), xoff, yoff);
  }

  /** Constructs an image with accompanying bounding box information. */
  BoundedImage(BufferedImage img,
    int width, int height, int xoff, int yoff)
  {
    this.img = img;
    this.width = width;
    this.height = height;
    this.xoff = xoff; this.yoff = yoff;
  }

  /** Adds a bounding box to the image. */
  addBox(BoundingBox box) { boxes.add(box); }

  /** Removes the last bounding box from the image. */
  removeBox() {
    int ndx = boxes.size() - 1;
    if (ndx >= 0) boxes.removeElementAt(ndx);
  }

  /** Gets image. */
  Image getImage() { return img; }

  /** Gets image width. */
  int getWidth() { return width; }

  /** Gets image height. */
  int getHeight() { return height; }

  /** Gets X offset. */
  int getOffsetX() { return xoff; }

  /** Gets Y offset. */
  int getOffsetY() { return yoff; }

  /** Gets bounding boxes given the image's top left coordinate. */
  Rectangle[] getBoxes(int x, int y) {
    int len = boxes.size();
    Rectangle[] r = new Rectangle[len];
    for (int i=0; i<len; i++) {
      BoundingBox box = (BoundingBox) boxes.elementAt(i);
      r[i] = box.getBox(x, y, width, height);
    }
    return r;
  }

}
