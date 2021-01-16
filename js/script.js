class Message {
  constructor(msg, x, y, size, color, duration) {
    this.msg = msg;
    this.x = x;
    this.y = y;
    this.font = size + "px SansSerif";
    this.color = color;
    this.remain = duration;
  }

  draw(ctx) {
    ctx.font = this.font;
    ctx.fillStyle = this.color;
    ctx.fillText(this.msg, this.x, this.y);
  }

  checkFinished() { return --this.remain <= 0; }
}

/** An object for parsing and executing a game script. */
class GameScript {
  constructor(game, scriptPath) {
    this.game = game;
    this.commands = [];
    this.cmdIndex = 0;
    this.waiting = 0;
    this.waitClear = false;
    fetch(scriptPath)
      .then(r => r.text())
      .then(text => {
        text.split("\n").forEach(line => {
          var tokens = line.split(" ");
          var name = tokens.shift();
          this.commands.push({name: name, params: tokens});
        });

        // append 1/2 pause at the end of each stage
        this.commands.push({name: "wait", params: ["30"]});

        // append final dummy command
        this.commands.push({name: "wait", params: ["0"]});
      });
  }

  /**
   * Executes the game script.
   * @return true if the script is complete
   */
  execute() {
    while (this.cmdIndex < this.commands.length) {
      var cmd = this.commands[this.cmdIndex].name;
      var args = this.commands[this.cmdIndex].params;
      if (this.game.debug) {
        console.info(`execute ${this.cmdIndex}/${this.commands.length}: ` +
          `waitClear=${this.waitClear}, ` +
          `waiting=${this.waiting}, ` +
          `cmd=${cmd}(${args})`);
      }
      if (this.waitClear) {
        if (this.game.isClear()) {
          this.waitClear = false;
          this.waiting = 0;
        }
        else if (this.waiting > 0) {
          this.waiting--;
          break;
        }
      }
      else if (this.waiting > 0) {
        this.waiting--;
        break;
      }
      if (this.game.debug) console.info(cmd + "(" + args + ")");
      if (equalsIgnoreCase(cmd, "add")) this.add(args);
      else if (equalsIgnoreCase(cmd, "print")) this.print(args);
      else if (equalsIgnoreCase(cmd, "wait")) this.wait(args);
      this.cmdIndex++;
    }
    return this.cmdIndex >= this.commands.length;
  }

  reset() {
    this.waitClear = false;
    this.waiting = 0;
    this.cmdIndex = 0;
  }

  add(args) {
    // syntax: add ObjectType P1 P2 ... Pn
    if (args.length < 1) {
      this.ignoreCommand("add", args);
      return;
    }
    var className = args[0];
    var p = args.slice(1);
    try {
      if (equalsIgnoreCase(className, "TestBoss")) // TEMP
        this.game.things.push(new TestBoss(this.game, p)); // TEMP
      else if (equalsIgnoreCase(className, "Enemy")) // TEMP
        this.game.things.push(new Enemy(this.game, p)); // TEMP
      else if (equalsIgnoreCase(className, "AlexEnemy")) // TEMP
        this.game.things.push(new AlexEnemy(this.game, p)); // TEMP
      else if (equalsIgnoreCase(className, "AlexBoss")) // TEMP
        this.game.things.push(new AlexBoss(this.game, p)); // TEMP
      else if (equalsIgnoreCase(className, "PaulEnemy")) // TEMP
        this.game.things.push(new PaulEnemy(this.game, p)); // TEMP
      else if (equalsIgnoreCase(className, "PaulBoss")) // TEMP
        this.game.things.push(new PaulBoss(this.game, p)); // TEMP
      else console.error("ALKJHFLKSDJHDSF " + className); // TEMP
      // NB: Instantiate object of the given class.
      //var thing = window[className](this.game, p);
      //this.game.things.push(thing);
    }
    catch (err) {
      console.error(err);
      this.ignoreCommand("add", args);
    }
  }

  print(args) {
    // syntax: print X Y size R G B duration Message to be printed
    if (args.length < 8) {
      this.ignoreCommand("print", args);
      return;
    }
    var x, y, size, r, g, b, time;
    try {
      x = parseInt(args[0]);
      y = parseInt(args[1]);
      size = parseInt(args[2]);
      r = parseInt(args[3]);
      g = parseInt(args[4]);
      b = parseInt(args[5]);
      time = parseInt(args[6]);
    }
    catch (err) {
      this.ignoreCommand("print", args);
      return;
    }
    var msg = "";
    for (var i=7; i<args.length; i++) msg += args[i] + " ";
    game.printMessage(new Message(msg, x, y, size, color(r, g, b), time));
  }

  wait(args) {
    // syntax: wait clear  OR  wait clear X  OR  wait X
    if (args.length < 1) {
      this.ignoreCommand("wait", args);
      return;
    }
    if (args.length == 2) {
      if (!equalsIgnoreCase(args[0], "clear")) {
        this.ignoreCommand("wait", args);
        return;
      }
      try { this.waiting = parseInt(args[1]); }
      catch (err) { this.ignoreCommand("wait", args); }
      this.waitClear = true;
    }
    else {
      if (equalsIgnoreCase(args[0], "clear")) {
        this.waitClear = true;
        this.waiting = Infinity;
      }
      else {
        try { this.waiting = parseInt(args[0]); }
        catch (err) { this.ignoreCommand("wait", args); }
      }
    }
  }

  ignoreCommand(cmd, args) {
    var err = "Ignoring command: " + cmd;
    for (var i=0; i<args.length; i++) err += " " + args[i];
    console.error(err);
  }
}
