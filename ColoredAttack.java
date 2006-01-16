//
// ColoredAttack.java
//

import java.awt.*;

/** Encapsulates an attack pattern with icon and color. */
public abstract class ColoredAttack extends AttackStyle {

  // -- Constants --

  protected static final Color DARK_RED = new Color(95, 0, 0);
  protected static final int ICON_SIZE = 21;


  // -- Fields --

  protected Image image;
  protected Color color;


  // -- Constructor --

  public ColoredAttack(Thing t, Color c, Image img) {
    super(t);
    color = c;
    image = img;
  }


  // -- ColoredAttack API methods --

  /** Draws an icon representing this attack style in the given position. */
  public void drawIcon(Graphics g, int x, int y, boolean selected) {
    Color origColor = g.getColor();
    g.setColor(Color.white);
    g.drawRect(x, y, ICON_SIZE - 1, ICON_SIZE - 1);
    int h = power > 10 ? 19 : (2 * power - 1);
    g.setColor(selected ? DARK_RED : Color.black);
    g.fillRect(x + 1, y + 1, ICON_SIZE - 2, ICON_SIZE - h - 2);
    g.setColor(selected ? Color.red : Color.darkGray);
    g.fillRect(x + 1, y + ICON_SIZE - h - 1, ICON_SIZE - 2, h);
    g.drawImage(image, x + 1, y + 1, thing.getGame());
    g.setColor(origColor);
  }

  /** Gets color associated with this attack style. */
  public Color getColor() { return color; }

  /**
   * Indicates control has been transferred to from this attack style,
   * and it is now active.
   */
  public void activate() { }

  /**
   * Indicates control has been transferred away from this attack style, and it
   * should cease functioning regardless of key press states or other factors.
   */
  public void clear() { }

}
