export interface GameData {
  original: string;
}

export interface CompareResult {
  matchedCount: number;
  totalCount: number;
  scorePercent: number;  // 0–100, rounded to nearest integer
  exactMatch: boolean;
}

// Passed via React Router location.state from GamePage / PlayPage → ResultPage
export interface ResultState {
  original: string;
  guess: string;
  matchedCount: number;
  totalCount: number;
  scorePercent: number;
  exactMatch: boolean;
  shareId?: string;   // PlayPage 경유 시 공유 URL 생성에 사용
}
