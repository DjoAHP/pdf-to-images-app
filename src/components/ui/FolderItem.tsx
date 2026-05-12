import { FolderOpen, Folder, Download } from 'lucide-react';
import { ImageItem } from './ImageItem';
import type { ImageFolder, ConvertedImage } from '../../types';

interface FolderItemProps {
  folder: ImageFolder;
  onToggle: (pdfId: string) => void;
  onDownloadImage: (image: ConvertedImage) => void;
  onDownloadFolder: (folder: ImageFolder) => void;
}

export function FolderItem({
  folder,
  onToggle,
  onDownloadImage,
  onDownloadFolder,
}: FolderItemProps) {
  return (
    <div className="mb-3">
      <div
        className="flex items-center gap-3 p-3 bg-bg-secondary/20 rounded-xl hover:bg-bg-secondary/40 cursor-pointer transition-all duration-300 border border-border-subtle/50 hover:border-accent/30"
        onClick={() => onToggle(folder.pdfId)}
      >
        <div className="flex-shrink-0">
          {folder.isExpanded ? (
            <FolderOpen className="w-5 h-5 text-accent" />
          ) : (
            <Folder className="w-5 h-5 text-accent/80" />
          )}
        </div>
        <span className="flex-1 text-sm font-medium text-text-primary truncate">{folder.pdfName}/</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadFolder(folder);
          }}
          className="p-2 hover:bg-accent/20 rounded-lg transition-all duration-300"
          title="Télécharger le dossier (ZIP)"
        >
          <Download className="w-4 h-4 text-text-muted hover:text-accent transition-colors" />
        </button>
      </div>

      {folder.isExpanded && (
        <div className="ml-8 mt-2 space-y-2">
          {folder.images.map((image) => (
            <ImageItem
              key={image.id}
              image={image}
              onDownload={onDownloadImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
