# Kids Mascot — scoped agent working contract

Read: root \`AGENTS.md\`, \`docs/AGENTS.md\`, \`docs/rules/documentation-structure.md\`, \`.agents/rules/character-system.md\`, \`.agents/rules/asset-registry.md\`, then this workstream README/TASKS/ACCEPTANCE.

1. Check \`git status\`, \`main\` and existing work before any implementation. Do not overwrite user changes.
2. Use task IDs \`MSCT-NN\`; change status in canonical TASKS before and after work.
3. Preserve license and attribution; do not treat Standard as CC0. No model binary in public repo/CDN until written redistribution rights are recorded.
4. Test against the supplied actual AI Robot GLB for acceptance, not just Mimo mock/fixture.
5. Implement reusable contracts in packages/characters, provenance in packages/assets, lighting in design-tokens, UI in kids-web.
6. Existing Character Engine should be extended, not replaced with a duplicated state machine.
7. All code tests run locally; no GitHub Actions. Real browser and manual visual acceptance are separate from unit/typecheck/build.
8. Respect Kids privacy, EN/TR copy parity, accessibility and reduced-motion fallback.
9. At end of each session: list changed IDs, local test commands/results, latest commit, blockers and one next action. No invented PASS.
