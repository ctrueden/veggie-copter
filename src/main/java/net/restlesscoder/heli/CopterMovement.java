package net.restlesscoder.heli;

import java.awt.event.KeyEvent;

/** Defines veggie copter movement. */
public class CopterMovement extends MovementStyle {

  // -- Constants --

  protected static final int SPEED = 2;


  // -- Fields --

  protected boolean left = false;
  protected boolean right = false;
  protected boolean up = false;
  protected boolean down = false;


  // -- Constructor --

  public CopterMovement(Thing t) {
    super(t);
    reset();
  }


  // -- CopterMovement API methods --

  public void reset() {
    left = right = up = down = false;
    VeggieCopter game = thing.getGame();
    thing.setPos(game.getWindowWidth() / 2, game.getWindowHeight() - 40);
  }


  // -- MovementStyle API methods --

  /** Moves according to the keyboard presses. */
  public void move() {
    float xpos = thing.getX(), ypos = thing.getY();
    int xdir = 0, ydir = 0;
    if (left) xdir -= SPEED; if (right) xdir += SPEED;
    if (up) ydir -= SPEED; if (down) ydir += SPEED;
    xpos += xdir; ypos += ydir;

    VeggieCopter game = thing.getGame();
    int w = game.getWindowWidth(), h = game.getWindowHeight();
    int width = thing.getWidth(), height = thing.getHeight();
    if (xpos < 1) xpos = 1; if (xpos + width >= w) xpos = w - width - 1;
    if (ypos < 1) ypos = 1; if (ypos + height >= h) ypos = h - height - 1;
    thing.setPos(xpos, ypos);
  }


  // -- KeyListener API methods --

  public void keyPressed(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == KeyEvent.VK_LEFT ||
      code == KeyEvent.VK_KP_LEFT) left = true;
    else if (code == KeyEvent.VK_RIGHT ||
      code == KeyEvent.VK_KP_RIGHT) right = true;
    else if (code == KeyEvent.VK_UP ||
      code == KeyEvent.VK_KP_UP) up = true;
    else if (code == KeyEvent.VK_DOWN ||
      code == KeyEvent.VK_KP_DOWN) down = true;
  }

  public void keyReleased(KeyEvent e) {
    int code = e.getKeyCode();
    if (code == KeyEvent.VK_LEFT ||
      code == KeyEvent.VK_KP_LEFT) left = false;
    else if (code == KeyEvent.VK_RIGHT ||
      code == KeyEvent.VK_KP_RIGHT) right = false;
    else if (code == KeyEvent.VK_UP ||
      code == KeyEvent.VK_KP_UP) up = false;
    else if (code == KeyEvent.VK_DOWN ||
      code == KeyEvent.VK_KP_DOWN) down = false;
  }

}
