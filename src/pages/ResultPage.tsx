/**
 * ResultPage.tsx  — 결과 화면
 *
 * GamePage에서 React Router의 location.state로 결과 데이터를 받아 표시.
 * URL로 직접 접근 불가 — state가 없으면 홈으로 보냄.
 *
 * 레이아웃은 스크린샷해서 공유하기 좋은 밈 카드 형태로 설계:
 *
 *   ┌──────────────────────────┐
 *   │ [어두운 헤더] 마음 해독기 │  ← 브랜드 항상 노출
 *   ├──────────────────────────┤
 *   │        42점              │  ← accent 색 큰 점수 (8xl)
 *   │  ████████░░░░  42/100자  │  ← progress bar + 글자 수
 *   ├──────────────────────────┤
 *   │  반반이네 반반치킨처럼    │  ← 밈 메시지 (가장 큰 텍스트, 2xl)
 *   ├──────────────────────────┤
 *   │ 원래 문장  나 사실 너... │  ← 정답 공개
 *   │ 내 답      나 진짜 넌... │
 *   └──────────────────────────┘
 *
 * 밈 메시지(getMemeResult)가 시각적으로 가장 중요한 요소 —
 * 스크린샷에서 제일 먼저 눈에 띄고, 공유 욕구를 자극하는 핵심.
 */

import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import ProgressBar from '../components/ProgressBar';
import { getMemeResult } from '../utils/memeResult';
import type { ResultState } from '../types';

export default function ResultPage() {
  const location = useLocation();
  const navigate  = useNavigate();
  const state = location.state as ResultState | null;

  // state 없이 직접 접근한 경우 — 홈으로 안내
  if (!state) {
    return (
      <Layout>
        <div className="text-center mt-24 space-y-4">
          <p className="text-zinc-400 text-sm">결과 데이터가 없어요.</p>
          <Button onClick={() => navigate('/')}>홈으로</Button>
        </div>
      </Layout>
    );
  }

  const { original, guess, scorePercent, matchedCount, totalCount, exactMatch } = state;
  const [shared, setShared] = useState(false);

  // 점수 구간에 따른 밈 메시지 — 공유 시 가장 먼저 읽히는 요소
  const memeMessage = getMemeResult(scorePercent);

  async function handleShareResult() {
    const text = `🧠 마음 해독기 결과\n${memeMessage}\n${scorePercent}점 (${matchedCount}/${totalCount}자)\n👉 https://mind-decoder.vercel.app`;
    if (navigator.share) {
      await navigator.share({ title: '마음 해독기 결과', text });
    } else {
      await navigator.clipboard.writeText(text);
      setShared(true);
    }
  }

  return (
    <Layout>
      {/*
        밈 카드 — 스크린샷·공유 목적으로 디자인.
        구조: 어두운 헤더 → 큰 점수 → 밈 메시지 → 정답 공개
      */}
      <div className="bg-white rounded-3xl border-2 border-zinc-200 overflow-hidden shadow-sm mb-5">

        {/* ── 헤더 ─────────────────────────────────────────────── */}
        <div className="bg-zinc-900 px-5 py-3 flex items-center justify-between">
          <span className="text-white font-black text-sm tracking-wide">마음 해독기</span>
          {/* "완벽 해독" 뱃지는 100% 완전 일치일 때만 표시 */}
          {exactMatch && (
            <span className="bg-accent text-zinc-900 text-xs font-black px-2 py-0.5 rounded-full">
              완벽 해독
            </span>
          )}
        </div>

        {/* ── 점수 ─────────────────────────────────────────────── */}
        {/* accent 색 점수가 시선이 처음 닿는 곳 */}
        <div className="px-5 pt-8 pb-6 text-center border-b border-zinc-100">
          <p className="text-8xl font-black text-accent tabular-nums leading-none">
            {scorePercent}
            <span className="text-4xl text-zinc-900 font-black">점</span>
          </p>
          <div className="mt-5 mb-3">
            <ProgressBar score={scorePercent} />
          </div>
          <p className="text-xs text-zinc-400">{totalCount}자 중 {matchedCount}자 맞춤</p>
        </div>

        {/* ── 밈 메시지 ────────────────────────────────────────── */}
        {/* 가장 큰 텍스트 — 스크린샷의 훅(hook).
            getMemeResult()가 점수 구간별로 다른 문구를 반환. */}
        <div className="px-5 py-8 text-center border-b border-zinc-100">
          <p className="text-2xl font-black text-zinc-900 leading-snug">
            {memeMessage}
          </p>
        </div>

        {/* ── 정답 공개 ────────────────────────────────────────── */}
        {/* 원래 문장과 사용자가 입력한 답을 나란히 보여줌 */}
        <div className="px-5 py-5 space-y-4">
          <div>
            <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">원래 문장</p>
            <p className="text-sm font-bold text-zinc-800 leading-relaxed">{original}</p>
          </div>
          <div>
            <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">내 답</p>
            <p className="text-sm text-zinc-500 leading-relaxed">{guess || '(입력 없음)'}</p>
          </div>
        </div>
      </div>

      {/* CTA — 바이럴 루프: 결과를 본 사람이 자기도 만들고 싶게 유도 */}
      <div className="space-y-3">
        <Button onClick={handleShareResult} className="w-full py-4 text-base">
          {shared ? '✅ 복사됐어요!' : '📤 결과 공유하기'}
        </Button>
        <Button onClick={() => navigate('/create')} className="w-full py-4 text-base">
          나도 만들기 →
        </Button>
        <Button onClick={() => navigate('/')} variant="secondary" className="w-full py-3 text-sm">
          홈으로
        </Button>
      </div>
    </Layout>
  );
}
