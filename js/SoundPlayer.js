class SoundPlayer {

  private static boolean mute = true;
  static toggleMute() { mute = !mute; }

  static boolean playSound(wave) {
    if (mute) return false;
    AudioInputStream audioInputStream = null;
    try { audioInputStream = AudioSystem.getAudioInputStream(wave); }
    catch (exc) { return false; }

    AudioFormat format = audioInputStream.getFormat();
    DataLine.Info info = new DataLine.Info(Clip.class, format);
    try {
      final Clip mClip = (Clip) AudioSystem.getLine(info);
      mClip.addLineListener(new LineListener() {
        update(event) {
          if (event.getType().equals(LineEvent.Type.STOP)) mClip.close();
        }
      });
      mClip.open(audioInputStream);
      mClip.loop(1);
    }
    catch (exc) { return false; }
    catch (e) { return false; }
    return true;
  }

  static boolean playMidi(midi, loop) {
    if (mute) return false;
    Sequence sequence = null;
    try { sequence = MidiSystem.getSequence(midi); }
    catch (exc) { return false; }
    catch (exc) { return false; }

    Sequencer smSequencer = null;
    try { smSequencer = MidiSystem.getSequencer(); }
    catch (exc) { return false; }

    try { smSequencer.open(); }
    catch (exc) { return false; }

    try { smSequencer.setSequence(sequence); }
    catch (exc) { return false; }

    Synthesizer smSynthesizer = null;
    if (!(smSequencer instanceof Synthesizer)) {
      try {
        smSynthesizer = MidiSystem.getSynthesizer();
        smSynthesizer.open();
        Receiver synthReceiver = smSynthesizer.getReceiver();
        Transmitter seqTransmitter = smSequencer.getTransmitter();
        seqTransmitter.setReceiver(synthReceiver);
      }
      catch (exc) { return false; }
    }

    final URL fMidi = midi;
    final boolean fLoop = loop;
    final Sequencer fSequencer = smSequencer;
    final Synthesizer fSynthesizer = smSynthesizer;
    smSequencer.addMetaEventListener(new MetaEventListener() {
      meta(event) {
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
