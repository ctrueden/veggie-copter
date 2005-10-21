//
// MineMovement.java
//

public class MineMovement extends MovementStyle {

  // -- Constants --

  /** Number of ticks to initially throw mine forward. */
  protected static final int THROW_DURATION = 20;

  /** Speed at which mine is thrown forward. */
  protected static final int THROW_SPEED = 8;

  /** Number of ticks until mine blows up automatically. */
  protected static final int EXPLODE_DELAY = 180;

  /** Rate at which shaking occurs (lower increases shaking more quickly). */
  protected static final int SHAKE_RATE = 16;

  /** Speed at which mine moves downward after being thrown. */
  protected static final float SPEED = 1;

  /** Strength of drag pulling in enemies. */
  protected static final int DRAG_STRENGTH = 20;


  // -- Fields --

  protected long ticks;
  protected float adjX, adjY;


  // -- Constructor --

  public MineMovement(Thing t) { super(t); }


  // -- MovementStyle API methods --

  /** Drags nearby enemies closer to the mine. */
  public void move() {
    float xpos = thing.getX(), ypos = thing.getY();
    ticks++;

    int pow = ((CopterMine) thing).getStrength();
    if (ticks <= THROW_DURATION) {
      // initially throw mine forward
      int throwSpeed = THROW_SPEED + pow;
      float q = (float) Math.sqrt((double) ticks / THROW_DURATION);
      thing.setPos(xpos, ypos - throwSpeed * (1 - q));
      return;
    }
    else if (ticks == EXPLODE_DELAY + 6 * pow) {
      // mine automatically explodes
      ((MineExplode) thing.getAttack()).explode();
    }

    float shake = (float) ticks / SHAKE_RATE;
    xpos -= adjX; ypos -= adjY; // correct for last time
    adjX = shake * (float) (Math.random() - 0.5);
    adjY = shake * (float) (Math.random() - 0.5);
    float x = xpos + adjX;
    float y = ypos + adjY;
    thing.setPos(x, y + SPEED);

    // use distance squared function to drag in enemies
    Thing[] t = thing.getGame().getThings();
    for (int i=0; i<t.length; i++) {
      if (t[i].getType() != Thing.EVIL) continue;
      float tx = t[i].getCX(), ty = t[i].getCY();
      float xx = xpos - tx, yy = ypos - ty;
      float dist2 = xx * xx + yy * yy;
      if (dist2 < 1) continue;
      float dist = (float) Math.sqrt(dist2);
      float drag = DRAG_STRENGTH * pow / dist2;
      if (drag > 1) drag = 1;
      tx += drag * xx / dist;
      ty += drag * yy / dist;
      t[i].setCPos(tx, ty);
    }
  }

}
