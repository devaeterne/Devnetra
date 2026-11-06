# Devnetra documentation agent instructions

Applies to all \`docs/**\`. Root \`AGENTS.md\` and \`.agents/rules/\` remain authoritative.

- Use [DOC-001](rules/documentation-structure.md) when creating new docs or tracking work.
- Existing docs/decisions and docs/assets keep their current locations.
- Use a single \`TASKS.md\` per workstream; avoid alternate status files.
- Update task dependencies, status and evidence on every meaningful handoff.
- NEVER claim VERIFIED without actual acceptance results; unit/build success is not a visual QA success.
- Record license accurately: Sketchfab Standard is **not** CC0 or open source. User-reported authorization is separate from archived permission granting public redistribution.
- Do not commit private license correspondence or secrets without explicit publication authorization.
- All CI/test/build execution happens locally. Never create GitHub Actions.
