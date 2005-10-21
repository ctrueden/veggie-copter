//
// Thing.java
//

import java.awt.*;
import java.awt.event.*;
import java.util.Vector;

/** Thing is an object on the screen that moves around and has hit points. */
public abstract class Thing implements KeyListener {

  // -- Constants --

  /** How far offscreen objects must be before being discarded. */
  protected static final int THRESHOLD = 50;


  // -- Fields --

  /** Game to which this object belongs. */
  protected VeggieCopter game;

  /** Object's movement style. */
  protected MovementStyle move;

  /** Object's attack style. */
  protected AttackStyle attack;

  /** Position of the object. */
  protected float xpos, ypos;

  /** List of images representing the object. */
  protected Vector images = new Vector();

  /** Index into images list for object's current status. */
  protected int imageIndex = -1;

  /** Hit points. */
  protected int hp = 1, maxhp = 1;

  /** Amount of damage the object inflicts. */
  protected int power = 1;

  /** Whether the object is evil. */
  protected boolean evil = true;

  /** Number of times the object has been hit. */
  protected int hit;


  // -- Constructor --

  /** Constructs a new object. */
  public Thing(VeggieCopter game) { this.game = game; }


  // -- Thing API methods --

  /** Assigns object's movement style. */
  public void setMovement(MovementStyle ms) { move = ms; }

  /** Assigns object's attack style. */
  public void setAttack(AttackStyle as) { attack = as; }

  /** Assigns object's image list. */
  public void setImageList(BoundedImage[] images) {
    this.images.removeAllElements();
    if (images == null) imageIndex = -1;
    else {
      for (int i=0; i<images.length; i++) this.images.add(images[i]);
      imageIndex = this.images.isEmpty() ? -1 : 0;
    }
  }

  /** Changes the image representing the object. */
  public void setImageIndex(int index) {
    if (index >= 0 && index < images.size()) imageIndex = index;
  }

  /** Assigns object's image. */
  public void setImage(BoundedImage image) {
    setImageList(new BoundedImage[] {image});
  }

  /** Assigns object's position. */
  public void setPos(float x, float y) {
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

  /** Assigns object's position (centered coordinates). */
  public void setCPos(float cx, float cy) {
    setPos(cx - getWidth() / 2f, cy - getHeight() / 2f);
  }

  /** Assigns object's hit points. */
  public void setHP(int hp) {
    if (hp > maxhp) hp = maxhp;
    this.hp = hp;
  }

  /** Assigns object's power. */
  public void setPower(int power) { this.power = power; }

  /** Toggles whether the object is evil. */
  public void setEvil(boolean evil) { this.evil = evil; }

  /** Draws the object onscreen. */
  public void draw(Graphics g) {
    BoundedImage img = getBoundedImage();
    if (img == null) return;
    int x = (int) (getX() + img.getOffsetX());
    int y = (int) (getY() + img.getOffsetY());
    g.drawImage(img.getImage(), x, y, game);
  }

  /** Hits this object for the given amount of damage. */
  public void hit(int damage) {
    setHP(hp - damage);
    hit = 2 * damage;
  }

  /** Moves the object according to its movement style. */
  public void move() {
    if (isDead()) return;
    if (isHit()) hit--;
    if (move == null) return;
    move.move();
  }

  /** Instructs the object to attack according to its attack style. */
  public Thing[] shoot() {
    if (isDead()) return null;
    if (attack == null) return null;
    return attack.shoot();
  }

  /**
   * Instructs the object to use its secondary (triggered)
   * attack according to its attack style.
   */
  public Thing[] trigger() {
    if (isDead()) return null;
    if (attack == null) return null;
    return attack.trigger();
  }

  /** Gets the game to which this object belongs. */
  public VeggieCopter getGame() { return game; }

  /** Gets the object's movement style. */
  public MovementStyle getMovement() { return move; }

  /** Gets the object's attack style. */
  public AttackStyle getAttack() { return attack; }

  /** Gets object's X coordinate. */
  public float getX() { return xpos; }

  /** Gets object's Y coordinate. */
  public float getY() { return ypos; }

  /** Gets object's centered X coordinate. */
  public float getCX() { return getX() + getWidth() / 2f; }

  /** Gets object's centered Y coordinate. */
  public float getCY() { return getY() + getHeight() / 2f; }

  /** Gets image representing this object. */
  public Image getImage() {
    BoundedImage img = getBoundedImage();
    if (img == null) return null;
    return img.getImage();
  }

  /** Gets current image index into image list. */
  public int getImageIndex() { return imageIndex; }

  /** Gets number of images in image list. */
  public int getImageCount() { return images.size(); }

  /** Gets object's width. */
  public int getWidth() {
    BoundedImage img = getBoundedImage();
    if (img == null) return -1;
    return img.getWidth();
  }

  /** Gets object's height. */
  public int getHeight() {
    BoundedImage img = getBoundedImage();
    if (img == null) return -1;
    return img.getHeight();
  }

  /** Gets object's bounding boxes. */
  public Rectangle[] getBoxes() {
    BoundedImage img = getBoundedImage();
    if (img == null) return null;
    return img.getBoxes((int) xpos, (int) ypos);
  }

  /** Gets object's current HP. */
  public int getHP() { return hp; }

  /** Gets object's maximum HP value. */
  public int getMaxHP() { return maxhp; }

  /** Gets object's power. */
  public int getPower() { return power; }

  /** Gets whether object is evil. */
  public boolean isEvil() { return evil; }

  /** Gets whether object has been hit. */
  public boolean isHit() { return hit > 0; }

  /** Gets whether object is dead. */
  public boolean isDead() { return hp <= 0; }

  /** Gets score value of the object. */
  public int getScore() { return maxhp; }

  /** Returns true if this object can harm the given one. */
  public boolean harms(Thing t) { return isEvil() != t.isEvil(); }


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) {
    if (move != null) move.keyPressed(e);
    if (attack != null) attack.keyPressed(e);
  }

  public void keyReleased(KeyEvent e) {
    if (move != null) move.keyReleased(e);
    if (attack != null) attack.keyReleased(e);
  }

  public void keyTyped(KeyEvent e) {
    if (move != null) move.keyTyped(e);
    if (attack != null) attack.keyTyped(e);
  }


  // -- Helper methods --

  protected BoundedImage getBoundedImage() {
    return getBoundedImage(imageIndex);
  }

  protected BoundedImage getBoundedImage(int index) {
    if (index < 0) return null;
    return (BoundedImage) images.elementAt(index);
  }

}
