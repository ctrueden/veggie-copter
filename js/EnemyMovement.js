package net.restlesscoder.heli;

public class EnemyMovement extends MovementStyle {

  // -- Constants --

  protected static final int ZIGZAG = 1;
  protected static final int SPIRAL = 2;
  protected static final int WAVE = 3;


  // -- Fields --

  protected long ticks;
  protected int style;
  protected float[] params;

  protected float xmod = 0, ymod = 1; // for zigzag


  // -- Constructors --

  /**
   * Constructs a new enemy movement handler.
   * params[0] = movement style (e.g., zigzag, spiral, wave, etc.)
   * params[1] = starting X coordinate
   * params[2] = starting Y coordinate
   * params[3+] = additional style parameters
   *   zigzag: tick1, xmod1, ymod1, tick2, xmod2, ymod2, ...
   *   spiral: TODO
   *   wave: TODO
   */
  public EnemyMovement(Thing t, String[] params) {
    super(t);

    // determine movement style
    if (params[0].equalsIgnoreCase("zigzag")) style = ZIGZAG;
    else if (params[0].equalsIgnoreCase("spiral")) style = SPIRAL;
    else if (params[0].equalsIgnoreCase("wave")) style = WAVE;

    // set starting position
    float xpos = Float.parseFloat(params[1]);
    float ypos = Float.parseFloat(params[2]);

    // prepare additional parameters
    this.params = new float[params.length - 3];
    for (int i=0; i<this.params.length; i++) {
      this.params[i] = Float.parseFloat(params[i + 3]);
    }

    // starting position
    VeggieCopter game = thing.getGame();
    thing.setPos(xpos, ypos);
  }


  // -- MovementStyle API methods --

  /** Moves the given thing according to the enemy type A movement style. */
  public void move() {
    ticks++;
    float cx = thing.getCX(), cy = thing.getCY();

    if (style == ZIGZAG) {
      // tick1, xmod1, ymod1, tick2, xmod2, ymod2, ...
      for (int i=0; i<params.length-2; i+=3) {
        if (params[i] == ticks) {
          xmod = params[i + 1];
          ymod = params[i + 2];
        }
      }
      cx += xmod;
      cy += ymod;
    }

    else if (style == SPIRAL) {
      // TODO
    }

    else if (style == WAVE) {
      // TODO
    }

    thing.setCPos(cx, cy);
  }

}
