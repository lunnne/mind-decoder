# Mind Decoder UX Flow

## 1. Page List (페이지 목록)

MVP에는 3개의 화면만 필요:

| Screen | URL State | Description |
|--------|-----------|-------------|
| **Encoder** (인코더) | `/?mode=encode` | Sender가 메시지를 입력하고 초성 게임 링크를 생성하는 화면. |
| **Decoder** (디코더) | `/?mode=decode&game=<encoded>` | Receiver가 초성 힌트를 보고 단어를 맞추는 화면. |
| **Result** (결과) | `/?mode=result&game=<encoded>&score=<percent>` | 게임 완료 후 점수와 공유 버튼을 보여주는 화면. |

**라우팅 방식**: URL search params로 화면 분기. 라우터 라이브러리 불필요. App.tsx에서 단순 조건부 렌더링.

---

## 2. Component List per Page (페이지별 컴포넌트)

### Encoder (인코더 페이지)

| Component | 설명 |
|-----------|------|
| `<MessageInput />` | 사용자가 한국어 메시지를 입력하는 텍스트 영역. |
| `<HintPreview />` | 입력한 메시지의 초성 변환 결과를 실시간으로 표시. |
| `<ShareButton />` | 게임 링크 생성 및 복사 버튼. |

### Decoder (디코더 페이지)

| Component | 설명 |
|-----------|------|
| `<HintDisplay />` | 초성-만 표시된 메시지와 입력 칸 목록. |
| `<GuessInput />` | 각 단어마다 하나의 입력 필드. |
| `<ProgressBar />` | 맞춘 단어 개수 / 전체 단어 개수로 진행도 표시. |
| `<HintButton />` | (Optional MVP+) 첫 글자만 공개하는 힌트 버튼. |

### Result (결과 페이지)

| Component | 설명 |
|-----------|------|
| `<ScoreDisplay />` | 맞춘 단어 개수, 정답률 % 표시. |
| `<MemeImage />` | 정답률에 따른 이모지/밈 이미지. |
| `<ShareButtons />` | SNS 공유 및 링크 복사 버튼. |
| `<PlayAgainButton />` | 새 게임 시작 버튼. |

---

## 3. State Flow (상태 흐름)

### App-level State (App.tsx에서 관리)

```
- mode: 'encode' | 'decode' | 'result'
  └ URL search param에서 읽음. setState 호출 시 URL 업데이트.

- gameData: { originalMessage: string, chosung: string }
  └ Encoder에서 생성 후 URL encoded로 저장.
  └ Decoder/Result에서 URL에서 파싱.

- guesses: Record<wordIndex, userGuess>
  └ Decoder에서 관리. 각 단어 입력 필드마다 추적.

- progress: { correct: number, total: number }
  └ guesses 기반으로 실시간 계산. useEffect에서 추적.

- score: number (0~100)
  └ Decoder에서 모든 단어가 맞춰지면 계산. Result 화면에 전달.
```

### Component-level State (최소한만 사용)

```
MessageInput
├─ inputValue: string (입력 중인 메시지)
└─ (onChange → HintPreview에 전달)

GuessInput (per word)
├─ value: string (입력 중인 추측)
└─ (onChange → App.guesses 업데이트)
```

### State Mutation Flow

```
Encoder:
  1. User types message → MessageInput.inputValue 업데이트
  2. onChange → HintPreview가 초성 변환해서 표시
  3. User clicks ShareButton → gameData 생성 → URL 업데이트 → mode='decode'

Decoder:
  1. URL에서 gameData 파싱 → HintDisplay 표시
  2. User types guess → GuessInput.onChange → App.guesses 업데이트
  3. App.useEffect → 진행도 계산 → score 계산
  4. score === 100 → mode='result'

Result:
  1. URL에서 score 읽음 → ScoreDisplay + MemeImage 표시
  2. User clicks PlayAgainButton → mode='encode' + gameData 초기화
```

---

