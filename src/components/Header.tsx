import { FileText } from 'lucide-react';

interface HeaderProps {
  pdfCount: number;
  isConverting: boolean;
  progressPercent: number;
}

export function Header({ pdfCount, isConverting, progressPercent }: HeaderProps) {
  return (
    <header className="h-12 shrink-0 flex items-center justify-between px-6 border-b border-border-subtle/50 bg-bg-primary/70 backdrop-blur-2xl">
      {/* Logo & Titre */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
          <FileText className="w-3.5 h-3.5 text-accent" />
        </div>
        <span className="text-sm font-semibold text-text-primary tracking-tight select-none">
          PDF to Images
        </span>
      </div>

      {/* Infos droite */}
      <div className="flex items-center gap-3">
        {/* Barre de progression pendant conversion */}
        {isConverting && (
          <div className="flex items-center gap-2">
            <div className="w-16 h-1 bg-bg-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-[10px] text-text-muted font-medium tabular-nums min-w-[32px] text-right">
              {progressPercent}%
            </span>
          </div>
        )}

        {/* Compteur de fichiers */}
        <span className="text-[10px] text-text-muted select-none px-2 py-0.5 rounded-lg bg-bg-secondary/60 border border-border-subtle/50">
          {pdfCount > 0
            ? `${pdfCount} fichier${pdfCount > 1 ? 's' : ''}`
            : 'Aucun fichier'}
        </span>
      </div>
    </header>
  );
}