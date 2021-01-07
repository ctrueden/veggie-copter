package net.restlesscoder.heli;

import java.awt.*;
import java.awt.event.KeyEvent;

/** Veggie copter object (the good guy!). */
public class Copter extends Thing {

  // -- Fields --

  /** Image of veggie copter. */
  protected Image img;


  // -- Constructor --

  /** Constructs a copter object. */
  public Copter(VeggieCopter game) {
    super(game);
    BoundedImage bi = game.loadImage("copter.gif");
    bi.addBox(new BoundingBox(2, 6, 2, 5));
    setImage(bi);
    setMovement(new CopterMovement(this));

    CopterAttack copterAttack = new CopterAttack(this);
    copterAttack.addAttackStyle(new GunAttack(this)); // brown
    copterAttack.addAttackStyle(new EnergyAttack(this)); // orange
    copterAttack.addAttackStyle(new SplitterAttack(this)); // yellow
    copterAttack.addAttackStyle(new LaserAttack(this)); // green
    copterAttack.addAttackStyle(new LitAttack(this)); // cyan
    copterAttack.addAttackStyle(new SpreadAttack(this)); // blue
    copterAttack.addAttackStyle(new ShieldAttack(this)); // purple
    copterAttack.addAttackStyle(new HomingAttack(this)); // magenta
    copterAttack.addAttackStyle(new RegenAttack(this)); // pink
    copterAttack.addAttackStyle(new ChargeAttack(this)); // white
    copterAttack.addAttackStyle(new GrayAttack(this)); // gray
    copterAttack.addAttackStyle(new MineAttack(this)); // dark gray
    copterAttack.addAttackStyle(new DoomAttack(this)); // black
    setAttack(copterAttack);

    maxhp = hp = 100;
    type = GOOD;
  }


  // -- Copter API methods --

  public void reset() { ((CopterMovement) move).reset(); }

  public void drawWeaponStatus(Graphics g, int x, int y) {
    CopterAttack copterAttack = (CopterAttack) attack;
    copterAttack.drawWeaponStatus(g, x, y);
  }


  // -- KeyListener API methods --

  /** Handles keyboard presses. */
  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == Keys.POWER_UP) {
      int pow = attack.getPower();
      pow++;
      attack.setPower(pow);
    }
    else if (code == Keys.POWER_DOWN) {
      int pow = attack.getPower();
      if (pow > 1) pow--;
      attack.setPower(pow);
    }
    super.keyPressed(e);
  }

}
