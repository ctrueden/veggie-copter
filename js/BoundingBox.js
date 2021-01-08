class BoundingBox {

  /** Bounding box insets. */
  x1, y1, x2, y2;

  /** Constructs a bounding box of default size. */
  BoundingBox() { this(0, 0, 0, 0); }

  /** Constructs a bounding box with the given insets. */
  BoundingBox(x1, y1, x2, y2) {
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
  }

  /** Gets bounding box given the coordinates, width and height. */
  Rectangle getBox(x, y, width, height) {
    int w = width - x1 - x2 - 1;
    int h = height - y1 - y2 - 1;
    if (w < 1) w = 1;
    if (h < 1) h = 1;
    return new Rectangle(x + x1, y + y1, w, h);
  }

}
