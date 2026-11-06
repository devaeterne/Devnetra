# Mimo — the original Devnetra Kids 3D mascot

**License chosen for Devnetra Mimo assets:** Creative Commons Zero 1.0 (CC0-1.0), subject to the rights the project can lawfully dedicate.  
Terms: https://creativecommons.org/publicdomain/zero/1.0/

This mesh is an **original parametric 3D model**, generated from shapes created expressly for Devnetra; it was not copied from, traced from, or downloaded from a third-party character pack. Source code is in `scripts/build-kids-mascot.py`. The model is a cheerful lavender robot with giant bright eyes, pastel sky-blue jellybean torso, pink cheeks, small yellow feet and a heart badge.

File: `apps/kids-web/public/assets/characters/devnetra-mimo.glb`  
Registry: `packages/assets/manifest.json` / `packages/assets/src/index.ts`

No embedded animations are claimed. Gentle floating motion is provided by accessible CSS, disabled when `prefers-reduced-motion` is enabled. A 2D fallback is provided on devices without WebGL.

## Repeatable generation

```bash
python3 -m venv /tmp/devnetra-mascot-env
/tmp/devnetra-mascot-env/bin/pip install numpy trimesh
/tmp/devnetra-mascot-env/bin/python scripts/build-kids-mascot.py --output apps/kids-web/public/assets/characters/devnetra-mimo.glb
pnpm test:mascot
```

`trimesh` and `numpy` are build-time tools, not included in the shipped Web app. Re-check their tool licenses if bundling or distributing those libraries in a separate package.

## Dependency provenance
The viewer uses `@google/model-viewer` (Apache-2.0), loaded from the local app bundle. The model itself contains no third-party art or textures. The optional reference packs considered during research were Kenney Mini Characters and Prototype Kit (both labeled CC0 on their individual publisher pages); **neither pack was incorporated**.
