//
// ScriptingEngine.java
//

import java.awt.Color;
import java.io.*;
import java.lang.reflect.*;
import java.util.*;

public class ScriptingEngine {

  // -- Constants --

  private static final Class[] SIG = {VeggieCopter.class, String[].class};


  // -- Fields --

  private VeggieCopter game;
  private Vector commands = new Vector();
  private Vector params = new Vector();
  private int cmdIndex;
  private int waiting;
  private boolean waitClear;


  // -- Constructor --

  /** Constructs an object for parsing the game script. */
  public ScriptingEngine(VeggieCopter game, String scriptFile) {
    this.game = game;
    try {
      BufferedReader fin = new BufferedReader(new FileReader(scriptFile));
      while (true) {
        String line = fin.readLine();
        if (line == null) break;
        StringTokenizer st = new StringTokenizer(line);
        int len = st.countTokens();
        if (len == 0) continue;
        commands.add(st.nextToken());
        String[] tokens = new String[len - 1];
        for (int i=0; i<tokens.length; i++) tokens[i] = st.nextToken();
        params.add(tokens);
      }
      fin.close();
    }
    catch (IOException exc) { exc.printStackTrace(); }

    // append 1/2 pause at the end of each stage
    commands.add("wait");
    params.add(new String[] {"30"});

    // append final dummy command
    commands.add("wait");
    params.add(new String[] {"0"});
  }


  // -- ScriptingEngine API methods --

  /**
   * Executes the game script.
   * @return true if the script is complete
   */
  public boolean execute() {
    while (cmdIndex < commands.size()) {
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
    return cmdIndex >= commands.size();
  }

  public void reset() {
    waitClear = false;
    waiting = 0;
    cmdIndex = 0;
  }

  public void add(String[] args) {
    // syntax: add ObjectType P1 P2 ... Pn
    if (args.length < 1) {
      ignoreCommand("add", args);
      return;
    }
    String className = args[0];
    String[] p = new String[args.length - 1];
    System.arraycopy(args, 1, p, 0, p.length);
    try {
      Class c = Class.forName(className);
      Constructor con = c.getConstructor(SIG);
      game.addThing((Thing) con.newInstance(new Object[] {game, p}));
    }
    catch (ClassNotFoundException exc) { ignoreCommand("add", args); }
    catch (NoSuchMethodException exc) { ignoreCommand("add", args); }
    catch (InstantiationException exc) { ignoreCommand("add", args); }
    catch (IllegalAccessException exc) { ignoreCommand("add", args); }
    catch (InvocationTargetException exc) { ignoreCommand("add", args); }
  }

  public void print(String[] args) {
    // syntax: print X Y size R G B duration Message to be printed
    if (args.length < 8) {
      ignoreCommand("print", args);
      return;
    }
    int x, y, size, r, g, b, time;
    try {
      x = Integer.parseInt(args[0]);
      y = Integer.parseInt(args[1]);
      size = Integer.parseInt(args[2]);
      r = Integer.parseInt(args[3]);
      g = Integer.parseInt(args[4]);
      b = Integer.parseInt(args[5]);
      time = Integer.parseInt(args[6]);
    }
    catch (NumberFormatException exc) {
      ignoreCommand("print", args);
      return;
    }
    String msg = "";
    for (int i=7; i<args.length; i++) msg += args[i] + " ";
    game.printMessage(new Message(msg, x, y, size, new Color(r, g, b), time));
  }

  public void wait(String[] args) {
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
      try { waiting = Integer.parseInt(args[1]); }
      catch (NumberFormatException exc) { ignoreCommand("wait", args); }
      waitClear = true;
    }
    else {
      if (args[0].equalsIgnoreCase("clear")) {
        waitClear = true;
        waiting = Integer.MAX_VALUE;
      }
      else {
        try { waiting = Integer.parseInt(args[0]); }
        catch (NumberFormatException exc) { ignoreCommand("wait", args); }
      }
    }
  }


  // -- Helper methods --

  protected void ignoreCommand(String cmd, String[] args) {
    System.err.print("Ignoring command: " + cmd);
    for (int i=0; i<args.length; i++) System.err.print(" " + args[i]);
    System.err.println();
  }

}
