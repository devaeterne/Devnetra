# ADR-033 — Mimo original 3D mascot
Status: Accepted  
Date: 2026-11-06

We chose an original 3D mascot, not a stock robot. Mimo is generated from primitive meshes committed as source, and the generated glTF binary is included for offline/local delivery. CC0-1.0 licensing is designated for the original art. UI access is via `DvCharacter3D` / asset registry, with fallback and reduced-motion support.

We evaluated third-party CC0 options from Kenney but did not bundle them because brand distinctiveness matters. Google model-viewer (Apache-2.0) is used for interactive GLB viewing on web, not as a source of artwork. Native 3D renderer and visual screenshot acceptance are separate future steps.
