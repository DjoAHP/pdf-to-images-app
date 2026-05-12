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
      <div className="p-4 border-b border-border-subtle">
        <h2 className="text-lg font-semibold text-text-primary">PDFs</h2>
      </div>

      {/* Drop Zone */}
      <div
        className={`flex-1 p-4 overflow-y-auto ${
          isDragOver ? 'bg-accent/10 border-accent/50' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {pdfs.length === 0 ? (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-border-subtle rounded-lg p-8 text-center cursor-pointer hover:border-border-accent transition-all duration-200"
          >
            <FileDown className="w-12 h-12 mx-auto mb-3 text-text-muted" />
            <p className="text-text-secondary">Glissez vos PDF ici</p>
            <p className="text-sm text-text-muted mt-1">ou cliquez pour sélectionner</p>
          </div>
        ) : (
          <div className="space-y-2">
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
      <div className="p-4 border-t border-border-subtle">
        <button
          onClick={onConvertAll}
          disabled={pdfs.length === 0 || isConverting}
          className="w-full py-2 px-4 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isConverting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Conversion...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              PDF&gt;Images
            </>
          )}
        </button>
      </div>
    </div>
  );
}
