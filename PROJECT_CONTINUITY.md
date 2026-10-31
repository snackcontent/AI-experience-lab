# AI Experience Lab — Project Continuity & Handoff

> Last reconciled: 2026-10-31. This is a continuity guide, not a replacement for `AGENTS.md`. Always read `AGENTS.md` and the latest `development` before implementing. This document summarizes verified repository state and user decisions surfaced in the AI Experience Lab project conversations. It is **not** a claim that every message or image in an older private ChatGPT thread was fetched.

## 1. Source of truth and previews

- GitHub repository: `snackcontent/AI-experience-lab`, default/working branch `development`.
- Primary editable source: `AI Experience Lab.dc.html`. Related assets: `assets/roadmap-scenes/`; supporting files: `roadmap-art.js`, `i18n-ar.js`, `AGENTS.md`.
- Last **code** checkpoint before this handoff: `63f5cd4c2739778d785ee9eecada8bea133e78a7` (2026-10-31); FAQ section redesign, single-open accordion behavior, scroll-to-contact CTA.
- Immutable preview of that verified code: https://raw.githack.com/snackcontent/AI-experience-lab/63f5cd4c2739778d785ee9eecada8bea133e78a7/AI%20Experience%20Lab.dc.html#next
- **Canonical stable preview agreed on 2026-10-31:** https://raw.githack.com/snackcontent/AI-experience-lab/development/AI%20Experience%20Lab.dc.html . This follows the `development` branch and **must be the primary link in every subsequent update**; users should not have to change bookmarks after each commit. New changes can take minutes to appear (sometimes longer under high traffic) due to Githack caching. Share commit-pinned URLs only as optional audit/debug references.
- For new changes: commit on top of current `development` HEAD; verify the code and CI, and separately distinguish source commits from deployment verification. Never use an older pinned URL as an editing baseline.
- A separately open `fadaat-media.github.io/AI-experience-lab/` preview was observed. Do not assume it is synced with `snackcontent` or claim deployment to it without confirming its actual source/deploy process.
- **Railway is not the website's requested publication workflow.** Do not switch to Railway or another unrelated project.

## 2. Product / UI architecture

- Showcase includes AI capabilities and live/guided demos, AI Products/Solutions, an 18-item Roadmap, FAQ, Contact.
- Preserve current site structure, visual identity, data/content, localization, states, navigation and interactivity. Apply only requested incremental changes; no ground-up redesign or rollback.
- Preserve the Roadmap **3D Coverflow**: prominently centered active card; visibly selectable adjacent cards; touch drag/swipe; keyboard activation; accessible labels; counter, compact arrows and progress. Avoid replacing with grid.
- The permanent responsive layout contract in `AGENTS.md`: 12 columns, 24px gutters, reference column 88px, reference content 1320px; preserve `data-layout-container`, `data-layout-grid12`, `data-layout-span`, CSS variables, Arabic RTL/English LTR, focus and mobile layouts.
- Responsive checks: desktop 1440/1320/1200, tablet 1024/768, mobile 430/390/375/320, in both languages; no horizontal overflow or clipped cards. See GitHub Actions `Responsive Grid Contract`.
- Only the centered/active Roadmap card's motion runs. Inactive cards show static 16:9 posters; honor `prefers-reduced-motion`; avoid excessive animation and UI flicker. Do not regress the 3D stage hit-testing and card pointer-events rules documented in `AGENTS.md`.

## 3. Approved visual language

- Cinematic, semi-realistic high-quality compositions; navy / dark blue environments, luminous electric blue and cyan, secondary violet/magenta highlights; depth, glass/neon edges, intentional lighting.
- Every graphic should **visually communicate the feature's user value**: clear source → AI transformation → result, but avoid mechanically repeating the same central-AI-chip-and-lines composition.
- Prefer one unambiguous visual story with strong hierarchy; do not overload imagery with paragraphs, dashboards, floating data columns, long labels, percentages, or tiny unreadable text.
- Maintain a consistent family but vary the narrative, camera framing, physical devices and scene layout for each feature.
- User has rejected concepts drifting away from earlier approved work, overly busy/journal-like art, repetitive imagery, and frequent seated spectator characters.
- For Rapid Recap & Key Moments in particular: **do not include a person sitting watching**; avoid a recurring **brain icon**; use an AI/robot/symbol concept where meaningful, with the same cinematic visual quality and palette as existing approved scenes.
- Do **not** silently alter existing artwork the user has already approved; ask for the next asset/feature only when an actual choice blocks work. When a particular image reference is unavailable, use repo's approved images for style and state the limitation.

## 4. Roadmap artwork status (source-verified on development at 63f5cd4)

