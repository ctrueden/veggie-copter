package net.restlesscoder.heli;

public class EnergyMovement extends MovementStyle {

  // -- Constants --

  public static final int FLUX_RADIUS = 5;
  protected static final int FLUX_RATE = 4;


  // -- Fields --

  private Thing owner;
  private long ticks;


  // -- Constructors --

  public EnergyMovement(Thing t, Thing owner) {
    super(t);
    this.owner = owner;
    syncPos();
  }


  // -- EnergyMovement API methods --

  public void syncPos() {
    float xpos = owner.getCX();
    float ypos = owner.getCY();
    thing.setCPos(xpos, ypos);
  }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the energy movement style. */
  public void move() {
    syncPos();
    ticks++;

    Copter hero = thing.getGame().getCopter();
    float cx1 = hero.getX();
    float cx2 = cx1 + hero.getWidth();
    float cy = hero.getY();
    float x1 = owner.getX();
    float x2 = x1 + owner.getWidth();
    float y = owner.getCY();
    if (owner.isDead() || cx2 < x1 || cx1 > x2 || cy < y) thing.setHP(0);

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
