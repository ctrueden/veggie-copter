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

/** Named colors from HTML/CSS. */
var Colors = {
  AliceBlue: 'rgb(240, 248, 255)',
  AntiqueWhite: 'rgb(250, 235, 215)',
  Aqua: 'rgb(0, 255, 255)',
  Aquamarine: 'rgb(127, 255, 212)',
  Azure: 'rgb(240, 255, 255)',
  Beige: 'rgb(245, 245, 220)',
  Bisque: 'rgb(255, 228, 196)',
  Black: 'rgb(0, 0, 0)',
  BlanchedAlmond: 'rgb(255, 235, 205)',
  Blue: 'rgb(0, 0, 255)',
  BlueViolet: 'rgb(138, 43, 226)',
  Brown: 'rgb(165, 42, 42)',
  BurlyWood: 'rgb(222, 184, 135)',
  CadetBlue: 'rgb(95, 158, 160)',
  Chartreuse: 'rgb(127, 255, 0)',
  Chocolate: 'rgb(210, 105, 30)',
  Coral: 'rgb(255, 127, 80)',
  CornflowerBlue: 'rgb(100, 149, 237)',
  Cornsilk: 'rgb(255, 248, 220)',
  Crimson: 'rgb(220, 20, 60)',
  Cyan: 'rgb(0, 255, 255)',
  DarkBlue: 'rgb(0, 0, 139)',
  DarkCyan: 'rgb(0, 139, 139)',
  DarkGoldenRod: 'rgb(184, 134, 11)',
  DarkGray: 'rgb(169, 169, 169)',
  DarkGrey: 'rgb(169, 169, 169)',
  DarkGreen: 'rgb(0, 100, 0)',
  DarkKhaki: 'rgb(189, 183, 107)',
  DarkMagenta: 'rgb(139, 0, 139)',
  DarkOliveGreen: 'rgb(85, 107, 47)',
  DarkOrange: 'rgb(255, 140, 0)',
  DarkOrchid: 'rgb(153, 50, 204)',
  DarkRed: 'rgb(139, 0, 0)',
  DarkSalmon: 'rgb(233, 150, 122)',
  DarkSeaGreen: 'rgb(143, 188, 143)',
  DarkSlateBlue: 'rgb(72, 61, 139)',
  DarkSlateGray: 'rgb(47, 79, 79)',
  DarkSlateGrey: 'rgb(47, 79, 79)',
  DarkTurquoise: 'rgb(0, 206, 209)',
  DarkViolet: 'rgb(148, 0, 211)',
  DeepPink: 'rgb(255, 20, 147)',
  DeepSkyBlue: 'rgb(0, 191, 255)',
  DimGray: 'rgb(105, 105, 105)',
  DimGrey: 'rgb(105, 105, 105)',
  DodgerBlue: 'rgb(30, 144, 255)',
  FireBrick: 'rgb(178, 34, 34)',
  FloralWhite: 'rgb(255, 250, 240)',
  ForestGreen: 'rgb(34, 139, 34)',
  Fuchsia: 'rgb(255, 0, 255)',
  Gainsboro: 'rgb(220, 220, 220)',
  GhostWhite: 'rgb(248, 248, 255)',
  Gold: 'rgb(255, 215, 0)',
  GoldenRod: 'rgb(218, 165, 32)',
  Gray: 'rgb(128, 128, 128)',
  Grey: 'rgb(128, 128, 128)',
  Green: 'rgb(0, 128, 0)',
  GreenYellow: 'rgb(173, 255, 47)',
  HoneyDew: 'rgb(240, 255, 240)',
  HotPink: 'rgb(255, 105, 180)',
  IndianRed: 'rgb(205, 92, 92)',
  Indigo: 'rgb(75, 0, 130)',
  Ivory: 'rgb(255, 255, 240)',
  Khaki: 'rgb(240, 230, 140)',
  Lavender: 'rgb(230, 230, 250)',
  LavenderBlush: 'rgb(255, 240, 245)',
  LawnGreen: 'rgb(124, 252, 0)',
  LemonChiffon: 'rgb(255, 250, 205)',
  LightBlue: 'rgb(173, 216, 230)',
  LightCoral: 'rgb(240, 128, 128)',
  LightCyan: 'rgb(224, 255, 255)',
  LightGoldenRodYellow: 'rgb(250, 250, 210)',
  LightGray: 'rgb(211, 211, 211)',
  LightGrey: 'rgb(211, 211, 211)',
  LightGreen: 'rgb(144, 238, 144)',
  LightPink: 'rgb(255, 182, 193)',
  LightSalmon: 'rgb(255, 160, 122)',
  LightSeaGreen: 'rgb(32, 178, 170)',
  LightSkyBlue: 'rgb(135, 206, 250)',
  LightSlateGray: 'rgb(119, 136, 153)',
  LightSlateGrey: 'rgb(119, 136, 153)',
  LightSteelBlue: 'rgb(176, 196, 222)',
  LightYellow: 'rgb(255, 255, 224)',
  Lime: 'rgb(0, 255, 0)',
  LimeGreen: 'rgb(50, 205, 50)',
  Linen: 'rgb(250, 240, 230)',
  Magenta: 'rgb(255, 0, 255)',
  Maroon: 'rgb(128, 0, 0)',
  MediumAquaMarine: 'rgb(102, 205, 170)',
  MediumBlue: 'rgb(0, 0, 205)',
  MediumOrchid: 'rgb(186, 85, 211)',
  MediumPurple: 'rgb(147, 112, 219)',
  MediumSeaGreen: 'rgb(60, 179, 113)',
  MediumSlateBlue: 'rgb(123, 104, 238)',
  MediumSpringGreen: 'rgb(0, 250, 154)',
  MediumTurquoise: 'rgb(72, 209, 204)',
  MediumVioletRed: 'rgb(199, 21, 133)',
  MidnightBlue: 'rgb(25, 25, 112)',
  MintCream: 'rgb(245, 255, 250)',
  MistyRose: 'rgb(255, 228, 225)',
  Moccasin: 'rgb(255, 228, 181)',
  NavajoWhite: 'rgb(255, 222, 173)',
  Navy: 'rgb(0, 0, 128)',
  OldLace: 'rgb(253, 245, 230)',
  Olive: 'rgb(128, 128, 0)',
  OliveDrab: 'rgb(107, 142, 35)',
  Orange: 'rgb(255, 165, 0)',
  OrangeRed: 'rgb(255, 69, 0)',
  Orchid: 'rgb(218, 112, 214)',
  PaleGoldenRod: 'rgb(238, 232, 170)',
  PaleGreen: 'rgb(152, 251, 152)',
  PaleTurquoise: 'rgb(175, 238, 238)',
  PaleVioletRed: 'rgb(219, 112, 147)',
  PapayaWhip: 'rgb(255, 239, 213)',
  PeachPuff: 'rgb(255, 218, 185)',
  Peru: 'rgb(205, 133, 63)',
  Pink: 'rgb(255, 192, 203)',
  Plum: 'rgb(221, 160, 221)',
  PowderBlue: 'rgb(176, 224, 230)',
  Purple: 'rgb(128, 0, 128)',
  RebeccaPurple: 'rgb(102, 51, 153)',
  Red: 'rgb(255, 0, 0)',
  RosyBrown: 'rgb(188, 143, 143)',
  RoyalBlue: 'rgb(65, 105, 225)',
  SaddleBrown: 'rgb(139, 69, 19)',
  Salmon: 'rgb(250, 128, 114)',
  SandyBrown: 'rgb(244, 164, 96)',
  SeaGreen: 'rgb(46, 139, 87)',
  SeaShell: 'rgb(255, 245, 238)',
  Sienna: 'rgb(160, 82, 45)',
  Silver: 'rgb(192, 192, 192)',
  SkyBlue: 'rgb(135, 206, 235)',
  SlateBlue: 'rgb(106, 90, 205)',
  SlateGray: 'rgb(112, 128, 144)',
  SlateGrey: 'rgb(112, 128, 144)',
  Snow: 'rgb(255, 250, 250)',
  SpringGreen: 'rgb(0, 255, 127)',
  SteelBlue: 'rgb(70, 130, 180)',
  Tan: 'rgb(210, 180, 140)',
  Teal: 'rgb(0, 128, 128)',
  Thistle: 'rgb(216, 191, 216)',
  Tomato: 'rgb(255, 99, 71)',
  Turquoise: 'rgb(64, 224, 208)',
  Violet: 'rgb(238, 130, 238)',
  Wheat: 'rgb(245, 222, 179)',
  White: 'rgb(255, 255, 255)',
  WhiteSmoke: 'rgb(245, 245, 245)',
  Yellow: 'rgb(255, 255, 0)',
  YellowGreen: 'rgb(154, 205, 50)'
};

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
  if (color in Colors) color = Colors[color];
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
  ctx.strokeStyle = Colors.White;
  ctx.rect(x, y, width - 1, height - 1);
  ctx.stroke();
}

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  get x2() { return this.x + this.width - 1; }
  get y2() { return this.y + this.height - 1; }

  intersects(that) {
    // Credit: https://stackoverflow.com/a/2752369/1207769
    return this.x <= that.x2 &&
           that.x <= this.x2 &&
           this.y <= that.y2 &&
           that.y <= this.y2;
  }
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
