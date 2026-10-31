# AI Experience Lab — Mandatory layout contract

These rules apply to **all future versions**, redesigns, feature additions, and code changes on this repository. Always build from the latest `development` branch (current default branch); do not resurrect older snapshots, or overwrite approved changes from historical HTML versions.

## Stable development preview URL

- **Always share this single canonical link for the latest development build:** https://raw.githack.com/snackcontent/AI-experience-lab/development/AI%20Experience%20Lab.dc.html
- The user explicitly approved a **branch-based, permanent URL** rather than a new SHA-pinned link after each iteration. Never substitute a pinned-commit preview as the default shareable link.
- Continue committing to the `development` branch. The branch-based `raw.githack.com` URL follows its current contents, subject to caching delays of minutes (potentially longer under high traffic). Do not promise instant refresh; hard refresh or revisit when cached content is stale.
- Commit SHA links may still be provided **separately** for audit, rollback, or debugging, not as the primary preview URL. Do not mistake raw.githack development preview for a production deployment.


## Site-wide Google Font

- **Approved typeface:** **Almarai** (Google Fonts) for **Arabic and English** across the entire AI Experience Lab site, effective 2026-10-31. Do not silently revert any UI, overlay, button, product mockup, RTL text, or Canvas text to Tajawal.
- The primary HTML file imports `https://fonts.googleapis.com/css2?family=Almarai:wght@300;400;700;800&display=swap` with preconnects to Google Fonts. Keep `body`, `rootFont`, explicit inline `font-family` declarations and Canvas `ft()` in sync. Use `Almarai, system-ui, sans-serif` as the fallback stack.
- Actual Google Fonts-supported weights are **300, 400, 700 and 800**. Existing CSS typography weights and UI sizes remain otherwise unchanged unless specifically requested.
- Prevent broad CSS selectors from overriding inner `.sc-interp` elements; FAQ questions/answers must retain 18px/16px. The `FAQ rendered typography QA` browser test now validates loaded Google Font faces and the computed `font-family` of actual UI text on desktop and mobile.
- Continue to verify mobile and Arabic RTL layout, wrapping, line height and vertical alignment when changing typography.

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
- AI Comment Moderation Engine (Roadmap card index 4) uses **`assets/roadmap-scenes/ai-comment-moderation-16x9.webp`** and **`assets/roadmap-scenes/ai-comment-moderation-animated-16x9.mp4`**.
- AI StoryCast (Roadmap card index 5): 16:9 **`assets/roadmap-scenes/ai-storycast-16x9.webp`** and muted 5-second loop **`assets/roadmap-scenes/ai-storycast-animated-16x9.mp4`**. Preserve the approved Lisan → AI Summarization → TTS → personalized audio scene. Video only mounts for active card when reduced motion is not requested; inactive uses still poster, no other card changes.
- AI Smart Chapters (Roadmap card index 6) must retain **`assets/roadmap-scenes/ai-smart-chapters-16x9.webp`** and **`assets/roadmap-scenes/ai-smart-chapters-animated-16x9.mp4`**, with long-video player on the left, AI segmentation in the center, and five timestamped chapter previews on the right. Maintain 16:9 and subtle 5-second active-only loop showing the chapter-selection flow; inactive cards and reduced-motion users always see the poster. Never replace with generic `chapters` canvas or modify other cards.
- AI Catch-Up / Recap (Roadmap card index 7) uses **`assets/roadmap-scenes/ai-catch-up-recap-16x9.webp`** and **`assets/roadmap-scenes/ai-catch-up-recap-animated-16x9.mp4`**. Keep the approved 16:9 paused-series → AI recap → chapter snippets concept. Mount muted 5-second animation only while selected; show still poster when inactive or reduced-motion is enabled, with side-card sizes and interactions unchanged.
- AI Emotional Voice Dubbing (Roadmap semantic item `u.v === 'dubbing'`, currently index 9) uses the approved generated **`assets/roadmap-scenes/ai-emotional-voice-dubbing-16x9.webp`** and muted five-second **`assets/roadmap-scenes/ai-emotional-voice-dubbing-animated-16x9.mp4`**. Show the still image in inactive side cards and when reduced-motion is requested; mount the animated video only for the active centered card. The visual depicts the same emotional actor performance flowing through an AI headphone character into English, Spanish, French and Arabic voice tracks. The motion emphasizes emotional speech waveform transfer, sequential multilingual audio activity, and controlled cyan-violet neon pulses. Preserve the 16:9 aspect ratio, all other cards, 3D Coverflow hit-testing and accessibility.
- Motion visibility: the active illustration wrappers have a restrained cyan-purple CSS tracking highlight (`cfRoadmapActiveShimmer`) to make animations slightly more visible. Do not apply this to inactive cards, do not increase to distracting full-frame flashes, and disable under `prefers-reduced-motion`. Maintain all prior art assets and active-only behavior. The user-approved replacement is a **simplified, near-textless neon-blue** AI moderation scene: incoming comments, central AI brain, clear approved/filtered pathways. Do not restore dense comment lists, dashboards, text columns, percentage metrics or crowded labels. Preserve 16:9 and the muted five-second subtle energy-pulse loop **only on the active card**; all inactive cards and reduced-motion users see the still poster. Do not change other Roadmap cards or slider interactions.
- AI Shop the Scene (Roadmap item with `v: 'shop'`) now uses **`assets/roadmap-scenes/ai-shop-the-scene-concept-v2-16x9.webp`** and **`assets/roadmap-scenes/ai-shop-the-scene-concept-v2-animated-16x9.mp4`**. The user-approved concept depicts an actor wearing a navy blazer, white shirt and blue-dial watch inside a video player, an AI shopping assistant, and **matching** blazer/shirt/watch product tiles, with a glowing commerce symbol. No readable micro-copy or unrelated products. Motion: soft 5-second seamless pulses of the recognition highlights, AI transfer particles and matching product tiles. Side cards and reduced-motion viewers display the poster only; **only the active centered card mounts the muted looping video**. Match by semantic `u.v === 'shop'`; do not reintroduce a fixed card index. The previous v1 scene assets remain in the repo only for rollback.
- Keep the motion overlay transparent over the original raster so all translated labels, subtitles, speaker and output panels remain crisp; honor `prefers-reduced-motion`. Ensure inactive art remains stationary.
- All Roadmap card illustration canvases use a responsive **16:9** aspect ratio on desktop, tablet, and mobile; do not reintroduce fixed pixel heights in breakpoint overrides.
- Apply a subtle directional visual fade to inactive cards: **left-side cards soften toward the right edge**, right-side cards soften toward the left edge. Use an overlay on the card rather than reducing the entire nearer card's opacity, so more distant card text does not bleed through. Active card stays unaffected.
- Avoid long dot pagination, excessive glows, aggressive rotations, forced horizontal overflow and auto-advancing on small touch screens.
- Refrain from replacing the Roadmap with a card grid or theater unless explicitly approved.
