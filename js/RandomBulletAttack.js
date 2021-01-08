/** Defines random enemy bullet attack. */
class RandomBulletAttack extends AttackStyle {

  /** Probability that this thing will fire a bullet (1=rare, 60=always). */
  const int FREQUENCY = 3;

  RandomBulletAttack(Thing t) { super(t); }

  /** Fires a shot randomly. */
  Thing[] shoot() {
    if (Math.random() >= 1.0 / (60 - FREQUENCY)) return null;
    return new Thing[] {new EnemyBullet(thing)};
  }

}
