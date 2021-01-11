// Base data structures.

/** A rectangle in space. */
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

/** An image with associated bounding box insets. */
class BoundedImage {
  constructor(img, width, height, xoff, yoff) {
    this.img = img;                                      // Image.
    this.width = width == null ? img.width : width;      // Image width.
    this.height = height == null ? img.height : height;  // Image height.
    this.xoff = xoff == null ? 0 : xoff;                 // X offset.
    this.yoff = yoff == null ? 0 : yoff;                 // Y offset.
    this.boxes = [];                                     // Bounding boxes.
  }

  /** Adds a bounding box to the image. */
  addBox(box) { this.boxes.push(box); }

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
    var r = [];
    for (var i=0; i<this.boxes.length; i++) {
      r.push(this.boxes[i].getBox(x, y, width, height));
    }
    return r;
  }
}

/** A movement pattern. */
class MovementStyle {
  constructor(t) {
    this.thing = t; // Thing upon which this movement style object operates.
  }

  /** Moves according to this movement style. */
  move() { }

  keyPressed(e) { }
  keyReleased(e) { }
}

/** An attack pattern. */
class AttackStyle {
  constructor(t) {
    this.thing = t; // Thing upon which this attack style object operates.
    this.power = 1; // Amount of damage the attack style inflicts.
  }

  /** Instructs the thing to fire a shot (but only if it wants to). */
  shoot() { }

  /**
   * Instructs the thing to perform a secondary trigger action,
   * if it has one.
   */
  trigger() { }

  /** Sets power level of this attack style. */
  setPower(power) { this.power = power; }

  /** Gets power level of this attack style. */
  getPower() { return this.power; }

  keyPressed(e) { }
  keyReleased(e) { }
}

var ThingTypes = {
  EVIL: 0,        // evil entity
  GOOD: 1,        // good entity
  EVIL_BULLET: 2, // evil bullet
  GOOD_BULLET: 3, // good bullet
  POWER_UP: 4,    // power-up
};

/** An object on the screen that can (potentially) move and attack. */
class Thing {
  constructor(game) {
    this.game = game;            // Game to which this object belongs.
    this.move = null;            // Object's movement style.
    this.attack = null;          // Object's attack style.
    this.xpos = this.ypos = 0;   // Position of the object.
    this.images = {};            // Collection of images representing the object.
    this.activeImage = null;     // Name key of image for object's current status.
    this.hp = this.maxhp = 1;    // Hit points.
    this.power = 1;              // Amount of damage the object inflicts.
    this.type = ThingTypes.EVIL; // The type of this object.
    this.hit = 0;                // Number of times the object has been hit.

    this.threshold = 50;         // How far offscreen object must be before being discarded.
  }

  /** Assigns object's movement style. */
  setMovement(ms) { this.move = ms; }

  /** Assigns object's attack style. */
  setAttack(as) { this.attack = as; }

  /** Assigns object's collection of images. */
  setImages(images, activeImage) {
    if (images == null) {
      this.images = {};
      this.activeImage = null;
    }
    else {
      this.images = clone(images);
      this.activateImage(activeImage);
    }
  }

  /** Changes the image currently representing the object. */
  activateImage(imageName) {
    if (imageName == null || imageName in this.images) this.activeImage = imageName;
    else this.noSuchImage(imageName);
  }

  /** Assigns object's position. */
  setPos(x, y) {
    this.xpos = x;
    this.ypos = y;
    var width = this.getWidth(), height = this.getHeight();
    if (this.xpos < -width - this.threshold ||
        this.ypos < -height - this.threshold ||
        this.xpos >= this.game.width + this.threshold ||
        this.ypos >= this.game.height + this.threshold)
    {
      this.hp = 0;
    }
  }

  /** Assigns object's position (coordinates). */
  setCPos(cx, cy) {
    setPos(cx - getWidth() / 2, cy - getHeight() / 2);
  }

  /** Assigns object's hit points. */
  setHP(hp) {
    if (hp > this.maxhp) hp = this.maxhp;
    this.hp = hp;
  }

  /** Assigns object's power. */
  setPower(power) { this.power = power; }

  /** Assigns object's type, from the ThingTypes enumeration. */
  setType(type) { this.type = type; }

