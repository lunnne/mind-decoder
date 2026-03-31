import type { ReactNode } from 'react';

interface Props {
  onClick?: () => void;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  type?: 'button' | 'submit';
  className?: string;
}

export default function Button({
  onClick,
  children,
  variant = 'primary',
  disabled = false,
  type = 'button',
  className = '',
}: Props) {
  const base =
    'px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-150 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer';
  const variants = {
    primary:   'bg-accent text-zinc-900 hover:opacity-90',
    secondary: 'bg-white text-zinc-900 border-2 border-zinc-200 hover:bg-zinc-50',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
