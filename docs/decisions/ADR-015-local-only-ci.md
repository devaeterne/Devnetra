# ADR-015: Local-only CI

Status: Accepted
Date: 2026-11-06

## Decision
All quality checks, builds and E2E tests run locally. No GitHub Actions, no hosted CI workflows. GitHub is used for source hosting, collaboration and code review.

## Rationale
Avoid GitHub-hosted CI usage and limit consumption.

## Consequences
- A local developer runs `pnpm ci:local` before submitting or merging changes.
- PR must provide commit-specific test evidence and reviewers can rerun checks.
- Branch rules cannot honestly claim a GitHub CI status is available.
- Future self-hosted automation would require an explicit replacement ADR; it is NOT in scope.
