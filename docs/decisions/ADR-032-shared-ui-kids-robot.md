# ADR-032: Shared UI primitives, playful Kids theme and robot mascot

Date: 2026-11-06
Status: Accepted

Decision: Kids uses a colorful, playful, game-oriented visual language. Primary character ID is kids.robot, a friendly cute 3D robot. 3D is a future licensed GLB runtime asset; its initial illustrative fallback is mandatory. Web UI uses shadcn/ui-style owned primitives and Lucide registry; planned native UI is React Native Reusables. Shared semantic theme tokens, typed wrappers, licensed asset registry and local-only contract tests are enforced. No GitHub Actions.

Future work: final robot GLB/animation license validation, native renderer, screenshot regression baselines.
