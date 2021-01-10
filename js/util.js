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
