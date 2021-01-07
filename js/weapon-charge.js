package net.restlesscoder.heli;

import java.awt.*;
import java.awt.event.KeyEvent;

/** Defines veggie copter charge attack style. */
public class ChargeAttack extends ColoredAttack {

  private static final int GROW_SPEED = 11;

  protected CopterCharge charge;
  protected boolean space;
  protected int ticks;

  public ChargeAttack(Thing t) {
    super(t, Color.white, t.getGame().loadImage("icon-charge.png").getImage());
  }

  public void launch() {
    if (charge == null) return;
    charge.launch();
    charge = null;
  }

  public void clear() {
    space = false;
    launch();
  }

  /** Fires a shot if space bar is pressed. */
  public Thing[] shoot() {
    if (!space) return null;

    if (charge == null) {
      ticks = 0;
      charge = new CopterCharge(thing);
      return new Thing[] {charge};
    }
    ticks++;
    int rate = GROW_SPEED - power;
    if (rate <= 0) rate = 1;
    if (ticks % rate == 0) {
      if (!charge.grow()) launch();
    }
    return null;
  }

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) clear();
  }

}
