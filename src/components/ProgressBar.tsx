interface Props {
  score: number; // 0–100
  height?: 'sm' | 'md';
}

export default function ProgressBar({ score, height = 'md' }: Props) {
  const h = height === 'sm' ? 'h-2' : 'h-3';
  return (
    <div className={`w-full bg-zinc-100 rounded-full ${h} overflow-hidden`}>
      <div
        className={`${h} rounded-full bg-accent transition-all duration-500`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}
