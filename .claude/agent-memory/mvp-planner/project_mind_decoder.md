---
name: mind-decoder project context
description: Core product decisions, scope, and risks for the Mind Decoder Korean viral web tool
type: project
---

Mind Decoder is a two-sided Korean viral web tool where a sender writes a message, the system masks key words as 초성-only hints, and a receiver guesses the original words via a shared URL.

**Core loop:** Compose -> 초성 mask -> share link -> decode -> meme result screen

**MVP scope (7 pieces):** Compose screen, 초성 converter function, URL-encoded state sharing (no backend), decode screen, word-level progress indicator, meme result screen, copy link button.

**Why:** Validate that the guessing mechanic is fun and shareable before adding any infra or complexity.

**Cut for later:** login, accounts, backend/DB, AI hints, multiple game modes, English version, custom meme uploads, comments, SEO, admin dashboard.

**Top risks:**
1. 초성 converter edge cases (irregular syllables, mixed ASCII/Hangul) — validate with unit tests first
2. URL length limits breaking share links on KakaoTalk/SMS — test with 200-char messages, fallback to LZString
3. Guessing mechanic frustration vs. fun calibration — use word-level matching (not character-level), playtest with 5 people before polish

**First implementation step:** `mind-decoder/src/utils/choseong.ts` — pure `maskToChoseong(text: string): string` function. Everything else wraps around this.

**How to apply:** Always suggest 초성 converter as the foundation. Resist adding UI polish or sharing logic until the converter is tested. Keep matching logic at word-level granularity.
