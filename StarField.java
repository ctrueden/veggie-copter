//
// StarField.java
//

import java.awt.*;

public class StarField {

  // -- Constants --

  /** Number of stars in star field. */
  private static final int STARS = 50;

  /** Minimum star speed. */
  private static final int STAR_MIN = 1;

  /** Maximum star speed. */
  private static final int STAR_MAX = 4;


  // -- Fields --

  /** Dimensions of star field. */
  private int width, height;

  /** Star field Y values. */
  private double[] starY;

  /** Star field velocity values. */
  private double[] starV;


  // -- Constructor --

  /** Constructs a star field. */
  public StarField(int w, int h) {
    width = w; height = h;
    starY = new double[STARS];
    starV = new double[STARS];
    for (int i=0; i<STARS; i++) {
      starY[i] = height * Math.random();
      starV[i] = (STAR_MAX - STAR_MIN + 1) * Math.random() + STAR_MIN;
    }
  }


  // -- StarField API methods --

  /** Draws stars to the given graphics context. */
  public void drawStars(Graphics g) {
    g.setColor(Color.gray);
    for (int i=0; i<STARS; i++) {
      int x = i * width / STARS;
      g.drawLine(x, (int) starY[i], x, (int) (starY[i] - 2 * starV[i]));
    }
  }

  /** Updates star positions. */
  public void moveStars() {
    for (int i=0; i<STARS; i++) {
      starY[i] += starV[i];
      if (starY[i] - 2 * starV[i] > height) {
        starY[i] = 0;
        starV[i] = (STAR_MAX - STAR_MIN + 1) * Math.random() + STAR_MIN;
      }
    }
  }

}
