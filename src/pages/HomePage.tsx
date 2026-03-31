import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { disguiseText } from '../utils/chosung';

const EXAMPLE_ORIGINAL = '나 오늘 버스에서 방구 꼈는데 아무도 몰랐어';
const EXAMPLE_CHOSUNG  = disguiseText(EXAMPLE_ORIGINAL, 'normal');

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      {/* Brand */}
      <header className="mb-10">
        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">MIND DECODER</p>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-black text-zinc-900 tracking-tight leading-tight">
            속마음을<br />초성으로 숨겨
          </h1>
          <img src="/brain.png" alt="brain" className="w-20 h-20" />
        </div>
        <p className="mt-3 text-sm text-zinc-500">맞추면 사이 확인, 못 맞추면 관계 재고</p>
      </header>

      {/* Live example */}
      <div className="bg-white rounded-2xl border-2 border-zinc-200 p-4 mb-6">
        <p className="text-xs font-bold tracking-widest text-zinc-400 uppercase mb-3">예시</p>
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <span className="shrink-0 text-xs text-zinc-400 mt-0.5 w-8">원문</span>
            <p className="text-sm text-zinc-700 font-medium">{EXAMPLE_ORIGINAL}</p>
          </div>
          <div className="border-t border-dashed border-zinc-100 my-1" />
          <div className="flex items-start gap-3">
            <span className="shrink-0 text-xs text-zinc-400 mt-0.5 w-8">힌트</span>
            <p className="text-xl font-black text-zinc-900 tracking-widest">{EXAMPLE_CHOSUNG}</p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <ol className="flex flex-col gap-2 mb-8">
        {[
          { n: '01', label: '속마음을 문장으로 적어요' },
          { n: '02', label: '초성 힌트만 담긴 링크를 보내요' },
          { n: '03', label: '상대방이 해독하면 점수가 나와요' },
        ].map(({ n, label }) => (
          <li key={n} className="flex items-center gap-3 text-sm text-zinc-600">
            <span className="shrink-0 w-7 h-7 rounded-full bg-zinc-900 text-white font-black text-xs flex items-center justify-center">
              {n}
            </span>
            {label}
          </li>
        ))}
      </ol>

      <Button onClick={() => navigate('/create')} className="w-full py-4 text-base">
        메시지 만들기 →
      </Button>

      <p className="mt-4 text-center text-xs text-zinc-400">
        로그인 필요 없어요 · 무료
      </p>
    </Layout>
  );
}
