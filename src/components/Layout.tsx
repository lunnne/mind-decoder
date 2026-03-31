import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
