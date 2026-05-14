import { FileText, File, XCircle, Eye } from 'lucide-react';
import type { PDFFile } from '../../types';

function getStatusColor(pdf: PDFFile) {
  switch (pdf.status) {
    case 'pending':
      return {
        border: 'border-border-subtle',
        badgeBg: 'bg-text-muted/10',
        badgeText: 'text-text-muted',
        label: 'En attente',
        icon: <FileText className="w-4 h-4 text-text-muted/60" />,
        bg: 'bg-bg-secondary/40',
      };
    case 'converting':
      return {
        border: 'border-progress/50',
        badgeBg: 'bg-progress/15',
        badgeText: 'text-progress',
        label: 'Conversion...',
        icon: <FileText className="w-4 h-4 text-progress animate-pulse-slow" />,
        bg: 'bg-progress/5',
      };
    case 'done':
      return {
        border: 'border-success/50',
        badgeBg: 'bg-success/15',
        badgeText: 'text-success',
        label: 'Terminé',
        icon: <FileText className="w-4 h-4 text-success" />,
        bg: 'bg-success/5',
      };
    case 'error':
      return {
        border: 'border-error/50',
        badgeBg: 'bg-error/15',
        badgeText: 'text-error',
        label: 'Erreur',
        icon: <XCircle className="w-4 h-4 text-error" />,
        bg: 'bg-error/5',
      };
  }
}

export function PdfCard({ pdf, onPreview }: { pdf: PDFFile; onPreview?: (pdf: PDFFile) => void }) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} o`;
    return `${(bytes / 1024).toFixed(1)} Ko`;
  };

  const c = getStatusColor(pdf);

  return (
    <div
      className={`group relative flex items-center gap-2.5 p-2.5 ${c.bg} border-l-4 ${c.border} rounded-xl transition-all duration-300 hover:bg-bg-secondary/60 animate-fade-in`}
    >
      {/* Icône de statut */}
      <div className="shrink-0">{c.icon}</div>

      {/* Infos fichier */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium text-text-primary truncate" title={pdf.name}>
            {pdf.name}
          </span>
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap ${c.badgeBg} ${c.badgeText}`}
          >
            {c.label}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-text-muted/50">{formatSize(pdf.size)}</span>
          {pdf.totalPages && (
            <span className="text-[10px] text-text-muted/50">
              · {pdf.totalPages} page{pdf.totalPages > 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Boutons d'action au hover */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {pdf.status === 'done' && onPreview && (
          <button
            onClick={() => onPreview(pdf)}
            className="p-1 text-text-muted/40 hover:text-accent transition-colors rounded-lg hover:bg-accent/10 cursor-pointer"
            title="Prévisualiser"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        )}
        {onPreview && (
          <button
            onClick={() => onPreview(pdf)}
            className="p-1 text-text-muted/40 hover:text-accent transition-colors rounded-lg hover:bg-accent/10 cursor-pointer"
            title="Prévisualiser le PDF"
          >
            <File className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}