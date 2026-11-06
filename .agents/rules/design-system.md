# Design and assets
- Semantic tokens only. Adult and Kids themes differ but share token contract.
- Use approved UI wrappers, Lucide icon registry and licensed asset/character registry.
- Web primitives: shadcn/ui; native primitives: React Native Reusables, subject to platform compatibility validation.
- Asset metadata must include origin, license, format, version and render fallback.
- Kids targets: accessible contrast, large interactive targets, simple navigation, reduced-motion support.
- Every page maintains a design/pages contract covering states, interactions, data access, i18n and tests.
