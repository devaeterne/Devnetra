# MSCT-02 — Actual AI Robot GLB structural audit

**Date:** 2026-11-06 · **Status:** Static GLB audit complete; runtime pivot certification pending (MSCT-03/06).
**Source:** User-uploaded `ai_robot.glb`, plus `ai_robot.zip` with glTF/bin/eye texture and model's Sketchfab license text. No model binary is committed here.
**Upstream:** [Noores / AI Robot](https://sketchfab.com/3d-models/ai-robot-f7c4e4dcd1594e3e92b2d35a4ec8a93a)

## Binary identity

| Property | Observed |
|---|---|
| File | ai_robot.glb |
| GLB version | 2 |
| Bytes | 675,992 |
| SHA-256 | `e6cff59131f0100016f7b08079dd3170968bebb728666d7d26615d31401018cd` |
| Meshes | 25 |
| Nodes | 38 |
| Materials | 18 |
| Animations | 0 |
| Skins / skeletal rigs | 0 |
| Embedded image | 1 PNG |
| Textures | 1 |
| glTF JSON chunk | 28,424 bytes |

## Named groups and mapped functionality

| Group | Mesh children / material families | Planned control |
|---|---|---|
| Head | Head_Head_0, Head_EyeBorder_0, Head_Ears_0, Head_Eyes_0, Antenna | Neck tilt, eye emphasis, head pose |
| Antenna (child of Head) | Antenna_Antenna_0, Antenna_Holder_0, Antenna_light_0 | Light pulse and highlight |
| Chest | Chest_chestMat_0 | Primary shell color |
| Hips | Hips_hipsMat_0 | Secondary body color |
| Neck | Neck_Neck_0 | Fixed connector / head rotation boundary |
| MidSpine | MidSpine_midSpineMat_0 | Fixed center support |
| LeftArm | 5 meshes (HandCircle, AfterCircle, ForeArm, Fingers, Hand) | Independent wave / celebrate |
| RightArm | 5 meshes (same family) | Independent wave / celebrate |
| LeftWheel | Wheelmat, wheelHolderMAt | Roll rotation |
| RightWheel | Wheelmat, wheelHolderMAt | Counterpart roll rotation |

**18 source materials:** Head, EyeBorder, Ears, Eyes, Antenna, Holder, light, chestMat, hipsMat, Neck, midSpineMat, Wheelmat, wheelHolderMAt, HandCircleMat, AfterCircleMat, ForeArmMat, FingersMAt, HandMad.

The **Eyes** material references the only embedded PNG texture and carries an emissive factor. Preserve this texture when recoloring the body. The **light** material has emissive factor approximately `[0, 0.7752, 1]`; only recolor its glow channel with a controlled brightness cap. Preserve wheel and hand material contrast. Do not recolor all meshes identically.

## Transform and movement implications

- The outer `Sketchfab_model` and `Robot.fbx` nodes have axis-conversion matrices. Joint motion must be tested in **local** coordinates; global-axis assumptions cause reversed or tilted gestures.
- Existing named joint roots include Head, LeftArm, RightArm, LeftWheel and RightWheel. Their source transforms are not identity; clone and save baseline transforms before any procedural animation. Do not mutate original shared glTF scene.
- Arms and wheels have independent groups, but the file contains **no skeleton animation**. A part-controller can rotate those groups; rig quality and precise joint-axis verification still require real browser captures.
- Source pivot translations are approximate and in the original coordinate system. Head: `[-0.0000, 0.23987, 0.01197]`, LeftArm: `[-0.05435, 0.14502, -0.00247]`, RightArm: `[0.05435, 0.14502, -0.00247]`, LeftWheel: `[0.04870, 0.04698, -0.00268]`, RightWheel: `[-0.04870, 0.04698, -0.00268]`.
- Facial expression is not a ready-made blendshape/clip. Start with head poses, eye light/intensity and optional derived eye overlay; don't claim per-eye blinks until actual eye texture geometry has been inspected.

## Packaging and legal status

The provided `ai_robot.zip` contains `scene.gltf`, `scene.bin`, `textures/Eyes_baseColor.png` and `license.txt`. License file identifies **Sketchfab Standard**, not CC0. The user reported permission granted, but the exact written public-redistribution terms have not been archived. Treat binary publishing on public GitHub/Vercel as **blocked**, independent of this technical audit.

## Reproducibility

Run:

```bash
node scripts/audit-ai-robot-glb.mjs /path/to/ai_robot.glb
```

The audit prints names, hash, required node groups, texture/emission summary and absence/presence of embedded clips. Use the supplied GLB privately; do not add the proprietary binary to git.

## Results

**MSCT-02 static structural audit: DONE.** Runtime transform and visual QA remains for MSCT-03/06; no release or per-part visual PASS is claimed. Next: a semantic material mapper and part adapter using actual names. See `TASKS.md`.
