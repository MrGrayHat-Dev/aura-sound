# aura-sound
A Chrome extension that applies a crystal clear spatial audio effect to all HTML5 video and audio elements on a webpage, enhancing your listening experience with immersive 3D sound.

# Spatial Audio Effect - Chrome Extension

[![Generic badge](https://img.shields.io/badge/Made%20with-JavaScript-blue.svg)](https://shields.io/) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This Chrome extension enhances your web Browse experience by applying a dynamic, crystal clear spatial audio effect to all `<audio>` and `<video>` elements on any webpage. Using the Web Audio API, it creates an immersive 3D soundscape, making it feel like the audio is coming from a fixed point in space around you.

## Features

- **Immersive 3D Sound**: Utilizes the `PannerNode` with an `HRTF` panning model to position audio in a 3D space.
- **Dynamic Audio Processing**: Enhances audio clarity and consistency with a `DynamicsCompressor` and a `BiquadFilter` (high-shelf).
- **Volume Boost**: Amplifies the audio signal using a `GainNode` for a louder and richer sound.
- **Universal Compatibility**: Works on any website by targeting all HTML5 `<audio>` and `<video>` elements.
- **Dynamic Content Support**: Automatically applies the effect to media elements loaded dynamically (e.g., infinite scroll on YouTube or new videos in a playlist) using a `MutationObserver`.
- **Lightweight and Efficient**: Runs as a content script, directly processing audio in your browser.

## How It Works

The extension injects a content script, `content.js`, into every webpage you visit. This script leverages the **Web Audio API** to construct a sophisticated audio processing graph for each media element found.

The audio processing pipeline is as follows:
`MediaElement` -> `SourceNode` -> `PannerNode` -> `DynamicsCompressorNode` -> `BiquadFilterNode` -> `GainNode` -> `Destination (Speakers)`

1.  **AudioContext**: A single `AudioContext` is created for the page to manage all audio operations.
2.  **Media Element Source**: The original audio from a `<video>` or `<audio>` tag is used as the source.
3.  **PannerNode**: This node is the core of the spatial effect. It is configured to simulate a sound source positioned at a fixed point in 3D space (`x=0, y=5, z=2`).
    * `panningModel`: 'HRTF' (Head-Related Transfer Function) for a realistic 3D sound experience.
    * `distanceModel`: 'exponential' for a natural falloff in sound as the listener moves.
4.  **DynamicsCompressorNode**: This node evens out the audio's dynamic range, making quiet parts louder and loud parts softer. This results in a more consistent and "punchy" sound.
5.  **BiquadFilterNode**: A `highshelf` filter is applied to boost higher frequencies (above 2000 Hz), which can add clarity and brightness to the audio.
6.  **GainNode**: An overall volume boost is applied to the final signal before it reaches your speakers.
7.  **MutationObserver**: The script actively watches for new media elements being added to the page and automatically applies the same audio graph, ensuring a consistent experience on modern, dynamic websites.

## Installation

To install this extension locally, follow these steps:

1.  **Download the Repository**: Clone or download this repository as a ZIP file and unzip it.
2.  **Open Chrome Extensions**: Open Google Chrome and navigate to `chrome://extensions`.
3.  **Enable Developer Mode**: Turn on the "Developer mode" toggle in the top-right corner.
4.  **Load Unpacked**: Click the "Load unpacked" button and select the directory where you unzipped the repository files.
5.  **Done!**: The extension is now installed. Visit any webpage with video or audio (like YouTube) to experience the effect!

## Files

-   **`manifest.json`**: The manifest file that defines the extension's properties, permissions, and scripts.
-   **`content.js`**: The core JavaScript file that contains all the logic for applying the spatial audio effect.
-   **`icon16.png`, `icon48.png`, `icon128.png`**: Icons for the extension.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
