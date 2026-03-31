/**
 * share.ts
 *
 * 앱의 모든 공유 동작을 담당.
 *
 * "공유하기" 버튼을 탭했을 때 흐름:
 *   handleShare(url)
 *     ├─ navigator.share 사용 가능?  (iOS Safari, Android Chrome 등 모바일)
 *     │    └─ YES → 재미있는 문구 + url 포함해서 네이티브 공유 시트 열기
 *     └─ NO  (데스크탑 / 미지원 브라우저)
 *          └─ url을 clipboard에 복사, 호출부에서 "복사됐어요!" alert 표시
 *
 * generateShareMessage()는 랜덤 한국어 도발 문구를 반환.
 * 최종 공유 텍스트 형태:
 *   "이거 못 맞추면 진짜 문제 있음 ㅋㅋ\n👉 https://..."
 *
 * 문구가 살짝 도발적인 게 의도적 — 받는 사람이 링크를 누르게 만드는 바이럴 장치.
 */

const SHARE_MESSAGES = [
  '이거 못 맞추면 진짜 문제 있음 ㅋㅋ',
  '이 초성 맞추면 인정해줄게 (못 맞추면 절교)',
  '솔직히 이건 못 맞춘다 해봐',
  '너 눈치 몇 점인지 테스트해봐 ㅋ',
  '나 속마음 초성으로 보냈는데 맞혀봐 ㄷㄷ',
  '이거 맞추면 우리 진짜 통하는 거다',
  '5초 안에 못 맞추면 넌 나 모르는 거임',
  '이거 못 맞추면 우리 사이 다시 생각해봐야 할 듯',
  '초성 맞추기 겁나 쉬운 척 해봤는데 진짜 어려움 ㅋㅋㅋ',
  '친구한테 보내봐 ㅋㅋ 반응 보장됨',
  '이 초성 맞추는 사람 천재임 진짜',
  '내 속마음 들어맞혀봐 — 맞추면 선물 (없음)',
];

/** 랜덤 공유 문구 하나를 반환. */
export function generateShareMessage(): string {
  return SHARE_MESSAGES[Math.floor(Math.random() * SHARE_MESSAGES.length)];
}

/** shareUrl을 clipboard에 바로 복사. */
export async function copyLink(shareUrl: string): Promise<void> {
  await navigator.clipboard.writeText(shareUrl);
}

/**
 * 메인 공유 handler.
 * 네이티브 공유 시트가 열리면 'shared' 반환,
 * clipboard 복사로 fallback하면 'copied' 반환 (호출부에서 alert 띄움).
 */
export async function handleShare(shareUrl: string): Promise<'shared' | 'copied'> {
  const text = generateShareMessage();
  const fullText = `${text}\n👉 ${shareUrl}`;

  if (navigator.share) {
    await navigator.share({
      title: 'mind decoder',
      text: fullText,
      url: shareUrl,
    });
    return 'shared';
  }

  // Fallback: 조용히 복사하고 호출부가 사용자에게 알림
  await copyLink(shareUrl);
  return 'copied';
}
