# AI Experience Lab — Mandatory layout contract

These rules apply to **all future versions**, redesigns, feature additions, and code changes on this repository. Always build from the latest `development` branch (current default branch); do not resurrect older snapshots, or overwrite approved changes from historical HTML versions.

## Permanent responsive layout invariant

- **12 columns** for primary page grids.
- **24px gutter** between tracks at all responsive widths.
- **88px reference column width** at the desktop reference width.
- **1320px reference content width** = `12 * 88 + 11 * 24`. Content is fluid below 1320px, with safe 16px / 24px / 32px viewport edges.
- Keep existing layout attributes `data-layout-container`, `data-layout-grid12`, `data-layout-span`, CSS variables (`--fl-*`) and breakpoint rules in `AI Experience Lab.dc.html`. This contract must be implemented in the source code—not just design documentation.
- Reference spans: 3 for four-up product cards, 6 for two-up card groups, 5/7 for editorial splits, and 12 for stacked/mobile layouts. At mobile widths, cards must stack without horizontal page overflow.
- Preserve **RTL/LTR**, semantic content order, focus styles, accessible targets, text wrapping, and responsive typography.
- Backgrounds, hero media, sticky effects, draggable carousels, canvases, animations, and modal interiors may extend beyond the content grid where required; do not clip them or alter behaviors just to enforce page gutters.
- Preserve the most recently approved AI Products card design, Roadmap 3D Coverflow slider and feature-specific artwork, Arabic translations and typography, brand palette, all working states and interactive functionality.
- Do not replace the page with older versions while implementing new requests. Changes are incremental on the newest accepted version.

## Non-regression process

1. Fetch latest `development` and inspect changes before editing; apply requested work on top of it.
2. Keep the grid contract and required markup attributes intact when changing layouts or sections.
3. Run the `Responsive Grid Contract` GitHub Actions check.
4. Inspect desktop 1440/1320/1200, tablet 1024/768, mobile 430/390/375/320, in both Arabic RTL and English LTR.
5. Before merging, verify no horizontal overflow, truncated headlines, clipped illustrations, broken carousels, or form layout regression.
6. Never remove these guidelines or contract checks during routine feature implementation.

**Canonical approved baseline:** `development` at commit `6247d5160a047fc4231cb178f8ca154bbfed88a8`, with the responsive-grid and Roadmap Coverflow refinements applied on top. Keep future changes incremental from the latest branch head.

## Roadmap slider invariants

- Preserve the 3D Coverflow with a clearly centered active card, visible adjacent previews, drag/swipe support, individual feature artwork and Arabic/English localization.
- Keep compact arrows, count and progress indicator (`cf-controls`), accessible labels and keyboard controls.
- Every visibly exposed Roadmap side card must be directly selectable by mouse click or touch tap, and support Enter/Space when keyboard-focused. Clicking either side makes that exact card active and centered, including the second neighbor if exposed. Preserve drag/swipe, avoid stale drag suppression of future clicks, and hide only truly off-screen cards from keyboard and assistive technology.
- **Critical 3D hit-testing rule:** the full-size `cf-carousel` inner stage (`transform-style:preserve-3d`) must have `pointer-events:none`; visible card articles explicitly use `pointer-events:auto` through `u.pe`. Otherwise the stage at z=0 intercepts clicks intended for side cards behind it at negative translateZ. Keep the side-card transparent `<button class="cf-card__select">` hit surface with keyboard focus, and use pointerdown card identity for tap activation when 3D transforms retarget pointerup.
- Keep a visible gap between Roadmap cards and carousel controls (34px desktop / 24px mobile as the current reference). Do not add decorative per-card numbering; retain the functional slide counter below.
- Favor transform/opacity-only coverflow transitions with stable layout dimensions and 16:9 canvas bitmaps. Avoid width/margin/filter animations and continuous work on all 18 cards; coalesce drag updates to animation frames.
- Enlarge only the active card with real width/centering adjustments; side-card dimensions stay unchanged and text remains crisp (do not use `scale()` on the entire card).
- Only the active card's artwork animates. Inactive roadmap canvases hold a static frame until activated, with redraws permitted on resize or first visibility; preserve reduced-motion behavior.
- AI Translation & Subtitles (Roadmap card index 1) uses the committed 16:9 **`assets/roadmap-scenes/ai-translation-subtitles-16x9.jpg`** image, with a CSS/SVG animated multilingual-flow overlay active **only** while the card is selected. Never revert it to the old globe canvas or replace it with an external/temporary image URL.
- Ask the Video (Roadmap card index 0) uses **`assets/roadmap-scenes/ask-the-video-16x9.webp`** as its 16:9 static poster and **`assets/roadmap-scenes/ask-the-video-animated-16x9.mp4`** as its animated motion asset. Mount and autoplay the muted looping clip only while the card is active; show the still poster when inactive or reduced-motion is requested. Maintain same design language and preserve other cards.
- AI Sports Analyst (Roadmap card index 2) uses **`assets/roadmap-scenes/ai-sports-analyst-16x9.webp`** and **`assets/roadmap-scenes/ai-sports-analyst-animated-16x9.mp4`**. Maintain the user-approved simplified neon-blue tactical match interface. Keep the image still while inactive; mount the 5-second muted looping animation only when active and only without reduced-motion. Never revert to the generic canvas or animate other cards.
- AI Article-to-Shorts (Roadmap card index 3) uses **`assets/roadmap-scenes/ai-article-to-shorts-16x9.webp`** and **`assets/roadmap-scenes/ai-article-to-shorts-animated-16x9.mp4`**. Its 16:9 illustration shows the workflow from article to AI script/storyboard to vertical 9:16 social video. Keep poster visible for inactive cards and reduced-motion users; mount muted looping MP4 only while active, without changing the size, position, or other feature cards.
- AI Shop the Scene (Roadmap item with `v: 'shop'`) uses **`assets/roadmap-scenes/ai-shop-the-scene-16x9.webp`** and **`assets/roadmap-scenes/ai-shop-the-scene-animated-16x9.mp4`**. Preserve the approved full-scene AR recognition layout with a modestly dressed woman, neon-blue item highlights and bottom product strip. Keep a still poster in side cards and play the 5-second muted loop only when the item is active; respect reduced-motion. Do not fall back to its generic canvas. Match by semantic `u.v === 'shop'` rather than a fragile card index.
- Keep the motion overlay transparent over the original raster so all translated labels, subtitles, speaker and output panels remain crisp; honor `prefers-reduced-motion`. Ensure inactive art remains stationary.
- All Roadmap card illustration canvases use a responsive **16:9** aspect ratio on desktop, tablet, and mobile; do not reintroduce fixed pixel heights in breakpoint overrides.
- Apply a subtle directional visual fade to inactive cards: **left-side cards soften toward the right edge**, right-side cards soften toward the left edge. Use an overlay on the card rather than reducing the entire nearer card's opacity, so more distant card text does not bleed through. Active card stays unaffected.
- Avoid long dot pagination, excessive glows, aggressive rotations, forced horizontal overflow and auto-advancing on small touch screens.
- Refrain from replacing the Roadmap with a card grid or theater unless explicitly approved.
