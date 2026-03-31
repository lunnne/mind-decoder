interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export default function TextInput({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
}: Props) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`w-full rounded-2xl border-2 border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-300 focus:outline-none focus:border-zinc-900 resize-none text-base leading-relaxed ${className}`}
    />
  );
}
