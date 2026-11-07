# Mascot v1 — Canonical Task Tracker

**Prefix:** MSCT · **Branch:** `main` · **Last planning audit:** 2026-11-06
**Baseline commit (before this planning work):** `ac05e017d58d2c310860bd34bc0c5ac2c1f60210`
**Release:** NOT READY · **Status definitions:** [DOC-001](../../rules/documentation-structure.md)
**Stages:** OPEN / IN_PROGRESS / BLOCKED / DONE / VERIFIED

| ID | Scope | Priority | Depends on | Status | Gate |
|---|---|---|---|---|---|
| MSCT-01 | Verify model rights, author and public redistribution permission | P0 | — | BLOCKED | G0 |
| MSCT-02 | Real AI Robot GLB audit: hierarchy, mesh/material mapping, textures, scale, hashes | P0 | — | DONE | G0 |
| MSCT-03 | Versioned AI Robot adapter, typed part selectors and asset registry | P0 | MSCT-01,02 | DONE | G0/G1 |
| MSCT-04 | Five true independent material palettes (Ocean/Violet/Candy/Lime/Sunshine) | P0 | MSCT-02,03 | DONE | G1 |
| MSCT-05 | Glowing eye/antenna, expressive look and bounded studio lighting | P0 | MSCT-02,03 | IN_PROGRESS | G1 |
| MSCT-06 | Real part pivots for Head/LeftArm/RightArm/LeftWheel/RightWheel | P0 | MSCT-02,03 | IN_PROGRESS | G2 |
| MSCT-07 | Implement idle, wave, happy, celebrate with clear visible differences | P0 | MSCT-06 | IN_PROGRESS | G2 |
| MSCT-08 | Think/oops/sleep/roll/blink and eight expression mapping | P1 | MSCT-05,07 | IN_PROGRESS | G2 |
| MSCT-09 | Action priorities, deterministic replay, cooldown, interrupt/reduced-motion | P0 | MSCT-07 | IN_PROGRESS | G2 |
| MSCT-10 | Reusable speech-bubble component, queue/replace, TTL and mobile placement | P1 | MSCT-03 | DONE | G3 |
| MSCT-11 | Localized child-friendly EN/TR bubble copy: Aferin, Harika, Süper, Try again, Think together | P1 | MSCT-10 | DONE | G3 |
| MSCT-12 | Typed game events connecting animations, bubble and idempotent feedback | P0 | MSCT-09,11 | IN_PROGRESS | G3 |
| MSCT-13 | Parent-approved local preference persistence, age track UX and reset | P1 | MSCT-04,08 | OPEN | G3 |
| MSCT-14 | Accessible 2D fallback, context loss, network/mesh error and reduced motion | P0 | MSCT-03,09 | IN_PROGRESS | G1/G4 |
| MSCT-15 | Actual-model browser, visual, keyboard, device, performance and regression suite | P0 | MSCT-04..14 | IN_PROGRESS | G4 |
| MSCT-16 | Public delivery + credit/attribution + Vercel Blob/CDN URL (rights-gated) | P0 | MSCT-01,15 | IN_PROGRESS | G4 |
| MSCT-17 | Make licensed AI Robot the primary Kids homepage mascot, retain Mimo fallback | P0 | MSCT-01,15,16 | OPEN | G4 |
| MSCT-18 | Native/mobile mascot support (separate acceptance plan) | P2 | MSCT-14 | OPEN | G4 |

## Detailed work packages

### MSCT-01 — Rights gate · BLOCKED
- [ ] Confirm who granted permission and which model/file version.
- [ ] Capture explicit permission for **derivatives, commercial public use, public hosting, direct GLB download and public GitHub redistribution**; retain any attribution, license and sublicense restrictions.
- [ ] Record provenance without exposing private correspondence.
- **Blocker:** User reports permission obtained, but written redistribution evidence/scope has not been archived in this repo or the supplied model bundle.
- **Related:** `docs/assets/ai-robot-license-pending.md`; `packages/assets/candidates.json`.

### MSCT-02 — Real model audit · DONE (static; runtime check remains in MSCT-03/06)
- [x] Validate supplied `ai_robot.glb` structure and archive inventory; record content hash, size and texture references.
- [x] Inspect named meshes/parts: Head, Eyes, EyeBorder, Ears, Antenna, Chest, Hips, Neck, MidSpine, Left/RightArm, Left/RightWheel.
- [x] Inventory all 18 material names and identify shell, eyes/texture, wheel/hand accents and emissive antenna.
- [ ] Test hierarchy and pivot transforms in Three.js browser (moved to MSCT-03/06); source transforms and rig absence documented.
- [x] Produce reproducible GLB audit script and [human-readable findings](REAL_MODEL_AUDIT.md); keep asset binary private until MSCT-01.

