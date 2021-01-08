/** Defines random enemy bullet attack. */
class AnnaAttack extends AttackStyle {

  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  const int FREQUENCY = 1;

  AnnaAttack(Thing t) { super(t); }

  /** Fires a shot randomly. */
  Thing[] shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return new Thing[] {new EnemyBullet(thing)};
  }

}
