import type { ReactNode } from 'react';

interface AppLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export function AppLayout({ left, center, right }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {left}
      <div className="flex-1 flex flex-col overflow-hidden">
        {center}
      </div>
      {right}
    </div>
  );
}
