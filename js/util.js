// Utility functions and classes.

function equalsIgnoreCase(s1, s2) {
    return s1.localeCompare(s2, undefined, { sensitivity: 'base' }) === 0;
}

function drawOutlinedRect(ctx, color, x, y, width, height) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width - 1, height - 1);
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.rect(x, y, width - 1, height - 1);
  ctx.stroke();
}

class ImageLoader {
  constructor() {
    this.images = {};
  }

  getImage(path) {
    if (path in this.images) return this.images[path];
    var image = this.loadImage(path);
    this.images[path] = image;
    return image;
  }

  loadImage(path) {
    var image = new Image();
    image.src = path;
    return image;
  }
}

class BoundingBox {
  constructor(x1, y1, x2, y2) {
    this.x1 = x1 == null ? 0 : x1;
    this.y1 = y1 == null ? 0 : y1;
    this.x2 = x2 == null ? 0 : x2;
    this.y2 = y2 == null ? 0 : y2;
  }

  get width() { return this.x2 - this.x1 + 1; }
  get height() { return this.y2 - this.y1 + 1; }

  /** Gets bounding box given the coordinates, width and height. */
  getBox(x, y, width, height) {
    var w = width - this.x1 - this.x2 - 1;
    var h = height - this.y1 - this.y2 - 1;
    if (w < 1) w = 1;
    if (h < 1) h = 1;
    return {x: x + this.x1, y: y + this.y1, width: w, height: h};
  }
}
