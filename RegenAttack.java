//
// RegenAttack.java
//

import java.awt.*;
import java.awt.event.KeyEvent;

/** Defines veggie copter regen "attack" style. */
public class RegenAttack extends ColoredAttack {

  // -- Fields --

  protected boolean space;
  protected CopterRegen regen;


  // -- Constructor --

  public RegenAttack(Thing t) {
    super(t, Color.pink, t.getGame().loadImage("icon-regen.png").getImage());
  }


  // -- ColoredAttack API methods --

  public void clear() {
    space = false;
    if (regen != null) regen.setHP(0);
    regen = null;
  }


  // -- AttackStyle API methods --

  /** Begins regeneration if space bar is pressed. */
  public Thing[] shoot() {
    if (!space || regen != null) return null;
    regen = new CopterRegen(thing);
    regen.setPower(power);
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return new Thing[] {regen};
  }

  public void setPower(int power) {
    super.setPower(power);
    if (regen != null) regen.setPower(power);
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
