class SplitterMovement extends MovementStyle {

  xdir, ydir;

  SplitterMovement(t, x, y, xdir, ydir) {
    super(t);
    thing.setPos(x, y);
    this.xdir = xdir;
    this.ydir = ydir;
  }

  /** Moves the given thing according to the splitter movement style. */
  move() {
    thing.setPos(thing.xpos + xdir, thing.ypos + ydir);
  }

}

class CopterSplitter extends Thing {
  MAX_SIZE = 12;

  static Sprite[] images;

  static {
    images = new Sprite[MAX_SIZE];
    for (var i=0; i<MAX_SIZE; i++) {
      var size = i + 4;
      var img = makeImage(size, size);
      var ctx = context2d(img);
      ctx.fillStyle = "yellow";
      ctx.fillRoundRect(0, 0, size, size, size / 2, size / 2);
      images[i] = new Sprite(img);
      images[i].addBox(new BoxInsets());
    }
  }

  CopterSplitter(game, x, y,
    xdir, ydir, count, size)
  {
    super(game);
    type = GOOD_BULLET;
    if (size < 0) size = 0;
    else if (size >= MAX_SIZE) size = MAX_SIZE - 1;
    setSprite(images[size]);
    if (count == 1) y -= height;
    move = new SplitterMovement(this, x - width / 2f, y, xdir, ydir);
    attack = new SplitterAttack(this, xdir, ydir, count);
  }

  /** Assigns object's power. */
  set power(power) {
    super.power = power;
    this.attack.power = power;
  }
}

/** Defines splitter attack. */
class SplitterAttack extends Weapon {

  RECHARGE = 10;
  MAX_SPLIT = 6;
  SPEED = 5;
  MULTIPLIER = 4;

  space, trigger;
  var fired;
  xdir, ydir;
  var count;

  SplitterAttack(t) { this(t, 0, 0, 0); }

  SplitterAttack(t, xdir, ydir, count) {
    super(t, "yellow", t.game.loadSprite("icon-split").image);
    if (xdir == 0 && ydir == 0) {
      this.xdir = SPEED;
      this.ydir = 0;
    }
    else {
      this.xdir = xdir;
      this.ydir = ydir;
    }
    this.count = count;
  }

  clear() { space = trigger = false; }

  /** Fires a splitter shot. */
  shoot() {
    if (fired > 0) {
      fired--;
      return [];
    }
    if (!space) return [];
    if (count != 0) return [];
    fired = RECHARGE;

    CopterSplitter splitter = new CopterSplitter(thing.game,
      thing.cx, thing.ypos, 0, -SPEED, 1, power + 1);
    splitter.power = MULTIPLIER * (power + 2);
    return [splitter];
  }

  /** Splits existing splitter shots. */
  Thing[] trigger() {
    if (!trigger) return [];
    if (count == 0 || power <= 2 * MULTIPLIER) return [];
    thing.hp = 0;

    VeggieCopter game = thing.game;
    var x = thing.cx, y = thing.cy;
    var xd = ydir, yd = xdir;
    var size = power / MULTIPLIER - 3;

    CopterSplitter[] cs = {
      new CopterSplitter(game, x, y, xd, yd, count + 1, size),
      new CopterSplitter(game, x, y, -xd, -yd, count + 1, size),
      // MWAHAHA!
      //new CopterSplitter(game, x, y, yd, xd, count + 1, size),
      //new CopterSplitter(game, x, y, -yd, -xd, count + 1, size),
      //new CopterSplitter(game, x, y, SPEED, SPEED, count + 1, size),
      //new CopterSplitter(game, x, y, -SPEED, -SPEED, count + 1, size),
      //new CopterSplitter(game, x, y, -SPEED, SPEED, count + 1, size),
      //new CopterSplitter(game, x, y, SPEED, -SPEED, count + 1, size)
    };
    for (var i=0; i<cs.length; i++) cs[i].power = power - 2 * MULTIPLIER;
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return cs;
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = true;
    else if (Keys.TRIGGER.includes(e.keyCode)) trigger = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) space = false;
    else if (Keys.TRIGGER.includes(e.keyCode)) trigger = false;
  }

}
