class PowerUpMovement extends MovementStyle {

  const int PERIOD = 3;

  boolean center;
  long ticks;
  boolean dir;

  PowerUpMovement(Thing t, float x, float y, boolean center) {
    super(t);
    thing.setPos(x, y);
    this.center = center;
  }

  /** Moves the given thing according to the laser movement style. */
  move() {
    ticks++;

    if (ticks % PERIOD == 0) {
      // do power-up pulsing
      int index = thing.getImageIndex();
      if (dir) {
        index--;
        if (index == 0) dir = !dir;
      }
      else {
        index++;
        if (index == thing.getImageCount() - 1) dir = !dir;
      }
      thing.setImageIndex(index);
    }

    float cx = thing.getCX();
    float cy = thing.getCY();
    if (center) {
      VeggieCopter game = thing.getGame();
      float w2 = game.getWidth() / 2f;
      float h2 = game.getHeight() / 2f;
      if (cx > w2) {
        if (cx - w2 < 1) cx = w2;
        else cx--;
      }
      if (cx < w2) {
        if (w2 - cx < 1) cx = w2;
        else cx++;
      }
      if (cy > h2) {
        if (cy - h2 < 1) cy = h2;
        else cy--;
      }
      if (cy < h2) {
        if (h2 - cy < 1) cy = h2;
        cy++;
      }
    }
    else cy++;
    thing.setCPos(cx, cy);
  }

}
