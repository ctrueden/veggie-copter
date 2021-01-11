class CopterSpread extends Thing {

  const var SPREAD_SPEED = 10;

  static Sprite image;

  static {
    var size = 9;
    var img = makeImage(size, size);
    var ctx = context2d(img);
    ctx.fillStyle = "blue";
    ctx.fillRoundRect(0, 0, size, size, size / 2, size / 2);
    image = new Sprite(img);
    image.addBox(new BoundingBox());
  }

  CopterSpread(thing, angle) {
    super(thing.game);
    type = GOOD_BULLET;
    setSprite(image);
    var x = thing.cx - width / 2, y = thing.getY();
    var xd = -(float) (100 * Math.cos(angle)) + x;
    var yd = -(float) (100 * Math.sin(angle)) + y;
    move = new BulletMovement(this, x, y, xd, yd, SPREAD_SPEED);
  }

}

/** Defines veggie copter spread attack. */
class SpreadWeapon extends Weapon {

  RECHARGE = 10;
  POWER = 3;

  boolean space = false;
  var fired;

  constructor(t) {
    super(t, "blue", t.game.sprite("icon-spread").image);
  }

  clear() { space = false; }

  /** Fires a shot if space bar is pressed. */
  Thing[] shoot() {
    if (fired > 0) {
      fired--;
      return null;
    }
    if (!space) return null;
    fired = RECHARGE;
    var pow = this.power;
    var num = pow + 2;

    var widthDeg = 20 * num - 30;
    if (widthDeg > 180) widthDeg = 180;
    var startDeg = (180 - widthDeg) / 2;
    var endDeg = 180 - startDeg;

    var startRad = Math.PI * startDeg / 180;
    var endRad = Math.PI * endDeg / 180;
    var inc = (endRad - startRad) / (num - 1);

    CopterSpread[] shots = new CopterSpread[num];
    for (int s=0; s<num; s++) {
      shots[s] = new CopterSpread(thing, startRad + inc * s);
      shots[s].power = POWER;
    }
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return shots;
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = false;
  }

}
