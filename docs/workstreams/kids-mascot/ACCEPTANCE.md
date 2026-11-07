# Mascot v1 — Acceptance & Local QA Gates

All boxes below are **unverified** until dated evidence, committed SHA and required human signoff are recorded in TASKS.

## G0 — Provenance & actual model
- [ ] Real user-supplied AI Robot GLB hash, size, hierarchy, texture and animation inventory checked reproducibly.
- [ ] Clear evidence of rights for hosting, modification, public redistribution and open GitHub distribution, plus exact attribution instructions. Sketchfab Standard is not CC0.
- [ ] Asset metadata keyed to real GLB and license; no unapproved binary uploaded publicly.
- [ ] Manifest/provenance validation tests pass.

## G1 — Visual and color foundation
- [ ] Actual AI Robot is rendered through lazy Three.js WebGL pipeline, framed in responsive Kids UI.
- [ ] Five palette screenshots prove **shell only**, accents, eyes and original textures retain distinct intended colors.
- [ ] Bright but readable key/ambient/rim/glow lighting at normal and low-contrast modes.
- [ ] Fallback after invalid URL/GLB, WebGL/context loss and reduced-motion handling.

## G2 — Motion and emotions
- [ ] Real Head, LeftArm, RightArm and both Wheels move independently using named nodes and sensible joint pivots.
- [ ] Idle, Wave, Happy, Celebrate are visually distinct, have deterministic restart and return to idle.
- [ ] Thinking, Excited, Surprised, Sleepy, Cool, Oops, Roll and Blink have verified real-model behaviors or explicit safe fallback.
- [ ] Priority, concurrency/cooldown, absence of accumulated transform drift, speed limits and reduced-motion validated.
- [ ] Real-model browser captures and manual acceptance; a Mimo fixture alone does not meet this gate.

## G3 — Speech bubbles and gameplay
- [ ] EN/TR “Aferin!”, “Harika!”, “Süper!”, “Bir daha deneyelim!”, “Beraber düşünelim.” and age-appropriate EN counterparts.
- [ ] Bubble lifetime, queueing/replace behavior, viewport fit and keyboard/screen reader announcements.
- [ ] Game events trigger typed animation + speech feedback without repeated scoring or uncontrolled spam.
- [ ] No child chat, freeform PII, external tracking. Guest Kids works without mandatory account.
- [ ] Parent-approved palette/expression settings persist and can reset locally.

## G4 — Certification and release
- [ ] Local \`pnpm ci:local\` PASS executed on committed SHA; no GitHub Actions.
- [ ] Real AI Robot Chrome/other target browser and responsive viewport screenshots PASS; WebGL failure tests PASS.
- [ ] Human child-friendly look/tone signoff, accessibility/contrast, mobile performance and asset loading budget documented.
- [ ] Source license/grant, attribution and CDN/Vercel distribution clearance signed off.
- [ ] Kids homepage switches after gates; original Mimo remains viable fallback.
- [ ] Native/mobile Expo support explicitly certified or clearly deferred, not implied.

## Evidence

| Gate | Status | SHA | Evidence |
|---|---|---|---|
| G0 | OPEN / permission subtask BLOCKED | — | Real files supplied, public redistribution grant scope not archived |
| G1 | PARTIAL | — | Real GLB five palettes, non-deforming UV face expressions and Eyes/antenna light mapping; visual/accessibility signoff pending |
| G2 | PARTIAL | — | Actual model wave/happy/celebrate and in-place wheel roll demonstrated; long-duration stability, reduced-motion browser and state-machine/cooldown acceptance pending |
| G3 | PARTIAL | — | Real GLB Chrome Studio preview PASS for EN/TR event/bubble expiry, actual game scoring and child-facing QA pending |
| G4 | OPEN | — | Planned |

Current scripts: \`pnpm ci:local\`, \`pnpm test:mascot\`, \`pnpm test:visual\`, \`pnpm test:ai-robot-editor\`. Future real-model tests must not assume proprietary GLB can be checked into a public repo.
