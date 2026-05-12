import { useEffect, useRef, type ReactNode } from 'react';
import type { TerminalLine } from '../types';

interface TerminalProps {
  lines: TerminalLine[];
}

export function Terminal({ lines }: TerminalProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines.length]);

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'progress':
        return 'text-progress';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="flex-1 h-full bg-terminal-bg/90 backdrop-blur-sm border border-border-accent rounded-lg m-2 overflow-hidden flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-bg-secondary/50 border-b border-border-subtle">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-error/80" />
          <div className="w-3 h-3 rounded-full bg-progress/80" />
          <div className="w-3 h-3 rounded-full bg-success/80" />
        </div>
        <span className="text-sm text-text-muted ml-2">Terminal</span>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {lines.length === 0 ? (
          <p className="text-text-muted">
            $ Prêt pour la conversion...
          </p>
        ) : (
          lines.map((line) => (
            <div key={line.id} className={`mb-1 ${getLineColor(line.type)}`}>
              {line.text}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
