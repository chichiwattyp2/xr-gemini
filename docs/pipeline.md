# Processing Pipeline & Manifest Contract

This document details the stages of the VoluSphere processing pipeline and the data contract for the experience manifest file.

## 1. Processing Pipeline Stages

The pipeline is an automated, multi-stage process that transforms raw capture data into a playable XR experience.

1.  **Ingest**: The uploaded file (zipped image sequence or multi-cam video) is validated, unpacked, and prepared for processing.
2.  **Reconstruct (Gaussian Splats)**: Using structure-from-motion (SfM) techniques, the pipeline reconstructs the 3D scene and represents it as a high-fidelity Gaussian Splat asset.
3.  **Temporal Stabilization**: Algorithms are applied to smooth out frame-to-frame inconsistencies, reducing jitter and improving the overall viewing experience.
4.  **Interpolation**: (Optional) New frames are generated between the captured frames to enable high-framerate playback (120/240 FPS).
5.  **LOD Baking**: Multiple Levels of Detail (LODs) are generated from the source asset to ensure smooth performance across a range of devices.
6.  **Packaging**: All assets (splats, textures, metadata) are optimized and packaged into a standardized format for efficient delivery.
7.  **CDN Publish**: The final packaged assets are uploaded to the Content Delivery Network (CDN), and the experience manifest is updated.

## 2. Experience Manifest Contract

Each published experience has a JSON manifest file that the native XR viewer uses to load the content. The schema is as follows:

```json
{
  "id": "exp_123",
  "title": "Studio Dance",
  "devices": ["android_xr", "quest", "pcvr"],
  "mrReady": true,
  "defaultQuality": "High",
  "defaultInterpolation": "120fps",
  "minPlayArea": "2m x 2m",
  "assets": {
    "splat": "https://cdn.example.com/exp_123/v2/splat.bin",
    "index": "https://cdn.example.com/exp_123/v2/splat.index",
    "lodTable": "https://cdn.example.com/exp_123/v2/lod.json",
    "poster": "https://cdn.example.com/exp_123/v2/poster.jpg",
    "trailer": "https://cdn.example.com/exp_123/v2/trailer.mp4"
  },
  "private": false,
  "signature": "optional-signed-url-or-hash"
}
```

### Field Descriptions

-   `id` (string): Unique identifier for the experience.
-   `title` (string): The display title of the experience.
-   `devices` (string[]): A list of supported device families (e.g., `android_xr`, `quest`, `pcvr`).
-   `mrReady` (boolean): `true` if the experience supports Mixed Reality passthrough.
-   `defaultQuality` (string): The recommended quality setting (`Base`, `High`, `Ultra`).
-   `defaultInterpolation` (string): The recommended interpolation setting (`Off`, `120fps`, `240fps`).
-   `minPlayArea` (string): The minimum recommended physical space (e.g., `"2m x 2m"`, `"Standing"`).
-   `assets` (object): A map of asset URLs.
    -   `splat`: URL to the primary Gaussian Splat data file.
    -   `index`: URL to the index or metadata file for the splat data.
    -   `lodTable`: URL to a JSON file defining the different levels of detail.
    -   `poster`: URL to the poster image for display in menus.
    -   `trailer`: URL to the MP4 video trailer.
-   `private` (boolean): `true` if the content is private and requires signed URLs.
-   `signature` (string, optional): A signature or hash to verify content integrity, or used for signed URL authentication.
