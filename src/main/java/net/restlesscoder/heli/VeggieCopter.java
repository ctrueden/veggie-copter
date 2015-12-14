package net.restlesscoder.heli;

import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import java.util.*;
import java.lang.reflect.*;
import javax.swing.*;

public class VeggieCopter extends JPanel implements KeyListener {

  // -- Constants --

  /** Width of game window. */
  private static final int GAME_WIDTH = 400;

  /** Height of game window. */
  private static final int GAME_HEIGHT = 400;

  /** Height of status bar. */
  private static final int STATUS = 24;


  // -- Fields --

  /** Containing frame. */
  private JFrame frame;

  /** Double buffering image. */
  private BufferedImage buf;

  /** Object for loading images from disk. */
  private ImageLoader loader;

  /** Object for handling stage selection. */
  private StageSelector selector;

  /** Current game stage. */
  private Stage stage;

  /** Field of stars in the background. */
  private StarField stars;

  /** Our hero. */
  private Copter copter;

  /** List of things onscreen. */
  private Vector things = new Vector();

  /** List of onscreen text messages. */
  private Vector messages = new Vector();

  /** The player's score. */
  private int score = 0;

  /** Game frame counter. */
  private long ticks = 0;

  /** List of times require to compute each frame. */
  private long[] times;

  /** Current place in times list. */
  private int timesPt;

  /** Whether game is paused. */
  private boolean pause;

  /** Whether fast forward is enabled. */
  private boolean fast;

  /** Debugging flag. */
  private boolean debug;


  // -- Constructor --

  /** Constructs a veggie copter frame. */
  public VeggieCopter() {
    setPreferredSize(new Dimension(GAME_WIDTH, GAME_HEIGHT + STATUS));

    // set up frame
    frame = new JFrame("Veggie Copter");
    frame.setContentPane(this);
    frame.setResizable(false);
    frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    frame.addKeyListener(this);
    frame.pack();
    Dimension screen = Toolkit.getDefaultToolkit().getScreenSize();
    frame.setLocation((screen.width - GAME_WIDTH) / 2,
      (screen.height - GAME_HEIGHT - STATUS) / 2);

    // background music
    SoundPlayer.playMidi(getClass().getResource("metblast.mid"), true);

    // graphics buffer
    buf = ImageTools.makeImage(GAME_WIDTH, GAME_HEIGHT + STATUS);

    // image loader
    loader = new ImageLoader();

    // stage selector
    selector = new StageSelector(this);

    // star field
    stars = new StarField(GAME_WIDTH, GAME_HEIGHT);

    // veggie copter
    copter = new Copter(this);

    // animation
    times = new long[32];
    Thread anim = new Thread(new Runnable() {
      public void run() {
        while (true) {
          long start = System.currentTimeMillis();
          try {
            SwingUtilities.invokeAndWait(new Runnable() {
              public void run() { repaint(); }
            });
          }
          catch (InterruptedException exc) { exc.printStackTrace(); }
          catch (InvocationTargetException exc) { exc.printStackTrace(); }
          times[timesPt] = System.currentTimeMillis() - start;
          timesPt = (timesPt + 1) % times.length;
          long sum = 0;
          for (int i=0; i<times.length; i++) sum += times[i];
          double avg = (double) sum / times.length;
          long wait = (long) (1000.0 / 60 - avg);
          if (wait > 0) {
            if (!fast) {
              try { Thread.sleep(wait); }
              catch (InterruptedException exc) { exc.printStackTrace(); }
            }
          }
          else System.out.println("ticks=" + ticks + "; avg=" + avg);
        }
      }
    });

    // go!
    frame.setVisible(true);
    anim.start();
  }


  // -- VeggieCopter API methods --

  /** Loads the given image from disk. */
  public BoundedImage loadImage(String filename) {
    return loadImage(filename, 0, 0, new BoundingBox[0]);
  }

