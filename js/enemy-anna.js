/** Defines random enemy bullet attack. */
class AnnaAttack extends AttackStyle {
  constructor(t) {
    super(t);

    /** Probability that this thing will fire a bullet (1=rare, 60=always). */
    this.frequency = 1;
  }

  /** Fires a shot randomly. */
  shoot() {
    if (Math.random() >= 1.0 / (60 - this.frequency)) return null;
    return [new EnemyBullet(thing, null, null)];
  }

}
