package net.restlesscoder.heli;

public class EnemyHead extends Thing {

  public static final int NORMAL = 0;
  public static final int ATTACKING = 1;
  public static final int HURTING = 2;

  protected static final int SHOT_DELAY = 18;

  protected int shooting;

  public EnemyHead(VeggieCopter game, int max,
    BoundedImage normal, BoundedImage attacking, BoundedImage hurting)
  {
    super(game);
    setImageList(new BoundedImage[] {normal, attacking, hurting});
    maxhp = hp = max;
    //power = 10;
  }

  public boolean isShooting() { return shooting > 0; }

  public void move() {
    super.move();
    if (isHit()) setImageIndex(HURTING);
    else if (isShooting()) setImageIndex(ATTACKING);
    else setImageIndex(NORMAL);
  }

  public Thing[] shoot() {
    Thing[] t = super.shoot();
    if (t != null) shooting = SHOT_DELAY;
    else if (shooting > 0) shooting--;
    if (isDead()) {
      // dead head drops a power-up
      t = getPowerUp();
    }
    return t;
  }

  public Thing[] getPowerUp() {
    return new Thing[] {new PowerUp(game, getCX(), getCY(), 20, null)};
  }

}
