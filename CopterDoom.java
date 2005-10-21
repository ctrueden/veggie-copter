//
// CopterDoom.java
//

import java.awt.*;

public class CopterDoom extends Thing {

  // -- Constants --

  private static final int FLUX_BOTTOM = 72;
  private static final int FLUX_RATE = 3;
  private static final int FLUX_COUNT = 6;


  // -- Fields --

  private int flux = FLUX_BOTTOM;
  private boolean fluxDir = true;


  // -- Constructor --

  public CopterDoom(Thing thing) {
    super(thing.getGame());
    type = GOOD_BULLET;
    move = new DoomMovement(this, thing);
    maxhp = hp = Integer.MAX_VALUE;
  }


  // -- Thing API methods --

  /** Draws the object onscreen. */
  public void draw(Graphics g) {
    int w = game.getWidth();
    int h = game.getHeight();
    g.setColor(new Color(96, 96, 96, flux));
    g.fillRect(0, 0, w, h);
    if (fluxDir) flux += power * FLUX_RATE;
    else flux -= power * FLUX_RATE;
    int max = FLUX_BOTTOM + power * FLUX_RATE * FLUX_COUNT;
    if (max > 255) max = 255;
    if (flux >= max) {
      flux = max;
      fluxDir = false;
    }
    else if (flux <= FLUX_BOTTOM) {
      flux = FLUX_BOTTOM;
      fluxDir = true;
    }
  }

  /** Gets object's bounding boxes. */
  public Rectangle[] getBoxes() {
    return new Rectangle[] {
      new Rectangle(0, 0, game.getWidth(), game.getHeight())
    };
  }

}
