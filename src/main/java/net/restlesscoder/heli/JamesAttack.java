package net.restlesscoder.heli;

/** Defines Jamesey's attack style. */
public class JamesAttack extends AttackStyle {

  // -- Constants --

  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  protected static final int FREQUENCY = 1;


  // -- Constructor --

  public JamesAttack(Thing t) { super(t); }


  // -- AttackStyle API methods --

  /** Fires a shot randomly. */
  public Thing[] shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return new Thing[] {new EnemyBullet(thing)};
  }

}
