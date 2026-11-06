# Kids Mascot v1 — AI Robot

**Workstream:** MSCT · **Created:** 2026-11-06 · **Owner:** Devnetra  
**Canonical tracking:** [TASKS.md](TASKS.md) · [Acceptance](ACCEPTANCE.md)

## Outcome

A lovable, customizable and accessible 3D robot for Devnetra Kids (ages 6–8 and 9–12), with five themed colors, expressive movement and localized, short encouragement bubbles (e.g. “Aferin!”, “Harika!”).

## Baseline — what exists and what does not

**Existing (code):** original Mimo GLB, shared Character Engine action priority/timeout, local AI Robot editor, palette/expressions selection presets, local CI commands, 2D fallback. Baseline before this planning effort: `ac05e017d58d2c310860bd34bc0c5ac2c1f60210`.

**Supplied files:** AI Robot `ai_robot.glb` (uploaded), `ai_robot.zip` with glTF/bin/eye texture and Sketchfab Standard license text, `ai-robot.zip` with source package, optional USDZ. Those uploads are available to this conversation; they are not yet included in the repo.

**Initial real-model structural inspection:** the supplied archive's glTF includes 25 meshes, 18 materials, 38 nodes, **0 animations**. Named hierarchy includes Head, Eyes, EyeBorder, Ears, Antenna, Chest, Neck, Hips, MidSpine, LeftArm/RightArm and LeftWheel/RightWheel. Verify transforms, materials and target meshes in the real GLB runtime before claiming individual animation support.

**Rights:** user reports permission obtained. Archive's `license.txt` says Sketchfab Standard, NOT CC0; written permission covering public redistribution/modification/derivatives must be retained and reviewed before placing GLB into a public GitHub repository or public Vercel/CDN asset store.

**Not shipped:** AI Robot on Kids homepage, per-mesh recoloring, independent limb/wheel/eye actions, bubbles, child profile persistence and end-to-end release acceptance. Fixture tests using Mimo do not prove real AI Robot behavior.

## Target architecture

- `packages/characters`: typed action/expression/palette/event/bubble contracts.
- `packages/assets`: licensed asset metadata, source attribution, versions, hashes and fallback.
- `packages/design-tokens`: semantic colors, studio lighting and bubble styles.
- `apps/kids-web`: lazy WebGL renderer and fallback, Character Studio, game event bindings.
- Future `apps/kids-mobile`: native renderer/static fallback separately certified.

## Delivery gates

1. **G0 — Provenance:** real file/rights/source audit, no premature public release.
2. **G1 — Foundation:** actual AI Robot renderer, part-level material colors, lighting, graceful fallback.
3. **G2 — Motion:** real limb/wheel/eye movement, priorities, procedural animation and reduced-motion.
4. **G3 — Speech:** EN/TR encouragement bubbles tied to typed game events.
5. **G4 — Certification:** local CI + browser screenshots + device/accessibility + release signoff.

## Constraints

No open chat, child identification data, third-party trackers, free-form user speech or forced WebGL. Support lightweight 2D mode and reduced-motion. Avoid overpraise/harsh negative feedback; keep bubbles encouraging, brief and age appropriate. No production switch before license and release gates.

## Related sources

[Asset provenance](../../assets/ai-robot-license-pending.md) · [Motion ADR](../../decisions/ADR-034-mimo-procedural-animation.md) · [Character rule](../../../.agents/rules/character-system.md) · [Asset rule](../../../.agents/rules/asset-registry.md)

**Next:** MSCT-03 (in progress: model-specific part/material adapter; real-model browser acceptance pending), while MSCT-01 rights evidence is collected. See [actual GLB structural audit](REAL_MODEL_AUDIT.md).
