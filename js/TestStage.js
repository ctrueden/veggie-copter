class TestStage extends Stage {

  /** Constructs a stage for debugging. */
  TestStage(game, name,
    prefix, String[] description)
  {
    super(game, name, prefix, description);
  }

  /** Test stage never gets flagged as completed. */
  setCompleted(completed) { }

}
