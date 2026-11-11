# MSCT-15 — Real-device & accessibility QA protocol

**Status:** READY FOR MANUAL EXECUTION — NOT VERIFIED  
**Created:** 2026-11-11  
**Applies to:** Devnetra Kids Character Studio at `/dev/characters` on a checked-out, recorded commit.  
**Release gate:** This document does not override MSCT-01 licensing, G0–G4, or authorize production/public distribution.

## Evidence already collected (automated Chrome, not real devices)

- `pnpm ci:local` PASS at main `74eee7141e4973d0345393c351d936cd8f5955f6` (15/15 typecheck, 15/15 tests, 8/8 builds; Turbo cached tasks).
- Playwright responsive/keyboard passes at 320, 390, 768, 1280 px; 2.2s delayed GLB placeholder; action replay 20 transitions.
- 2D fallback after GLB 404, WebGL unavailable, context loss; mobile 390 px with reduced motion; mini challenge desktop and mobile; MSCT-13 save/reload/reset/corrupt local storage PASS.
- These observations do **not** establish mobile Safari/Android Chrome compatibility, hardware FPS, GPU memory, or assistive-technology usability.

## Required execution metadata

Record for each run: date/time and tester; git commit SHA and clean/dirty status; device model, OS version and browser version; viewport/orientation, network profile; whether real GLB loaded or 2D fallback; evidence paths/screenshots; outcome PASS/FAIL/BLOCKED and issue reference. Test from a clearly identified local test server, not an unrelated port or build.

## Manual QA matrix

| ID | Environment | Action | Acceptance (observed, not assumed) |
|---|---|---|---|
| DEV-01 | Physical iPhone, current supported Safari | Open Character Studio on device over reachable HTTPS/LAN, load real GLB, rotate portrait/landscape | No crash, cutoff, horizontal overflow or missing controls; 3D or labeled fallback visible |
| DEV-02 | Physical Android, current supported Chrome | Repeat load/orientation and run palette/mood/action changes | Stable rendering and independently working controls; no error overlay |
| DEV-03 | Touch at 320–390 CSS px (both devices where feasible) | Tap all controls and mini-challenge; open keyboard when applicable | Controls do not overlap, bubble remains legible, touch targets reasonably >=44 CSS px, no accidental activation |
| A11Y-01 | Desktop Chrome or Safari + keyboard only | Tab/Shift+Tab through palette, selects, age track, save, reset and mini-game | Every control reachable, focus visible, logical order; no keyboard traps |
| A11Y-02 | iPhone VoiceOver | Navigate palette choice, adult acknowledgment, save/reset, challenge, status/bubbles | Labels and selected states announced intelligibly; feedback announced once without repetitive interruption |
| A11Y-03 | Android TalkBack | Repeat A11Y-02 | Same functional outcome; screen reader can finish task |
| A11Y-04 | OS reduced motion enabled | Repeat idle/action/lesson and force fallback | Physical motion reduced or stopped; lesson, status and controls fully functional |
| A11Y-05 | OS font scaling / zoom ~200% | Read bubble and form; interact without precision input | No essential content truncated; zoom/large text retains function |
| A11Y-06 | Both light/dark device display, low brightness | Check robot, text, error/status, focus and buttons | Readable contrast; record measured failures separately (automated screenshot is not a contrast measurement) |
| RES-01 | Slow or intermittent network | Delay/block model request; retry loading | Prompt 2D placeholder and comprehensible status; mini-lesson remains available |
| RES-02 | Missing WebGL / context loss | Test supported browser scenario or automated probe | 2D fallback, safe retry, no lost ability to complete lesson |
| PERF-01 | Physical iPhone and Android | Capture 60 s idle + 60 s repeated action using OS/browser performance tools | Record measured FPS/frame-time, memory trend, device heat/battery observations; **no invented numeric budget** |
| PERF-02 | Same devices | Repeat entering/exiting studio 10 times and switch palettes/actions 20+ times | No crash, escalating memory/texture growth, stuck animation or input lag; attach trace |
| DATA-01 | Fresh browser profile | Try palettes/expressions without parent acknowledgment; refresh | No localStorage persistence before approved save |
| DATA-02 | Fresh browser profile | Acknowledge parent checkbox and save; reload; reset | Exactly the allowlisted palette/expression/ageTrack fields persist, reset clears key; no name/DOB/XP |
| DATA-03 | Private/incognito or blocked storage | Try save and reload | Explicit failure status without crash or false success |
| UX-01 | Human reviewer familiar with ages 6–8 and 9–12 | Review all five palettes, eight expressions, EN/TR bubbles and fallback | Record age-appropriate tone, visual readability and child comprehension, with screenshots; explicit signoff |

## Performance reporting template

For each PERF run, record: hardware and OS; browser; commit; device temperature state; refresh/load type; network profile; median/p95 frame time where tooling supports it; FPS distribution; browser/JS/GPU memory if tools provide reliable values; count of crashes, WebGL losses, and visible input stalls. If measurement is unsupported, mark **NOT MEASURED** rather than PASS. Establish a device budget from observed baselines and documented product targets before making performance certification claims.

## Execution commands (automated baseline only)

```bash
cd ~/Projects/Devnetra
git rev-parse HEAD
git status --short
pnpm ci:local
# In terminal A:
pnpm --filter @devnetra/kids-web exec next dev -p 3101
# In terminal B:
DEVNETRA_KIDS_URL=http://localhost:3101/dev/characters pnpm test:mascot-preferences-browser
DEVNETRA_KIDS_URL=http://localhost:3101/dev/characters pnpm test:mascot-mini-browser
DEVNETRA_KIDS_URL=http://localhost:3101/dev/characters pnpm test:mascot-fallback-browser
DEVNETRA_KIDS_URL=http://localhost:3101/dev/characters pnpm test:mascot-device-browser
```

Device Safari/Chrome access may require a reachable, trusted HTTPS endpoint or compatible LAN URL; do not assume `localhost` on a phone points to the developer laptop. Keep unlicensed model hosting restrictions in force; do not create a new public preview merely to test.

## Signoff record (to be filled by a human tester)

| Check | Status | Device / evidence | Issue / owner |
|---|---|---|---|
| Physical iPhone/Safari | NOT RUN | — | — |
| Physical Android/Chrome | NOT RUN | — | — |
| VoiceOver | NOT RUN | — | — |
| TalkBack | NOT RUN | — | — |
| Keyboard, zoom and contrast | NOT RUN | — | — |
| Reduced motion & resilience | NOT RUN | — | — |
| Hardware performance trace | NOT RUN | — | — |
| Child-friendly visual/EN-TR copy review | NOT RUN | — | — |
| MSCT-01 distribution/attribution rights | BLOCKED | Written scope not archived | MSCT-01 |

**Decision rule:** Keep MSCT-15 `IN_PROGRESS` until required human evidence is recorded and reviewed. Automated PASS must not be copied into manual PASS. MSCT-17 homepage switch remains blocked by G0–G4.
