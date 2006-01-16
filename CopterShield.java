//
// CopterShield.java
//

public class CopterShield extends Thing {

  protected static final int SIZE = 7;

  protected static BoundedImage[] images;
  protected static int count = 0;


  // -- Constructor --

  public CopterShield(Thing thing, float angle) {
    super(thing.getGame());
    type = GOOD;
    move = new ShieldMovement(this, thing, angle);
    if (images == null) {
      images = new BoundedImage[] {
        game.loadImage("james-spade.png"),
        game.loadImage("james-heart.png"),
        game.loadImage("james-diamond.png"),
        game.loadImage("james-club.png")
      };
      for (int i=0; i<images.length; i++) images[i].addBox(new BoundingBox());
    }
    setImage(images[count % images.length]);
    count++;
  }


  // -- CopterShield API methods --

  public void setExtended(boolean extended) {
    ((ShieldMovement) move).setExtended(extended);
  }


  // -- Thing API methods --

  /** Shields cannot be destroyed. */
  public void hit(int damage) { }

}
