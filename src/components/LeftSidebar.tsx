import { useCallback, useRef, useState } from 'react';
import type { PDFFile } from '../types';
import { PdfCard } from './ui/PdfCard';
import { Button } from './ui/button';
import { FileDown, Loader2 } from 'lucide-react';

interface LeftSidebarProps {
  pdfs: PDFFile[];
  onAddPdfs: (files: File[]) => void;
  onConvertAll: () => void;
  isConverting: boolean;
  progressPercent: number;
}

export function LeftSidebar({ pdfs, onAddPdfs, onConvertAll, isConverting, progressPercent }: LeftSidebarProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      );
      if (files.length > 0) {
        onAddPdfs(files);
      }
    },
    [onAddPdfs]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (files.length > 0) {
      onAddPdfs(files);
    }
    e.target.value = '';
  };

  return (
    <div className="w-[340px] h-full bg-bg-primary/60 backdrop-blur-3xl border-r border-border-subtle flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-subtle/50">
        <h2 className="text-lg font-semibold text-text-primary tracking-tight">PDFs</h2>
        <p className="text-xs text-text-muted/70 mt-0.5">Glissez vos fichiers ou cliquez</p>
      </div>

      {/* Drop Zone */}
      <div
        className={`flex-1 px-6 py-8 overflow-y-auto transition-all duration-300 ${
          isDragOver ? 'bg-accent/5' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {pdfs.length === 0 ? (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-border-subtle/60 rounded-3xl p-10 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 group"
          >
            <div className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-bg-secondary/60 flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300 border border-border-subtle/30">
              <FileDown className="w-10 h-10 text-text-muted/60 group-hover:text-accent transition-colors duration-300" />
            </div>
            <p className="text-text-secondary font-semibold text-base">Glissez vos PDF ici</p>
            <p className="text-xs text-text-muted/70 mt-2">ou cliquez pour sélectionner</p>
            <p className="text-[10px] text-text-muted/40 mt-1">Formats : .pdf uniquement</p>
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            {pdfs.map((pdf) => (
              <PdfCard key={pdf.id} pdf={pdf} />
            ))}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Progress bar during conversion */}
      {isConverting && (
        <div className="px-6 pt-3 pb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-text-muted/70 font-medium uppercase tracking-wider">Progression</span>
            <span className="text-[10px] text-accent font-bold tabular-nums">{progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 bg-bg-tertiary/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-300 ease-out shadow-lg shadow-accent/20"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Convert Button */}
      <div className="px-6 py-5 border-t border-border-subtle/50 bg-bg-primary/40 backdrop-blur-xl">
        <Button
          onClick={onConvertAll}
          disabled={pdfs.length === 0 || isConverting}
          variant="default"
          size="xl"
          className="w-full shadow-2xl shadow-accent/20"
        >
          {isConverting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Conversion en cours…</span>
            </>
          ) : (
            <>
              <FileDown className="w-5 h-5 mr-2" />
              <span>Convertir tout ({pdfs.length} fichier{pdfs.length > 1 ? 's' : ''})</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}