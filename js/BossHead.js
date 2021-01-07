package net.restlesscoder.heli;

public abstract class BossHead extends EnemyHead {

  public BossHead(VeggieCopter game, int max,
    BoundedImage normal, BoundedImage attacking, BoundedImage hurting)
  {
    super(game, max, normal, attacking, hurting);
  }

  /** Gets the attack form left behind by this boss upon defeat. */
  public abstract ColoredAttack getColoredAttack();

  public Thing[] getPowerUp() {
    return new Thing[] {
      new PowerUp(game, getCX(), getCY(), 50, getColoredAttack())
    };
  }

}
