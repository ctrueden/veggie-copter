//
// TestStage.java
//

public class TestStage extends Stage {

  // -- Constructor --

  /** Constructs a stage for debugging. */
  public TestStage(VeggieCopter game, String name,
    String prefix, String[] description)
  {
    super(game, name, prefix, description);
  }


  // -- Stage API methods --

  /** Test stage never gets flagged as completed. */
  public void setCompleted(boolean completed) { }

}
