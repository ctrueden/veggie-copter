// Utility functions and classes.

/**
 * Appends all elements of data to the given array.
 * Like array.concat(data), but mutating in place.
 */
function append(array, data) {
  data.forEach(element => array.push(element));
}

/**
 * Makes a shallow copy of the given object. This means creating a new object
 * with all the same members as the original, pointing to the same values.
 */
function clone(obj) {
  return Object.assign({}, obj);
}

/** Tests if two strings are equal except for case differences. */
function equalsIgnoreCase(s1, s2) {
    return s1.localeCompare(s2, undefined, { sensitivity: 'base' }) === 0;
}

/**
 * Constructs a color string with the given red, green, blue, and alpha values.
 * The color values should be in the range [0, 255]; the alpha value should be
 * in the range [0.0, 1.0].
 */
function color(r, g, b, a) {
  return a == null ?
    `rgb(${r}, ${g}, ${b})` :
    `rgba(${r}, ${g}, ${b}, ${a})`;
}

/** Extracts [red, green, blue, alpha] values from an rgb/rgba string. */
function rgba(color) {
  // Credit: https://stackoverflow.com/a/10971090/1207769
  return color.replace(/[^\d,.%]/g, '').split(',');
}

/** Extracts red value from an rgb/rgba string. */
function red(color) { return rgba(color)[0]; }

/** Extracts green value from an rgb/rgba string. */
function green(color) { return rgba(color)[1]; }

/** Extracts blue value from an rgb/rgba string. */
function blue(color) { return rgba(color)[2]; }

/** Extracts alpha value from an rgb/rgba string. */
function alpha(color) { return rgba(color)[3]; }

/** Creates an image canvas of the given dimensions. */
function makeImage(width, height) {
  var canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

/** Obtains a 2D drawing context for the given image canvas. */
function context2d(canvas) {
  return canvas.getContext('2d');
}

/** Draws an outlined rectangle of the given dimensions. */
function drawOutlinedRect(ctx, color, x, y, width, height) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, width - 1, height - 1);
  ctx.beginPath();
  ctx.strokeStyle = "white";
  ctx.rect(x, y, width - 1, height - 1);
  ctx.stroke();
}

/** Helper class for loading and caching images from external sources. */
class ImageLoader {
  constructor() {
    this.images = {};
  }

  image(path) {
    if (!(path in this.images)) {
      var image = new Image();
      image.src = path;
      this.images[path] = image;
    }
    return this.images[path];
  }
}
