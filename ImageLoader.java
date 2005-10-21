//
// ImageLoader.java
//

import java.awt.Component;
import java.awt.Image;
import java.awt.MediaTracker;
import java.awt.Toolkit;

import java.util.Hashtable;

public class ImageLoader extends Component {

  protected static final String[] PRELOAD = {
    "alex1.png", "alex2.png", "alex3.png",
    "alex-boss1.png",
    "paul1.png", "paul2.png", "paul3.png",
    "paul-boss1.png"
  };

  protected Hashtable imageHash;
  protected MediaTracker tracker;
  protected int nextId;

  public ImageLoader() {
    imageHash = new Hashtable();
    tracker = new MediaTracker(this);
    for (int i=0; i<PRELOAD.length; i++) loadImage(PRELOAD[i]);
  }

  public Image getImage(String filename) {
    Image image = (Image) imageHash.get(filename);
    if (image == null) {
      image = loadImage(filename);
      imageHash.put(filename, image);
    }
    return image;
  }

  protected Image loadImage(String filename) {
    Image image = Toolkit.getDefaultToolkit().createImage(
      getClass().getResource(filename));
    tracker.addImage(image, ++nextId);
    try { tracker.waitForID(nextId); }
    catch (InterruptedException exc) { exc.printStackTrace(); }
    return image;
  }

}