### MSCT-03/04/05 — Foundation · OPEN
- [ ] Shared `AiRobotRigAdapter` with predictable part lookup, missing-node diagnostics, reset/dispose and safe source binding.
- [x] Atomic per-instance palette changes with no GLB reload; preserve eye texture and mechanical contrast. All five colors captured on real AI Robot model (awaiting approval to mark VERIFIED).
- [x] Eye texture emissive and antenna emissive controlled independently, with source PNG preserved and typed mood intensity bounds; wheel materials preserved. Human visual quality review remains.
- [ ] Bounded illumination suitable for Kids light backgrounds; screenshot all five themes.
- [ ] New Kids component uses existing asset registry, fallback and role/label semantics.

### MSCT-06/07/08/09 — Motion & personality · OPEN
- [x] Real-model head and both arm pivots use world-to-parent axis conversion and baseline source quaternions; visible waving/celebration confirmed in Chrome. Named-wheel roll-in-place and bounded pure pose targets implemented; long-duration runtime drift checks remain OPEN.
- [ ] Core actions: actual-model idle/wave/celebrate preview implemented, but return-to-idle/interrupt controller integration and human motion signoff remain.
- [ ] Secondary: thinking/sleepy/oops/cool now drive typed eye and antenna brightness; head/arm reactions exist. Source Eyes mesh includes the face screen; runtime 1024x1024 UV texture now supports happy/sleepy/surprised/cool/oops eye shapes and blink without scaling the mesh. Wheel/all-expression acceptance remains open.
- [x] Reuse shared action priorities and idle timeout; game-event preview verified on real bundled GLB in Chrome.
- [ ] Verify reduced-motion, speed cap, interrupted actions, event replay and context loss; no endless drift. Pure motion targets now have bounded finite values and zeroed reduced-motion poses; long-running live browser and context-loss QA still open.

### MSCT-10/11/12 — Speech & reactions · OPEN
- [x] Anchored replacement-based bubble, automatic 3.2s timeout, screen reader announcement and reduced-motion styling; mobile human QA pending.
- [x] EN/TR copy parity in typed model for six events. Human wording review remains.
- [x] Typed preview event mappings drive both action and bubble, and rejected low-priority events do not replace them. A new shared pure event-ID deduplication reducer is prepared on a review branch; local CI and actual game scoring integration are not yet verified.
- [x] Manual reaction buttons in development-only Character Studio; public Kids homepage untouched.

### MSCT-13/14/15/16/17/18 — Integrate & release · OPEN/BLOCKED
- [ ] Persist allowed preferences locally with schema validation; parent-controlled nickname only.
- [ ] Real GLB failures fall back to 2D; check slow network, missing parts, WebGL unavailable and `prefers-reduced-motion`.
- [ ] `pnpm ci:local` on committed candidate, real-model Playwright + screenshots, mobile viewport/manual QA, visual contrast and file size budgets.
- [ ] Release authorization and required attribution; no asset hosted publicly before permission evidence.
- [ ] Replace homepage only after G0–G4; ensure mobile is explicitly tested or deferred.

## Verification record

| ID | Status | Evidence |
|---|---|---|
| Existing editor (not MSCT-03 certification) | Implemented baseline | Prior `pnpm ci:local`; AI Robot editor smoke ran against Mimo GLB fixture |
| Audit MSCT-02 | DONE, not VERIFIED | Static audit of supplied GLB: 25 meshes, 38 nodes, 18 materials, source hash recorded; see REAL_MODEL_AUDIT.md |
| Evidence MSCT-04 | DONE, not VERIFIED | Actual AI Robot GLB tested with five palette screenshots; shell/trim change without model reload. Human visual approval pending. |
| MSCT-06/07 | IN_PROGRESS | Actual model head/arm actions captured; reduced motion and wheel QA remain. |
| MSCT-09/12 | IN_PROGRESS | Real Chrome priority, expiry and event-to-bubble previews passed; game-scoring integration remains open. |
| MSCT-10/11 | DONE, not VERIFIED | Real Chrome EN/TR bubble copy, expiry, replacement and aria status PASS; mobile/human signoff pending. |
| MSCT-01, 03–18 | Not verified | No actual AI Robot per-part browser certification or release approval yet |

## Progress log

- **2026-11-06 — Planning established:** audited docs, root and parent AGENTS, existing Kids model and local tests. Created canonical mascot tracker and acceptance contracts; implementation tasks intentionally remain OPEN/BLOCKED. Baseline `ac05e01`. Next: MSCT-02 real GLB audit while rights evidence for MSCT-01 is collected.

