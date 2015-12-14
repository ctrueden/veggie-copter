package net.restlesscoder.heli;

/** Defines random enemy bullet attack. */
public class AnnaAttack extends AttackStyle {

  // -- Constants --

  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  protected static final int FREQUENCY = 1;


  // -- Constructor --

  public AnnaAttack(Thing t) { super(t); }


  // -- AttackStyle API methods --

  /** Fires a shot randomly. */
  public Thing[] shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return new Thing[] {new EnemyBullet(thing)};
  }

}
