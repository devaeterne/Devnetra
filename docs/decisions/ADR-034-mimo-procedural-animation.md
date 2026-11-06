# ADR-034 — Mimo Motion Controller and Illuminated Character Playground

Status: Accepted
Date: 2026-11-06

## Purpose

Mimo must respond to game events using a reusable, deterministic character animation state machine without requiring third-party pre-baked animation clips. Users can preview all actions and light settings in a local developer-only Playground.

## Design

- Nine motions: idle, wave, think, happy, celebrate, walk, blink, oops, sleep.
- Contract and priority state machine: \`packages/characters/src/animation.ts\`.
- Game event adapter maps game.start→wave, answer.correct→happy, answer.wrong→oops, challenge.complete→celebrate, hint.request→think, break.start→sleep.
- A higher-priority motion cannot be interrupted by lower priority events until its duration expires. Explicit Playground button presses override priority.
- Mimo's GLB has 51 named mesh objects, not a skin skeleton. React Three Fiber reparents scene nodes under logical pivots (head, eyes, torso, arms, legs) to create procedural movement without altering the shipped GLB's asset identity.
- Lighting: centralized \`mimoLighting\` semantic preset with ambient, hemisphere, directional key, lavender rim and cyan fill. Playground scales brightness with a local 0.6–1.8 control.
- The public Kids homepage defaults to Idle; kids cannot navigate to the developer control panel from the homepage.
- \`prefers-reduced-motion\` neutralizes procedural movement; failed WebGL rendering falls back to an accessible 2D illustration.
- Animation preview route: \`/dev/characters\` (internal development UX; do not expose publicly without authorization or remove from production builds).

## Limits and follow-up

Procedural rigging is not an industry-standard skeletal GLTF rig and does not yet embed Blender clips. Visual regression/device coverage must still be verified in a real browser; static CI checks cannot substitute for this.

## Replaying the same action

The animation controller increments a \`serial\` field. Renderer effects depend on both \`action\` and \`serial\` so repeated manual previews restart timing even if the action name is unchanged.

## Local visual verification

Start \`pnpm dev:kids\` in one terminal, then run \`pnpm test:visual\` in another. Chrome is required for this local Playwright smoke test. The test validates actual GLB rendering (not merely an empty canvas), Wave, Celebrate event priority, lighting/speed sliders, and generates screenshots under ignored \`reports/visual/\`. The internal Playground responds 404 on production builds by design.
