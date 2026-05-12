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
    <div className="w-[320px] h-full bg-bg-primary/80 backdrop-blur-xl border-r border-border-subtle flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border-subtle">
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">PDFs</h2>
        <p className="text-sm text-text-muted mt-1.5">Glissez vos fichiers ou cliquez</p>
      </div>

      {/* Drop Zone */}
      <div
        className={`flex-1 px-8 py-12 overflow-y-auto transition-all duration-300 ${
          isDragOver ? 'bg-accent/5' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {pdfs.length === 0 ? (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-border-subtle rounded-3xl p-12 text-center cursor-pointer hover:border-accent/50 hover:bg-accent/5 transition-all duration-300 group"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-bg-secondary/50 flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
              <FileDown className="w-12 h-12 text-text-muted group-hover:text-accent transition-colors duration-300" />
            </div>
            <p className="text-text-secondary font-semibold text-lg">Glissez vos PDF ici</p>
            <p className="text-sm text-text-muted mt-2.5">ou cliquez pour sélectionner des fichiers</p>
          </div>
        ) : (
          <div className="space-y-4">
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
      <div className="px-8 py-6 border-t border-border-subtle bg-bg-primary/50 backdrop-blur-sm">
        <Button
          onClick={onConvertAll}
          disabled={pdfs.length === 0 || isConverting}
          variant="default"
          size="lg"
          className="w-full text-base shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/30"
        >
          {isConverting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              <span>Conversion en cours...</span>
            </>
          ) : (
            <>
              <FileDown className="w-5 h-5 mr-2" />
              <span>PDF → Images</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
