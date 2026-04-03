// 점수 구간별 밈 문구 — perfect 20개, 나머지 구간 10개씩
// getMemeResult(score) → { message, emoji, animClass }

export interface MemeResult {
  message: string
  emoji: string
  animClass: string
}

const MESSAGES: Record<string, { message: string; emoji: string }[]> = {
  perfect: [
    { message: '실화냐?? 텔레파시 맞지 진짜로', emoji: '🔮' },
    { message: '이거 넌 몰래카메라인가 ㄷㄷ', emoji: '📷' },
    { message: '완벽함... 이 사람 내 머릿속 들었나', emoji: '🙊' },
    { message: '대박.. 예언가 맞지 진심으로', emoji: '🌟' },
    { message: '인정함 넌 나 복제인간 아니냐', emoji: '👯' },
    { message: '신의 영역.. 그냥 신이다', emoji: '⚡' },
    { message: '이거 100점 아니면 그냥 사기다', emoji: '🏆' },
    { message: '우리 전생에 분명 한 몸이었음', emoji: '👁️' },
    { message: '이 사람 FBI 아니냐 진심으로', emoji: '🕵️' },
    { message: '소름 돋았어 진짜 소름', emoji: '🫶' },
    { message: '이거 맞추고 어떻게 그냥 앉아있어', emoji: '💥' },
    { message: 'GPT보다 나을듯 진심으로', emoji: '🤖' },
    { message: '이 사람 나보다 나를 더 잘 아는 거 아님?', emoji: '😱' },
    { message: '완벽 그 자체... 할 말이 없어', emoji: '✨' },
    { message: '결혼 각이다 지금 당장', emoji: '💍' },
    { message: '이 사람이랑은 비밀도 못 숨기겠네', emoji: '🫣' },
    { message: '진짜임? 다시 해봐 이거 운이지?', emoji: '🎯' },
    { message: '100점 받은 사람 앞으로 나와봐', emoji: '🎤' },
    { message: '이건 그냥 영혼이 통한 거임', emoji: '🌈' },
    { message: '역대급 해독자 등장 ㄷㄷㄷ', emoji: '👑' },
  ],
  great: [
    { message: '거의 다 맞췄잖아 집착이냐 ㅋ', emoji: '👀' },
    { message: '어... 어떻게 이렇게 잘 맞지?', emoji: '😳' },
    { message: '진짜 이 사람 날 얼마나 잘 아냐', emoji: '🥹' },
    { message: '와... 미스 몇 개가 왜 이렇게 아파', emoji: '💔' },
    { message: '이건 좀 의심스럽게 잘 맞는데', emoji: '🤨' },
    { message: '다 맞았다고 해도 될듯? ㅋㅋㅋ', emoji: '😏' },
    { message: '이 정도면 나 마음 다 열었네', emoji: '🫀' },
    { message: '거의 100%냐 그 나머지는 실수지', emoji: '📊' },
    { message: '아깝다 아까워 진짜로', emoji: '😤' },
    { message: '거의 다인데... 그 아쉬움이란', emoji: '🫠' },
  ],
  decent: [
    { message: '쏘쏘... 다음엔 좀 더 열심히', emoji: '😐' },
    { message: '음... 좋기도 하고 아쉽기도 하고', emoji: '🤔' },
    { message: '반반 정도네... 반반의 매력', emoji: '🍗' },
    { message: '60%면 괜찮은 건가 나쁜 건가', emoji: '📉' },
    { message: '대충 맞은 거라고 봐야 하나', emoji: '🙃' },
    { message: '말하고 싶은데 말이 안 나와', emoji: '💬' },
    { message: '흠... 그런 줄 알았어', emoji: '🧐' },
    { message: '뭐... 이 정도면 괜찮겠지?', emoji: '🫤' },
    { message: '이게 합격인지 낙제인지 모르겠네', emoji: '📝' },
    { message: '운이 좋았나? 아니면 실력?', emoji: '🎲' },
  ],
  half: [
    { message: '반반이네 반반치킨처럼', emoji: '🍗' },
    { message: '40점.. 이건 야식 사줘야 하는 거 아냐?', emoji: '🌙' },
    { message: '진짜 하다 만 거야? ㅋㅋㅋ', emoji: '🤪' },
    { message: '뭐 이렇게 띄엄띄엄 맞았어', emoji: '🫥' },
    { message: '이게 뭐하는 짓이야 진심으로', emoji: '😅' },
    { message: '40점은 뭐... 떨어졌다는 뜻이야', emoji: '📉' },
    { message: '연기 한 거 아님? 진짜 모르는 거야?', emoji: '🎭' },
    { message: '우리 사이가... 딱 이 점수네', emoji: '💧' },
    { message: '반은 맞고 반은 틀렸어 ㅠㅠ', emoji: '😬' },
    { message: '성적표 나왔다 ㅋㅋㅋ', emoji: '📋' },
  ],
  low: [
    { message: '그냥 찍은 거 아님? 진심이야?', emoji: '🎰' },
    { message: '이게... 진짜... 실수야?', emoji: '😶' },
    { message: '20점.. 이건 뭐 주사위 굴린 거 아님?', emoji: '🎲' },
    { message: '진짜 날 모르는군... 슬프네 ㅠㅠ', emoji: '🥲' },
    { message: '어? 이렇게 못 맞춰? ㅋㅋㅋ', emoji: '💀' },
    { message: '이 정도면 빈칸 제출한 거 같은데', emoji: '🫙' },
    { message: '유령이 쳤나? ㅋㅋㅋ', emoji: '👻' },
    { message: '스마트폰 잘못 건드린 거 아님?', emoji: '📱' },
    { message: '이건 운이 아니라 뭔가 이상한데', emoji: '🔍' },
    { message: '우리 진짜 남남인가봐 ㅠ', emoji: '🚶' },
  ],
  zero: [
    { message: '0점... 이 링크 왜 열었어요', emoji: '💀' },
    { message: '진짜 우리 이게 뭐하는 관계야', emoji: '🫠' },
    { message: '뭐야 완전 모르고 있었구나', emoji: '😵' },
    { message: '이 정도면 절교 각이다 ㅋㅋㅋ', emoji: '✂️' },
    { message: '화성에서 온 사람인가 ㅠㅠ', emoji: '🪐' },
    { message: '우리 감정 여기 묻어주자', emoji: '⚰️' },
    { message: '진짜 이건 악몽 아니냐 ㅋㅋㅋㅋ', emoji: '😱' },
    { message: '검은 역사가... 생겼어', emoji: '🖤' },
    { message: '이게 뭐하는 거야 진짜 ㅠㅠ', emoji: '🤡' },
    { message: '어둠의 세계로 빠져버렸어', emoji: '🌑' },
  ],
}

const ANIM: Record<string, string> = {
  perfect: 'anim-bounce',
  great:   'anim-spin',
  decent:  'anim-float',
  half:    'anim-float',
  low:     'anim-shake',
  zero:    'anim-droop',
}

function pick<T>(pool: T[]): T {
  return pool[Math.floor(Math.random() * pool.length)]
}

export function getMemeResult(scorePercent: number): MemeResult {
  let tier: string
  if (scorePercent === 100)    tier = 'perfect'
  else if (scorePercent >= 80) tier = 'great'
  else if (scorePercent >= 60) tier = 'decent'
  else if (scorePercent >= 40) tier = 'half'
  else if (scorePercent >= 20) tier = 'low'
  else                         tier = 'zero'

  const { message, emoji } = pick(MESSAGES[tier])
  return { message, emoji, animClass: ANIM[tier] }
}
