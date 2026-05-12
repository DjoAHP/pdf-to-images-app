import { useCallback, useRef, useState } from 'react';
import type { PDFFile } from '../types';
import { PdfCard } from './ui/PdfCard';
import { FileDown, Loader2 } from 'lucide-react';

interface LeftSidebarProps {
  pdfs: PDFFile[];
  onAddPdfs: (files: File[]) => void;
  onConvertAll: () => void;
  isConverting: boolean;
}

export function LeftSidebar({ pdfs, onAddPdfs, onConvertAll, isConverting }: LeftSidebarProps) {
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
    <div className="w-[300px] h-full bg-bg-primary/80 backdrop-blur-md border-r border-border-subtle flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border-subtle">
        <h2 className="text-xl font-semibold text-text-primary tracking-tight">PDFs</h2>
        <p className="text-xs text-text-muted mt-1">Glissez vos fichiers ou cliquez</p>
      </div>

      {/* Drop Zone */}
      <div
        className={`flex-1 px-6 py-8 overflow-y-auto ${
          isDragOver ? 'bg-accent/5 border-accent/30' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {pdfs.length === 0 ? (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-border-subtle rounded-2xl p-10 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 group"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-bg-secondary/50 flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
              <FileDown className="w-10 h-10 text-text-muted group-hover:text-accent transition-colors duration-300" />
            </div>
            <p className="text-text-secondary font-medium">Glissez vos PDF ici</p>
            <p className="text-sm text-text-muted mt-2">ou cliquez pour sélectionner</p>
          </div>
        ) : (
          <div className="space-y-3">
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

      {/* Convert Button */}
      <div className="px-6 py-5 border-t border-border-subtle">
        <button
          onClick={onConvertAll}
          disabled={pdfs.length === 0 || isConverting}
          className="w-full py-3 px-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent-hover hover:to-accent disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 disabled:shadow-none"
        >
          {isConverting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Conversion en cours...</span>
            </>
          ) : (
            <>
              <FileDown className="w-5 h-5" />
              <span>PDF&gt;Images</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
