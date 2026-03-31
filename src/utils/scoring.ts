import type { CompareResult } from '../types';

// Examples:
//   compareAnswer('안녕하세요', '안녕하세요') → { matchedCount: 5, totalCount: 5, scorePercent: 100, exactMatch: true }
//   compareAnswer('나 좋아해', '나 싫어해')   → { matchedCount: 2, totalCount: 4, scorePercent: 50,  exactMatch: false }
//   compareAnswer('안녕', '')               → { matchedCount: 0, totalCount: 2, scorePercent: 0,   exactMatch: false }
//   compareAnswer('hi 안녕', 'hi 안녕')     → { matchedCount: 4, totalCount: 4, scorePercent: 100, exactMatch: true }
//   compareAnswer('', '')                  → { matchedCount: 0, totalCount: 0, scorePercent: 0,   exactMatch: false }

/** Compares original and guess character by character, ignoring spaces.
 *  `totalCount` is anchored to the original's non-space length.
 *  Extra characters in the guess beyond original's length are not penalised,
 *  but they do prevent `exactMatch` from being true.
 */
export function compareAnswer(originalText: string, guessText: string): CompareResult {
  const original = originalText.replace(/ /g, '');
  const guess    = guessText.replace(/ /g, '');

  const totalCount = original.length;

  let matchedCount = 0;
  for (let i = 0; i < totalCount; i++) {
    if (original[i] === guess[i]) matchedCount++;
  }

  const scorePercent = totalCount === 0
    ? 0
    : Math.round((matchedCount / totalCount) * 100);

  // Exact only when every character matches and no extra characters were typed
  const exactMatch = totalCount > 0 && original === guess;

  return { matchedCount, totalCount, scorePercent, exactMatch };
}

/** Returns a boolean per word in original indicating whether the user has
 *  already typed that word correctly. Used for the live word-chip UI in GamePage.
 */
export function getWordMatches(original: string, guess: string): boolean[] {
  const originalWords = original.trim().split(/\s+/);
  const guessWords    = guess.trim().split(/\s+/);
  return originalWords.map((word, i) => word === (guessWords[i] ?? ''));
}
