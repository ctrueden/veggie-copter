const PRELOAD = [
  "alex1.png", "alex2.png", "alex3.png",
  "alex-boss1.png",
  "paul1.png", "paul2.png", "paul3.png",
  "paul-boss1.png"
];

class ImageLoader {
  constructor() {
    this.images = {};
    for (int i=0; i<PRELOAD.length; i++) loadImage(PRELOAD[i]);
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
