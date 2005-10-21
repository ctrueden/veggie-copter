//
// MineExplode.java
//

import java.awt.event.KeyEvent;

/** Defines veggie copter gravity mine explosion behavior. */
public class MineExplode extends AttackStyle {

  // -- Fields --

  protected boolean explode;


  // -- Constructor --

  public MineExplode(Thing t) { super(t); }


  // -- MineExplode API methods --

  /** Causes the mine to explode. */
  public void explode() { explode = true; }


  // -- AttackStyle API methods --

  public Thing[] shoot() { return null; }

  /** Explodes mine when trigger is pressed. */
  public Thing[] trigger() {
    if (!explode) return null;

    // explode in power+2 bullets evenly space around a circle
    int num = ((CopterMine) thing).getStrength() + 2;
    Thing[] bullets = new Thing[num];
    float cx = thing.getCX(), cy = thing.getCY();
    for (int i=0; i<num; i++) {
      float angle = (float) (2 * Math.PI * i / num);
      bullets[i] = new MineBullet(thing, angle, cx, cy);
    }
    //SoundPlayer.playSound(getClass().getResource("explode.wav"));
    thing.setHP(0);
    return bullets;
  }


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.TRIGGER) explode();
  }

}
