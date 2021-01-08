
/** Defines random enemy bullet attack. */
public class AnnaAttack extends AttackStyle {

  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  protected static final int FREQUENCY = 1;

  public AnnaAttack(Thing t) { super(t); }

  /** Fires a shot randomly. */
  public Thing[] shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return new Thing[] {new EnemyBullet(thing)};
  }

}
