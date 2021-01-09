/** Thing is an object on the screen that moves around and has hit points. */ class Thing implements KeyListener {

  /** Type indicating evil entity. */
  EVIL = 0;

  /** Type indicating good entity. */
  GOOD = 1;

  /** Type indicating evil bullet. */
  EVIL_BULLET = 2;

  /** Type indicating good bullet. */
  GOOD_BULLET = 3;

  /** Type indicating power-up. */
  POWER_UP = 4;

  /** List of all possible types. */
  TYPES = [
    EVIL, GOOD, EVIL_BULLET, GOOD_BULLET, POWER_UP
  ];

  /** How far offscreen objects must be before being discarded. */
  THRESHOLD = 50;

  constructor(game) {
    this.game = game;          // Game to which this object belongs.
    this.move = null;          // Object's movement style.
    this.attack = null;        // Object's attack style.
    this.xpos = this.ypos = 0; // Position of the object.
    this.images = [];          // List of images representing the object.
    this.imageIndex = -1;      // Index into images list for object's current status.
    this.hp = this.maxhp = 1;  // Hit points.
    this.power = 1;            // Amount of damage the object inflicts.
    this.type = EVIL;          // The type of this object.
    this.hit = 0;              // Number of times the object has been hit.
  }

  /** Assigns object's movement style. */
  setMovement(ms) { this.move = ms; }

  /** Assigns object's attack style. */
  setAttack(as) { this.attack = as; }

  /** Assigns object's image list. */
  setImageList(images) {
    this.images.removeAllElements();
    if (images == null) this.imageIndex = -1;
    else {
      this.images.concat(images);
      this.imageIndex = this.images.isEmpty() ? -1 : 0;
    }
  }

  /** Changes the image representing the object. */
  setImageIndex(index) {
    if (index >= 0 && index < this.images.length) this.imageIndex = index;
  }

  /** Assigns object's image. */
  setImage(image) {
    setImageList([image]);
  }

  /** Assigns object's position. */
  setPos(x, y) {
    this.xpos = x;
    this.ypos = y;
    var width = getWidth(), height = getHeight();
    if (this.xpos < -width - THRESHOLD || this.ypos < -height - THRESHOLD ||
      this.xpos >= this.game.getWindowWidth() + THRESHOLD ||
      this.ypos >= this.game.getWindowHeight() + THRESHOLD)
    {
      this.hp = 0;
    }
  }

  /** Assigns object's position (coordinates). */
  setCPos(cx, cy) {
    setPos(cx - getWidth() / 2f, cy - getHeight() / 2f);
  }

  /** Assigns object's hit points. */
  setHP(hp) {
    if (hp > this.maxhp) hp = this.maxhp;
    this.hp = hp;
  }

  /** Assigns object's power. */
  setPower(power) { this.power = power; }

  /**
   * Assigns object's type.
   * Valid types are:
   * <li>GOOD
   * <li>EVIL
   * <li>GOOD_BULLET
   * <li>EVIL_BULLET
   */
  setType(type) { this.type = type; }

  /** Draws the object onscreen. */
  draw(ctx) {
    var img = getBoundedImage();
    if (img == null) return;
    var x = Math.trunc(getX() + img.getOffsetX());
    var y = Math.trunc(getY() + img.getOffsetY());
    ctx.drawImage(img.getImage(), x, y, this.game);
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
    if (move == null) return;
    this.move.move();
  }

  /** Instructs the object to attack according to its attack style. */
  shoot() {
    if (isDead()) return null;
    if (attack == null) return null;
    return attack.shoot();
  }

  /**
   * Instructs the object to use its secondary (triggered)
   * attack according to its attack style.
   */
  trigger() {
    if (isDead()) return null;
    if (attack == null) return null;
    return attack.trigger();
  }

  /** Gets the game to which this object belongs. */
  VeggieCopter getGame() { return game; }

  /** Gets the object's movement style. */
  MovementStyle getMovement() { return move; }

  /** Gets the object's attack style. */
  AttackStyle getAttack() { return attack; }

  /** Gets object's X coordinate. */
  var getX() { return xpos; }

  /** Gets object's Y coordinate. */
  var getY() { return ypos; }

  /** Gets object's centered X coordinate. */
  var getCX() { return getX() + getWidth() / 2f; }

  /** Gets object's centered Y coordinate. */
  var getCY() { return getY() + getHeight() / 2f; }

  /** Gets image representing this object. */
  Image getImage() {
    BoundedImage img = getBoundedImage();
    if (img == null) return null;
    return img.getImage();
  }

  /** Gets current image index into image list. */
  var getImageIndex() { return imageIndex; }

  /** Gets number of images in image list. */
  var getImageCount() { return images.length; }

  /** Gets object's width. */
  var getWidth() {
    BoundedImage img = getBoundedImage();
    if (img == null) return -1;
    return img.getWidth();
  }

  /** Gets object's height. */
  var getHeight() {
    BoundedImage img = getBoundedImage();
    if (img == null) return -1;
    return img.getHeight();
  }

  /** Gets object's bounding boxes. */
  getBoxes() {
    BoundedImage img = getBoundedImage();
    if (img == null) return null;
    return img.getBoxes(xpos, ypos);
  }

  /** Gets object's current HP. */
  var getHP() { return hp; }

  /** Gets object's maximum HP value. */
  var getMaxHP() { return maxhp; }

  /** Gets object's power. */
  var getPower() { return power; }

  /** Gets object's type. */
  var getType() { return type; }

  /** Gets whether object has been hit. */
  boolean isHit() { return hit > 0; }

  /** Gets whether object is dead. */
  boolean isDead() { return hp <= 0; }

  /** Gets score value of the object. */
  var getScore() { return maxhp; }

  /** Returns true if this object can harm the given one. */
  boolean harms(t) {
    return (type == GOOD && t.type == EVIL) ||
      (type == EVIL && t.type == GOOD) ||
      (type == GOOD_BULLET && t.type == EVIL) ||
      (type == EVIL && t.type == GOOD_BULLET) ||
      (type == GOOD && t.type == EVIL_BULLET) ||
      (type == EVIL_BULLET && t.type == GOOD);
  }

  keyPressed(e) {
    if (move != null) move.keyPressed(e);
    if (attack != null) attack.keyPressed(e);
  }

  keyReleased(e) {
    if (move != null) move.keyReleased(e);
    if (attack != null) attack.keyReleased(e);
  }

  BoundedImage getBoundedImage() {
    return getBoundedImage(imageIndex);
  }

  BoundedImage getBoundedImage(index) {
    return index < 0 ? null : images[index];
  }

}
