import type { TerminalLine } from '../types';
import { Trash2 } from 'lucide-react';

interface TerminalProps {
  lines: TerminalLine[];
  onClear: () => void;
}

export function Terminal({ lines, onClear }: TerminalProps) {
  const getTypeColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'progress':
        return 'text-progress';
      default:
        return 'text-text-muted';
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden border-t border-border-subtle/50">
      {/* Barre de titre du terminal */}
      <div className="flex items-center justify-between px-5 py-2 bg-bg-secondary/30 select-none">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-[#ff5f57]"></div>
            <div className="w-2 h-2 rounded-full bg-[#fbbf24]"></div>
            <div className="w-2 h-2 rounded-full bg-[#4ade80]"></div>
          </div>
          <span className="text-[10px] text-text-muted font-semibold uppercase tracking-[0.2em]">
            Terminal
          </span>
          <span className="text-[10px] text-text-muted/40 hidden sm:inline">
            — {lines.length} ligne{lines.length > 1 ? 's' : ''}
          </span>
        </div>
        <button
          onClick={onClear}
          className="p-0.5 text-text-muted/40 hover:text-text-secondary transition-colors rounded-lg hover:bg-bg-tertiary/50 cursor-pointer"
          title="Effacer le terminal"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Contenu du terminal */}
      <div className="flex-1 overflow-y-auto bg-terminal-bg p-3">
        {lines.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-muted/25 text-xs italic font-mono">
            Le terminal sera rempli ici lors de la conversion...
          </div>
        ) : (
          <div className="space-y-0.5">
            {lines.map((line) => (
              <div
                key={line.id}
                className={`font-mono text-[11px] leading-snug ${getTypeColor(line.type)}`}
              >
                {line.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}