  /**
   * Loads the given image from disk, using the specified
   * bounding box insets for collision detection.
   */
  public BoundedImage loadImage(String filename,
    int xoff, int yoff, BoundingBox[] boxes)
  {
    BufferedImage img = loader.getImage(filename);
    BoundedImage bi = new BoundedImage(img, xoff, yoff);
    for (int i=0; i<boxes.length; i++) bi.addBox(boxes[i]);
    return bi;
  }

  /** Gets containing frame. */
  public JFrame getFrame() { return frame; }

  /** Gets width of game window. */
  public int getWindowWidth() { return GAME_WIDTH; }

  /** Gets height of game height. */
  public int getWindowHeight() { return GAME_HEIGHT; }

  /** Gets veggie copter object (our hero!). */
  public Copter getCopter() { return copter; }

  /** Gets number of frames since game has started. */
  public long getTicks() { return ticks; }

  /** Adds an object to the list of onscreen things. */
  public void addThing(Thing t) { things.add(t); }

  /** Gets objects currently onscreen. */
  public Thing[] getThings() {
    Thing[] t = new Thing[things.size()];
    things.copyInto(t);
    return t;
  }

  /** Overlays a text message to the screen. */
  public void printMessage(Message m) { messages.add(m); }

  /** Whether there are any enemies currently onscreen. */
  public boolean isClear() {
    boolean clear = true;
    for (int i=0; i<things.size(); i++) {
      Thing t = (Thing) things.elementAt(i);
      int type = t.getType();
      if (type != Thing.GOOD && type != Thing.GOOD_BULLET) {
        clear = false;
        break;
      }
    }
    return clear;
  }

  /** Resets the game to its initial state. */
  public void resetGame() {
    things.removeAllElements();
    messages.removeAllElements();
    copter = new Copter(this);
    ticks = 0;
    score = 0;
    stage = null;
    selector.reset();
  }


  // -- Component API methods --

  /** Draws the veggie copter frame. */
  public void paint(Graphics g) {
    draw();
    g.drawImage(buf, 0, 0, this);
  }

