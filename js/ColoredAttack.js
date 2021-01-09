/** Encapsulates an attack pattern with icon and color. */
class ColoredAttack extends AttackStyle {

  DARK_RED = new Color(95, 0, 0);
  ICON_SIZE = 21;

  image;
  color;

  ColoredAttack(t, c, img) {
    super(t);
    color = c;
    image = img;
  }

  /** Draws an icon representing this attack style in the given position. */
  drawIcon(g, x, y, selected) {
    var origColor = g.getColor();
    g.setColor(Color.white);
    g.drawRect(x, y, ICON_SIZE - 1, ICON_SIZE - 1);
    var h = power > 10 ? 19 : (2 * power - 1);
    g.setColor(selected ? DARK_RED : Color.black);
    g.fillRect(x + 1, y + 1, ICON_SIZE - 2, ICON_SIZE - h - 2);
    g.setColor(selected ? Color.red : Color.darkGray);
    g.fillRect(x + 1, y + ICON_SIZE - h - 1, ICON_SIZE - 2, h);
    g.drawImage(image, x + 1, y + 1, thing.getGame());
    g.setColor(origColor);
  }

  /** Gets color associated with this attack style. */
  getColor() { return color; }

  /**
   * Indicates control has been transferred to from this attack style,
   * and it is now active.
   */
  activate() { }

  /**
   * Indicates control has been transferred away from this attack style, and it
   * should cease functioning regardless of key press states or other factors.
   */
  clear() { }

}
