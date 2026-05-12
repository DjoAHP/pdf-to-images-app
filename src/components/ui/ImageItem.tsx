import type { ConvertedImage } from '../../types';
import { Download, Image } from 'lucide-react';

interface ImageItemProps {
  image: ConvertedImage;
  onDownload: (image: ConvertedImage) => void;
}

export function ImageItem({ image, onDownload }: ImageItemProps) {
  return (
    <div className="group flex items-center gap-4 p-3.5 bg-bg-secondary/20 hover:bg-bg-secondary/40 border border-border-subtle/50 hover:border-accent/30 rounded-2xl transition-all duration-300">
      {/* Icon */}
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-bg-secondary/50 flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300">
        <Image className="w-5 h-5 text-text-muted/70 group-hover:text-accent transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{image.name}</p>
        <p className="text-xs text-text-muted/70 mt-0.5">Image JPG</p>
      </div>

      {/* Download Button */}
      <button
        onClick={() => onDownload(image)}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-9 h-9 rounded-xl bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-all duration-300"
        title="Télécharger"
      >
        <Download className="w-4 h-4 text-accent" />
      </button>
    </div>
  );
}