  /** Draws the veggie copter graphics to the image buffer. */
  public void draw() {
    Graphics g = buf.createGraphics();
    g.setColor(Color.black);
    int w = buf.getWidth(), h = buf.getHeight();
    g.fillRect(0, 0, w, h);

    Thing[] t = getThings();

    // star field
    stars.drawStars(g);

    // redraw things
    for (int i=0; i<t.length; i++) t[i].draw(g);

    if (debug) {
      for (int i=0; i<t.length; i++) {
        // draw bounding box
        g.setColor(Color.red);
        Rectangle[] r = t[i].getBoxes();
        for (int j=0; j<r.length; j++) {
          g.drawRect(r[j].x, r[j].y, r[j].width, r[j].height);
        }

        // draw power level
        g.setColor(Color.white);
        int x = (int) t[i].getCX() - 3;
        int y = (int) t[i].getCY() + 6;
        g.drawString("" + t[i].getPower(), x, y);
      }
    }

    // draw text messages
    Message[] m = new Message[messages.size()];
    messages.copyInto(m);
    for (int i=0; i<m.length; i++) m[i].draw(g);

    // draw stage selection
    if (stage == null) selector.draw(g);

    // draw status bar
    g.setColor(Color.darkGray);
    g.fillRect(0, GAME_HEIGHT + 1, GAME_WIDTH, 24);
    g.setColor(Color.white);
    g.drawLine(0, GAME_HEIGHT, GAME_WIDTH, GAME_HEIGHT);

    // draw life bar
    int x = 1;
    g.drawRect(x, GAME_HEIGHT + 2, 103, 20);
    g.setColor(Color.black);
    g.fillRect(x + 1, GAME_HEIGHT + 3, 102, 19);
    int hp = copter.getHP();
    for (int i=0; i<hp; i++) {
      double q = (double) i / 99;
      int red = (int) (255 * (1 - q));
      int green = (int) (255 * q);
      g.setColor(new Color(red, green, 0));
      g.drawLine(x + 2 + i, GAME_HEIGHT + 4, x + 2 + i, GAME_HEIGHT + 20);
    }

    // draw weapon selector
    copter.drawWeaponStatus(g, x + 107, GAME_HEIGHT + 2);

    g.dispose();
    if (pause) return;

    // collision detection
    checkCollisions(t);

    // update star field
    stars.moveStars();

    // move things
    for (int i=0; i<t.length; i++) t[i].move();

    // update text messages
    for (int i=0; i<m.length; i++) {
      if (m[i].checkFinished()) messages.remove(m[i]);
    }

    // allow things the chance to attack
    for (int i=0; i<t.length; i++) {
      Thing[] shots = t[i].shoot();
      if (shots != null) {
        for (int j=0; j<shots.length; j++) {
          if (shots[j] != null) things.add(shots[j]);
        }
      }
      shots = t[i].trigger();
      if (shots != null) {
        for (int j=0; j<shots.length; j++) {
          if (shots[j] != null) things.add(shots[j]);
        }
      }
    }

    // purge dead things
    for (int i=0; i<things.size(); i++) {
      Thing thing = (Thing) things.elementAt(i);
      if (thing.isDead()) {
        things.removeElementAt(i);
        if (thing == copter) {
          printMessage(new Message("Game Over",
            (GAME_WIDTH - 250) / 2, (GAME_HEIGHT - 30) / 2 + 30,
            48, Color.red, Integer.MAX_VALUE));
          printMessage(new Message("Press space to play again",
            (GAME_WIDTH - 170) / 2, (GAME_HEIGHT - 30) / 2 + 50,
            16, Color.gray, Integer.MAX_VALUE));
        }
      }
    }

    if (stage != null && !copter.isDead()) {
      boolean done = stage.executeScript();
      if (done) {
        stage.setCompleted(true);
        selector.adjustStage(true);
        stage = null;
        things.removeAllElements();
        copter.reset();
      }
    }
    ticks++;
  }


  // -- KeyListener API methods --

  /** Set of keys current being held. */
  private HashSet keys = new HashSet();

