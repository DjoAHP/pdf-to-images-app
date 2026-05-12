import type { PDFFile } from '../../types';
import { FileText, Loader2, CheckCircle, XCircle, GripVertical } from 'lucide-react';

interface PdfCardProps {
  pdf: PDFFile;
}

export function PdfCard({ pdf }: PdfCardProps) {
  const getStatusIcon = () => {
    switch (pdf.status) {
      case 'converting':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      case 'done':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <FileText className="w-5 h-5 text-text-muted/70" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="group relative flex items-center gap-4 p-4 bg-bg-secondary/20 hover:bg-bg-secondary/40 border border-border-subtle/50 hover:border-accent/30 rounded-2xl transition-all duration-300 cursor-pointer">
      {/* Drag handle */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <GripVertical className="w-4 h-4 text-text-muted/40" />
      </div>

      {/* Status Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-bg-secondary/50 flex items-center justify-center">
        {getStatusIcon()}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{pdf.name}</p>
        <p className="text-xs text-text-muted/80 mt-1">{formatSize(pdf.size)}</p>
      </div>

      {/* Status Badge */}
      <div className="flex-shrink-0">
        {pdf.status === 'done' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
            OK
          </span>
        )}
        {pdf.status === 'converting' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400">
            ...
          </span>
        )}
        {pdf.status === 'error' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400">
            Err
          </span>
        )}
      </div>
    </div>
  );
}
