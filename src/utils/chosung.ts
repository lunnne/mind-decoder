// 한글 음절 블록 범위: 가 (0xAC00) – 힣 (0xD7A3)
// 인코딩 공식: 0xAC00 + (초성 × 21 + 중성) × 28 + 종성
// 초성 index = Math.floor((code - 0xAC00) / (21 × 28))
//
// 예시:
//   toChosung('안녕하세요')  → 'ㅇㄴㅎㅅㅇ'
//   toChosung('나 좋아해')   → 'ㄴ ㅈㅇㅎ'   (공백 유지)
//   toChosung('hello 안녕') → 'hello ㅇㄴ'  (비한글 문자 그대로)
//   toChosung('ㄱㄴㄷ')     → 'ㄱㄴㄷ'       (낱자 그대로)
//   toChosung('')           → ''

const CHOSUNG: readonly string[] = [
  'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ',
  'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const HANGUL_START = 0xAC00;
const HANGUL_END   = 0xD7A3;
const BLOCK_SIZE   = 21 * 28; // 중성 수 × 종성 수

// easy 모드에서 tailLen을 3으로 올려 어미 앞 글자까지 노출할 2글자 어미 목록
const TWO_CHAR_ENDINGS = ['했어', '싶어', '거야', '이야', '이어'];

function isHangul(char: string): boolean {
  const code = char.charCodeAt(0);
  return code >= HANGUL_START && code <= HANGUL_END;
}

function extractChosung(char: string): string {
  const code = char.charCodeAt(0);
  if (code < HANGUL_START || code > HANGUL_END) return char;
  return CHOSUNG[Math.floor((code - HANGUL_START) / BLOCK_SIZE)];
}

/** 텍스트 전체를 초성으로 변환. 공백·숫자·영문·부호는 그대로 유지. */
export function toChosung(text: string): string {
  return text.split('').map(extractChosung).join('');
}

/** 한글 음절 개수를 반환 (공백·비한글 제외). */
function countHangul(token: string): number {
  return [...token].filter(isHangul).length;
}

/**
 * 토큰(공백 없는 단어)에서 끝 `tailLen`개의 한글 음절만 원문으로 유지하고
 * 나머지는 초성으로 변환. 비한글 문자는 항상 그대로.
 *
 * disguiseToken('귀엽냐', 1) → 'ㄱㅇ냐'
 * disguiseToken('귀엽냐', 2) → 'ㄱ엽냐'
 * disguiseToken('이렇게', 2) → 'ㅇ렇게'
 */
function disguiseToken(token: string, tailLen: number): string {
  const chars = [...token];
  const total = chars.filter(isHangul).length;
  if (total === 0) return token;

  let seen = 0;
  return chars.map(c => {
    if (isHangul(c)) {
      seen++;
      return seen > total - tailLen ? c : extractChosung(c);
    }
    return c;
  }).join('');
}

/**
 * easy 모드에서 토큰의 tailLen을 결정.
 * 기본 2, 단 2글자 어미로 끝나는 경우 3으로 올려 어미 앞 맥락 1글자도 노출.
 */
function easyTailLen(token: string): number {
  if (TWO_CHAR_ENDINGS.some(e => token.endsWith(e))) return 3;
  return 2;
}

/**
 * disguiseText — 난이도별 힌트 노출 함수
 *
 * ─────────────────────────────────────────────────────────────
 * hard
 *   전체 초성 변환. 힌트 없음.
 *   "너 오늘 왜 이렇게 귀엽냐"  → "ㄴ ㅇㄴ ㅇ ㅇㄹㄱ ㄱㅇㄴ"
 *   "보고 싶었어"               → "ㅂㄱ ㅅㅇㅇ"
 *
 * ─────────────────────────────────────────────────────────────
 * normal  (기본값)
 *   기본은 전체 초성. 단, 아래 조건을 동시에 만족하는 단어에만 끝 1글자 노출:
 *     • 한글 음절 3개 이상인 단어
 *     • 문장 전체에서 최대 2개 단어까지만 허용 (첫 번째, 두 번째 후보 순)
 *   → 1글자·2글자 단어는 절대 노출 안 함
 *   → 긴 문장이라도 힌트는 최대 2개
 *
 *   "나 사실 방구 꼈어 근데 나 지금"
 *     → "ㄴ ㅅㅅ ㅂㄱ ㄲㅇ ㄱㄷ ㄴ ㅈㄱ"  (3글자 이상 단어 없음 → 전부 초성)
 *   "너 오늘 왜 이렇게 귀엽냐"
 *     → "ㄴ ㅇㄴ ㅇ ㅇㄹ게 ㄱㅇ냐"        (이렇게·귀엽냐 각 끝 1글자 노출)
 *   "보고 싶었어"
 *     → "ㅂㄱ ㅅㅇ어"                     (싶었어 끝 1글자 노출)
 *
 * ─────────────────────────────────────────────────────────────
 * easy
 *   모든 단어의 끝 2글자 노출.
 *   2글자 어미(했어/싶어/거야 등)로 끝나는 단어는 끝 3글자 노출.
 *   → 1글자·2글자 단어는 사실상 전부 노출됨
 *
 *   "나 사실 방구 꼈어 근데 나 지금"
 *     → "나 사실 방구 꼈어 근데 나 지금"   (모두 2글자 이하 → 전부 노출)
 *   "너 오늘 왜 이렇게 귀엽냐"
 *     → "너 오늘 왜 ㅇ렇게 ㄱ엽냐"
 *   "보고 싶었어"
 *     → "보고 ㅅ었어"
 */
export function disguiseText(text: string, mode: 'hard' | 'normal' | 'easy' = 'normal'): string {
  if (mode === 'hard') return toChosung(text);

  const tokens = text.split(' ');

  if (mode === 'normal') {
    // 힌트 후보: 한글 3글자 이상인 단어. 앞에서부터 최대 2개만 선정.
    const hintIndices = new Set<number>();
    for (let i = 0; i < tokens.length; i++) {
      if (countHangul(tokens[i]) >= 3) {
        hintIndices.add(i);
        if (hintIndices.size >= 2) break;
      }
    }

    return tokens
      .map((token, i) =>
        hintIndices.has(i)
          ? disguiseToken(token, 1)  // 후보 단어: 끝 1글자만 노출
          : toChosung(token)         // 나머지: 전부 초성
      )
      .join(' ');
  }

  // easy: 모든 단어에 끝 2글자 노출 (2글자 어미는 끝 3글자)
  return tokens
    .map(token => disguiseToken(token, easyTailLen(token)))
    .join(' ');
}
