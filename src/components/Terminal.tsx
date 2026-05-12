import { useEffect, useRef } from 'react';
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
    <div className="flex-1 h-full bg-terminal-bg/95 backdrop-blur-md border border-border-accent/50 rounded-2xl m-3 overflow-hidden flex flex-col shadow-2xl shadow-black/50">
      {/* Terminal Header */}
      <div className="flex items-center gap-3 px-6 py-3 bg-bg-secondary/30 border-b border-border-subtle">
        <div className="flex gap-2">
          <div className="w-3.5 h-3.5 rounded-full bg-error/90 hover:bg-error transition-colors cursor-pointer" />
          <div className="w-3.5 h-3.5 rounded-full bg-progress/90 hover:bg-progress transition-colors cursor-pointer" />
          <div className="w-3.5 h-3.5 rounded-full bg-success/90 hover:bg-success transition-colors cursor-pointer" />
        </div>
        <span className="text-sm text-text-muted ml-2 font-medium tracking-wide">TERMINAL</span>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-6 font-mono text-sm leading-relaxed">
        {lines.length === 0 ? (
          <div className="text-text-muted/60">
            <span className="text-accent">$</span> Prêt pour la conversion...
          </div>
        ) : (
          lines.map((line) => (
            <div key={line.id} className={`mb-2 ${getLineColor(line.type)} opacity-90 hover:opacity-100 transition-opacity`}>
              {line.text}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
