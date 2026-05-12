import type { ConvertedImage } from '../../types';
import { Download } from 'lucide-react';

interface ImageItemProps {
  image: ConvertedImage;
  onDownload: (image: ConvertedImage) => void;
}

export function ImageItem({ image, onDownload }: ImageItemProps) {
  return (
    <div className="flex items-center gap-3 p-2 bg-bg-secondary/30 rounded-md hover:bg-bg-secondary/50 transition-all duration-200 group">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary truncate">{image.name}</p>
      </div>
      <button
        onClick={() => onDownload(image)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent/20 rounded transition-all duration-200"
        title="Télécharger"
      >
        <Download className="w-4 h-4 text-text-muted" />
      </button>
    </div>
  );
}
