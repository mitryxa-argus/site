import type { ReactNode } from 'react';

export default function ArgusLayout({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        backgroundImage: 'none',
        backgroundSize: 'unset',
        minHeight: '100dvh',
      }}
    >
      {children}
    </div>
  );
}
