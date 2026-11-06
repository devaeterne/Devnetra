# Localization
- EN and TR parity is required.
- JSON translations live in locales/<language>/<namespace>.json, English is canonical.
- Contributions add a complete language folder via GitHub PR.
- No dynamic executable strings or embedded arbitrary HTML in translations.
- Match all translation key paths, interpolation variables and plural/select cases.
- Use locale-aware Intl formatting; UTC at persistence boundaries.
