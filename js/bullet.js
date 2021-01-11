class BulletMovement extends MovementStyle {
  constructor(t, x, y, xtarget, ytarget, speed) {
    super(t);

    this.thing.setPos(x, y);
    if (xtarget == null) xtarget = t.game.copter.xpos;
    if (ytarget == null) ytarget = t.game.copter.ypos;
    this.speed = speed == null ? 2.2 : speed;
    this.xstart = x; this.ystart = y;
    var xx = xtarget - x;
    var yy = ytarget - y;
    var c = Math.sqrt((xx * xx + yy * yy) / (speed * speed));
    this.xtraj = xx / c;
    this.ytraj = yy / c;
    this.tick = 0;
  }

  move() {
    var xpos = this.xstart + this.tick * this.xtraj;
    var ypos = this.ystart + this.tick * this.ytraj;
    this.tick++;
    this.thing.setPos(xpos, ypos);
  }
}
