import { Download } from 'lucide-react';
import type { ImageFolder, ConvertedImage } from '../types';
import { FolderItem } from './ui/FolderItem';
import { ImageItem } from './ui/ImageItem';
import { Button } from './ui/button';

interface RightSidebarProps {
  folders: ImageFolder[];
  singleImages: ConvertedImage[];
  onToggleFolder: (pdfId: string) => void;
  onDownloadImage: (image: ConvertedImage) => void;
  onDownloadFolder: (folder: ImageFolder) => void;
  onDownloadAll: () => void;
  onClearAll: () => void;
  hasConvertedContent: boolean;
}

export function RightSidebar({
  folders,
  singleImages,
  onToggleFolder,
  onDownloadImage,
  onDownloadFolder,
  onDownloadAll,
  onClearAll,
  hasConvertedContent,
}: RightSidebarProps) {
  const totalImages = singleImages.length + folders.reduce((acc, f) => acc + f.images.length, 0);

  return (
    <div className="w-[340px] h-full bg-bg-primary/60 backdrop-blur-3xl border-l border-border-subtle flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 border-b border-border-subtle/50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary tracking-tight">Images converties</h2>
            <p className="text-xs text-text-muted/70 mt-0.5">Fichiers prêts au téléchargement</p>
          </div>
          <div className="flex items-center gap-2">
            {hasConvertedContent && (
              <button
                onClick={onClearAll}
                className="p-1.5 text-text-muted/40 hover:text-error hover:bg-error/10 transition-colors rounded-lg cursor-pointer"
                title="Tout effacer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" /><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                </svg>
              </button>
            )}
            <span className="text-[10px] text-text-muted/60 bg-bg-secondary/60 px-2 py-0.5 rounded-lg font-medium">
              {totalImages}
            </span>
          </div>
        </div>
      </div>

      {/* Images List */}
      <div className="flex-1 px-6 py-5 overflow-y-auto">
        {!hasConvertedContent ? (
          <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
            <div className="w-18 h-18 rounded-2xl bg-bg-secondary/50 flex items-center justify-center mb-5 border border-border-subtle/30">
              <Download className="w-9 h-9 text-text-muted/30" />
            </div>
            <p className="text-text-muted font-medium text-sm">Aucune image convertie</p>
            <p className="text-xs text-text-muted/50 mt-2 max-w-[200px] leading-relaxed">
              Convertissez un PDF pour voir les images apparaître ici
            </p>
          </div>
        ) : (
          <div className="space-y-1 animate-fade-in">
            <div className="text-[11px] text-text-muted/50 mb-4 pl-0.5">
              <span className="font-medium">{totalImages} image{totalImages > 1 ? 's' : ''} prête{totalImages > 1 ? 's' : ''}</span>
              {folders.length > 0 && (
                <span className="text-[10px] text-text-muted/40 ml-2 bg-bg-tertiary/60 px-2 py-0.5 rounded-lg">
                  {folders.length} dossier{folders.length > 1 ? 's' : ''}
                </span>
              )}
            </div>
            {/* Folders (multi-page PDFs) */}
            {folders.map((folder) => (
              <FolderItem
                key={folder.pdfId}
                folder={folder}
                onToggle={onToggleFolder}
                onDownloadImage={onDownloadImage}
                onDownloadFolder={onDownloadFolder}
              />
            ))}

            {/* Single images (1-page PDFs) */}
            {singleImages.map((image) => (
              <ImageItem
                key={image.id}
                image={image}
                onDownload={onDownloadImage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Download All Button */}
      <div className="px-6 py-4 border-t border-border-subtle/50 bg-bg-primary/40 backdrop-blur-xl">
        <Button
          onClick={onDownloadAll}
          disabled={!hasConvertedContent}
          variant="outline"
          size="xl"
          className="w-full"
        >
          <Download className="w-5 h-5 mr-2 group-hover:translate-x-0.5 transition-transform" />
          <span>Tout télécharger (ZIP)</span>
        </Button>
      </div>
    </div>
  );
}