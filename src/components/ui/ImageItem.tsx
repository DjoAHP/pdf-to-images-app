import type { ConvertedImage } from '../../types';
import { Download } from 'lucide-react';

interface ImageItemProps {
  image: ConvertedImage;
  onDownload: (image: ConvertedImage) => void;
}

export function ImageItem({ image, onDownload }: ImageItemProps) {
  return (
    <div className="flex items-center gap-4 p-3 bg-bg-secondary/20 rounded-xl hover:bg-bg-secondary/40 transition-all duration-300 group border border-border-subtle/50 hover:border-accent/30">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary truncate">{image.name}</p>
      </div>
      <button
        onClick={() => onDownload(image)}
        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-accent/20 rounded-lg transition-all duration-300"
        title="Télécharger"
      >
        <Download className="w-4 h-4 text-text-muted hover:text-accent transition-colors" />
      </button>
    </div>
  );
}
