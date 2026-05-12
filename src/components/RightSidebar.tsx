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
    <div className="w-[320px] h-full bg-bg-primary/80 backdrop-blur-xl border-l border-border-subtle flex flex-col">
      {/* Header */}
      <div className="px-8 py-6 border-b border-border-subtle">
        <h2 className="text-2xl font-bold text-text-primary tracking-tight">Images converties</h2>
        <p className="text-sm text-text-muted mt-1.5">Fichiers prêts au téléchargement</p>
      </div>

      {/* Images List */}
      <div className="flex-1 px-8 py-6 overflow-y-auto">
        {!hasContent ? (
          <div className="text-center mt-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-bg-secondary/30 flex items-center justify-center">
              <Download className="w-10 h-10 text-text-muted/40" />
            </div>
            <p className="text-text-muted font-medium">Aucune image convertie</p>
            <p className="text-xs text-text-muted/70 mt-2">Les images apparaîtront ici</p>
          </div>
        ) : (
          <div className="space-y-4">
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
      <div className="px-8 py-6 border-t border-border-subtle bg-bg-primary/50 backdrop-blur-sm">
        <Button
          onClick={onDownloadAll}
          disabled={!hasContent}
          variant="default"
          size="lg"
          className="w-full text-base shadow-xl shadow-accent/20 hover:shadow-2xl hover:shadow-accent/30"
        >
          <Download className="w-5 h-5 mr-2" />
          <span>Télécharger tout (ZIP)</span>
        </Button>
      </div>
    </div>
  );
}
