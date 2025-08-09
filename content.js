// Create a single AudioContext for the entire page.
// This is the central object for all audio processing.
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// applySpatializer(mediaElement)
// This function sets up the spatial audio effect for a given media element.
// It creates an audio graph: mediaElement -> sourceNode -> pannerNode -> compressorNode -> filterNode -> gainNode -> destination.

function applySpatializer(mediaElement) {
  // Prevent applying the effect multiple times to the same element.
  if (mediaElement.spatialized) {
    console.log("Spatializer already applied to this element.");
    return;
  }

  try {
    // Create an AudioNode from the media element (e.g., <audio> or <video> tag).
    // This node acts as the source of the audio stream.
    const source = audioContext.createMediaElementSource(mediaElement);

    // Create a PannerNode for spatial audio effects.
    // This node positions the sound in a 3D space relative to the listener.
    const panner = audioContext.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'exponential';
    panner.refDistance = 0.5;
    panner.maxDistance = 50;
    panner.rolloffFactor = 2;

    // --- STATIC 3D POSITIONING ---
    // Set a fixed position for the sound source.
    panner.positionX.setValueAtTime(0, audioContext.currentTime);
    panner.positionY.setValueAtTime(5, audioContext.currentTime);
    panner.positionZ.setValueAtTime(2, audioContext.currentTime);

    // Create a DynamicsCompressorNode to control the dynamic range.
    // This makes the sound more consistent by reducing the difference between loud and quiet parts.
    const compressor = audioContext.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-50,audioContext.currentTime); // dB value above which the compression will start
    compressor.knee.setValueAtTime(20, audioContext.currentTime);      // dB value representing the range above the threshold where the curve smoothly transitions
    compressor.ratio.setValueAtTime(15, audioContext.currentTime);     // Amount of gain reduction applied to the signal above the threshold
    compressor.attack.setValueAtTime(0.003, audioContext.currentTime); // Time in seconds for the gain reduction to kick in
    compressor.release.setValueAtTime(0.25, audioContext.currentTime); // Time in seconds for the gain reduction to be released

    // Create a BiquadFilterNode for equalization (e.g., boosting high frequencies for clarity).
    const filter = audioContext.createBiquadFilter();
    filter.type = 'highshelf'; // 'highshelf' boosts frequencies above a certain point
    filter.frequency.setValueAtTime(2000, audioContext.currentTime); // Frequencies above 3000 Hz will be affected
    filter.gain.setValueAtTime(10, audioContext.currentTime); // Boost by 10 dB (positive value for boost, negative for cut)

    // Create a GainNode to control the overall volume.
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 4; // Adjust this value for overall volume (e.g., 2, 3, 4)

    // Connect the audio nodes to form the processing graph.
    // source -> panner -> compressor -> filter -> gainNode -> destination
    source.connect(panner);
    panner.connect(compressor); // Panner output goes to compressor
    compressor.connect(filter); // Compressor output goes to filter
    filter.connect(gainNode);   // Filter output goes to gainNode
    gainNode.connect(audioContext.destination); // GainNode output goes to speakers

    // Mark the element as spatialized to avoid re-applying the effect.
    mediaElement.spatialized = true;

    console.log("Crystal clear spatial audio effect applied to a media element.");

  } catch (error) {
    console.error("Failed to apply spatial audio effect:", error);
  }
}


// DOM Observation and Initial Application
// These sections ensure the spatializer is applied to all media elements,
// whether they are present on page load or added dynamically later.
// Create a MutationObserver to watch for new media elements being added to the document.
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      // Check if the added node is an <audio> or <video> element itself.
      if (node.tagName === 'AUDIO' || node.tagName === 'VIDEO') {
        applySpatializer(node);
      } else if (node.querySelectorAll) {
        // If the added node is a container, check for media elements within it.
        node.querySelectorAll('audio, video').forEach(mediaElement => {
          applySpatializer(mediaElement);
        });
      }
    });
  });
});

// Start observing the entire document body for changes in its child list and subtree.
// This ensures detection of dynamically loaded media players (e.g., infinite scroll on YouTube).
observer.observe(document.body, { childList: true, subtree: true });

// Apply the spatializer to any media elements that are already present on the page
// when the content script first loads.
document.querySelectorAll('audio, video').forEach(mediaElement => {
  applySpatializer(mediaElement);
});

