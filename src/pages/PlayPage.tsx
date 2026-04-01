import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import ProgressBar from '../components/ProgressBar';
import { supabase } from '../lib/supabase';
import { ensureAnonymousSession } from '../lib/auth';
import { createShareId } from '../lib/share';
import { compareAnswer, getWordMatches } from '../utils/scoring';
import { disguiseText } from '../utils/chosung';

interface Puzzle {
  id: string;
  title: string | null;
  question_text: string;
  initials: string;
  answer_text: string;
}

function getResultType(score: number): string {
  if (score >= 90) return '감정 해독왕';
  if (score >= 60) return '눈치 만렙';
  return '눈치 수련생';
}

// ── 로딩 상태 ────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <Layout>
      <div className="text-center mt-24">
        <p className="text-zinc-400 text-sm">불러오는 중...</p>
      </div>
    </Layout>
  );
}

// ── 에러 상태 ────────────────────────────────────────────────
function ErrorScreen({ message }: { message: string }) {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="text-center mt-24 space-y-4">
        <p className="text-5xl">😵</p>
        <p className="text-zinc-500 text-sm">{message}</p>
        <Button onClick={() => navigate('/')}>홈으로</Button>
      </div>
    </Layout>
  );
}

// ── 메인 ─────────────────────────────────────────────────────
export default function PlayPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'submitting' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [guess, setGuess] = useState('');

  useEffect(() => {
    if (!slug) {
      setErrorMsg('잘못된 링크예요.');
      setStatus('error');
      return;
    }

    (async () => {
      try {
        await ensureAnonymousSession();

        const { data, error } = await supabase
          .from('puzzles')
          .select('id, title, question_text, initials, answer_text')
          .eq('share_slug', slug)
          .single();

        if (error || !data) {
          setErrorMsg('문제를 찾을 수 없어요.\n링크를 다시 확인해주세요!');
          setStatus('error');
          return;
        }

        setPuzzle(data as Puzzle);
        setStatus('ready');
      } catch {
        setErrorMsg('불러오기 실패. 잠시 후 다시 시도해주세요.');
        setStatus('error');
      }
    })();
  }, [slug]);

  if (status === 'loading') return <LoadingScreen />;
  if (status === 'error' || !puzzle) return <ErrorScreen message={errorMsg} />;

  const chosung = disguiseText(puzzle.question_text, 'normal');
  const liveResult = compareAnswer(puzzle.answer_text, guess);
  const wordMatches = getWordMatches(puzzle.answer_text, guess);
  const hasGuess = guess.trim().length > 0;

  async function handleSubmit() {
    if (!puzzle || !hasGuess) return;
    setStatus('submitting');

    try {
      await ensureAnonymousSession();

      const { data: { session } } = await supabase.auth.getSession();
      const solverUserId = session?.user.id;
      if (!solverUserId) throw new Error('세션 없음');

      const isCorrect = puzzle.answer_text.trim() === guess.trim();
      const score = isCorrect ? 100 : 40;
      const resultType = getResultType(score);
      const shareId = createShareId();

      const { error } = await supabase.from('submissions').insert({
        puzzle_id: puzzle.id,
        solver_user_id: solverUserId,
        submitted_text: guess,
        is_correct: isCorrect,
        score,
        result_type: resultType,
        share_id: shareId,
        is_public: true,
      });

      if (error) throw error;

      const finalResult = compareAnswer(puzzle.answer_text, guess);
      navigate(`/result/${shareId}`, {
        state: {
          original: puzzle.answer_text,
          guess,
          matchedCount: finalResult.matchedCount,
          totalCount: finalResult.totalCount,
          scorePercent: score,
          exactMatch: finalResult.exactMatch,
          shareId,
        },
      });
    } catch (err) {
      console.error('[PlayPage] 제출 실패:', err);
      setErrorMsg('제출 중 오류가 발생했어요. 다시 시도해주세요.');
      setStatus('error');
    }
  }

  return (
    <Layout>
      {/* 헤더 */}
      <div className="mb-6">
        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">마음 해독기</p>
        <h2 className="text-2xl font-black text-zinc-900">초성을 해독해봐</h2>
        {puzzle.title && (
          <p className="text-sm text-zinc-400 mt-0.5">{puzzle.title}</p>
        )}
      </div>

      {/* 초성 힌트 */}
      <div className="bg-white rounded-2xl border-2 border-zinc-200 px-5 py-5 mb-5 text-center">
        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-3">힌트 (초성)</p>
        <p className="text-2xl font-black text-zinc-900 tracking-widest leading-loose break-all">
          {chosung}
        </p>
      </div>

      {/* 답 입력 */}
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

      {/* 진행도 */}
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

      {/* 단어 chip */}
      {hasGuess && (
        <div className="bg-white rounded-2xl border border-zinc-200 px-4 py-3 mb-5">
          <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-3">단어 체크</p>
          <div className="flex flex-wrap gap-2">
            {puzzle.answer_text.split(/\s+/).map((word, i) => (
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
        disabled={!hasGuess || status === 'submitting'}
        className="w-full py-4 text-base"
      >
        {status === 'submitting' ? '저장 중...' : '결과 보기 →'}
      </Button>
    </Layout>
  );
}
