/**
 * encoding.ts
 *
 * 게임 데이터를 URL-safe 문자열로 변환/복원하는 유틸.
 * 덕분에 게임 전체가 공유 링크 하나에 담김 — 서버 불필요.
 *
 * 인코딩 순서:
 *   원본 문자열
 *     → JSON.stringify  ({ original } 객체로 감쌈)
 *     → encodeURIComponent  (유니코드·특수문자 이스케이프)
 *     → btoa  (base64 → URL-safe ASCII)
 *
 * 디코딩은 정확히 역순. 실패 시 null 반환 → 호출부에서 "잘못된 링크" 화면 표시.
 *
 * 예시:
 *   encodeGameData('나 좋아해')  → 'eyJvcmlnaW5hbCI6...'
 *   decodeGameData('eyJvcmlnaW5hbCI6...') → { original: '나 좋아해' }
 */

import type { GameData } from '../types';

export function encodeGameData(original: string): string {
  const data: GameData = { original };
  return btoa(encodeURIComponent(JSON.stringify(data)));
}

export function decodeGameData(encoded: string): GameData | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    // 링크가 깨진 경우 — 호출부에서 에러 화면을 보여줌
    return null;
  }
}
