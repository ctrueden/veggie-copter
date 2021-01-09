/** Information regarding a specific stage of the game. */
class Stage {
  TOP_LEFT = 10;
  IMAGE_SIZE = 154;
  ICON_SIZE = 50;

  BIG = new Font("SansSerif", Font.BOLD, 36);
  SMALL = new Font("SansSerif", Font.PLAIN, 12);

  DARK_RED = new Color(48, 0, 0);

  /** Constructs a playable stage. */
  constructor(game, name, prefix, description) {
    this.game = game;
    this.name = name;
    this.script = new GameScript(game, prefix + ".txt");
    this.image = game.loadImage(prefix + "-boss2.png").getImage();
    this.imageWidth = this.image.getWidth(game);
    this.imageHeight = this.image.getHeight(game);
    this.icon = game.loadImage(prefix + "1.png").getImage();
    this.iconWidth = this.icon.getWidth(game);
    this.iconHeight = this.icon.getHeight(game);
    this.description = description;
    this.completed = false;
  }

  /** Draws a descriptive screen for use during stage select. */
  drawSelectScreen(ctx) {
    var origFont = ctx.getFont();
    var origColor = ctx.getColor();

    drawOutlinedRect(g, DARK_RED, TOP_LEFT, TOP_LEFT, IMAGE_SIZE, IMAGE_SIZE);
    var gameWidth = game.getWidth();
    var textHeight = 14 * description.length + 10;
    drawOutlinedRect(g, Color.darkGray, TOP_LEFT + IMAGE_SIZE + 10,
      TOP_LEFT + 45, gameWidth - TOP_LEFT - IMAGE_SIZE - 20, textHeight);

    var cx = TOP_LEFT + 1 + (IMAGE_SIZE - 2 - imageWidth) / 2;
    var cy = TOP_LEFT + 1 + (IMAGE_SIZE - 2 - imageHeight) / 2;
    ctx.drawImage(image, cx, cy, game);
    ctx.setFont(BIG);
    ctx.setColor(Color.white);
    ctx.drawString(name, IMAGE_SIZE + TOP_LEFT + 10, TOP_LEFT + 35);
    ctx.setFont(SMALL);
    for (var i=0; i<description.length; i++) {
      ctx.drawString(description[i], TOP_LEFT + IMAGE_SIZE + 15,
        14 * i + TOP_LEFT + 61);
    }
    ctx.setFont(origFont);
    ctx.setColor(origColor);
  }

  /** Draws the icon for this stage at the given position. */
  drawIcon(ctx, x, y, selected) {
    drawOutlinedRect(g, completed ? Color.gray :
      (selected ? Color.red : DARK_RED), x, y, ICON_SIZE, ICON_SIZE);
    var cx = x + 2 + (ICON_SIZE - 2 - iconWidth) / 2;
    var cy = y + 2 + (ICON_SIZE - 2 - iconHeight) / 2;
    ctx.drawImage(icon, cx, cy, game);
  }

  /**
   * Executes the script for this stage.
   * @return true if the script is complete
   */
  executeScript() {
    var done = script.execute();
    if (done) resetScript();
    return done;
  }

  /** Resets the script for this stage. */
  resetScript() { script.reset(); }

  /** Marks whether this stage has been completed. */
  setCompleted(completed) { this.completed = completed; }

  /** Gets whether this stage has been completed. */
  isCompleted() { return this.completed; }

  drawOutlinedRect(ctx, color, x, y, width, height) {
    var origColor = ctx.getColor();
    ctx.setColor(Color.white);
    ctx.drawRect(x, y, width - 1, height - 1);
    ctx.setColor(color);
    ctx.fillRect(x + 1, y + 1, width - 2, height - 2);
    ctx.setColor(origColor);
  }
}

/** A stage for debugging. */
class TestStage extends Stage {
  constructor(game, name, prefix, description) {
    super(game, name, prefix, description);
  }

  /** Test stage never gets flagged as completed. */
  setCompleted(completed) { }
}

/** Logic for selecting a stage. */
class StageSelector {
  /** Stage icon coordinates (values). */
  STAGE_X = [10, 10, 10, 64, 119, 174, 229, 284, 338, 339, 339];

  /** Stage icon coordinates (values). */
  STAGE_Y = [341, 284, 227, 170, 170, 170, 170, 170, 227, 284, 341];

  constructor(game) {
    this.game = game;
    this.stages = [
      new TestStage(game, "Shadow", "test", [
        "A test enemy for gauging weapon",
        "strength.",
      ]),
      new Stage(game, "Alex", "alex", [
        "Fear the vicious Alex lunge!",
      ]),
      new Stage(game, "Paul", "paul", [
        "Paul SMASH!!!"
      ]),
      new Stage(game, "Anna", "anna", [
        "Best girl ever!"
      ]),
      new Stage(game, "Kels", "kels", [
        "Defeat the mighty Kelsey, and the",
        "dreaded yellow shots shall be yours!"
      ]),
      new Stage(game, "James", "james", [
        "James is laughing at you -- they're",
        "ALL laughing at you!"
      ]),
      new Stage(game, "George", "george", [
        "Support our troops!"
      ]),
      new Stage(game, "Bush", "bush", [
        "Looks like I misunderestimated you!"
      ])
    ];
    this.current = 0;
  }

  /** Draws stage select screen. */
  draw(ctx) {
    var size = this.stages.length;
    var w = this.game.getWidth(), h = this.game.getHeight();
    var cols = w / Stage.ICON_SIZE;
    var rows = (size + cols - 1) / cols;
    for (var i=0; i<size; i++) {
      this.stages[i].drawIcon(ctx, STAGE_X[i], STAGE_Y[i], i == this.current);
    }
    getSelectedStage().drawSelectScreen(ctx);
  }

  /** Adjusts currently selected stage forward or backward. */
  adjustStage(dir) {
    var start = this.current;
    do {
      this.current += dir ? 1 : -1;
      if (this.current >= this.stages.length) this.current = 0;
      if (this.current < 0) this.current = this.stages.length - 1;
      if (!getSelectedStage().isCompleted()) break;
    }
    while (start != this.current);
  }

  /** Gets currently selected stage. */
  getSelectedStage() { return this.stages[this.current]; }

  /** Resets stage selector to its initial state. */
  reset() {
    for (var i=0; i<this.stages.length; i++) {
      this.stages[i].setCompleted(false);
    }
    this.current = 0;
  }
}
