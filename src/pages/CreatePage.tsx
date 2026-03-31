/**
 * CreatePage.tsx  — "속마음 적기"
 *
 * 메시지를 보내는 사람(sender) 쪽 화면. 두 가지 UI state가 있음:
 *
 * STATE 1 — 작성  (shareUrl이 비어있을 때)
 *   비밀 메시지를 입력.
 *   입력하는 동안 상대방에게 보일 초성 힌트가 실시간으로 미리보기됨.
 *   "링크 만들기" → 메시지를 URL query param으로 인코딩 (서버 불필요).
 *
 * STATE 2 — 공유  (shareUrl이 생성된 후)
 *   완성된 링크와 두 가지 CTA를 표시:
 *   • 공유하기 — 모바일에서 네이티브 공유 시트, 아니면 clipboard fallback
 *   • 링크 복사하기 — 명시적 clipboard 복사 + 시각적 피드백
 *   "새 메시지 만들기" → STATE 1으로 리셋.
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { disguiseText } from '../utils/chosung';
import { encodeGameData } from '../utils/encoding';
import { handleShare, copyLink } from '../utils/share';
import { saveGame } from '../lib/supabase';

// 입력창 placeholder — 마운트마다 랜덤으로 하나 선택
const PLACEHOLDER_EXAMPLES = [
  '나 오늘 버스에서 방구 꼈는데 아무도 몰랐어',
  '나 사실 고양이한테 질투 느낀 적 있어',
  '편의점 알바가 잘생겨서 오늘 세 번 갔어',
  '엄마 몰래 라면 끓여 먹다가 냄비 태워버렸어',
  '내가 좋아하는 유튜버가 팔로우 했다가 바로 풀었어',
  '친구한테 빌려간 돈 3년을 못 갚았어',
  '화장실 다녀온 후 손 안 씻고 밥 먹었어',
  '어제 뭔가 그럴싸하게 말했는데 알고 보니 개소리였어',
  '선생님한테 질문했다가 이미 설명한 거라고 눈치 받았어',
  '내 연락처 이름이 뭔가 이상하게 저장된 것 같아',
  '배고파서 엄마 밥통에 손 댔다가 혼났어',
  '너 사진 올렸는데 내가 몇 초 만에 좋아요 눌렀어',
  '시험 시간에 화장실 가고 싶어서 한 시간 동안 참았어',
  '엘리베이터에서 이상한 소리 냈는데 옆에 사람 있었어',
  '카톡 맞춤법 틀렸는데 지우기 못 찾아서 12시간 그대로 뒀어',
  '치킨 먹으면서 기름 묻은 손으로 휴대폰 들었어',
  '어제 꿈에서 너랑 싸웠는데 깨어나서도 짜증났어',
  '너 그 얘기 했을 때 웃었는데 사실 멍했어',
  '나 사실 너 없으면 엄청 심심해',
  '우리 엄마가 하던 말들을 이제 내가 하고 있어',
  '핸드폰 닦으려고 바지에 문질렀어',
  '유튜브 보다가 갑자기 무서운 장면 나와서 밥 흘렸어',
  '너는 모르겠지만 내가 너 생각을 왜 이렇게 자주 하는지 모르겠어',
  '계단에서 발 헛디뎠는데 다행히 아무도 안 봤어',
  '카페에서 일부러 너를 기다렸어',
  '나 오늘 하루종일 네가 연락할 것 같아서 폰만 봤어',
  '너 웃을 때 나도 진짜 행복해',
  '사실 뭐 할 줄 모를 때 너를 제일 먼저 생각해',
  '지하철에서 졸다가 옆 사람 어깨에 기댔는데 모르는 사람이었어',
  '나 사실 너한테 할 말이 있는데 아직 못 했어',
];

export default function CreatePage() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // 키 입력마다 실시간으로 변환 — normal 모드: 각 단어 마지막 1글자 노출
  const chosung = disguiseText(text, 'normal');

  // 페이지 마운트 시 한 번만 랜덤 선택, 리렌더링마다 바뀌지 않음
  const placeholder = useMemo(
    () => PLACEHOLDER_EXAMPLES[Math.floor(Math.random() * PLACEHOLDER_EXAMPLES.length)],
    []
  );
  const hasText = text.trim().length > 0;

  // Supabase에 저장 후 UUID로 URL 생성. 실패 시 base64 방식으로 fallback.
  async function handleGenerate() {
    const trimmed = text.trim();
    setIsGenerating(true);
    try {
      const id = await saveGame(trimmed);
      if (id) {
        setShareUrl(`${window.location.origin}/share.html?id=${id}`);
      } else {
        // Supabase 미연결 시 fallback
        const encoded = encodeGameData(trimmed);
        setShareUrl(`${window.location.origin}/share.html?d=${encoded}`);
      }
    } finally {
      setIsGenerating(false);
      setCopied(false);
    }
  }

  async function handleCopy() {
    await copyLink(shareUrl);
    setCopied(true);
  }

  // 모바일이면 네이티브 공유 시트, 데스크탑이면 clipboard로 fallback
  async function handleShareClick() {
    const result = await handleShare(shareUrl);
    if (result === 'copied') {
      alert('링크가 복사되었어요!');
    }
  }

  function handleReset() {
    setShareUrl('');
    setText('');
    setCopied(false);
  }

  return (
    <Layout>
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-7">
        <button
          onClick={() => navigate('/')}
          className="text-zinc-400 text-sm hover:text-zinc-700 cursor-pointer"
        >
          ←
        </button>
        <div>
          <h2 className="text-xl font-black text-zinc-900">속마음 적기</h2>
          <p className="text-xs text-zinc-400">입력하면 초성으로 변환돼요</p>
        </div>
      </div>

      {/* ── STATE 1: 작성 ─────────────────────────────────────── */}
      {!shareUrl ? (
        <div className="space-y-4">
          <TextInput
            value={text}
            onChange={setText}
            placeholder={`예: ${placeholder}`}
            rows={4}
          />

          {/* 실시간 미리보기: 원문 + 초성을 나란히 보여주는 카드 */}
          <div className={`rounded-2xl border-2 transition-colors overflow-hidden ${hasText ? 'border-zinc-200 bg-white' : 'border-transparent bg-transparent'}`}>
            {hasText && (
              <>
                <div className="px-4 pt-3 pb-2 border-b border-zinc-100">
                  <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">원문</p>
                  <p className="text-sm text-zinc-700 leading-relaxed">{text}</p>
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">
                    상대방에게 보이는 힌트
                  </p>
                  <p className="text-xl font-black text-zinc-900 tracking-widest leading-relaxed">
                    {chosung}
                  </p>
                </div>
              </>
            )}
          </div>

          <Button
            onClick={handleGenerate}
            disabled={!hasText || isGenerating}
            className="w-full py-4 text-base"
          >
            {isGenerating ? '저장 중...' : '링크 만들기 →'}
          </Button>
        </div>

      /* ── STATE 2: 공유 ──────────────────────────────────────── */
      ) : (
        <div className="space-y-4">
          {/* 요약 카드: 상대방에게 보이는 초성 + 생성된 링크 */}
          <div className="bg-white rounded-2xl border-2 border-zinc-200 overflow-hidden">
            <div className="bg-zinc-900 px-4 py-3 flex items-center gap-2">
              <span className="text-accent text-sm font-bold">링크 완성</span>
            </div>
            <div className="px-4 pt-4 pb-2 border-b border-zinc-100">
              <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">보내지는 초성</p>
              <p className="text-lg font-black text-zinc-900 tracking-widest leading-relaxed">{chosung}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-1">공유 링크</p>
              <p className="text-xs text-zinc-400 break-all font-mono leading-relaxed">{shareUrl}</p>
            </div>
          </div>

          {/* 주요 CTA — 모바일 네이티브 공유 시트 or clipboard fallback */}
          <Button onClick={handleShareClick} className="w-full py-4 text-base">
            📤 공유하기
          </Button>

          {/* 보조 CTA — 명시적 복사, 완료 시 버튼 텍스트가 바뀜 */}
          <Button onClick={handleCopy} className="w-full py-4 text-base" variant={copied ? 'secondary' : 'primary'}>
            {copied ? '✅ 복사됐어요!' : '📋 링크 복사하기'}
          </Button>

          {copied && (
            <p className="text-center text-xs text-zinc-400">
              카카오톡이나 DM으로 보내보세요
            </p>
          )}

          <Button onClick={handleReset} variant="secondary" className="w-full py-3 text-sm">
            새 메시지 만들기
          </Button>
        </div>
      )}
    </Layout>
  );
}
