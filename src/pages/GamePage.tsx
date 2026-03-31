/**
 * GamePage.tsx  — "초성을 해독해봐"
 *
 * 링크를 받은 사람(recipient) 쪽 화면. 접근 경로:
 *   /game?d=<base64로 인코딩된 게임 데이터>
 *
 * 주요 동작:
 * • mount 시 URL param을 디코딩 — 링크가 잘못됐으면 에러 화면을 보여줌.
 * • 초성 힌트를 화면 상단에 크게 표시.
 * • 사용자가 답을 입력하는 동안:
 *     - compareAnswer()로 진행도(progress bar)를 실시간 업데이트
 *     - 단어별 chip이 나타나 맞은 단어(✓)와 아닌 것(?)을 표시
 * • "결과 보기" → ResultPage로 이동하면서 최종 결과를 router state로 전달.
 *   (결과는 URL이 아닌 state로 넘김 — 직접 링크 불가, 일회성 화면)
 */

import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import ProgressBar from '../components/ProgressBar';
import { decodeGameData } from '../utils/encoding';
import { disguiseText } from '../utils/chosung';
import { compareAnswer, getWordMatches } from '../utils/scoring';
import { loadGame } from '../lib/supabase';
import type { ResultState } from '../types';

export default function GamePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [guess, setGuess] = useState('');
  const [original, setOriginal] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ?id= (Supabase) 우선, 없으면 ?d= (base64 fallback) 시도
  useEffect(() => {
    const id = searchParams.get('id');
    const encoded = searchParams.get('d');

    if (id) {
      loadGame(id).then(text => {
        setOriginal(text);
        setIsLoading(false);
      });
    } else if (encoded) {
      const data = decodeGameData(encoded);
      setOriginal(data?.original ?? null);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  // 로딩 중
  if (isLoading) {
    return (
      <Layout>
        <div className="text-center mt-24">
          <p className="text-zinc-400 text-sm">불러오는 중...</p>
        </div>
      </Layout>
    );
  }

  // 링크 없음 or 깨진 링크 → 에러 화면
  if (!original) {
    return (
      <Layout>
        <div className="text-center mt-24 space-y-4">
          <p className="text-5xl">😵</p>
          <p className="text-zinc-500 text-sm">링크가 잘못됐어요.<br />다시 확인해주세요!</p>
          <Button onClick={() => navigate('/')}>홈으로</Button>
        </div>
      </Layout>
    );
  }

  // 상대방에게 보여줄 힌트 — normal 모드: 각 단어 마지막 1글자 노출
  const chosung = disguiseText(original!, 'normal');

  // 실시간 채점: textarea에 입력할 때마다 재계산됨
  const liveResult = compareAnswer(original!, guess);
  const wordMatches = getWordMatches(original!, guess);
  const hasGuess = guess.trim().length > 0;

  // 최종 결과를 router state에 담아 ResultPage로 이동 — 서버 호출 없음
  function handleSubmit() {
    const result = compareAnswer(original!, guess);
    const state: ResultState = { original: original!, guess, ...result };
    navigate('/result', { state });
  }

  return (
    <Layout>
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">마음 해독기</p>
        <h2 className="text-2xl font-black text-zinc-900">초성을 해독해봐</h2>
        <p className="text-sm text-zinc-400 mt-0.5">숨겨진 문장을 맞춰보세요</p>
      </div>

      {/* 초성 힌트 — 이 페이지에서 가장 중요한 요소 */}
      <div className="bg-white rounded-2xl border-2 border-zinc-200 px-5 py-5 mb-5 text-center">
        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-3">힌트 (초성)</p>
        <p className="text-2xl font-black text-zinc-900 tracking-widest leading-loose break-all">
          {chosung}
        </p>
      </div>

      {/* 자유 입력 답안 */}
      <div className="mb-4">
        <label className="text-xs font-bold tracking-widest text-zinc-400 uppercase block mb-2">
          내 답
        </label>
        <TextInput
          value={guess}
          onChange={setGuess}
          placeholder="원래 문장을 입력해봐..."
          rows={3}
        />
      </div>

      {/* 진행도 — 항상 표시, 입력 전엔 0%에서 시작 */}
      <div className="bg-white rounded-2xl border border-zinc-200 px-4 py-3 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">진행도</span>
          <span className="text-sm font-black text-zinc-900 tabular-nums">
            {liveResult.scorePercent}%
          </span>
        </div>
        <ProgressBar score={liveResult.scorePercent} />
        {hasGuess && (
          <p className="text-xs text-zinc-400 mt-2 text-right">
            {liveResult.totalCount}자 중 {liveResult.matchedCount}자 맞음
          </p>
        )}
      </div>

      {/* 단어 chip — 입력을 시작하면 나타남.
          accent(초록) = 해당 단어 정확히 맞춤, 회색 = 아직 틀림 */}
      {hasGuess && (
        <div className="bg-white rounded-2xl border border-zinc-200 px-4 py-3 mb-5">
          <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-3">단어 체크</p>
          <div className="flex flex-wrap gap-2">
            {original!.split(/\s+/).map((word, i) => (
              <span
                key={i}
                className={`px-3 py-1 rounded-full text-sm font-bold transition-colors duration-200 ${
                  wordMatches[i]
                    ? 'bg-accent text-zinc-900'
                    : 'bg-zinc-100 text-zinc-400'
                }`}
              >
                {wordMatches[i] ? `✓ ${word}` : '?'}
              </span>
            ))}
          </div>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        disabled={!hasGuess}
        className="w-full py-4 text-base"
      >
        결과 보기 →
      </Button>
    </Layout>
  );
}
