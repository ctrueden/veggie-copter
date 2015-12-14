package net.restlesscoder.heli;

import java.awt.*;
import java.awt.event.KeyEvent;

/** Defines veggie copter doom attack style. */
public class DoomAttack extends ColoredAttack {

  // -- Fields --

  protected boolean space;
  protected CopterDoom doom;


  // -- Constructor --

  public DoomAttack(Thing t) {
    super(t, Color.black,
      t.getGame().loadImage("icon-doom.png").getImage());
  }


  // -- ColoredAttack API methods --

  public void clear() {
    space = false;
    if (doom != null) doom.setHP(0);
    doom = null;
  }


  // -- AttackStyle API methods --

  /** Fires a shot if space bar is pressed. */
  public Thing[] shoot() {
    if (!space || doom != null || thing.getHP() == 1) return null;
    doom = new CopterDoom(thing);
    doom.setPower(power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {doom};
  }


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) space = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) clear();
  }

}
