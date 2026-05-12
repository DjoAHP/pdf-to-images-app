import { Download } from 'lucide-react';
import type { ImageFolder, ConvertedImage } from '../types';
import { FolderItem } from './ui/FolderItem';
import { ImageItem } from './ui/ImageItem';

interface RightSidebarProps {
  folders: ImageFolder[];
  singleImages: ConvertedImage[];
  onToggleFolder: (pdfId: string) => void;
  onDownloadImage: (image: ConvertedImage) => void;
  onDownloadFolder: (folder: ImageFolder) => void;
  onDownloadAll: () => void;
}

export function RightSidebar({
  folders,
  singleImages,
  onToggleFolder,
  onDownloadImage,
  onDownloadFolder,
  onDownloadAll,
}: RightSidebarProps) {
  const hasContent = folders.length > 0 || singleImages.length > 0;

  return (
    <div className="w-[300px] h-full bg-bg-primary/80 backdrop-blur-md border-l border-border-subtle flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border-subtle">
        <h2 className="text-xl font-semibold text-text-primary tracking-tight">Images converties</h2>
        <p className="text-xs text-text-muted mt-1">Fichiers prêts au téléchargement</p>
      </div>

      {/* Images List */}
      <div className="flex-1 px-6 py-4 overflow-y-auto">
        {!hasContent ? (
          <div className="text-center mt-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bg-secondary/30 flex items-center justify-center">
              <Download className="w-8 h-8 text-text-muted/50" />
            </div>
            <p className="text-text-muted">Aucune image convertie</p>
            <p className="text-xs text-text-muted/70 mt-1">Les images apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-3">
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
      <div className="px-6 py-5 border-t border-border-subtle">
        <button
          onClick={onDownloadAll}
          disabled={!hasContent}
          className="w-full py-3 px-6 bg-gradient-to-r from-accent to-accent/80 hover:from-accent-hover hover:to-accent/70 disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 disabled:shadow-none"
        >
          <Download className="w-5 h-5" />
          <span>Télécharger tout (ZIP)</span>
        </button>
      </div>
    </div>
  );
}
