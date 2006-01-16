//
// ShieldAttack.java
//

import java.awt.*;
import java.awt.event.KeyEvent;

/** Defines veggie copter shield attack style. */
public class ShieldAttack extends ColoredAttack {

  // -- Constants --

  protected static final Color PURPLE = new Color(0.7f, 0, 0.7f);


  // -- Fields --

  protected CopterShield[] shields;
  protected boolean extended;


  // -- Constructor --

  public ShieldAttack(Thing t) {
    super(t, PURPLE, t.getGame().loadImage("icon-shield.png").getImage());
  }

  // -- ShieldAttack API methods --

  public void setExtended(boolean extended) {
    this.extended = extended;
    if (shields != null) {
      for (int i=0; i<shields.length; i++) shields[i].setExtended(extended);
    }
  }


  // -- ColoredAttack API methods --

  public void activate() {
    int num = power + 1;
    shields = new CopterShield[num];
    VeggieCopter game = thing.getGame();
    for (int i=0; i<num; i++) {
      shields[i] = new CopterShield(thing, (float) (2 * Math.PI * i / num));
      shields[i].setPower(1);
      game.addThing(shields[i]);
    }
    setExtended(extended);
  }

  public void clear() {
    if (shields != null) {
      for (int i=0; i<shields.length; i++) shields[i].setHP(0);
      shields = null;
      extended = false;
    }
  }


  // -- AttackStyle API methods --

  public Thing[] shoot() {
    return null;
  }

  public void setPower(int power) {
    super.setPower(power);
    if (shields != null) {
      for (int i=0; i<shields.length; i++) shields[i].setHP(0);
    }
    activate();
  }


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) setExtended(true);
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.SHOOT) setExtended(false);
  }

}
