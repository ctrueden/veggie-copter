//
// RegenMovement.java
//

public class RegenMovement extends MovementStyle {

  // -- Constants --

  public static final int FLUX_RADIUS = 5;
  protected static final int FLUX_RATE = 4;


  // -- Fields --

  private Thing owner;
  private long ticks;


  // -- Constructors --

  public RegenMovement(Thing t, Thing owner) {
    super(t);
    this.owner = owner;
    syncPos();
  }


  // -- RegenMovement API methods --

  public void syncPos() {
    float xpos = owner.getCX();
    float ypos = owner.getCY();
    thing.setCPos(xpos, ypos);
  }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the regen movement style. */
  public void move() {
    syncPos();
    ticks++;

    int regenRate = 20 - thing.getPower();
    if (regenRate <= 0) regenRate = 1;
    if (ticks % regenRate == 0) {
      // regenerate copter
      Copter hero = thing.getGame().getCopter();
      int hp = hero.getHP();
      int max = hero.getMaxHP();
      if (hp < max) hero.setHP(hp + 1);
    }

    if (ticks % FLUX_RATE == 0) {
      // fluctuate
      long t = ticks / FLUX_RATE;
      int ndx = thing.getPower() - 1;
      if (ndx < 0) ndx = 0;
      else if (ndx > 9) ndx = 9;

      boolean dir = t % (2 * FLUX_RADIUS) >= FLUX_RADIUS;
      int amount = (int) (t % FLUX_RADIUS);
      if (dir) amount = FLUX_RADIUS - amount - 1;
      ndx += amount;

      thing.setImageIndex(ndx);
    }
  }

}
