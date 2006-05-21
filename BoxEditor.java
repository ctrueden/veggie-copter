// BoxEditor.java

import java.io.*;
import java.awt.*;
import java.awt.event.*;
import java.awt.image.BufferedImage;
import java.util.*;
import javax.swing.*;

public class BoxEditor extends JFrame
  implements KeyListener, MouseListener, MouseMotionListener, WindowListener {

  // -- Constants --

  public static final Color[] COLORS = {
    Color.red, Color.blue, Color.green, Color.cyan,
    Color.magenta, Color.yellow, Color.white
  };
 

  // -- Fields --

  /** Index of current image. */
  private int ndx = 0;

  /** List of images. */
  private Vector images;

  /** List of image names. */
  private Vector names;

  /** Message indicating last event. */
  private String message;

  /** Bounding box currently being drawn. */
  private BoundingBox bb;


  // -- Constructor --

  public BoxEditor() throws IOException {
    super();
    addKeyListener(this);
    addMouseListener(this);
    addMouseMotionListener(this);
    addWindowListener(this);
    setBounds(300, 300, 300, 300);
    File[] files = new File(".").listFiles();
    images = new Vector();
    names = new Vector();
    ImageLoader loader = new ImageLoader();
    for (int i=0; i<files.length; i++) {
      String name = files[i].getName();
      if (!name.endsWith(".png") && !name.endsWith(".gif")) continue;
      if (name.startsWith("icon-")) continue;
      if (name.endsWith("-heart.png") || name.endsWith("-club.png") ||
        name.endsWith("-diamond.png") || name.endsWith("-spade.png"))
      {
        continue;
      }
      System.out.println("Loading " + name);
      BufferedImage img = loader.getImage(name);
      BoundedImage bi = new BoundedImage(img);
      images.add(bi);
      names.add(name);
    }
    updateTitle();
    load();
    show();
  }


  // -- BoxEditor methods --

  public void updateTitle() { setTitle((String) names.elementAt(ndx)); }

  public void load() throws IOException {
    for (int i=0; i<images.size(); i++) {
      BoundedImage bi = (BoundedImage) images.elementAt(i);
      String name = (String) names.elementAt(i);
      String boxName = name.substring(0, name.length() - 3) + "box";
      System.out.println("Loading " + boxName);
      BufferedReader in = null;
      try { in = new BufferedReader(new FileReader(boxName)); }
      catch (IOException exc) { continue; }
      while (true) {
        String line = in.readLine();
        if (line == null) break;
        StringTokenizer st = new StringTokenizer(line);
        int[] coords = new int[4];
        int c = 0;
        while (st.hasMoreTokens()) {
          String token = st.nextToken();
          coords[c++] = Integer.parseInt(token);
          if (c == coords.length) break;
        }
        if (c == 4) {
          int w = bi.getWidth(), h = bi.getHeight();
          bi.addBox(new BoundingBox(coords[0], coords[1],
            coords[2], coords[3]));
        }
      }
      in.close();
    }
  }

  public void save() throws IOException {
    for (int i=0; i<images.size(); i++) {
      BoundedImage bi = (BoundedImage) images.elementAt(i);
      String name = (String) names.elementAt(i);
      String boxName = name.substring(0, name.length() - 3) + "box";
      System.out.println("Saving " + boxName);
      PrintWriter out = new PrintWriter(new FileWriter(boxName));
      int w = bi.getWidth(), h = bi.getHeight();
      Rectangle[] r = bi.getBoxes(0, 0);
      for (int b=0; b<r.length; b++) {
        out.print(r[b].x + " " + r[b].y + " ");
        int x2 = w - r[b].x - r[b].width - 1;
        int y2 = h - r[b].y - r[b].height - 1;
        out.println(x2 + " " + y2);
      }
      out.close();
    }
  }


  // -- Component methods --

  public void paint(Graphics g) {
    Dimension size = getSize();
    BoundedImage bi = (BoundedImage) images.elementAt(ndx);
    int w = bi.getWidth();
    int h = bi.getHeight();
    int x = (size.width - w) / 2;
    int y = (size.height - h) / 2;
    g.fillRect(0, 0, size.width, size.height);
    g.drawImage(bi.getImage(), x, y, this);
    Rectangle[] r = bi.getBoxes(0, 0);
    for (int b=0; b<r.length; b++) {
      g.setColor(COLORS[b]);
      g.drawRect(x + r[b].x, y + r[b].y, r[b].width, r[b].height);
    }
  }


  // -- KeyListener methods --

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    switch (code) {
      case KeyEvent.VK_UP:
        break;
      case KeyEvent.VK_DOWN:
        break;
      case KeyEvent.VK_LEFT:
        System.out.println("left");
        break;
      case KeyEvent.VK_RIGHT:
        System.out.println("right");
        break;
      case KeyEvent.VK_PAGE_UP:
        ndx--;
        if (ndx < 0) ndx = images.size() - 1;
        updateTitle();
        break;
      case KeyEvent.VK_PAGE_DOWN:
        ndx++;
        if (ndx >= images.size()) ndx = 0;
        updateTitle();
        break;
      case KeyEvent.VK_DELETE:
        BoundedImage bi = (BoundedImage) images.elementAt(ndx);
        bi.removeBox();
        break;
    }
    repaint();
  }
  public void keyTyped(KeyEvent e) { }
  public void keyReleased(KeyEvent e) { }


  // -- MouseListener methods --

  public void mousePressed(MouseEvent e) {
    Dimension size = getSize();
    BoundedImage bi = (BoundedImage) images.elementAt(ndx);
    int w = bi.getWidth();
    int h = bi.getHeight();
    int x = (size.width - w) / 2;
    int y = (size.height - h) / 2;
    int mx = e.getX();
    int my = e.getY();
    int x1 = mx - x, y1 = my - y;
    int x2 = w - x1 - 1, y2 = h - y1 - 1;
    bb = new BoundingBox(x1, y1, x2, y2);
    bi.addBox(bb);
    repaint();
  }
  public void mouseReleased(MouseEvent e) {
    bb = null;
  }
  public void mouseClicked(MouseEvent e) { }
  public void mouseEntered(MouseEvent e) { }
  public void mouseExited(MouseEvent e) { }


  // -- MouseMotionListener methods --

  public void mouseDragged(MouseEvent e) {
    if (bb != null) {
      Dimension size = getSize();
      BoundedImage bi = (BoundedImage) images.elementAt(ndx);
      int w = bi.getWidth();
      int h = bi.getHeight();
      int x = (size.width - w) / 2;
      int y = (size.height - h) / 2;
      int mx = e.getX();
      int my = e.getY();
      int x1 = mx - x, y1 = my - y;
      int x2 = w - x1 - 1, y2 = h - y1 - 1;
      bb.x2 = x2;
      bb.y2 = y2;
      repaint();
    }
  }
  public void mouseMoved(MouseEvent e) { }


  // -- WindowListener methods --

  public void windowClosed(WindowEvent e) { }
  public void windowClosing(WindowEvent e) {
    try { save(); }
    catch (IOException exc) { exc.printStackTrace(); }
    System.exit(0);
  }
  public void windowActivated(WindowEvent e) { }
  public void windowDeactivated(WindowEvent e) { }
  public void windowDeiconified(WindowEvent e) { }
  public void windowIconified(WindowEvent e) { }
  public void windowOpened(WindowEvent e) { }


  // -- Main method --

  public static void main(String[] args) throws Exception { new BoxEditor(); }

}
