# Mascot v1 — Canonical Task Tracker

**Prefix:** MSCT · **Branch:** \`main\` · **Last planning audit:** 2026-11-06  
**Baseline commit (before this planning work):** \`ac05e017d58d2c310860bd34bc0c5ac2c1f60210\`  
**Release:** NOT READY · **Status definitions:** [DOC-001](../../rules/documentation-structure.md)  
**Stages:** OPEN / IN_PROGRESS / BLOCKED / DONE / VERIFIED

| ID | Scope | Priority | Depends on | Status | Gate |
|---|---|---|---|---|---|
| MSCT-01 | Verify model rights, author and public redistribution permission | P0 | — | BLOCKED | G0 |
| MSCT-02 | Real AI Robot GLB audit: hierarchy, mesh/material mapping, textures, scale, hashes | P0 | — | OPEN | G0 |
| MSCT-03 | Versioned AI Robot adapter, typed part selectors and asset registry | P0 | MSCT-01,02 | OPEN | G0/G1 |
| MSCT-04 | Five true independent material palettes (Ocean/Violet/Candy/Lime/Sunshine) | P0 | MSCT-02,03 | OPEN | G1 |
| MSCT-05 | Glowing eye/antenna, expressive look and bounded studio lighting | P0 | MSCT-02,03 | OPEN | G1 |
| MSCT-06 | Real part pivots for Head/LeftArm/RightArm/LeftWheel/RightWheel | P0 | MSCT-02,03 | OPEN | G2 |
| MSCT-07 | Implement idle, wave, happy, celebrate with clear visible differences | P0 | MSCT-06 | OPEN | G2 |
| MSCT-08 | Think/oops/sleep/roll/blink and eight expression mapping | P1 | MSCT-05,07 | OPEN | G2 |
| MSCT-09 | Action priorities, deterministic replay, cooldown, interrupt/reduced-motion | P0 | MSCT-07 | OPEN | G2 |
| MSCT-10 | Reusable speech-bubble component, queue/replace, TTL and mobile placement | P1 | MSCT-03 | OPEN | G3 |
| MSCT-11 | Localized child-friendly EN/TR bubble copy: Aferin, Harika, Süper, Try again, Think together | P1 | MSCT-10 | OPEN | G3 |
| MSCT-12 | Typed game events connecting animations, bubble and idempotent feedback | P0 | MSCT-09,11 | OPEN | G3 |
| MSCT-13 | Parent-approved local preference persistence, age track UX and reset | P1 | MSCT-04,08 | OPEN | G3 |
| MSCT-14 | Accessible 2D fallback, context loss, network/mesh error and reduced motion | P0 | MSCT-03,09 | OPEN | G1/G4 |
| MSCT-15 | Actual-model browser, visual, keyboard, device, performance and regression suite | P0 | MSCT-04..14 | OPEN | G4 |
| MSCT-16 | Public delivery + credit/attribution + Vercel Blob/CDN URL (rights-gated) | P0 | MSCT-01,15 | BLOCKED | G4 |
| MSCT-17 | Make licensed AI Robot the primary Kids homepage mascot, retain Mimo fallback | P0 | MSCT-01,15,16 | OPEN | G4 |
| MSCT-18 | Native/mobile mascot support (separate acceptance plan) | P2 | MSCT-14 | OPEN | G4 |

## Detailed work packages

### MSCT-01 — Rights gate · BLOCKED
- [ ] Confirm who granted permission and which model/file version.
- [ ] Capture explicit permission for **derivatives, commercial public use, public hosting, direct GLB download and public GitHub redistribution**; retain any attribution, license and sublicense restrictions.
- [ ] Record provenance without exposing private correspondence.
- **Blocker:** User reports permission obtained, but written redistribution evidence/scope has not been archived in this repo or the supplied model bundle.
- **Related:** \`docs/assets/ai-robot-license-pending.md\`; \`packages/assets/candidates.json\`.

### MSCT-02 — Real model audit · OPEN
- [ ] Validate supplied \`ai_robot.glb\` against \`ai_robot.zip\`, and record content hash/size/texture references.
- [ ] Inspect named meshes/parts: Head, Eyes, EyeBorder, Ears, Antenna, Chest, Hips, Neck, MidSpine, Left/RightArm, Left/RightWheel.
- [ ] Map 18 materials into shell, trim, metal, eye-screen and emissive channels.
- [ ] Test hierarchy and pivot transforms in Three.js (not only parsed JSON); document rig absence and opportunities.
- [ ] Produce a reproducible audit script and human-readable output; keep unapproved asset binary private until MSCT-01.

### MSCT-03/04/05 — Foundation · OPEN
- [ ] Shared \`AiRobotRigAdapter\` with predictable part lookup, missing-node diagnostics, reset/dispose and safe source binding.
- [ ] Atomic per-instance palette changes that do **not** tint every part or destroy textures.
- [ ] Separately controllable eye glow, antenna light, shell, accent and wheels.
- [ ] Bounded illumination suitable for Kids light backgrounds; screenshot all five themes.
- [ ] New Kids component uses existing asset registry, fallback and role/label semantics.

### MSCT-06/07/08/09 — Motion & personality · OPEN
- [ ] Stable joint origin for both arms/head, coherent wheel rotation; no root-only fake waving.
- [ ] Core actions: idle / wave / happy / celebrate with start, cancel, end and idle recovery.
- [ ] Secondary: thinking / surprised / sleepy / cool / oops / roll / blink/excited with actual part/eye behavior as technically possible.
- [ ] Preserve shared action priorities; avoid repeating engine per page.
- [ ] Verify reduced-motion, speed cap, interrupted actions, event replay and context loss; no endless drift.

### MSCT-10/11/12 — Speech & reactions · OPEN
- [ ] Anchored bubble overlay with queue policy, bounded text, automatic timeout, screen reader announcements and low-motion mode.
- [ ] EN/TR text parity, no PII/chat, parent-friendly tone; copy examples: “Aferin!”, “Harika!”, “Süper!”, “Bir daha deneyelim!”, “Beraber düşünelim.”
- [ ] Typed \`game.start\`, \`answer.correct\`, \`answer.wrong\`, \`hint.request\`, \`challenge.complete\` mappings; no double-triggered XP.
- [ ] Optional manual demo buttons in **development-only** Playground; not on public Kids UI until verified.

### MSCT-13/14/15/16/17/18 — Integrate & release · OPEN/BLOCKED
- [ ] Persist allowed preferences locally with schema validation; parent-controlled nickname only.
- [ ] Real GLB failures fall back to 2D; check slow network, missing parts, WebGL unavailable and \`prefers-reduced-motion\`.
- [ ] \`pnpm ci:local\` on committed candidate, real-model Playwright + screenshots, mobile viewport/manual QA, visual contrast and file size budgets.
- [ ] Release authorization and required attribution; no asset hosted publicly before permission evidence.
- [ ] Replace homepage only after G0–G4; ensure mobile is explicitly tested or deferred.

## Verification record

| ID | Status | Evidence |
|---|---|---|
| Existing editor (not MSCT-03 certification) | Implemented baseline | Prior \`pnpm ci:local\`; AI Robot editor smoke ran against Mimo GLB fixture |
| MSCT-01–18 | Not verified | No actual AI Robot per-part browser certification or release approval yet |

## Progress log

- **2026-11-06 — Planning established:** audited docs, root and parent AGENTS, existing Kids model and local tests. Created canonical mascot tracker and acceptance contracts; implementation tasks intentionally remain OPEN/BLOCKED. Baseline \`ac05e01\`. Next: MSCT-02 real GLB audit while rights evidence for MSCT-01 is collected.
