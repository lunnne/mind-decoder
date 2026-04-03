type ShareType = 'create' | 'challenge' | 'result'

interface ShareOverrides {
  title?: string
  description?: string
}

const SHARE_CONFIGS: Record<ShareType, { title: string; description: string; imageUrl: string; buttonTitle: string }> = {
  create: {
    title: '내 마음을 해독해봐! 💌',
    description: '초성 힌트만 보고 내 마음을 맞혀봐~',
    imageUrl: 'https://mind-decoder.vercel.app/schosung.png',
    buttonTitle: '해독하러 가기',
  },
  challenge: {
    title: '도전장이 날아왔어! 🔥',
    description: '초성 힌트 해독할 수 있어? 지금 바로 도전해봐',
    imageUrl: 'https://mind-decoder.vercel.app/canyoudecode.png',
    buttonTitle: '도전하러 가기',
  },
  result: {
    title: '마음 해독 결과 공개 🧠',
    description: '',
    imageUrl: 'https://mind-decoder.vercel.app/quizsolved.png',
    buttonTitle: '결과 보러 가기',
  },
}

export function shareToKakao(type: ShareType, url?: string, overrides?: ShareOverrides) {
  if (!window.Kakao) {
    alert('카카오 공유를 사용할 수 없어요.')
    return
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JS_KEY)
  }

  const base = SHARE_CONFIGS[type]
  const title = overrides?.title ?? base.title
  const description = overrides?.description ?? base.description
  const { imageUrl, buttonTitle } = base
  const currentUrl = url ?? window.location.href

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description,
      imageUrl,
      imageWidth: 1200,
      imageHeight: 630,
      link: {
        mobileWebUrl: currentUrl,
        webUrl: currentUrl,
      },
    },
    buttons: [
      {
        title: buttonTitle,
        link: {
          mobileWebUrl: currentUrl,
          webUrl: currentUrl,
        },
      },
    ],
  })
}
