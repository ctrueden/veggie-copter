// Base data structures.

/**
 * Insets in space. The four coordinates are pixel distances from the
 * left, top, right, and bottom of some unspecified rectangle. As such,
 * this object has no intrinsic width and height of its own.
 */
class BoxInsets {
  constructor(left, upper, right, lower) {
    this.left = left == null ? 0 : left;
    this.upper = upper == null ? 0 : upper;
    this.right = right == null ? 0 : right;
    this.lower = lower == null ? 0 : lower;
  }

  /** Gets rectangle bounds given XY coordinates plus width and height. */
  rect(x, y, width, height) {
    var w = Math.max(1, width - this.left - this.right - 1);
    var h = Math.max(1, height - this.upper - this.lower - 1);
    return new Rectangle(x + this.left, y + this.upper, w, h);
  }
}

/** An image plus associated bounding box insets. */
class Sprite {
  constructor(image, width, height, xoff, yoff) {
    this.image = image;                                   // Image.
    this.width = width == null ? image.width : width;     // Image width.
    this.height = height == null ? image.height : height; // Image height.
    this.xoff = xoff == null ? 0 : xoff;                  // X offset.
    this.yoff = yoff == null ? 0 : yoff;                  // Y offset.
    this.boxes = [];                                      // Bounding box insets.
  }

  /** Adds a bounding box to the image. */
  addBox(box) { this.boxes.push(box); }

  /** Gets bounding rectangles relative to the given top left coordinate. */
  bounds(x, y) {
    return this.boxes.map(box => box.rect(x, y, this.width, this.height));
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
  shoot() { return []; }

  /**
   * Instructs the thing to perform a secondary trigger action,
   * if it has one.
   */
  trigger() { return []; }

  /** Gets power level of this attack style. */
  get power() { return this._power; }

  /** Sets power level of this attack style. */
  set power(power) { this._power = power; }

  keyPressed(e) { }
  keyReleased(e) { }
}

var ThingTypes = {
  EVIL: 0,        // evil entity
  GOOD: 1,        // good entity
  EVIL_SHOT: 2,   // a shot with evil alignment
  GOOD_SHOT: 3,   // a shot with good alignment
  POWER_UP: 4,    // power-up
};

/** An object on the screen that can (potentially) move and attack. */
class Thing {
  constructor(game) {
    this.game = game;            // Game to which this object belongs.
    this.movement = null;        // Object's movement style.
    this.attack = null;          // Object's attack style.
    this.xpos = this.ypos = 0;   // Position of the object.
    this.sprites = {};           // Collection of sprites representing the object.
    this.activeSpriteKey = null; // Name key of object's active sprite.
    this.hp = this.maxHP = 1;    // Hit points.
    this.power = 1;              // Amount of damage the object inflicts.
    this.type = ThingTypes.EVIL; // The type of this object.
    this.hit = 0;                // Number of times the object has been hit.

    this.threshold = 50;         // How far offscreen object must be before being discarded.
  }

  /** Assigns object's collection of sprites. */
  setSprites(sprites, activeSpriteKey) {
    if (sprites == null) {
      this.sprites = {};
      this.activeSpriteKey = null;
    }
    else {
      this.sprites = clone(sprites);
      this.activateSprite(activeSpriteKey);
    }
  }

  setSprite(sprite) { this.setSprites({0: sprite}, 0); }

  /** Changes the sprite currently representing the object. */
  activateSprite(key) {
    if (key == null || key in this.sprites) this.activeSpriteKey = key;
    else this.noSuchSprite(key);
  }

  /** Assigns object's position. */
  setPos(x, y) {
    this.xpos = x;
    this.ypos = y;
    if (this.xpos < -this.width - this.threshold ||
        this.ypos < -this.height - this.threshold ||
        this.xpos >= this.game.width + this.threshold ||
        this.ypos >= this.game.height + this.threshold)
    {
      this.hp = 0;
    }
  }

