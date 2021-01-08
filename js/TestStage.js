class TestStage extends Stage {

  /** Constructs a stage for debugging. */
  TestStage(VeggieCopter game, String name,
    String prefix, String[] description)
  {
    super(game, name, prefix, description);
  }

  /** Test stage never gets flagged as completed. */
  setCompleted(boolean completed) { }

}
