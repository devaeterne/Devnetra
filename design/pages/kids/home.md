# Kids home — UI contract v1.0
Product: Kids; age 6–12; 6–8 and 9–12 tracks.
Theme: kids; playful color, clear hierarchy, large controls, friendly robot mascot, simple navigation.
Sources: @devnetra/ui-web, @devnetra/icons, @devnetra/characters, @devnetra/localization; no imported raw Lucide on pages.
States: ready, offline, loading, error. Avoid forced animation. Reduced-motion fallback.
Privacy: no external links, profile data requests, login or analytics in anonymous view.
EN/TR: use translation dictionary (no hardcoded user-visible strings).
Tests: typecheck, contract, accessible button, mascot fallback, EN/TR and local page build. Visual screenshots separate pending acceptance.
