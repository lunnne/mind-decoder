# Mind Decoder — Product Brief

**Product:** Korean viral web tool for sending hidden messages as consonant-only hints (초성).
**Tone:** Silly, meme-like, absurd, cute. Very Korean internet.
**Stack:** React 19 + TypeScript + Vite + Tailwind CSS. Frontend-only. No backend.
**Target:** Korean couples, friend groups, anyone who likes playful guessing games.

---

## 1. Core User Loop

The full interaction is two-sided and share-driven.

**Sender side**
1. Sender opens the app and types a Korean message (e.g. `나 사실 너 좋아해`)
2. App converts key words into 초성-only hints (e.g. `나 사실 너 ㅈㅇㅎ`)
3. Sender copies a shareable link and sends it to the receiver (KakaoTalk, DM, etc.)

**Receiver side**
4. Receiver opens the link and sees the 초성-masked message
5. Receiver types their guess word-by-word into an input field
6. Progress bar fills as correct words are matched
7. On full decode: a meme-style result screen fires — funny reaction image + text (e.g. `ㅋㅋㅋ 다 맞혔어 천재냐`)
8. Receiver can share their result or challenge back

**Value exchange:** Sender gets a cute, low-stakes way to say something. Receiver gets a fun guessing game. Both get a shareable moment.

---

## 2. MVP Features

Only what is needed to make the loop above playable end-to-end.

- **Compose screen** — single textarea for the sender's message, submit button
- **초성 converter** — pure function: takes Korean string, returns masked string where content words are reduced to 초성 (e.g. `좋아해` → `ㅈㅇㅎ`)
- **Shareable URL** — message state encoded in the URL hash or query param (no backend, no DB)
- **Decode screen** — shows masked message, word-by-word input, live match feedback
- **Progress indicator** — simple bar or counter showing X/N words decoded
- **Result screen** — fires on 100% decode; shows one meme reaction (image + short Korean copy)
- **Copy link button** — one tap to copy the shareable URL on compose screen

That is the full MVP. Seven pieces.

---

## 3. Non-Goals

Cut ruthlessly. These are explicitly out of scope for MVP.

| What | Why it's cut |
|---|---|
| Login / accounts | No persistence needed; link sharing is enough |
| Backend / database | URL encoding handles state; zero infra cost |
| AI-generated hints or analysis | Adds complexity, not core to the loop |
| Multiple game modes | One mode first, validate fun before expanding |
| English version | Korean-first; internationalization is a distraction |
| Custom meme uploads | Ship one hardcoded meme, iterate later |
| Comments or reactions | Not needed to validate the core loop |
| SEO blog / landing page | Ship the tool first |
| Admin dashboard | No backend means nothing to admin |
| Hint difficulty settings | Default behavior only for MVP |

---

## 4. Biggest Risks

**Risk 1 — 초성 converter edge cases break the experience**
Korean has irregular compound vowels, syllable blocks with no initial consonant (e.g. `아`), and mixed Hangul/ASCII text. If the converter produces unreadable or wrong hints, the game is unplayable.
- Mitigation: Write the converter first with a unit test suite covering edge cases before touching UI.

**Risk 2 — URL-encoded state hits length limits or breaks on share**
KakaoTalk and SMS preview URLs. If the encoded message is too long or the URL gets truncated, the receiver gets a broken link.
- Mitigation: Test with a 200-character Korean message immediately. If too long, switch to base64 compression (LZString is tiny and dependency-free).

**Risk 3 — The guessing mechanic is frustrating, not fun**
If matching is too strict (exact character match only), users will rage-quit. If too loose, it's trivial and not satisfying. Wrong difficulty = no virality.
- Mitigation: Implement word-level matching first (not character-level). Do a 5-person playtest with friends before any polish work.

---

## 5. Suggested Next Implementation Step

**Build the 초성 converter function first.**

File: `mind-decoder/src/utils/choseong.ts`

Write and export a single pure function:

```ts
export function maskToChoseong(text: string): string
```

It should:
- Walk each Korean syllable block (Unicode range `AC00–D7A3`)
- Extract the initial consonant (초성) using `Math.floor((code - 0xAC00) / 28 / 21)`
- Return non-Korean characters unchanged
- Leave particles and short connectors (은/는/이/가/을/를/의) unmasked so the sentence stays readable

This is the irreducible core of the product. Everything else — UI, sharing, scoring — wraps around this function. Get it right and tested first, then build the compose screen on top of it.

Suggested test cases to cover before moving on:
- `좋아해` → `ㅈㅇㅎ`
- `나 사실 너 좋아해` → `나 사실 너 ㅈㅇㅎ`
- `hello 안녕` → `hello ㅇㄴ`
- Empty string → empty string
- String with only particles → unchanged
