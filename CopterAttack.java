//
// CopterAttack.java
//

import java.awt.Graphics;
import java.awt.event.KeyEvent;
import java.util.Vector;

/** Defines veggie copter attack. */
public class CopterAttack extends AttackStyle {

  // -- Fields --

  protected Vector attacks = new Vector();
  protected int current = 0;


  // -- Constructor --

  public CopterAttack(Thing t) { super(t); }


  // -- CopterAttack API methods --

  /** Gets current attack style. */
  public ColoredAttack getAttackStyle() {
    if (current < 0) return null;
    return (ColoredAttack) attacks.elementAt(current);
  }

  /** Gets list of linked attack styles. */
  public ColoredAttack[] getAttackStyles() {
    ColoredAttack[] att = new ColoredAttack[attacks.size()];
    attacks.copyInto(att);
    return att;
  }

  /** Adds an attack style to the list of choices. */
  public void addAttackStyle(ColoredAttack attack) {
    // check whether copter already has this type of attack
    Class c = attack.getClass();
    int size = attacks.size();
    for (int i=0; i<size; i++) {
      if (attacks.elementAt(i).getClass().equals(c)) return;
    }
    attacks.add(attack);
  }

  /** Sets attack style to the given list index. */
  public void setAttackStyle(int index) {
    if (index < -1 || index >= attacks.size()) return;
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      for (int i=0; i<attacks.size(); i++) {
        ((ColoredAttack) attacks.elementAt(i)).clear();
      }
    }
    else attack.clear();
    current = index;
  }

  public void drawWeaponStatus(Graphics g, int x, int y) {
    int size = attacks.size();
    for (int i=0; i<size; i++) {
      ColoredAttack attack = (ColoredAttack) attacks.elementAt(i);
      attack.drawIcon(g, x, y, current < 0 || i == current);
      x += ColoredAttack.ICON_SIZE - 1; // one pixel overlap
    }
  }


  // -- AttackStyle API methods --

  public Thing[] shoot() {
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      Vector v = new Vector();
      for (int i=0; i<attacks.size(); i++) {
        Thing[] t = ((ColoredAttack) attacks.elementAt(i)).shoot();
        if (t != null) for (int j=0; j<t.length; j++) v.add(t[j]);
      }
      if (v.size() == 0) return null;
      Thing[] shots = new Thing[v.size()];
      v.copyInto(shots);
      return shots;
    }
    else return attack.shoot();
  }

  public Thing[] trigger() {
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      Vector v = new Vector();
      for (int i=0; i<attacks.size(); i++) {
        Thing[] t = ((ColoredAttack) attacks.elementAt(i)).trigger();
        if (t != null) for (int j=0; j<t.length; j++) v.add(t[j]);
      }
      if (v.size() == 0) return null;
      Thing[] triggers = new Thing[v.size()];
      v.copyInto(triggers);
      return triggers;
    }
    return attack.trigger();
  }

  public void setPower(int power) {
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      Vector v = new Vector();
      for (int i=0; i<attacks.size(); i++) {
        ((ColoredAttack) attacks.elementAt(i)).setPower(power);
      }
    }
    else attack.setPower(power);
  }

  public int getPower() {
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      return ((ColoredAttack) attacks.elementAt(0)).getPower();
    }
    return attack.getPower();
  }


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    int size = attacks.size();
    if (code == Keys.ATTACK_STYLE_CYCLE) setAttackStyle((current + 1) % size);
    else if (code == Keys.ALL_ATTACK_STYLES) {
      // turn on all attack styles simultaneously
      setAttackStyle(-1);
    }
    else {
      boolean match = false;
      for (int i=0; i<Keys.ATTACK_STYLES.length; i++) {
        if (code == Keys.ATTACK_STYLES[i]) {
          setAttackStyle(i);
          match = true;
          break;
        }
      }
      if (!match) {
        ColoredAttack attack = getAttackStyle();
        if (attack == null) { // all attack styles
          for (int i=0; i<attacks.size(); i++) {
            ((ColoredAttack) attacks.elementAt(i)).keyPressed(e);
          }
        }
        else attack.keyPressed(e);
      }
    }
  }

  public void keyReleased(KeyEvent e) {
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      for (int i=0; i<attacks.size(); i++) {
        ((ColoredAttack) attacks.elementAt(i)).keyReleased(e);
      }
    }
    else attack.keyReleased(e);
  }

  public void keyTyped(KeyEvent e) {
    ColoredAttack attack = getAttackStyle();
    if (attack == null) { // all attack styles
      for (int i=0; i<attacks.size(); i++) {
        ((ColoredAttack) attacks.elementAt(i)).keyReleased(e);
      }
    }
    else attack.keyTyped(e);
  }

}
