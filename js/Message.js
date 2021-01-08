class Message {

  private String msg;
  private int x, y;
  private Color color;
  private Font font;
  private int remain;

  Message(String msg, int x, int y,
    int size, Color color, int duration)
  {
    this.msg = msg;
    this.x = x;
    this.y = y;
    font = new Font("SansSerif", Font.PLAIN, size);
    this.color = color;
    remain = duration;
  }

  draw(Graphics g) {
    Font origFont = g.getFont();
    Color origColor = g.getColor();
    g.setFont(font);
    g.setColor(color);
    g.drawString(msg, x, y);
    g.setFont(origFont);
    g.setColor(origColor);
  }

  boolean checkFinished() { return --remain <= 0; }

}
