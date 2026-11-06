# DOC-001 — Documentation and workstream standard

**State:** ACTIVE · **Effective:** 2026-11-06 · **Scope:** \`docs/\`

## Directory classification

- \`rules/\`: durable documentation and tracking rules; engineering constraints remain in root AGENTS and .agents/rules.
- \`decisions/\`: numbered ADRs (\`ADR-NNN-slug.md\`); preserve history, supersede with another ADR.
- \`assets/\`: licensed asset provenance, author, source, public redistribution rights, hashes, attribution and fallback.
- \`workstreams/<kebab-case>/\`: one canonical work tracker per active goal.

Each workstream contains \`README.md\` (purpose/architecture/current state), \`TASKS.md\` (only canonical backlog), \`ACCEPTANCE.md\` (testable gates), and \`AGENTS.md\` (scoped working rules). Optional research/risks/changes docs must contain actual information, not empty scaffolding.

## Tracking schema

Stable task IDs: \`MSCT-01\`, etc. Each task has title, priority, dependencies, status, implementation scope and acceptance checks. Status options:

- **OPEN** — ready to plan, no implementation.
- **IN_PROGRESS** — actively worked on.
- **BLOCKED** — blocked by an explicitly named dependency.
- **DONE** — implemented, not yet fully accepted.
- **VERIFIED** — all acceptance criteria passed using real artifacts, required manual QA, local commands, date and committed SHA.

Do not call a task VERIFIED for a fixture-only test when real-model certification is required. Do not count a CI build as browser/visual/device acceptance.

## Working procedure

1. Locate existing task; do not duplicate it.
2. Before development, record status IN_PROGRESS and note blockers and affected files.
3. Update TASKS after changes and at every handoff.
4. Evidence log includes date, SHA, actual command results, remaining gaps.
5. If architecture changes, write/supersede an ADR. Task status changes stay in TASKS.
6. Local-only CI (never GitHub Actions), aligned with root AGENTS.md.
7. Prefer English for engineering artifacts for community contributions; EN/TR product copy parity is mandatory.

Priority: root AGENTS.md > applicable .agents/rules > nearest scoped AGENTS.md > task plans. Flag conflict rather than quietly overriding.
