//
// DoomMovement.java
//

public class DoomMovement extends MovementStyle {

  // -- Constants --

  private static final int DOOM_RATE = 4;


  // -- Fields --

  private Thing owner;
  private int ticks;


  // -- Constructors --

  public DoomMovement(Thing t, Thing owner) {
    super(t);
    this.owner = owner;
  }


  // -- MovementStyle API methods --

  public void move() {
    // hurt owner
    if (ticks % DOOM_RATE == 0) {
      int hp = owner.getHP() - 1;
      if (hp > 0) owner.setHP(hp);
      else thing.setHP(0);
    }
    ticks++;
  }

}
