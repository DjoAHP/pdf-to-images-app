import { useState } from 'react';
import type { ImageFolder } from '../../types';
import { FolderOpen, Folder, Download } from 'lucide-react';
import { ImageItem } from './ImageItem';

interface FolderItemProps {
  folder: ImageFolder;
  onToggle: (pdfId: string) => void;
  onDownloadImage: (image: { name: string; url: string }) => void;
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
      <div
        className="flex items-center gap-2 p-2 bg-bg-secondary/30 rounded-md hover:bg-bg-secondary/50 cursor-pointer transition-all duration-200"
        onClick={() => onToggle(folder.pdfId)}
      >
        {folder.isExpanded ? (
          <FolderOpen className="w-4 h-4 text-accent" />
        ) : (
          <Folder className="w-4 h-4 text-accent" />
        )}
        <span className="flex-1 text-sm text-text-primary truncate">{folder.pdfName}/</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadFolder(folder);
          }}
          className="p-1 hover:bg-accent/20 rounded transition-all duration-200"
          title="Télécharger le dossier (ZIP)"
        >
          <Download className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>

      {folder.isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
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
