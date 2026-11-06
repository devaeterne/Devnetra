# UI-CHAR-001 — Character System
Kids primary mascot: cute friendly 3D robot. Single character ID kids.robot; support future multiple characters. Use DvCharacter wrapper and character registry, with explicit idle/celebrate animations. Default fallback is an accessible lightweight illustration. Full GLB asset must be independently acquired or authored and license-checked before claiming the 3D model is delivered. Real 3D playback is opt-in, lazy and reduced-motion aware; mobile always has a static fallback. No unlicensed imagery or runtime fetching arbitrary asset URLs.

## DN-003 Motion and lighting contract
- Action types, priority, automatic idle fallback and game-event mappings originate in packages/characters/src/animation.ts, not app pages.
- Real 3D runtime uses @react-three/fiber + Three.js. Group named GLB meshes under reusable pivot controllers; no duplicated animation computation in feature pages.
- Lighting uses semantic preset packages/design-tokens:mimoLighting. Use approved intensity/brightness bounds; never hardcode ad hoc light setups in individual game pages.
- On-device reduced-motion and failed WebGL must always support the existing 2D fallback.
- Internal developer Playground is not a public Kids feature. Exclude it from production distribution until development route access is gated.
- Screenshots, browser input/accessibility, and native-device performance require separate real-device acceptance tests; don't claim they passed from static local CI.
