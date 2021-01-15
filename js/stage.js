// Data structures for the stages (levels) of the game.

/** Information regarding a specific stage of the game. */
class Stage {
  /** Constructs a playable stage. */
  constructor(game, name, scriptName, description) {
    this.topLeft = 10;
    this.imageSize = 154;
    this.iconSize = 50;
    this.bigFont = "36px SansSerif"; // TODO: font-weight bold
    this.smallFont = "12px SansSerif";

    this.game = game;
    this.name = name;
    this.script = new GameScript(game, "../assets/" + scriptName + ".txt");
    this.image = game.loadSprite(`${scriptName}-boss2`).image;
    this.icon = game.loadSprite(`${scriptName}1`).image;
    this.description = description;
    this.completed = false;
  }

  /** Draws a descriptive screen for use during stage select. */
  drawSelectScreen(ctx) {
    drawOutlinedRect(ctx, Colors.DarkRed,
      this.topLeft, this.topLeft, this.imageSize, this.imageSize);
    var gameWidth = this.game.width;
    var textHeight = 14 * this.description.length + 10;
    drawOutlinedRect(ctx, Colors.DarkGray,
      this.topLeft + this.imageSize + 10, this.topLeft + 45,
      gameWidth - this.topLeft - this.imageSize - 20, textHeight);

    var cx = this.topLeft + 1 + (this.imageSize - 2 - this.image.width) / 2;
    var cy = this.topLeft + 1 + (this.imageSize - 2 - this.image.height) / 2;
    ctx.drawImage(this.image, cx, cy);
    ctx.font = this.bigFont;
    ctx.fillStyle = Colors.White;
    ctx.fillText(this.name,
      this.imageSize + this.topLeft + 10, this.topLeft + 35);
    ctx.font = this.smallFont;
    for (var i=0; i<this.description.length; i++) {
      ctx.fillText(this.description[i], this.topLeft + this.imageSize + 15,
        14 * i + this.topLeft + 61);
    }
  }

  /** Draws the icon for this stage at the given position. */
  drawIcon(ctx, x, y, selected) {
    var color = this.completed ? Colors.Gray :
      (selected ? Colors.Red : Colors.DarkRed);
    drawOutlinedRect(ctx, color, x, y, this.iconSize, this.iconSize);
    var cx = x + 2 + (this.iconSize - 2 - this.icon.width) / 2;
    var cy = y + 2 + (this.iconSize - 2 - this.icon.height) / 2;
    ctx.drawImage(this.icon, cx, cy);
  }

  /**
   * Executes the script for this stage.
   * @return true if the script is complete
   */
  executeScript() {
    var done = this.script.execute();
    if (done) this.resetScript();
    return done;
  }

  /** Resets the script for this stage. */
  resetScript() { this.script.reset(); }

  /** Marks whether this stage has been completed. */
  setCompleted(completed) { this.completed = completed; }

  /** Gets whether this stage has been completed. */
  isCompleted() { return this.completed; }
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
  constructor(game) {
    this.game = game;
    this.stageInfo = [
      { x: 10, y: 341, stage: new TestStage(game, "Shadow", "test",
          ["A test enemy for gauging weapon",
           "strength."]) },
      { x: 10, y: 284, stage: new Stage(game, "Alex", "alex",
        ["Fear the vicious Alex lunge!"]) },
      { x: 10, y: 227, stage: new Stage(game, "Paul", "paul",
        ["Paul SMASH!!!"]) },
      { x: 64, y: 170, stage: new Stage(game, "Anna", "anna",
        ["Best girl ever!"]) },
      { x: 119, y: 170, stage: new Stage(game, "Kels", "kels",
        ["Defeat the mighty Kelsey, and the",
         "dreaded yellow shots shall be yours!"]) },
      { x: 174, y: 170, stage: new Stage(game, "James", "james",
        ["James is laughing at you -- they're",
         "ALL laughing at you!"]) },
      { x: 229, y: 170, stage: new Stage(game, "George", "george",
        ["Support our troops!"]) },
      { x: 284, y: 170, stage: new Stage(game, "Bush", "bush",
        ["Looks like I misunderestimated you!"]) },
      //{ x: 338, y: 227, stage: new Stage(game, ...) },
      //{ x: 339, y: 284, stage: new Stage(game, ...) },
      //{ x: 339, y: 341, stage: new Stage(game, ...) },
    ];
    this.current = 0;
  }

  /** Draws stage select screen. */
  draw(ctx) {
    var size = this.stageInfo.length;
    var w = this.game.width, h = this.game.height;
    var cols = w / this.iconSize;
    var rows = (size + cols - 1) / cols;
    for (var i=0; i<size; i++) {
      var info = this.stageInfo[i];
      info.stage.drawIcon(ctx, info.x, info.y, i == this.current);
    }
    this.selectedStage.drawSelectScreen(ctx);
  }

  /** Adjusts currently selected stage forward or backward. */
  adjustStage(dir) {
    var start = this.current;
    do {
      this.current += dir ? 1 : -1;
      if (this.current >= this.stageInfo.length) this.current = 0;
      if (this.current < 0) this.current = this.stageInfo.length - 1;
      if (!this.selectedStage.isCompleted()) break;
    }
    while (start != this.current);
  }

  /** Gets currently selected stage. */
  get selectedStage() { return this.stageInfo[this.current].stage; }

  /** Resets stage selector to its initial state. */
  reset() {
    for (var i=0; i<this.stageInfo.length; i++) {
      this.stageInfo[i].stage.setCompleted(false);
    }
    this.current = 0;
  }
}
