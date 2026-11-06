# Local-only CI contract

No .github/workflows, no GitHub Actions, and no hosted CI. All verification is performed locally.

Commands (when implementation scripts are created):
- `pnpm ci:quick`: lint, typecheck, unit tests.
- `pnpm ci:contracts`: architecture, localization, page/design and asset contract checks.
- `pnpm ci:privacy`: static privacy/data boundary tests.
- `pnpm ci:web`: web E2E and builds.
- `pnpm ci:mobile`: native unit tests and local build checks.
- `pnpm ci:local`: all relevant gates.

Reports must include git commit SHA, command, tool/runtime versions, start/end times and exit status.
Only mark PASS when command actually executed successfully; do not fabricate results.
PRs include the local CI report summary; reviewers can rerun locally.
Local tests cannot prove runtime privacy, third-party SDK behavior, or full mobile accessibility; device review is additionally required.
