package net.restlesscoder.heli;

import java.awt.Rectangle;

public class BoundingBox {

  // -- Fields --

  /** Bounding box insets. */
  public int x1, y1, x2, y2;


  // -- Constructor --

  /** Constructs a bounding box of default size. */
  public BoundingBox() { this(0, 0, 0, 0); }

  /** Constructs a bounding box with the given insets. */
  public BoundingBox(int x1, int y1, int x2, int y2) {
    this.x1 = x1; this.y1 = y1;
    this.x2 = x2; this.y2 = y2;
  }


  // -- BoundingBox API methods --

  /** Gets bounding box given the coordinates, width and height. */
  public Rectangle getBox(int x, int y, int width, int height) {
    int w = width - x1 - x2 - 1;
    int h = height - y1 - y2 - 1;
    if (w < 1) w = 1;
    if (h < 1) h = 1;
    return new Rectangle(x + x1, y + y1, w, h);
  }

}
