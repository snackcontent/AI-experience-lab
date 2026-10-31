# AI Experience Lab v02 — Theme Architecture Audit & Regression Gates

Status: **Phase 01, partially completed; Gate 01 BLOCKED pending reproducible screenshots**.

## Immutable references

- Approved pre-theme Dark Mode commit: `25a2298fbba921d0b53eef8ead2be68a4af040be`.
- Original HTML blob: `f241b056232214ee4f9cefe43e0e47d36db1f9da`.
- Current development HTML blob at inspection: `084a6f8db4cc2ddd915a7c748cc0d3b3e732f40d`.
- The current development branch is two commits ahead of the approved baseline, with the tracked change confined to `AI Experience Lab.dc.html` (92 changed lines in GitHub commit statistics).
- **Do not** use the current theme implementation as the approved visual baseline; compare against the pre-theme reference above.

## Source inventory (current development HTML)

| Source | Observed count | Architectural action |
| --- | ---: | --- |
| CSS rule blocks | 971 | classify selectors by component and theme dependency |
| `!important` declarations | 459 | preserve cascade; inspect specificity before edits |
| CSS hex values | 280 | classify by semantic role, preserve original dark values |
| CSS rgba/rgb calls | 219 | retain exact alpha/gradients |
| CSS gradient functions | 56 | preserve dark gradient stops verbatim |
| CSS box-shadow declarations | 37 | separate surface/elevation from illustration effects |
| Inline `style` attributes | 830 | migrate only theme-dependent properties incrementally |
| Inline style attributes containing hex | 384 | inspect per-component sources |
| JavaScript `.style.` references | 46 | distinguish dynamic geometry vs colors |
| Explicit `html[data-theme="light"]` selectors | 65 | audit specificity and coverage of all sections |

## Styling categories

**Theme-dependent:** page and section backgrounds, cards and modals, text/placeholder colors, borders, overlays, shadows, inputs, selected/hover/focus/error states, header/menu, carousel controls, progress bars.

**Theme-independent:** layout grid and responsive breakpoints, spacing, sizing, typography metrics, border geometry, element positioning, carousel geometry.

**Dynamic presentations:** lamp Canvas and its lighting state, carousel transforms, card opacity, media animation, video/canvas effects, generated styles, focus-management behavior.

## Existing architecture observations

- The document already has a `data-theme` state and a header theme toggle, installed after the approved baseline.
- The theme bootstrap persists a preference and sets `colorScheme` and theme-color metadata.
- The current implementation adds light-scoped CSS; many hardcoded inline styles and JS-driven styles remain, so Light Mode completeness is **not validated**.
- Never bulk-replace color literals. Each component should use semantically named tokens with the original dark value preserved exactly.
- Keep rendering of approved images, videos, SVG, Canvas and media demonstrations unchanged unless a scoped container treatment is required.

## Mandatory baseline evidence — not yet captured

For each viewport **320, 390, 430, 768, 1024, 1440**, record **English LTR and Arabic RTL** snapshots of header, Hero, Across Our Network, AI Features, AI Products, Roadmap, FAQ, Contact and Footer, plus representative dialogs and interactive states. Capture an identical post-change frame, scroll coordinate and UI state. Exclude only the newly added theme switcher. Save screenshots in a retrievable evidence location and compare computed properties and image diffs.

**Blocker:** The connected browser is unavailable from the current chat execution context. Direct external site access from the execution container also failed. No trustworthy full-page browser baseline was captured, so no claim of visual parity, WCAG AA, or cross-device sign-off is justified.

## Gate statuses

- Gate 01 — Audit/inventory started; screenshot baseline **BLOCKED**.
- Gate 02 — Safe refactoring and computed-style equivalence **NOT STARTED**.
- Gate 03 — Dark regression **NOT VERIFIED**.
- Gate 04 — Light visual refinement **NOT VERIFIED**.
- Gate 05 — Theme switcher exists; interaction, storage and flash QA **NOT VERIFIED**.
- Gate 06 — Complete light component/state coverage **NOT VERIFIED**.
- Gate 07 — Responsive, bilingual, accessibility, performance and visual QA **NOT VERIFIED**.

## Required next step

Establish a browser session capable of loading the immutable pre-theme commit and current development branch, with screenshots and computed-style capture. Stop architectural writes to the site until Gate 01 baseline evidence exists. Preserve the dark stylesheet unchanged and implement theme migration component by component after screenshots are available. Do not merge or deploy to production.
