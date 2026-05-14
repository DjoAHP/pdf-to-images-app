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
    <div className="mb-2">
      {/* Folder Header */}
      <div
        className="flex items-center gap-3 p-3 bg-bg-secondary/40 hover:bg-bg-secondary/60 border border-border-subtle/50 hover:border-accent/30 rounded-lg cursor-pointer transition-all duration-300 group"
        onClick={() => onToggle(folder.pdfId)}
      >
        {/* Folder Icon */}
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
          {folder.isExpanded ? (
            <FolderOpen className="w-4 h-4 text-amber-400" />
          ) : (
            <Folder className="w-4 h-4 text-amber-500/80" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text-primary truncate">{folder.pdfName}/</p>
          <p className="text-[10px] text-text-muted/60 mt-0.5">{folder.images.length} image{folder.images.length > 1 ? 's' : ''}</p>
        </div>

        {/* Download Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadFolder(folder);
          }}
          className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-all duration-300 border border-accent/10 hover:border-accent/20 cursor-pointer"
          title="Télécharger le dossier (ZIP)"
        >
          <Download className="w-3.5 h-3.5 text-accent" />
        </button>
      </div>

      {/* Expanded Content */}
      {folder.isExpanded && (
        <div className="ml-6 mt-2 space-y-1.5 pl-4 border-l-2 border-border-subtle/30">
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