## 4. Folder Structure (폴더 구조)

```
src/
├── components/
│   ├── Encoder.tsx           # 인코더 페이지 컨테이너
│   ├── MessageInput.tsx
│   ├── HintPreview.tsx
│   ├── ShareButton.tsx
│   ├── Decoder.tsx           # 디코더 페이지 컨테이너
│   ├── HintDisplay.tsx
│   ├── GuessInput.tsx
│   ├── ProgressBar.tsx
│   ├── Result.tsx            # 결과 페이지 컨테이너
│   ├── ScoreDisplay.tsx
│   ├── MemeImage.tsx
│   └── ShareButtons.tsx
├── utils/
│   ├── chosung.ts            # 한글 → 초성 변환
│   ├── urlState.ts           # URL search param 읽기/쓰기
│   ├── scoring.ts            # 정답률 계산 로직
│   └── normalize.ts          # 입력값 정규화 (trim, 공백 통합 등)
├── types.ts                  # 공유 타입 정의
├── App.tsx                   # 메인 앱 + 상태 관리
├── main.tsx
└── index.css
```

**설계 원칙:**
- `components/` 폴더에는 각 컴포넌트 1파일 = 1컴포넌트
- 페이지 컨테이너 (`Encoder.tsx`, `Decoder.tsx`, `Result.tsx`)만 상위 상태 접근
- 공유 로직은 `utils/`에 순수 함수로 분리
- Context/Redux 없음 — App.tsx의 props drilling으로 충분

---

## 5. Progress Calculation (진행도 계산 방법)

### 단어 분할 (Word Tokenization)

원본 메시지를 **공백 기준**으로 분할. 각 단어 = 1개의 추측 대상.

```
originalMessage: "안녕하세요 반갑습니다"
words: ["안녕하세요", "반갑습니다"]  // 2 words
```

### 정답 판정 (Matching Logic)

User guess가 정답이려면:

1. **대소문자 무시** (Case-insensitive)
2. **양쪽 공백 제거** (trim)
3. **정확히 일치** (case-insensitive comparison)
4. **한글 이형문자 정규화** (초성/종성 오타 등은 MVP에서 무시)

```typescript
// 예시
originalWord: "안녕하세요"
userGuess: "  안녕하세요  " → 정답 (공백 제거 후 일치)
userGuess: "안녕하세요." → 오답 (마침표 제거 안 함)
userGuess: "안녕하세요다" → 오답 (길이 다름)
```

### 진행도 계산 (Progress %)

```
correctCount = guesses 중 정답으로 판정된 개수
totalCount = originalMessage의 단어 개수

progress = (correctCount / totalCount) * 100

예:
  originalMessage: "안녕하세요 반갑습니다" (2 words)
  guesses: { 0: "안녕하세요", 1: "" } (1개 정답)
  progress = (1 / 2) * 100 = 50%
```

### 결과 화면 트리거

```
모든 단어가 정답으로 판정되면 (progress === 100):
  1. score = 100 계산
  2. URL에 score 추가 → mode='result'로 변경
  3. Result 페이지 렌더링
```

### 부분 정답 처리 (MVP)

- **점수 체계:** 모든 단어를 정답해야만 100% 완료.
- **부분 점수 없음:** 5개 단어 중 3개 맞춰도 60%로 표시하지만, Result 화면은 모두 정답해야만 진입 가능.
  - (또는 부분 정답 허용하고 점수 표시 가능 — 디자인 의사결정 필요)

---

## Appendix: URL State Format

### Encoder

```
/?mode=encode
```

### Decoder

```
/?mode=decode&game=<base64_or_urlencoded_json>
```

game 파라미터 구조:
```json
{
  "originalMessage": "안녕하세요 반갑습니다",
  "chosung": "ㅇㄴㅎㅅ ㅂㄱㅅ"
}
```

### Result

```
/?mode=result&game=<base64_or_urlencoded_json>&score=100
```

score: 0~100 정수.
