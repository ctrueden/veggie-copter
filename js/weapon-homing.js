package net.restlesscoder.heli;

import java.awt.*;
import java.awt.event.KeyEvent;

/** Defines veggie copter homing missile attack style. */
public class HomingAttack extends ColoredAttack {

  protected static final int RECHARGE = 12;

  protected boolean space = false;
  protected int fired;

  public HomingAttack(Thing t) {
    super(t, Color.magenta,
      t.getGame().loadImage("icon-homing.png").getImage());
  }

  public void clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  public Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    int pow = getPower();
    fired = RECHARGE - pow;

    CopterHoming homing = new CopterHoming(thing);
    homing.setPower(8);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {homing};
  }

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = false;
  }

}
