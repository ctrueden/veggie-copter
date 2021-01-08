public class SoundPlayer {

  private static boolean mute = true;
  public static void toggleMute() { mute = !mute; }

  public static boolean playSound(URL wave) {
    if (mute) return false;
    AudioInputStream audioInputStream = null;
    try { audioInputStream = AudioSystem.getAudioInputStream(wave); }
    catch (Exception exc) { return false; }

    AudioFormat format = audioInputStream.getFormat();
    DataLine.Info info = new DataLine.Info(Clip.class, format);
    try {
      final Clip mClip = (Clip) AudioSystem.getLine(info);
      mClip.addLineListener(new LineListener() {
        public void update(LineEvent event) {
          if (event.getType().equals(LineEvent.Type.STOP)) mClip.close();
        }
      });
      mClip.open(audioInputStream);
      mClip.loop(1);
    }
    catch (LineUnavailableException exc) { return false; }
    catch (IOException e) { return false; }
    return true;
  }

  public static boolean playMidi(URL midi, boolean loop) {
    if (mute) return false;
    Sequence sequence = null;
    try { sequence = MidiSystem.getSequence(midi); }
    catch (InvalidMidiDataException exc) { return false; }
    catch (IOException exc) { return false; }

    Sequencer smSequencer = null;
    try { smSequencer = MidiSystem.getSequencer(); }
    catch (MidiUnavailableException exc) { return false; }

    try { smSequencer.open(); }
    catch (MidiUnavailableException exc) { return false; }

    try { smSequencer.setSequence(sequence); }
    catch (InvalidMidiDataException exc) { return false; }

    Synthesizer smSynthesizer = null;
    if (!(smSequencer instanceof Synthesizer)) {
      try {
        smSynthesizer = MidiSystem.getSynthesizer();
        smSynthesizer.open();
        Receiver synthReceiver = smSynthesizer.getReceiver();
        Transmitter seqTransmitter = smSequencer.getTransmitter();
        seqTransmitter.setReceiver(synthReceiver);
      }
      catch (MidiUnavailableException exc) { return false; }
    }

    final URL fMidi = midi;
    final boolean fLoop = loop;
    final Sequencer fSequencer = smSequencer;
    final Synthesizer fSynthesizer = smSynthesizer;
    smSequencer.addMetaEventListener(new MetaEventListener() {
      public void meta(MetaMessage event) {
        if (event.getType() == 47) { // end of track
          fSequencer.close();
          if (fSynthesizer != null) fSynthesizer.close();
          if (fLoop) playMidi(fMidi, fLoop);
        }
      }
    });

    smSequencer.start();
    return true;
  }

}
