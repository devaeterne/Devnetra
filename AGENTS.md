# Devnetra engineering governance

Scope: entire monorepo. Prefer the closest app/platform rule and page contract when implementing an interface.

## CI policy — mandatory
- ALL CI, tests, lint, typechecks, localization checks, accessibility checks, visual checks and production builds run locally.
- DO NOT create GitHub Actions workflows, GitHub-hosted CI, scheduled workflows, or required hosted CI jobs.
- GitHub is for public source, branches, PRs, reviews, issues and releases only.
- Run `pnpm ci:local` on the exact candidate commit before marking a change PASS.
- Record result, timestamp, environment and commit SHA under `reports/ci/` (reports may be untracked).
- A locally reported PASS is not an independently verified hosted check. PR reviewers must inspect evidence and may rerun tests locally.

## Architecture and product rules
- Monorepo: pnpm + Turborepo; Next.js web and Expo React Native mobile.
- English (canonical) and Turkish required; translation PRs require full key/variable parity and human review.
- No user-facing hard-coded copy, raw colors, ad hoc asset paths, or localized timestamps in product code.
- Design tokens, UI wrappers, icon registry and licensed asset registry are authoritative.
- Dates are persisted as ISO 8601 UTC; render with Intl and selected locale/timezone.
- Kids: 6–8 and 9–12 age bands, no mandatory account for free trial, parent-managed nickname and age band only.
- Parent signs in with Google or Apple for optional cloud backup. Kids progress is local-first; one active cloud provider (Drive appDataFolder OR CloudKit private database); encrypted export/import.
- No direct child access to adult sessions, social services, messaging or blockchain wallets.
- No untrusted code execution directly inside server application processes.
- Never commit credentials, private user records or unlicensed third-party files.

See `.agents/rules/`, `.agents/platforms/`, and `design/pages/` as features are implemented.

## DN-002 — UI/visual governance
- Kids theme is playful, colorful and game-oriented; primary mascot is a friendly 3D robot with a licensed asset contract and a lightweight illustration fallback until a real model is shipped.
- Enforce UI-001..UI-012 in `.agents/rules/ui-components.md`, icon policy in `.agents/rules/icon-system.md`, character and asset policy in corresponding files.
- UI contract tests must be included in local `pnpm ci:local`; visual screenshots are a separate required acceptance stage and must never be represented as PASS based on static tests.
