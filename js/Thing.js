/** Thing is an object on the screen that moves around and has hit points. */
class Thing implements KeyListener {

  /** Type indicating evil entity. */
  const int EVIL = 0;

  /** Type indicating good entity. */
  const int GOOD = 1;

  /** Type indicating evil bullet. */
  const int EVIL_BULLET = 2;

  /** Type indicating good bullet. */
  const int GOOD_BULLET = 3;

  /** Type indicating power-up. */
  const int POWER_UP = 4;

  /** List of all possible types. */
  const int[] TYPES = {
    EVIL, GOOD, EVIL_BULLET, GOOD_BULLET, POWER_UP
  };

  /** How far offscreen objects must be before being discarded. */
  const int THRESHOLD = 50;

  /** Game to which this object belongs. */
  VeggieCopter game;

  /** Object's movement style. */
  MovementStyle move;

  /** Object's attack style. */
  AttackStyle attack;

  /** Position of the object. */
  xpos, ypos;

  /** List of images representing the object. */
  Vector images = new Vector();

  /** Index into images list for object's current status. */
  int imageIndex = -1;

  /** Hit points. */
  int hp = 1, maxhp = 1;

  /** Amount of damage the object inflicts. */
  int power = 1;

  /** The type of this object. */
  int type = EVIL;

  /** Number of times the object has been hit. */
  int hit;

  /** Constructs a new object. */
  Thing(game) { this.game = game; }

  /** Assigns object's movement style. */
  setMovement(ms) { move = ms; }

  /** Assigns object's attack style. */
  setAttack(as) { attack = as; }

  /** Assigns object's image list. */
  setImageList(BoundedImage[] images) {
    this.images.removeAllElements();
    if (images == null) imageIndex = -1;
    else {
      for (int i=0; i<images.length; i++) this.images.add(images[i]);
      imageIndex = this.images.isEmpty() ? -1 : 0;
    }
  }

  /** Changes the image representing the object. */
  setImageIndex(index) {
    if (index >= 0 && index < images.size()) imageIndex = index;
  }

  /** Assigns object's image. */
  setImage(image) {
    setImageList(new BoundedImage[] {image});
  }

  /** Assigns object's position. */
  setPos(x, y) {
    xpos = x;
    ypos = y;
    int width = getWidth(), height = getHeight();
    if (xpos < -width - THRESHOLD || ypos < -height - THRESHOLD ||
      xpos >= game.getWindowWidth() + THRESHOLD ||
      ypos >= game.getWindowHeight() + THRESHOLD)
    {
      hp = 0;
    }
  }

  /** Assigns object's position (coordinates). */
  setCPos(cx, cy) {
    setPos(cx - getWidth() / 2f, cy - getHeight() / 2f);
  }

  /** Assigns object's hit points. */
  setHP(hp) {
    if (hp > maxhp) hp = maxhp;
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
  draw(g) {
    BoundedImage img = getBoundedImage();
    if (img == null) return;
    int x = (int) (getX() + img.getOffsetX());
    int y = (int) (getY() + img.getOffsetY());
    g.drawImage(img.getImage(), x, y, game);
  }

  /** Hits this object for the given amount of damage. */
  hit(damage) {
    setHP(hp - damage);
    hit = 2 * damage;
  }

  /** Moves the object according to its movement style. */
  move() {
    if (isDead()) return;
    if (isHit()) hit--;
    if (move == null) return;
    move.move();
  }

  /** Instructs the object to attack according to its attack style. */
  Thing[] shoot() {
    if (isDead()) return null;
    if (attack == null) return null;
    return attack.shoot();
  }

  /**
   * Instructs the object to use its secondary (triggered)
   * attack according to its attack style.
   */
  Thing[] trigger() {
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
  float getX() { return xpos; }

  /** Gets object's Y coordinate. */
  float getY() { return ypos; }

  /** Gets object's centered X coordinate. */
  float getCX() { return getX() + getWidth() / 2f; }

  /** Gets object's centered Y coordinate. */
  float getCY() { return getY() + getHeight() / 2f; }

  /** Gets image representing this object. */
  Image getImage() {
    BoundedImage img = getBoundedImage();
    if (img == null) return null;
    return img.getImage();
  }

  /** Gets current image index into image list. */
  int getImageIndex() { return imageIndex; }

  /** Gets number of images in image list. */
  int getImageCount() { return images.size(); }

  /** Gets object's width. */
  int getWidth() {
    BoundedImage img = getBoundedImage();
    if (img == null) return -1;
    return img.getWidth();
  }

  /** Gets object's height. */
  int getHeight() {
    BoundedImage img = getBoundedImage();
    if (img == null) return -1;
    return img.getHeight();
  }

  /** Gets object's bounding boxes. */
  Rectangle[] getBoxes() {
    BoundedImage img = getBoundedImage();
    if (img == null) return null;
    return img.getBoxes((int) xpos, (int) ypos);
  }

  /** Gets object's current HP. */
  int getHP() { return hp; }

  /** Gets object's maximum HP value. */
  int getMaxHP() { return maxhp; }

  /** Gets object's power. */
  int getPower() { return power; }

  /** Gets object's type. */
  int getType() { return type; }

  /** Gets whether object has been hit. */
  boolean isHit() { return hit > 0; }

  /** Gets whether object is dead. */
  boolean isDead() { return hp <= 0; }

  /** Gets score value of the object. */
  int getScore() { return maxhp; }

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
    if (index < 0) return null;
    return (BoundedImage) images.elementAt(index);
  }

}
