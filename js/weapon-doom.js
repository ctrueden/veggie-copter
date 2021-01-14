class DoomMovement extends MovementStyle {
  private static final int DOOM_RATE = 4;

  private Thing owner;
  private int ticks;

  public DoomMovement(Thing t, Thing owner) {
    super(t);
    this.owner = owner;
  }

  public void move() {
    // hurt owner
    if (ticks % DOOM_RATE == 0) {
      int hp = owner.getHP() - 1;
      if (hp > 0) owner.setHP(hp);
      else thing.setHP(0);
    }
    ticks++;
  }
}

class DoomField extends Thing {
  private static final int FLUX_BOTTOM = 72;
  private static final int FLUX_RATE = 3;
  private static final int FLUX_COUNT = 6;

  private int flux = FLUX_BOTTOM;
  private boolean fluxDir = true;

  constructor(Thing thing) {
    super(thing.getGame());
    type = GOOD_SHOT;
    move = new DoomMovement(this, thing);
    maxhp = hp = Integer.MAX_VALUE;
  }

  /** Draws the object onscreen. */
  public void draw(Graphics g) {
    int w = game.getWidth();
    int h = game.getHeight();
    g.setColor(new Color(96, 96, 96, flux));
    g.fillRect(0, 0, w, h);
    if (fluxDir) flux += power * FLUX_RATE;
    else flux -= power * FLUX_RATE;
    int max = FLUX_BOTTOM + power * FLUX_RATE * FLUX_COUNT;
    if (max > 255) max = 255;
    if (flux >= max) {
      flux = max;
      fluxDir = false;
    }
    else if (flux <= FLUX_BOTTOM) {
      flux = FLUX_BOTTOM;
      fluxDir = true;
    }
  }

  /** Gets object's bounding boxes. */
  public Rectangle[] getBoxes() {
    return new Rectangle[] {
      new Rectangle(0, 0, game.getWidth(), game.getHeight())
    };
  }
}

/** Defines veggie copter doom attack style. */
class DoomWeapon extends Weapon {

  boolean space;
  DoomField doom;

  DoomAttack(t) {
    super(t, "Black", t.game.loadSprite("icon-doom").image);
  }

  clear() {
    space = false;
    if (doom) doom.hp = 0;
    doom = null;
  }

  /** Fires a shot if space bar is pressed. */
  shoot() {
    if (!this.space || this.doom || this.thing.hp == 1) return [];
    var doom = new DoomField(thing);
    doom.power = power;
    //SoundPlayer.playSound(getClass().getResource("laser4.wav"));
    return [doom];
  }

  keyPressed(e) {
    if (Keys.SHOOT.includes(e.keyCode)) this.space = true;
  }

  keyReleased(e) {
    if (Keys.SHOOT.includes(e.keyCode)) clear();
  }

}