  /** Draws the object onto the given canvas context. */
  draw(ctx) {
    var img = this.getBoundedImage();
    if (img == null) return;
    var x = Math.trunc(getX() + img.getOffsetX());
    var y = Math.trunc(getY() + img.getOffsetY());
    ctx.drawImage(img.getImage(), x, y);
  }

  /** Hits this object for the given amount of damage. */
  hit(damage) {
    setHP(this.hp - damage);
    this.hit = 2 * damage;
  }

  /** Moves the object according to its movement style. */
  move() {
    if (isDead()) return;
    if (isHit()) this.hit--;
    if (move != null) return;
    this.move.move();
  }

  /** Instructs the object to attack according to its attack style. */
  shoot() {
    if (this.isDead()) return null;
    if (this.attack == null) return null;
    return this.attack.shoot();
  }

  /**
   * Instructs the object to use its secondary (triggered)
   * attack according to its attack style.
   */
  trigger() {
    if (this.isDead()) return null;
    if (this.attack == null) return null;
    return this.attack.trigger();
  }

  /** Gets the game to which this object belongs. */
  getGame() { return this.game; }

  /** Gets the object's movement style. */
  getMovement() { return this.move; }

  /** Gets the object's attack style. */
  getAttack() { return this.attack; }

  /** Gets object's X coordinate. */
  getX() { return this.xpos; }

  /** Gets object's Y coordinate. */
  getY() { return this.ypos; }

  /** Gets object's centered X coordinate. */
  getCX() { return this.getX() + this.getWidth() / 2; }

  /** Gets object's centered Y coordinate. */
  getCY() { return this.getY() + this.getHeight() / 2; }

  /** Gets image representing this object. */
  getImage() {
    var img = this.getBoundedImage();
    return img == null ? null : img.getImage();
  }

  /** Gets current image index into image list. */
  getImageIndex() { return this.imageIndex; }

  /** Gets number of images in image list. */
  getImageCount() { return this.images.length; }

  /** Gets object's width. */
  getWidth() {
    var img = this.getBoundedImage();
    return img == null ? -1 : img.getWidth();
  }

  /** Gets object's height. */
  getHeight() {
    var img = this.getBoundedImage();
    return img == null ? -1 : img.getHeight();
  }

  /** Gets object's bounding boxes. */
  getBoxes() {
    var img = this.getBoundedImage();
    return img == null ? null : img.getBoxes(this.xpos, this.ypos);
  }

  /** Gets object's current HP. */
  getHP() { return this.hp; }

  /** Gets object's maximum HP value. */
  getMaxHP() { return this.maxhp; }

  /** Gets object's power. */
  getPower() { return this.power; }

  /** Gets object's type. */
  getType() { return this.type; }

  /** Gets whether object has been hit. */
  isHit() { return this.hit > 0; }

  /** Gets whether object is dead. */
  isDead() { return this.hp <= 0; }

  /** Gets score value of the object. */
  getScore() { return this.maxhp; }

  /** Returns true if this object can harm the given one. */
  harms(t) {
    return (this.type == ThingTypes.GOOD        && t.type == ThingTypes.EVIL) ||
           (this.type == ThingTypes.EVIL        && t.type == ThingTypes.GOOD) ||
           (this.type == ThingTypes.GOOD_BULLET && t.type == ThingTypes.EVIL) ||
           (this.type == ThingTypes.EVIL        && t.type == ThingTypes.GOOD_BULLET) ||
           (this.type == ThingTypes.GOOD        && t.type == ThingTypes.EVIL_BULLET) ||
           (this.type == ThingTypes.EVIL_BULLET && t.type == ThingTypes.GOOD);
  }

  keyPressed(e) {
    if (this.move != null) move.keyPressed(e);
    if (this.attack != null) attack.keyPressed(e);
  }

  keyReleased(e) {
    if (this.move != null) move.keyReleased(e);
    if (this.attack != null) attack.keyReleased(e);
  }

  getBoundedImage(imageName) {
    if (imageName == null) imageName = this.imageName;
    if (imageName == null) return null;
    if (!(imageName in this.images)) this.noSuchImage(imageName);
    else return this.images[imageName];
  }

  noSuchImage(imageName) {
    console.error(this + ": no such image: " + imageName);
  }
}