  /** Assigns object's position (coordinates). */
  setCPos(cx, cy) {
    this.setPos(cx - this.width / 2, cy - this.height / 2);
  }

  /** Gets the object's current hit points. */
  get hp() { return this._hp; }

  /** Assigns object's hit points. */
  set hp(hp) { this._hp = Math.min(hp, this.maxHP); }

  /** Gets object's power. */
  get power() { return this._power; }

  /** Assigns object's power. */
  set power(power) { this._power = power; }

  /** Draws the object onto the given canvas context. */
  draw(ctx) {
    if (this.sprite() == null) return;
    var x = Math.trunc(this.xpos + this.sprite().xoff);
    var y = Math.trunc(this.ypos + this.sprite().yoff);
    ctx.drawImage(this.sprite().image, x, y);
  }

  /** Hits this object for the given amount of damage. */
  damage(amount) {
    this.hp -= amount;
    this.hit = 2 * amount;
  }

  /** Moves the object according to its movement style. */
  move() {
    if (this.isDead()) return;
    if (this.isHit()) this.hit--;
    if (this.movement) this.movement.move();
  }

  /** Instructs the object to attack according to its attack style. */
  shoot() {
    return this.attack && !this.isDead() ? this.attack.shoot() : [];
  }

  /**
   * Instructs the object to use its secondary (triggered)
   * attack according to its attack style.
   */
  trigger() {
    return this.attack && !this.isDead() ? this.attack.trigger() : [];
  }

  /** Gets object's centered X coordinate. */
  get cx() { return this.xpos + this.width / 2; }

  /** Gets object's centered Y coordinate. */
  get cy() { return this.ypos + this.height / 2; }

  /** Gets image of the object's active sprite. */
  get image() {
    var sprite = this.sprite();
    return sprite == null ? null : sprite.image;
  }

  /** Gets object's width. */
  get width() {
    var sprite = this.sprite();
    return sprite == null ? -1 : sprite.width;
  }

  /** Gets object's height. */
  get height() {
    var sprite = this.sprite();
    return sprite == null ? -1 : sprite.height;
  }

  /** Gets bounding rectangles of the object's active sprite. */
  get bounds() {
    return this.sprite() == null ? [] : this.sprite().bounds(this.xpos, this.ypos);
  }

  /** Gets whether object has been hit. */
  isHit() { return this.hit > 0; }

  /** Gets whether object is dead. */
  isDead() { return this.hp <= 0; }

  /** Gets score value of the object. */
  get score() { return this.maxHP; }

  /** Returns true if this object can harm the given one. */
  harms(t) {
    return (this.type == ThingTypes.GOOD      && t.type == ThingTypes.EVIL) ||
           (this.type == ThingTypes.EVIL      && t.type == ThingTypes.GOOD) ||
           (this.type == ThingTypes.GOOD_SHOT && t.type == ThingTypes.EVIL) ||
           (this.type == ThingTypes.EVIL      && t.type == ThingTypes.GOOD_SHOT) ||
           (this.type == ThingTypes.GOOD      && t.type == ThingTypes.EVIL_SHOT) ||
           (this.type == ThingTypes.EVIL_SHOT && t.type == ThingTypes.GOOD);
  }

  keyPressed(e) {
    if (this.movement) this.movement.keyPressed(e);
    if (this.attack) this.attack.keyPressed(e);
  }

  keyReleased(e) {
    if (this.movement) this.movement.keyReleased(e);
    if (this.attack) this.attack.keyReleased(e);
  }

  /** Retrieves the sprite with the given name key. */
  sprite(key) {
    if (key == null) key = this.activeSpriteKey;
    if (key == null) return null;
    if (!(key in this.sprites)) this.noSuchSprite(key);
    else return this.sprites[key];
  }

  noSuchSprite(key) {
    console.error(this + ": no such sprite image: " + key);
  }
}
