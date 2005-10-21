//
// Stage.java
//

import java.awt.*;

/** Contains information regarding a specific stage of the game. */
public class Stage {

  // -- Constants --

  public static final int TOP_LEFT = 10;
  public static final int IMAGE_SIZE = 154;
  public static final int ICON_SIZE = 50;

  private static final Font BIG = new Font("SansSerif", Font.BOLD, 36);
  private static final Font SMALL = new Font("SansSerif", Font.PLAIN, 12);

  private static final Color DARK_RED = new Color(48, 0, 0);


  // -- Fields --

  protected VeggieCopter game;
  protected String name;
  protected ScriptingEngine script;
  protected Image image, icon;
  protected int imageWidth, imageHeight, iconWidth, iconHeight;
  protected String[] description;
  protected boolean completed;


  // -- Constructor --

  /** Constructs a playable stage. */
  public Stage(VeggieCopter game, String name,
    String prefix, String[] description)
  {
    this.game = game;
    this.name = name;
    this.script = new ScriptingEngine(game, prefix + ".txt");
    this.image = game.loadImage(prefix + "-boss2.png").getImage();
    imageWidth = this.image.getWidth(game);
    imageHeight = this.image.getHeight(game);
    this.icon = game.loadImage(prefix + "1.png").getImage();
    iconWidth = this.icon.getWidth(game);
    iconHeight = this.icon.getHeight(game);
    this.description = description;
  }


  // -- Stage API methods --

  /** Draws a descriptive screen for use during stage select. */
  public void drawSelectScreen(Graphics g) {
    Font origFont = g.getFont();
    Color origColor = g.getColor();

    drawOutlinedRect(g, DARK_RED,
      TOP_LEFT, TOP_LEFT, IMAGE_SIZE, IMAGE_SIZE);
    int gameWidth = game.getWidth();
    int textHeight = 14 * description.length + TOP_LEFT;
    drawOutlinedRect(g, Color.darkGray,
      TOP_LEFT, IMAGE_SIZE + 15, gameWidth - 20, textHeight);

    int cx = TOP_LEFT + 1 + (IMAGE_SIZE - 2 - imageWidth) / 2;
    int cy = TOP_LEFT + 1 + (IMAGE_SIZE - 2 - imageHeight) / 2;
    g.drawImage(image, cx, cy, game);
    g.setFont(BIG);
    g.setColor(Color.white);
    g.drawString(name, IMAGE_SIZE + 20, 65);
    g.setFont(SMALL);
    for (int i=0; i<description.length; i++) {
      g.drawString(description[i], TOP_LEFT + 5, IMAGE_SIZE + 14 * i + 31);
    }
    g.setFont(origFont);
    g.setColor(origColor);
  }

  /** Draws the icon for this stage at the given position. */
  public void drawIcon(Graphics g, int x, int y, boolean selected) {
    drawOutlinedRect(g, completed ? Color.gray :
      (selected ? Color.red : DARK_RED), x, y, ICON_SIZE, ICON_SIZE);
    int cx = x + 2 + (ICON_SIZE - 2 - iconWidth) / 2;
    int cy = y + 2 + (ICON_SIZE - 2 - iconHeight) / 2;
    g.drawImage(icon, cx, cy, game);
  }

  /**
   * Executes the script for this stage.
   * @return true if the script is complete
   */
  public boolean executeScript() {
    boolean done = script.execute();
    if (done) resetScript();
    return done;
  }

  /** Resets the script for this stage. */
  public void resetScript() { script.reset(); }

  /** Marks whether this stage has been completed. */
  public void setCompleted(boolean completed) { this.completed = completed; }

  /** Gets whether this stage has been completed. */
  public boolean isCompleted() { return completed; }


  // -- Helper methods --

  private void drawOutlinedRect(Graphics g, Color color,
    int x, int y, int width, int height)
  {
    Color origColor = g.getColor();
    g.setColor(Color.white);
    g.drawRect(x, y, width - 1, height - 1);
    g.setColor(color);
    g.fillRect(x + 1, y + 1, width - 2, height - 2);
    g.setColor(origColor);
  }

}
