package net.restlesscoder.heli;

import java.awt.*;
import java.awt.event.*;

/** Defines splitter attack. */
public class SplitterAttack extends ColoredAttack {

  // -- Constants --

  protected static final int RECHARGE = 10;
  public static final int MAX_SPLIT = 6;
  protected static final int SPEED = 5;
  protected static final int MULTIPLIER = 4;


  // -- Fields --

  protected boolean space, trigger;
  protected int fired;
  protected int xdir, ydir;
  protected int count;


  // -- Constructor --

  public SplitterAttack(Thing t) { this(t, 0, 0, 0); }

  public SplitterAttack(Thing t, int xdir, int ydir, int count) {
    super(t, Color.yellow, t.getGame().loadImage("icon-split.png").getImage());
    if (xdir == 0 && ydir == 0) {
      this.xdir = SPEED;
      this.ydir = 0;
    }
    else {
      this.xdir = xdir;
      this.ydir = ydir;
    }
    this.count = count;
  }


  // -- ColoredAttack API methods --

  public void clear() { space = trigger = false; }


  // -- AttackStyle API methods --

  /** Fires a splitter shot. */
  public Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    if (count != 0) return null;
    fired = RECHARGE;

    CopterSplitter splitter = new CopterSplitter(thing.getGame(),
      thing.getCX(), thing.getY(), 0, -SPEED, 1, power + 1);
    splitter.setPower(MULTIPLIER * (power + 2));
    return new Thing[] {splitter};
  }

  /** Splits existing splitter shots. */
  public Thing[] trigger() {
    if (!trigger) return null;
    if (count == 0 || power <= 2 * MULTIPLIER) return null;
    thing.setHP(0);

    VeggieCopter game = thing.getGame();
    float x = thing.getCX(), y = thing.getCY();
    int xd = ydir, yd = xdir;
    int size = power / MULTIPLIER - 3;

    CopterSplitter[] cs = {
      new CopterSplitter(game, x, y, xd, yd, count + 1, size),
      new CopterSplitter(game, x, y, -xd, -yd, count + 1, size),
      // MWAHAHA!
      //new CopterSplitter(game, x, y, yd, xd, count + 1, size),
      //new CopterSplitter(game, x, y, -yd, -xd, count + 1, size),
      //new CopterSplitter(game, x, y, SPEED, SPEED, count + 1, size),
      //new CopterSplitter(game, x, y, -SPEED, -SPEED, count + 1, size),
      //new CopterSplitter(game, x, y, -SPEED, SPEED, count + 1, size),
      //new CopterSplitter(game, x, y, SPEED, -SPEED, count + 1, size)
    };
    for (int i=0; i<cs.length; i++) cs[i].setPower(power - 2 * MULTIPLIER);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return cs;
  }


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
    else if (code == Keys.TRIGGER) trigger = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
    else if (code == Keys.TRIGGER) trigger = false;
  }

}
