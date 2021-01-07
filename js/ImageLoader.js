package net.restlesscoder.heli;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.util.Hashtable;
import javax.imageio.ImageIO;

public class ImageLoader {

  protected static final String[] PRELOAD = {
    "alex1.png", "alex2.png", "alex3.png",
    "alex-boss1.png",
    "paul1.png", "paul2.png", "paul3.png",
    "paul-boss1.png"
  };

  protected Hashtable imageHash;
  protected int nextId;

  public ImageLoader() {
    imageHash = new Hashtable();
    for (int i=0; i<PRELOAD.length; i++) loadImage(PRELOAD[i]);
  }

  public BufferedImage getImage(String filename) {
    BufferedImage image = (BufferedImage) imageHash.get(filename);
    if (image == null) {
      image = loadImage(filename);
      imageHash.put(filename, image);
    }
    return image;
  }

  protected BufferedImage loadImage(String filename) {
    BufferedImage image = null;
    try { image = ImageIO.read(getClass().getResource(filename)); }
    catch (IOException exc) { exc.printStackTrace(); }
    return ImageTools.makeCompatible(image, null);
  }

}
