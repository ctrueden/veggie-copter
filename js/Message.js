class Message {

  private String msg;
  private var x, y;
  private Color color;
  private Font font;
  private var remain;

  Message(msg, x, y,
    size, color, duration)
  {
    this.msg = msg;
    this.x = x;
    this.y = y;
    font = new Font("SansSerif", Font.PLAIN, size);
    this.color = color;
    remain = duration;
  }

  draw(g) {
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
