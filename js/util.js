// Utility functions and classes.

function clone(obj) {
  return Object.assign({}, obj);
}

function equalsIgnoreCase(s1, s2) {
    return s1.localeCompare(s2, undefined, { sensitivity: 'base' }) === 0;
}

function color(r, g, b, a) {
  return a == null ?
    `rgb(${r}, ${g}, ${b})` :
    `rgba(${r}, ${g}, ${b}, ${a})`;
}

function rgba(color) {
  // Credit: https://stackoverflow.com/a/10971090/1207769
  return color.replace(/[^\d,.%]/g, '').split(',');
}
function red(color) { return rgba(color)[0]; }
function green(color) { return rgba(color)[1]; }
function blue(color) { return rgba(color)[2]; }
function alpha(color) { return rgba(color)[3]; }

function makeImage(width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function context2d(canvas) {
  return canvas.getContext('2d');
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

  image(path) {
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
