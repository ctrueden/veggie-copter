//
// ImageTools.java
//

import java.awt.*;
import java.awt.image.BufferedImage;

public class ImageTools {

  public static final boolean HARDWARE_ACCEL = true;
  public static final Container OBS = new Container();

  /** Gets the default graphics configuration for the environment. */
  public static GraphicsConfiguration getDefaultConfiguration() {
    GraphicsEnvironment ge = GraphicsEnvironment.getLocalGraphicsEnvironment();
    GraphicsDevice gd = ge.getDefaultScreenDevice();
    return gd.getDefaultConfiguration();
  }

  /**
   * Creates an image using the given graphics configuration.
   * If gc is null, the default configuration is used.
   */
  public static BufferedImage makeImage(int width, int height,
    int transparency, GraphicsConfiguration gc)
  {
    if (HARDWARE_ACCEL) {
      if (gc == null) gc = getDefaultConfiguration();
      return gc.createCompatibleImage(width, height, transparency);
    }
    else return new BufferedImage(width, height, BufferedImage.TYPE_INT_ARGB);
  }

  /** Creates an image with transparency. */
  public static BufferedImage makeImage(int width, int height) {
    return makeImage(width, height, Transparency.TRANSLUCENT, null);
  }

  /**
   * Creates a copy of the given buffered image that is
   * optimized for the given graphics configuration.
   */
  public static BufferedImage makeCompatible(Image image,
    GraphicsConfiguration gc)
  {
    if (!HARDWARE_ACCEL && image instanceof BufferedImage) {
      return (BufferedImage) image;
    }
    int w = image.getWidth(OBS);
    int h = image.getHeight(OBS);
    BufferedImage bimg = image instanceof BufferedImage ?
      (BufferedImage) image : null;
    int transparency = bimg == null ? Transparency.TRANSLUCENT :
      bimg.getColorModel().getTransparency();
    BufferedImage result = makeImage(w, h, transparency, null);
    Graphics2D g2 = result.createGraphics();
    if (bimg == null) g2.drawImage(image, 0, 0, OBS);
    else g2.drawRenderedImage(bimg, null);
    g2.dispose();
    return result;
  }

}
