export function shareToKakao({
  title,
  description,
  imageUrl,
  linkUrl,
  buttonTitle = '해독하러 가기',
}: {
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  buttonTitle?: string
}) {
  if (!window.Kakao?.isInitialized()) {
    alert('카카오 공유를 사용할 수 없어요.')
    return
  }

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description,
      imageUrl,
      imageWidth: 1200,
      imageHeight: 630,
      link: {
        mobileWebUrl: linkUrl,
        webUrl: linkUrl,
      },
    },
    buttons: [
      {
        title: buttonTitle,
        link: {
          mobileWebUrl: linkUrl,
          webUrl: linkUrl,
        },
      },
    ],
  })
}
