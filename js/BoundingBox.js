class BoundingBox {
  /** Constructs a bounding box with the given insets. */
  constructor(x1, y1, x2, y2) {
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
  }

  /** Gets bounding box given the coordinates, width and height. */
  getBox(x, y, width, height) {
    var w = width - this.x1 - this.x2 - 1;
    var h = height - this.y1 - this.y2 - 1;
    if (w < 1) w = 1;
    if (h < 1) h = 1;
    return new Rectangle(x + this.x1, y + this.y1, w, h);
  }
}