  /** Handles key presses. */
  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    Integer ic = new Integer(code);
    if (!keys.contains(ic)) {
      keys.add(ic);
      Thing[] t = getThings();
      for (int i=0; i<t.length; i++) t[i].keyPressed(e);

      if (code == Keys.SHOOT) {
        if (stage == null) {
          stage = selector.getSelectedStage();
          stage.resetScript();
          things.add(copter);
          ((CopterAttack) copter.getAttack()).reactivateAttackStyle();
          ((CopterAttack) copter.getAttack()).reactivateAttackStyle();
        }
        else if (copter.isDead()) resetGame();
      }
      else if (code == Keys.PAUSE) pause = !pause;
      else if (code == 0 || code == 524) pause = true; // stupid Windows key
      else if (code == Keys.MOVE_LEFT) {
        if (stage == null) selector.adjustStage(false);
      }
      else if (code == Keys.MOVE_RIGHT) {
        if (stage == null) selector.adjustStage(true);
      }
      else if (code == Keys.FAST_FORWARD) fast = true;
      else if (code == Keys.TOGGLE_DEBUG) debug = !debug;
    }
  }

  /** Handles key releases. */
  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    Integer ic = new Integer(code);
    keys.remove(ic);
    Thing[] t = getThings();
    for (int i=0; i<t.length; i++) t[i].keyReleased(e);

    if (code == Keys.FAST_FORWARD) fast = false;
  }

  /** Handles key type events. */
  public void keyTyped(KeyEvent e) {
    int code = e.getKeyCode();
    Integer ic = new Integer(code);
    Thing[] t = getThings();
    for (int i=0; i<t.length; i++) t[i].keyReleased(e);
  }


  // -- Helper methods --

  /** Does collision detection between the given objects. */
  protected void checkCollisions(Thing[] t) {
    // divide things into types, and build rectangle lists
    Thing[][] tt = new Thing[Thing.TYPES.length][];
    int[] counts = new int[Thing.TYPES.length];
    for (int i=0; i<t.length; i++) {
      int type = t[i].getType();
      counts[type]++;
    }
    Rectangle[][][] boxes = new Rectangle[Thing.TYPES.length][][];
    for (int i=0; i<counts.length; i++) {
      tt[i] = new Thing[counts[i]];
      boxes[i] = new Rectangle[counts[i]][];
    }
    for (int i=0; i<t.length; i++) {
      int type = t[i].getType();
      int ndx = --counts[type];
      tt[type][ndx] = t[i];
      boxes[type][ndx] = t[i].getBoxes();
    }

    // do collision detection between copter and power-ups
    Rectangle[] rcop = copter.getBoxes();
    Rectangle[][] rups = boxes[Thing.POWER_UP];
    for (int i=0; i<rups.length; i++) {
      if (rups[i] == null) continue;
      boolean collision = false;
      for (int k=0; k<rups[i].length; k++) {
        for (int l=0; l<rcop.length; l++) {
          if (rups[i][k].intersects(rcop[l])) {
            collision = true;
            break;
          }
        }
        if (collision) break;
      }
      if (collision) {
        PowerUp powerUp = (PowerUp) tt[Thing.POWER_UP][i];
        ColoredAttack attack = powerUp.getGrantedAttack();
        if (attack == null) {
          // increase power of selected attack style by one
          int power = copter.getAttack().getPower();
          if (power < 10) copter.getAttack().setPower(power + 1);
        }
        else {
          // grant new attack style to copter
          CopterAttack copterAttack = (CopterAttack) copter.getAttack();
          copterAttack.addAttackStyle(attack);
        }
        tt[Thing.POWER_UP][i].setHP(0);
        rups[i] = null;
      }
    }

    // do collision detection between good and evil objects
    checkCollisions(tt[Thing.GOOD], boxes[Thing.GOOD],
      tt[Thing.EVIL], boxes[Thing.EVIL]);
    checkCollisions(tt[Thing.GOOD_BULLET], boxes[Thing.GOOD_BULLET],
      tt[Thing.EVIL], boxes[Thing.EVIL]);
    checkCollisions(tt[Thing.GOOD], boxes[Thing.GOOD],
      tt[Thing.EVIL_BULLET], boxes[Thing.EVIL_BULLET]);
  }

  /** Does collision detection between the given objects. */
  protected void checkCollisions(Thing[] t1, Rectangle[][] r1,
    Thing[] t2, Rectangle[][] r2)
  {
    for (int i=0; i<r1.length; i++) {
      for (int j=0; j<r2.length; j++) {
        if (r1[i] == null) break;
        if (r2[j] == null) continue;
        boolean collision = false;
        for (int k=0; k<r1[i].length; k++) {
          for (int l=0; l<r2[j].length; l++) {
            if (r1[i][k].intersects(r2[j][l])) {
              collision = true;
              break;
            }
          }
          if (collision) break;
        }
        if (collision) {
          boolean hurt1 = t2[j].harms(t1[i]);
          boolean hurt2 = t1[i].harms(t2[j]);
          if (hurt1 && smack(t2[j], t1[i])) r1[i] = null;
          if (hurt2 && smack(t1[i], t2[j])) r2[j] = null;
        }
      }
    }
  }

  /** Instructs the given attacker to damage the specified defender. */
  protected boolean smack(Thing attacker, Thing defender) {
    defender.hit(attacker.getPower());
    if (defender.isDead()) {
      if (defender.getType() == Thing.EVIL) score += defender.getScore();
      return true;
    }
    return false;
  }



  // -- Main --

  /** Runs veggie copter game. */
  public static void main(String[] args) { new VeggieCopter(); }

}
