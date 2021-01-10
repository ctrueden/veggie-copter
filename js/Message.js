class Message {
  constructor(msg, x, y, size, color, duration) {
    this.msg = msg;
    this.x = x;
    this.y = y;
    this.font = size + "px SansSerif";
    this.color = color;
    this.remain = duration;
  }

  draw(ctx) {
    var origFont = ctx.getFont();
    var origColor = ctx.getColor();
    ctx.setFont(font);
    ctx.setColor(color);
    ctx.drawString(msg, x, y);
    ctx.setFont(origFont);
    ctx.setColor(origColor);
  }

  checkFinished() { return --this.remain <= 0; }
}
