//
// StageSelector.java
//

import java.awt.Graphics;
import java.util.Vector;

/** Implements logic for selecting a stage. */
public class StageSelector {

  // -- Constants --

  /** Stage icon coordinates (X values). */
  private static final int[] STAGE_X = {
    10, 10, 10, 64, 119, 174, 229, 284, 338, 339, 339
  };

  /** Stage icon coordinates (Y values). */
  private static final int[] STAGE_Y = {
    341, 284, 227, 170, 170, 170, 170, 170, 227, 284, 341
  };


  // -- Fields --

  private VeggieCopter game;
  private Vector stages = new Vector();
  private int current = 0;


  // -- Constructor --

  public StageSelector(VeggieCopter game) {
    this.game = game;
    addStage(new TestStage(game, "Shadow", "test", new String[] {
      "A test enemy for gauging weapon",
      "strength.",
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
      "Defeat the mighty Kelsey, and the",
      "dreaded yellow shots shall be yours!"
    }));
    addStage(new Stage(game, "James", "james", new String[] {
      "James is laughing at you -- they're",
      "ALL laughing at you!"
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
    for (int i=0; i<size; i++) {
      Stage s = (Stage) stages.elementAt(i);
      s.drawIcon(g, STAGE_X[i], STAGE_Y[i], i == current);
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
