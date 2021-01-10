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
          var tokens = line.split(" +");
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
    while (cmdIndex < this.commands.length) {
      if (this.waitClear) {
        if (this.game.isClear()) {
          this.waitClear = false;
          this.waiting = 0;
        }
        else if (this.waiting > 0) {
          waiting--;
          break;
        }
      }
      else if (waiting > 0) {
        waiting--;
        break;
      }
      var cmd = this.commands[cmdIndex].name;
      var args = this.commands[cmdIndex].params;
      if (equalsIgnoreCase(cmd, "add")) add(args);
      else if (equalsIgnoreCase(cmd, "print")) print(args);
      else if (equalsIgnoreCase(cmd, "wait")) wait(args);
      cmdIndex++;
    }
    return cmdIndex >= this.commands.length;
  }

  reset() {
    this.waitClear = false;
    this.waiting = 0;
    this.cmdIndex = 0;
  }

  add(args) {
    // syntax: add ObjectType P1 P2 ... Pn
    if (args.length < 1) {
      ignoreCommand("add", args);
      return;
    }
    var className = args[0];
    var p = args.slice(1);
    try {
      // NB: Instantiate object of the given class.
      game.addThing(window[className](this.game, p));
    }
    catch (err) { ignoreCommand("add", args); }
  }

  print(args) {
    // syntax: print X Y size R G B duration Message to be printed
    if (args.length < 8) {
      ignoreCommand("print", args);
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
      ignoreCommand("print", args);
      return;
    }
    var msg = "";
    for (var i=7; i<args.length; i++) msg += args[i] + " ";
    game.printMessage(new Message(msg, x, y, size, new Color(r, g, b), time));
  }

  wait(args) {
    // syntax: wait clear  OR  wait clear X  OR  wait X
    if (args.length < 1) {
      ignoreCommand("wait", args);
      return;
    }
    if (args.length == 2) {
      if (!equalsIgnoreCase(args[0], "clear")) {
        ignoreCommand("wait", args);
        return;
      }
      try { this.waiting = parseInt(args[1]); }
      catch (err) { ignoreCommand("wait", args); }
      this.waitClear = true;
    }
    else {
      if (equalsIgnoreCase(args[0], "clear")) {
        this.waitClear = true;
        this.waiting = Infinity;
      }
      else {
        try { this.waiting = parseInt(args[0]); }
        catch (err) { ignoreCommand("wait", args); }
      }
    }
  }

  ignoreCommand(cmd, args) {
    var err = "Ignoring command: " + cmd;
    for (var i=0; i<args.length; i++) err += " " + args[i];
    console.error(err);
  }
}
