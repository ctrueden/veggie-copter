package net.restlesscoder.heli;

import java.awt.event.KeyEvent;

public abstract class Keys {

  public static final int SHOOT = KeyEvent.VK_SPACE;
  public static final int TRIGGER = KeyEvent.VK_B;
  public static final int MOVE_LEFT = KeyEvent.VK_LEFT;
  public static final int MOVE_RIGHT = KeyEvent.VK_RIGHT;
  public static final int FAST_FORWARD = KeyEvent.VK_BACK_QUOTE;
  public static final int TOGGLE_DEBUG = KeyEvent.VK_SLASH;
  public static final int PAUSE = KeyEvent.VK_P;
  public static final int POWER_UP = KeyEvent.VK_Q;
  public static final int POWER_DOWN = KeyEvent.VK_A;
  public static final int ATTACK_STYLE_CYCLE = KeyEvent.VK_Z;
  public static final int[] ATTACK_STYLES = {
    KeyEvent.VK_1, KeyEvent.VK_2, KeyEvent.VK_3, KeyEvent.VK_4,
    KeyEvent.VK_5, KeyEvent.VK_6, KeyEvent.VK_7, KeyEvent.VK_8,
    KeyEvent.VK_9, KeyEvent.VK_0, KeyEvent.VK_MINUS, KeyEvent.VK_EQUALS,
    KeyEvent.VK_BACK_SPACE
  };
  public static final int ALL_ATTACK_STYLES = KeyEvent.VK_END;

}
