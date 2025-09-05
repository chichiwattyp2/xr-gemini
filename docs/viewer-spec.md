# Native XR Viewer Specifications

This document outlines the technical specifications, controls, and expected behavior of the VoluSphere native Android XR viewer application.

## 1. Interactions & Locomotion

-   **Teleport**: The primary mode of movement. The user aims a teleport arc using the controller thumbstick and releases to move to the new location.
-   **Snap-Turn**: Flicking the thumbstick left or right rotates the user's view by a fixed angle (e.g., 45 degrees) for comfortable reorientation.
-   **Re-center**: A long-press on the menu or system button will re-center the view and play space to the user's current head position and orientation.

## 2. HUD (Heads-Up Display) Controls

A non-intrusive, wrist-mounted or floating HUD provides access to the following controls:

-   **LOD Stepper**: Manually cycles through available Levels of Detail (LOD0: Ultra, LOD1: High, LOD2: Medium, LOD3: Base) to allow users to balance visual quality and performance.
-   **Performance Mode**: Presets (Base, High, Ultra) that adjust rendering resolution, post-processing effects, and other quality settings.
-   **MR Toggle**: Instantly switches between the fully immersive virtual environment and a Mixed Reality view using the device's passthrough cameras.
-   **Photo Mode**: Captures a high-resolution screenshot of the current view and saves it to the device's gallery.

## 3. Performance Targets

The viewer is optimized to meet the following performance targets on supported hardware.

-   **Target Framerate**: A consistent 72Hz or 90Hz native framerate to ensure a comfortable, low-latency experience.
-   **Interpolation Modes**: The player can enable motion smoothing/interpolation to achieve an effective output of 120Hz or 240Hz, enhancing visual fluidity.
-   **Foveated Rendering**: The viewer supports eye-tracked foveated rendering on compatible hardware to maximize performance by rendering the user's peripheral vision at a lower resolution.

## 4. Analytics Events

To help creators understand user engagement, the viewer sends the following anonymous analytics events:

-   `enter_experience`: Fired when a user loads into an experience.
-   `time_in_scene`: Fired periodically with the duration the user has spent in the scene.
-   `quality_change`: Fired when the user changes the LOD or performance mode.
-   `perf_mode_change`: Fired when the performance preset is changed.
-   `mr_toggle`: Fired when the user toggles Mixed Reality passthrough.
-   `quit_reason`: Fired when the user exits, with a reason (e.g., 'user_initiated', 'error').
