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
    <div className="mb-4">
      {/* Folder Header */}
      <div
        className="flex items-center gap-4 p-4 bg-bg-secondary/20 hover:bg-bg-secondary/40 border border-border-subtle/50 hover:border-accent/30 rounded-2xl cursor-pointer transition-all duration-300"
        onClick={() => onToggle(folder.pdfId)}
      >
        {/* Folder Icon */}
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
          {folder.isExpanded ? (
            <FolderOpen className="w-6 h-6 text-amber-400" />
          ) : (
            <Folder className="w-6 h-6 text-amber-500/80" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{folder.pdfName}/</p>
          <p className="text-xs text-text-muted/70 mt-0.5">{folder.images.length} image(s)</p>
        </div>

        {/* Download Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadFolder(folder);
          }}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-9 h-9 rounded-xl bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-all duration-300"
          title="Télécharger le dossier (ZIP)"
        >
          <Download className="w-4 h-4 text-accent" />
        </button>
      </div>

      {/* Expanded Content */}
      {folder.isExpanded && (
        <div className="ml-10 mt-3 space-y-2 pl-4 border-l-2 border-border-subtle/30">
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
