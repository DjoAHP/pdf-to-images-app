import type { ReactNode } from 'react';

interface AppLayoutProps {
  header: ReactNode;
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export function AppLayout({ header, left, center, right }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden flex-col">
      {header}
      <div className="flex-1 flex overflow-hidden">
        {left}
        <div className="flex-1 flex flex-col overflow-hidden">
          {center}
        </div>
        {right}
      </div>
    </div>
  );
}