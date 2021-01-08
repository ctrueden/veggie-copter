/** An image with associated bounding box insets. */
class BoundedImage {

  /** Image. */
  img;

  /** Image dimensions. */
  width, height;

  /** X and Y offsets. */
  xoff, yoff;

  /** Bounding boxes. */
  boxes = [];

  /** Constructs a bounded image with default parameters. */
  BoundedImage(img) {
    this(img, img.getWidth(), img.getHeight(), 0, 0);
  }

  /** Constructs an image with accompanying bounding box information. */
  BoundedImage(img, xoff, yoff) {
    this(img, img.getWidth(), img.getHeight(), xoff, yoff);
  }

  /** Constructs an image with accompanying bounding box information. */
  BoundedImage(img,
    width, height, xoff, yoff)
  {
    this.img = img;
    this.width = width;
    this.height = height;
    this.xoff = xoff; this.yoff = yoff;
  }

  /** Adds a bounding box to the image. */
  addBox(box) { boxes.push(box); }

  /** Removes the last bounding box from the image. */
  removeBox() {
    boxes.pop();
  }

  /** Gets image. */
  getImage() { return this.img; }

  /** Gets image width. */
  getWidth() { return this.width; }

  /** Gets image height. */
  getHeight() { return this.height; }

  /** Gets X offset. */
  getOffsetX() { return this.xoff; }

  /** Gets Y offset. */
  getOffsetY() { return this.yoff; }

  /** Gets bounding boxes given the image's top left coordinate. */
  getBoxes(x, y) {
    var len = this.boxes.length;
    var r = new Rectangle[len];
    for (var i=0; i<len; i++) {
      r[i] = boxes[i].getBox(x, y, width, height);
    }
    return r;
  }

}
