# mind-decoder

## 프로젝트 개요
React + TypeScript + Vite 기반의 프론트엔드 프로젝트.

## 디렉토리 구조
```
mind-decoder/           # 루트
├── CLAUDE.md
├── docs/               # 문서
└── mind-decoder/       # 메인 앱
    ├── src/
    │   ├── App.tsx
    │   ├── App.css
    │   ├── main.tsx
    │   └── assets/
    ├── public/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    └── tsconfig.json
```

## 개발 명령어
```bash
cd mind-decoder
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run lint     # ESLint 실행
npm run preview  # 빌드 미리보기
```

## 기술 스택
- React 19
- TypeScript 5.9
- Vite 8
- ESLint

# Project: Mind Decoder

## Product Summary
A Korean viral web tool.
One user writes a long inner message.
The system converts important Korean words into consonant-only hints.
Another user tries to decode the message by typing the original text.

## Product Tone
- silly
- meme-like
- absurd
- cute
- very Korean internet vibe

## Target Users
- Korean users first
- couples
- friends
- people who like playful guessing games

## MVP Goal
Build the smallest playable version in 1-2 days.

## MVP Features
- User enters a long Korean sentence
- The system converts core words into Korean consonant hints
- The message is shareable by link
- The receiver types guesses
- Progress increases as correct parts are decoded
- Final result shows funny meme-style feedback

## Non-Goals For Now
- login
- accounts
- comments
- AI-generated analysis
- multiple game modes
- English version
- SEO blog
- admin dashboard

## Tech Direction
- React
- TypeScript
- Vite
- Tailwind CSS
- keep it frontend-first
- keep implementation simple

## Working Rules
- Always propose the smallest shippable version first
- Avoid over-engineering
- Before changing many files, make a short plan
- Prefer simple folder structure
- Keep UI pink, rounded, cute, and meme-like
- Write short Korean microcopy when needed