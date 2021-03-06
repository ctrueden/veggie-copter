package net.restlesscoder.heli;

import java.awt.*;
import java.awt.event.KeyEvent;

/** Defines veggie copter laser attack style. */
public class LaserAttack extends ColoredAttack {

  // -- Constants --

  protected static final int[] FLUX =
    {0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 1};


  // -- Fields --

  protected boolean space;
  protected int flux;


  // -- Constructor --

  public LaserAttack(Thing t) {
    super(t, Color.green, t.getGame().loadImage("icon-laser.png").getImage());
  }

  public void clear() { space = false; }


  // -- AttackStyle API methods --

  /** Fires a shot if space bar is pressed. */
  public Thing[] shoot() {
    if (!space) return null;
    int size = power - 1;
    if (size > CopterLaser.MAX_SIZE - 3) size = CopterLaser.MAX_SIZE - 3;
    flux = (flux + 1) % FLUX.length;
    size += FLUX[flux];
    CopterLaser laser = new CopterLaser(thing, size);
    laser.setPower(power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {laser};
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
