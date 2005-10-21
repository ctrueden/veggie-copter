//
// StageSelector.java
//

import java.awt.Graphics;
import java.util.Vector;

/** Implements logic for selecting a stage. */
public class StageSelector {

  // -- Fields --

  private VeggieCopter game;
  private Vector stages = new Vector();
  private int current = 0;


  // -- Constructor --

  public StageSelector(VeggieCopter game) {
    this.game = game;
    addStage(new TestStage(game, "Shadow", "test", new String[] {
      "A test enemy for gauging weapon strength.",
    }));
    addStage(new Stage(game, "Alex", "alex", new String[] {
      "Fear the vicious Alex lunge!",
    }));
    addStage(new Stage(game, "Paul", "paul", new String[] {
      "Paul SMASH!!!"
    }));
    addStage(new Stage(game, "Anna", "anna", new String[] {
      "Best girl ever!"
    }));
    addStage(new Stage(game, "Kels", "kels", new String[] {
      "Defeat the mighty Kelsey, and the dreaded yellow shots shall",
      "be yours!"
    }));
    addStage(new Stage(game, "George", "george", new String[] {
      "Support our troops!"
    }));
    addStage(new Stage(game, "Bush", "bush", new String[] {
      "Looks like I misunderestimated you!"
    }));
  }


  // -- StageSelector API methods --

  /** Adds a stage to the selector. */
  public void addStage(Stage s) { stages.add(s); }

  /** Draws stage select screen. */
  public void draw(Graphics g) {
    int size = stages.size();
    int w = game.getWidth(), h = game.getHeight();
    int cols = w / Stage.ICON_SIZE;
    int rows = (size + cols - 1) / cols;
    int x = 10, y = h - Stage.ICON_SIZE * rows - 32;
    for (int i=0; i<size; i++) {
      Stage s = (Stage) stages.elementAt(i);
      s.drawIcon(g, x, y, i == current);
      x += Stage.ICON_SIZE - 1; // one pixel overlap
      if (x + Stage.ICON_SIZE + 10 >= w) {
        x = 10;
        y -= Stage.ICON_SIZE - 1; // one pixel overlap
      }
    }
    getSelectedStage().drawSelectScreen(g);
  }

  /** Adjusts currently selected stage forward or backward. */
  public void adjustStage(boolean dir) {
    int start = current;
    do {
      current += dir ? 1 : -1;
      if (current >= stages.size()) current = 0;
      if (current < 0) current = stages.size() - 1;
      Stage s = (Stage) stages.elementAt(current);
      if (!s.isCompleted()) break;
    }
    while (start != current);
  }

  /** Gets currently selected stage. */
  public Stage getSelectedStage() { return (Stage) stages.elementAt(current); }

  /** Resets stage selector to its initial state. */
  public void reset() {
    for (int i=0; i<stages.size(); i++) {
      Stage s = (Stage) stages.elementAt(i);
      s.setCompleted(false);
    }
    current = 0;
  }

}
