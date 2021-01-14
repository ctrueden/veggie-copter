/** A copter weapon style. */
class Weapon extends AttackStyle {
  constructor(t, c, img) {
    super(t);
    this.color = c;
    this.image = img;
    this.iconSize = 21;
  }

  drawIcon(ctx, x, y, selected) {
    ctx.beginPath();
    ctx.strokeStyle = Colors.White;
    ctx.rect(x, y, this.iconSize - 1, this.iconSize - 1);
    ctx.stroke();
    var h = this.power > 10 ? 19 : (2 * this.power - 1);
    ctx.fillStyle = selected ? Colors.DarkRed : Colors.Black;
    ctx.fillRect(x + 1, y + 1, this.iconSize - 2, this.iconSize - h - 2);
    ctx.fillStyle = selected ? Colors.Red : Colors.DarkGray;
    ctx.fillRect(x + 1, y + this.iconSize - h - 1, this.iconSize - 2, h);
    ctx.drawImage(this.image, x + 1, y + 1);
  }

  /**
   * Indicates control has been transferred to from this attack style,
   * and it is now active.
   */
  activate() { }

  /**
   * Indicates control has been transferred away from this attack style, and it
   * should cease functioning regardless of key press states or other factors.
   */
  clear() { }
}