Roadmap indices are zero-based:
- 0 — Ask the Video: `ask-the-video-16x9.webp` + `ask-the-video-animated-16x9.mp4`.
- 1 — AI Translation & Subtitles: `ai-translation-subtitles-16x9.jpg` + active-only CSS/SVG motion overlay.
- 2 — AI Sports Analyst: `ai-sports-analyst-16x9.webp` + `ai-sports-analyst-animated-16x9.mp4`.
- 3 — AI Article-to-Shorts: `ai-article-to-shorts-16x9.webp` + `ai-article-to-shorts-animated-16x9.mp4`.
- 4 — AI Comment Moderation Engine: `ai-comment-moderation-16x9.webp` + `ai-comment-moderation-animated-16x9.mp4`. Simplified incoming → AI classification → approved/filtered branches.
- 5 — AI StoryCast: `ai-storycast-16x9.webp` + `ai-storycast-animated-16x9.mp4`. Lisan → AI Summarization → TTS → personalized news audio.
- 6 — AI Smart Chapters: `ai-smart-chapters-16x9.webp` + `ai-smart-chapters-animated-16x9.mp4`. Long-video player → segmentation → navigable chapters.
- 7 — AI Catch-Up / Recap: `ai-catch-up-recap-16x9.webp` + `ai-catch-up-recap-animated-16x9.mp4`. Previously on / recap / episode clips.
- 8 — Rapid Recap & Key Moments: named Roadmap item exists, **no custom 16:9 poster and MP4 assets are committed** at this checkpoint. Treat visual approval as unresolved.
- 9 — AI Emotional Voice Dubbing: **implemented 2026-10-31** in commit `d92c5b7f972684a12b30d9c366b8683730b41f56` using the user-approved 16:9 cinematic still `ai-emotional-voice-dubbing-16x9.webp` and the smooth five-second muted loop `ai-emotional-voice-dubbing-animated-16x9.mp4`. Semantic matching `u.v === 'dubbing'`. The active card alone mounts the video; inactive cards and `prefers-reduced-motion` see the poster.
- AI Shop the Scene (later semantic item `v:'shop'`): committed `ai-shop-the-scene-16x9.webp` + `ai-shop-the-scene-animated-16x9.mp4`; preserve semantic matching and active-only video.

All scene assets above are relative to `assets/roadmap-scenes/`. Availability of a generated picture in a private chat does not mean it is in the repository; distinguish generated vs approved vs committed vs visually tested.

## 5. FAQ latest requirement

- Match the **structure** of the user-provided screenshot, not its colors: left intro/support/contact column, right list of accordions, responsive stacking.
- Single-open FAQ accordion: choosing another item closes the previous one. The user explicitly did not want every item expanded at the same time.
- Contact Us CTA scrolls to `#o2-contact`. Preserve existing palette, Arabic RTL, keyboard interaction, and mobile wrapping.
- Implemented initially in source checkpoint `63f5cd4`; updated **2026-10-31** in `fdcefdea8a2f1f66816681ff979cc2006b3a4e3e`: FAQ now uses the **full 1320px/12-column container** (`data-layout-container` without `="8"`), with **5/7 spans, standard 24px gutter, and a completely transparent outer FAQ shell** (no large background/border/shadow). Retain subtle individual accordion card surfaces and single-open interaction.
- Typography baseline: heading 36–52px desktop / 34–42px mobile, question 18–20px, answers 16–18px, comfortable 1.5–1.7 line height. Ensure selector specificity beats general `#o2-faq>div:first-child span/p/h2` !important rules. Preserve Arabic RTL, responsive stacking at <=991.98px, and anchor link to contact.
- The `Responsive Grid Contract` GitHub Actions check passed for `fdcefdea` (run `41186322016`). Static contrast calculations against the page's dark-blue base passed WCAG AA. These checks are not a substitute for all-device browser visual verification.

## 6. Standard execution workflow for future chats

1. Read this handoff and `AGENTS.md`, then get the latest `development` HEAD and inspect current source/scene list.
2. For a requested Roadmap feature: follow the actual feature brief; create a **new 16:9 visual** consistent with approved repo references; present for approval before publishing if the user is evaluating the art.
3. Once approved or when directly asked to integrate: prepare a poster and small muted looping motion video (the established pattern is ~5 seconds); save under `assets/roadmap-scenes/`; wire the feature by **semantic key when available**, not fragile indices.
4. Make active card play video; inactive/reduced-motion show poster. Verify no other card changes, layout shifts, play failures, or carousel regression.
5. Commit incrementally on latest `development`; share a direct updated preview with full SHA. Explain exactly what was changed, what was source-verified, and what was actually runtime-tested.
6. Do not ask the user to re-explain the brand system, website, hosting, grid, carousel, or motion basics already recorded here. Avoid making unrelated changes to product, demos, FAQ, or another project.

## 7. Best next continuation

- Latest recovered design activity: refining **Rapid Recap & Key Moments** artwork against the approved cinematic language; subsequently exploring **AI Emotional Voice Dubbing** with a different composition.
- Latest repo work: FAQ structure and single-open accordion changes, now in `development`.
- The exact private older ChatGPT thread at `/c/6ae3bd45-de34-83ed-ab38-33871550d709` was not accessible directly; previously visible conversation summaries and the actual repository/history informed this handoff. Avoid claiming that unread private message attachments were inspected.
- Continue on the user's next specific request immediately; do not restart design discovery.
