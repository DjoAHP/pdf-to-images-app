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
      <div className="p-4 border-b border-border-subtle">
        <h2 className="text-lg font-semibold text-text-primary">Images converties</h2>
      </div>

      {/* Images List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!hasContent ? (
          <p className="text-text-muted text-center mt-8">
            Aucune image convertie
          </p>
        ) : (
          <div className="space-y-2">
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
      <div className="p-4 border-t border-border-subtle">
        <button
          onClick={onDownloadAll}
          disabled={!hasContent}
          className="w-full py-2 px-4 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Télécharger tout (ZIP)
        </button>
      </div>
    </div>
  );
}
