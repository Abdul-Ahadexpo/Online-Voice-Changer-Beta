let mic, pitchShift, reverb, delay, gainNode;

const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const pitchControl = document.getElementById("pitch");
const reverbControl = document.getElementById("reverb");
const delayControl = document.getElementById("delay");

startButton.addEventListener("click", start);
stopButton.addEventListener("click", stop);

async function start() {
  await Tone.start();

  // Create audio nodes
  mic = new Tone.UserMedia();
  pitchShift = new Tone.PitchShift();
  reverb = new Tone.Reverb({ wet: 0.1 }).toDestination(); // Set initial reverb wet value to 0.1
  delay = new Tone.FeedbackDelay({ wet: 0.1 }).toDestination(); // Set initial delay wet value to 0.1
  gainNode = new Tone.Gain(3.3); // Set initial gain to 1.0 to ensure higher volume

  // Connect audio nodes in a clean path
  mic.connect(pitchShift);
  pitchShift.connect(gainNode);
  gainNode.connect(reverb);
  gainNode.connect(delay);

  // Event listeners for controls
  pitchControl.addEventListener("input", (event) => {
    pitchShift.pitch = event.target.value;
  });

  reverbControl.addEventListener("input", (event) => {
    reverb.wet.value = event.target.value;
  });

  delayControl.addEventListener("input", (event) => {
    delay.wet.value = event.target.value;
  });

  // Open the microphone stream and ensure minimal latency
  await mic.open();
  mic.connect(pitchShift);
}

function stop() {
  if (mic) {
    mic.close();
  }
  // Disconnect nodes to stop audio processing
  mic.disconnect();
  pitchShift.disconnect();
  reverb.disconnect();
  delay.disconnect();
  gainNode.disconnect();
}
