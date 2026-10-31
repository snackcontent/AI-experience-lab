# Theme QA — run on a computer with Chromium

This harness is isolated under `theme-qa/` and does not modify the website or deploy anything.

## Setup

```bash
cd theme-qa
npm install
npx playwright install chromium
npm run theme:qa
```

Output: `theme-qa/theme-qa-results/`, containing reference Dark screenshots, current Dark screenshots, current Light screenshots, computed CSS summaries, pixel diffs, and `report.json`. Keep these files as QA evidence rather than committing them unless reviewed.

## Inputs

- Default pre-theme reference: `25a2298fbba921d0b53eef8ead2be68a4af040be`
- Default current: `development`
- Override: `THEME_BASE_URL`, `THEME_CURRENT_URL`, or `THEME_CURRENT_REF`

## Review

1. Confirm actual rendered language using the screenshots; check whether the existing localization bootstrap honors the language setting.
2. Compare Dark Mode with the reference in the same viewport and scroll state. Ignore only the new Theme Switcher.
3. Review all seven captured section screenshots, plus footer, modal, hover/selected, and animation states manually. The basic harness does *not* cover every interactive state.
4. Inspect `report.json`; large pixel differences may be caused by dynamic animation or unsynchronized content. They are **not** proof of regression without a visual investigation.
5. Inspect Light Mode screenshots for unthemed inline styles, text contrast, visual hierarchy, and clipped media.
6. Manually validate language switching, toggle persistence, keyboard accessibility, reduced motion, mobile Safari, 18 Roadmap filters, the Contact demo form, and non-regression in Dark Mode.

## Limitations

The first harness uses DOM section screenshots, not a complete visual approval suite. It does not synchronise animated media frames, hide the Theme Switcher in screenshot comparisons, generate a browser-editable report, run WCAG audits, or prove absence of a flash of incorrect theme. The tests must be run in an environment that can access raw.githack.com and load its supporting assets. Do not mark regression Gates 01–07 complete until those checks are performed.
