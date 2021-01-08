/** An object for parsing a game script. */
class ScriptingEngine {
  constructor(game, scriptFile) {
    this.game = game;
    this.commands = [];
    this.params = [];
    this.cmdIndex = 0;
    this.waiting = 0;
    this.waitClear = false;
    try {
      BufferedReader fin = new BufferedReader(
        new InputStreamReader(getClass().getResourceAsStream(scriptFile)));
      while (true) {
        String line = fin.readLine();
        if (line == null) break;
        StringTokenizer st = new StringTokenizer(line);
        var len = st.countTokens();
        if (len == 0) continue;
        commands.add(st.nextToken());
        String[] tokens = new String[len - 1];
        for (var i=0; i<tokens.length; i++) tokens[i] = st.nextToken();
        params.add(tokens);
      }
      fin.close();
    }
    catch (exc) { exc.printStackTrace(); }

    // append 1/2 pause at the end of each stage
    commands.add("wait");
    params.add(new String[] {"30"});

    // append final dummy command
    commands.add("wait");
    params.add(new String[] {"0"});
  }

  /**
   * Executes the game script.
   * @return true if the script is complete
   */
  boolean execute() {
    while (cmdIndex < commands.length) {
      if (waitClear) {
        if (game.isClear()) {
          waitClear = false;
          waiting = 0;
        }
        else if (waiting > 0) {
          if (waiting < Integer.MAX_VALUE) waiting--;
          break;
        }
      }
      else if (waiting > 0) {
        waiting--;
        break;
      }
      String cmd = (String) commands.elementAt(cmdIndex);
      String[] args = (String[]) params.elementAt(cmdIndex);
      if (cmd.equalsIgnoreCase("add")) add(args);
      else if (cmd.equalsIgnoreCase("print")) print(args);
      else if (cmd.equalsIgnoreCase("wait")) wait(args);
      cmdIndex++;
    }
    return cmdIndex >= commands.length;
  }

  reset() {
    waitClear = false;
    waiting = 0;
    cmdIndex = 0;
  }

  add(String[] args) {
    // syntax: add ObjectType P1 P2 ... Pn
    if (args.length < 1) {
      ignoreCommand("add", args);
      return;
    }
    String className = args[0];
    String[] p = new String[args.length - 1];
    System.arraycopy(args, 1, p, 0, p.length);
    try {
      String fqcn = getClass().getPackage().getName() + "." + className;
      Class c = Class.forName(fqcn);
      Constructor con = c.getConstructor(SIG); // game, args
      game.addThing((Thing) con.newInstance(new Object[] {game, p}));
    }
    catch (exc) { ignoreCommand("add", args); }
    catch (exc) { ignoreCommand("add", args); }
    catch (exc) { ignoreCommand("add", args); }
    catch (exc) { ignoreCommand("add", args); }
    catch (exc) { ignoreCommand("add", args); }
  }

  print(String[] args) {
    // syntax: print X Y size R G B duration Message to be printed
    if (args.length < 8) {
      ignoreCommand("print", args);
      return;
    }
    x, y, size, r, g, b, time;
    try {
      x = parseInt(args[0]);
      y = parseInt(args[1]);
      size = parseInt(args[2]);
      r = parseInt(args[3]);
      g = parseInt(args[4]);
      b = parseInt(args[5]);
      time = parseInt(args[6]);
    }
    catch (exc) {
      ignoreCommand("print", args);
      return;
    }
    String msg = "";
    for (var i=7; i<args.length; i++) msg += args[i] + " ";
    game.printMessage(new Message(msg, x, y, size, new Color(r, g, b), time));
  }

  wait(String[] args) {
    // syntax: wait clear  OR  wait clear X  OR  wait X
    if (args.length < 1) {
      ignoreCommand("wait", args);
      return;
    }
    if (args.length == 2) {
      if (!args[0].equalsIgnoreCase("clear")) {
        ignoreCommand("wait", args);
        return;
      }
      try { waiting = parseInt(args[1]); }
      catch (exc) { ignoreCommand("wait", args); }
      waitClear = true;
    }
    else {
      if (args[0].equalsIgnoreCase("clear")) {
        waitClear = true;
        waiting = Integer.MAX_VALUE;
      }
      else {
        try { waiting = parseInt(args[0]); }
        catch (exc) { ignoreCommand("wait", args); }
      }
    }
  }

  ignoreCommand(cmd, String[] args) {
    System.err.print("Ignoring command: " + cmd);
    for (var i=0; i<args.length; i++) System.err.print(" " + args[i]);
    System.err.println();
  }

}
