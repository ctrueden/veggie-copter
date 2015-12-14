package net.restlesscoder.heli;

import java.awt.*;
import java.awt.event.KeyEvent;

/** Defines veggie copter gravity mine attack style. */
public class MineAttack extends ColoredAttack {

  // -- Constants --

  protected static final int RECHARGE = 24;


  // -- Fields --

  protected boolean space;
  protected int fired;


  // -- Constructor --

  public MineAttack(Thing t) {
    super(t, Color.darkGray,
      t.getGame().loadImage("icon-mine.png").getImage());
  }


  // -- ColoredAttack API methods --
 
  public void clear() { space = false; }


  // -- AttackStyle API methods --

  /** Drops mines while space bar is being pressed. */
  public Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    fired = RECHARGE - power / 2;

    CopterMine mine = new CopterMine(thing, power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {mine};
  }


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
