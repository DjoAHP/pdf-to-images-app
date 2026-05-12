import type { PDFFile } from '../../types';
import { FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface PdfCardProps {
  pdf: PDFFile;
}

export function PdfCard({ pdf }: PdfCardProps) {
  const getStatusIcon = () => {
    switch (pdf.status) {
      case 'converting':
        return <Loader2 className="w-4 h-4 text-progress animate-spin" />;
      case 'done':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <FileText className="w-4 h-4 text-text-muted" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-secondary/50 rounded-lg border border-border-subtle hover:border-border-accent transition-all duration-200">
      {getStatusIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary truncate">{pdf.name}</p>
        <p className="text-xs text-text-muted">{formatSize(pdf.size)}</p>
      </div>
    </div>
  );
}
