# AI Robot — External preview, licensing and hosting plan

Original model: https://sketchfab.com/3d-models/ai-robot-f7c4e4dcd1594e3e92b2d35a4ec8a93a
Author: Noores (Sketchfab: nuks)
Model ID: f7c4e4dcd1594e3e92b2d35a4ec8a93a
Model info: downloadable, no rig, 0 animations, Sketchfab Free Standard (not CC0).
Status: **permission pending**.

No mesh or textures are bundled. Only the official Sketchfab iframe is used on a development-only route. The homepage still uses Mimo until rights and the model implementation are ready.

## Why environment variables cannot hide a GLB

Env variables hold settings such as a model URL, not large model binaries. \`NEXT_PUBLIC_*\` variables are exposed to browsers. Uploading a GLB to Vercel public assets or Vercel Blob does not hide the mesh; public distribution rights must be confirmed first.

## Planned approval and deployment

1. Obtain written permission allowing redistribution of this exact GLB and modified derivatives in a publicly accessible Devnetra deployment and public open-source repository. Explicitly confirm whether attribution and licensed redistribution restrictions apply. Preserve evidence.
2. Keep the asset in appropriate storage (Vercel Blob or CDN). Do not publish a third-party GLB simply by setting an env variable.
3. Set \`NEXT_PUBLIC_ROBOT_MODEL_URL=https://.../ai-robot.glb\` in the deployment configuration only after rights approval and actual file upload.
4. Review geometry segmentation; original model has no rig and animations. Eye expressions and recoloring will require editable mesh/materials or owner-approved derivative models.
5. Implement a model-specific runtime renderer and acceptance tests before switching the Kids homepage.

Personalization preset keys are in \`packages/characters/src/personalization.ts\`; the developer preview shows planned choices but makes no false claim that the external iframe changes the mesh.
