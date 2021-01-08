class BoxEditor extends JFrame
  KeyListener, MouseListener, MouseMotionListener, WindowListener {

  const COLORS = [
    Color.red, Color.blue, Color.green, Color.cyan,
    Color.magenta, Color.yellow, Color.white
  ];
 

  /** Index of current image. */
  ndx = 0;

  /** List of images. */
  images;

  /** List of image names. */
  names;

  /** Message indicating last event. */
  message;

  /** Bounding box currently being drawn. */
  bb;

  BoxEditor() throws IOException {
    super();
    addKeyListener(this);
    addMouseListener(this);
    addMouseMotionListener(this);
    addWindowListener(this);
    setBounds(300, 300, 300, 300);
    var pathPrefix = "src/main/resources/net/restlesscoder/heli";
    var files = new File(pathPrefix).listFiles();
    images = new Vector();
    names = new Vector();
    var loader = new ImageLoader();
    for (var i=0; i<files.length; i++) {
      var name = files[i].getName();
      if (!name.endsWith(".png") && !name.endsWith(".gif")) continue;
      if (name.startsWith("icon-")) continue;
      if (name.endsWith("-heart.png") || name.endsWith("-club.png") ||
        name.endsWith("-diamond.png") || name.endsWith("-spade.png"))
      {
        continue;
      }
      System.out.println("Loading " + name);
      var img = loader.getImage(name);
      var bi = new BoundedImage(img);
      images.add(bi);
      names.add(name);
    }
    updateTitle();
    load();
    setVisible(true);
  }

  updateTitle() { setTitle(names[ndx]); }

  load() throws IOException {
    for (var i=0; i<images.length; i++) {
      var bi = images[i];
      var name = names[i];
      var boxName = name.substring(0, name.length() - 3) + "box";
      System.out.println("Loading " + boxName);
      var in = null;
      try { in = new BufferedReader(new FileReader(boxName)); }
      catch (exc) { continue; }
      while (true) {
        var line = in.readLine();
        if (line == null) break;
        var st = new StringTokenizer(line);
        var coords = [0, 0, 0, 0];
        var c = 0;
        while (st.hasMoreTokens()) {
          var token = st.nextToken();
          coords[c++] = parseInt(token);
          if (c == coords.length) break;
        }
        if (c == 4) {
          var w = bi.getWidth(), h = bi.getHeight();
          bi.addBox(new BoundingBox(coords[0], coords[1],
            coords[2], coords[3]));
        }
      }
      in.close();
    }
  }

  save() throws IOException {
    for (var i=0; i<images.length; i++) {
      var bi = images[i];
      var name = names[i];
      var boxName = name.substring(0, name.length() - 3) + "box";
      System.out.println("Saving " + boxName);
      var out = new PrintWriter(new FileWriter(boxName));
      var w = bi.getWidth(), h = bi.getHeight();
      var r = bi.getBoxes(0, 0);
      for (int b=0; b<r.length; b++) {
        out.print(r[b].x + " " + r[b].y + " ");
        var x2 = w - r[b].x - r[b].width - 1;
        var y2 = h - r[b].y - r[b].height - 1;
        out.println(x2 + " " + y2);
      }
      out.close();
    }
  }

  paint(g) {
    var size = getSize();
    var bi = images[ndx];
    var w = bi.getWidth();
    var h = bi.getHeight();
    var x = (size.width - w) / 2;
    var y = (size.height - h) / 2;
    g.fillRect(0, 0, size.width, size.height);
    g.drawImage(bi.getImage(), x, y, this);
    var r = bi.getBoxes(0, 0);
    for (int b=0; b<r.length; b++) {
      g.setColor(COLORS[b]);
      g.drawRect(x + r[b].x, y + r[b].y, r[b].width, r[b].height);
    }
  }

  keyPressed(e) {
    var code = e.getKeyCode();
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
        if (ndx < 0) ndx = images.length - 1;
        updateTitle();
        break;
      case KeyEvent.VK_PAGE_DOWN:
        ndx++;
        if (ndx >= images.length) ndx = 0;
        updateTitle();
        break;
      case KeyEvent.VK_DELETE:
        BoundedImage bi = (BoundedImage) images[ndx];
        bi.removeBox();
        break;
    }
    repaint();
  }
  keyReleased(e) { }

  mousePressed(e) {
    var size = getSize();
    var bi = images[ndx];
    var w = bi.getWidth();
    var h = bi.getHeight();
    var x = (size.width - w) / 2;
    var y = (size.height - h) / 2;
    var mx = e.getX();
    var my = e.getY();
    var x1 = mx - x, y1 = my - y;
    var x2 = w - x1 - 1, y2 = h - y1 - 1;
    bb = new BoundingBox(x1, y1, x2, y2);
    bi.addBox(bb);
    repaint();
  }
  mouseReleased(e) {
    bb = null;
  }
  mouseClicked(e) { }
  mouseEntered(e) { }
  mouseExited(e) { }

  mouseDragged(e) {
    if (bb != null) {
      var size = getSize();
      var bi = images[ndx];
      var w = bi.getWidth();
      var h = bi.getHeight();
      var x = (size.width - w) / 2;
      var y = (size.height - h) / 2;
      var mx = e.getX();
      var my = e.getY();
      var x1 = mx - x, y1 = my - y;
      var x2 = w - x1 - 1, y2 = h - y1 - 1;
      bb.x2 = x2;
      bb.y2 = y2;
      repaint();
    }
  }
  mouseMoved(e) { }

  windowClosed(e) { }
  windowClosing(e) {
    try { save(); }
    catch (exc) { exc.printStackTrace(); }
    System.exit(0);
  }
  windowActivated(e) { }
  windowDeactivated(e) { }
  windowDeiconified(e) { }
  windowIconified(e) { }
  windowOpened(e) { }
}
