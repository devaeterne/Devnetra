# UI-001..UI-012 — shared components
Status: Accepted, DN-002 (2026-11-06)

1. Web primitives follow shadcn/ui conventions (owned source + Radix where needed). Mobile uses React Native Reusables after Expo implementation begins.
2. Feature screens import Dv* UI wrappers only, not underlying primitive libraries directly; packages/ui-web and future packages/ui-mobile own implementations.
3. All icons are registered in packages/icons; render via DvIcon. Never import lucide-react directly into feature pages.
4. Do not use raw hex colors, hard-coded radii or spacing in app screens. CSS var aliases and semantically named tokens live in design-tokens.
5. Shared UI semantic slots with distinct kids/adult theme values. Kids: bright, playful, game-oriented with deliberate focus and restrained animation.
6. Age group 6–8 uses simpler visuals, 9–12 may show more detailed challenges. Keep all essential controls accessible; no animations required to understand a task.
7. Every component has a typed API, visual states, accessible keyboard behavior and i18n for displayed copy.
8. Business logic belongs in learning/challenge/rewards engines; components only render props and emit events.
9. Version breaking changes in token/component APIs and update the consumers/tests together.
10. Avoid introducing multiple competing UI libraries without ADR.
11. Web and native may differ in implementation, but share design token names and compatible semantic props.
12. Local CI is the only CI. No GitHub Actions workflows.