- **2026-11-06 — MSCT-02 audit:** inspected supplied actual GLB and glTF archive; model has named independent limb and wheel groups, a textured Eyes material and emissive antenna material, but no animation or skin. Reproducible source audit and SHA recorded. Source binary is not redistributed; runtime pivot validation remains MSCT-03/06.

- **2026-11-06 — MSCT-03 started:** defined source-specific material roles and node-group contract. Editor now targets original Head/LeftArm/RightArm/LeftWheel/RightWheel groups, keeps baseline joint quaternions and preserves eye PNG and wheel/hand materials. Real-model browser verification and public asset delivery remain OPEN.

- **2026-11-06 — Real-model Chrome QA:** located authorized local GLB at `/Users/devaeterne/Desktop/airobot/ai_robot.glb`, corrected scene framing and arm pivot quaternion multiplication, added immediate non-reloading palette changes. Ran `AI_ROBOT_GLB_FILE=/Users/devaeterne/Desktop/airobot/ai_robot.glb pnpm test:ai-robot-real`: PASS (actual GLB hash, five palette screenshots, distinct wave/celebrate, no page errors). Screenshots ignored under `reports/visual/`. Rights evidence and visual release signoff still outstanding.

- **2026-11-07 — Bundled model:** User explicitly requested that previously uploaded AI Robot GLB be committed to public GitHub. Copied exact, SHA-verified asset to Kids public assets and auto-wired `kids.robot.ai-robot` in registry and Character Studio. Public delivery now implemented, but written extra-rights documentation and full release certification remain outstanding (MSCT-01/16).

- **2026-11-07 — Mascot event feedback v1:** real bundled GLB uses shared action priorities and idle recovery. Added typed EN/TR encouragement copy and accessible short-lived bubble with six developer-only game-event controls. Local Chrome test PASS for Aferin!, Harika!, English switch, priority rejection, expiry, idle return. MSCT-10/11 DONE; MSCT-09/12 IN_PROGRESS until real game integration.

- **2026-11-07 — Emotional lighting:** added typed mood mapping and bounded light intensity; original textured Eyes and emissive antenna now react separately to action/expression, preserving source texture. Removed constant idle bouncing in happy preset. Browser and unit tests added; human visual approval remains open.

- **2026-11-07 — Visual QA finding:** scaling Head_Eyes_0 collapses the black face panel because its source mesh includes the whole screen. Rejected that experiment. Kept original face geometry and tested mood-sensitive eye/antenna light; real independent blink remains OPEN (MSCT-08).

- **2026-11-07 — MSCT-08 face atlas:** implemented procedural CanvasTexture for the original Head_Eyes_0 UV atlas without deforming the face screen. Happy, sleepy, surprised and blink checked with real-model Chrome screenshots. Texture is instance-local, disposed on unmount; unchanged licensed GLB. Human UX and eight-expression signoff pending.

- **2026-11-07 — MSCT-06/07 motion improvements:** replaced ad hoc joint animation values with pure typed aiRobotMotionPose in packages/characters. Walk now shows bounded synchronized wheel rotation, modest body rock and arm counter-swing while anchored to the studio. Happy has balanced arm lift and bounce; celebrate has stronger two-arm lift. Reduced motion produces zero physical displacement. Real GLB Chrome screenshots for idle, roll, happy, celebrate inspected; browser motion regression and pure deterministic tests added. Long-duration device QA still pending.

- **2026-11-07 — MSCT-12 preparation (review branch):** Created a typed, bounded, ephemeral mascot game-event reducer. It rejects duplicate logical event IDs, retains high-priority reactions, returns expired animations to idle, and deliberately never changes XP or child profiles. Unit tests were authored, but local `pnpm ci:local` and browser tests were **NOT RUN** because the authorized Mac is offline. Do not mark DONE/VERIFIED or merge to main before local checks and integration with actual game logic.

- **2026-11-07 — MSCT-12 demo integration:** Mac connection restored. A development-only 2+3 mini learning task now sends deduplicated typed game events to the shared mascot controller for wrong/correct/hint/complete/restart; no persistent XP or child data. Branch local CI PASS (15 typechecks, 15 tests, 8 builds), reducer unit tests PASS (4), real GLB Chrome feedback regression PASS, desktop 1280 px and mobile 390 px reduced-motion mini challenge PASS. Production Kids lessons/scoring do not yet exist, so MSCT-12 stays IN_PROGRESS. MSCT-14/15 moved to IN_PROGRESS for wider accessibility/fallback/device checks.
