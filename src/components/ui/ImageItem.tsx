import type { ConvertedImage } from '../../types';
import { Download, Image } from 'lucide-react';

interface ImageItemProps {
  image: ConvertedImage;
  onDownload: (image: ConvertedImage) => void;
}

export function ImageItem({ image, onDownload }: ImageItemProps) {
  return (
    <div className="group flex items-center gap-3 p-2.5 bg-bg-secondary/40 hover:bg-bg-secondary/60 border border-border-subtle/50 hover:border-accent/30 rounded-lg transition-all duration-300 cursor-pointer">
      {/* Icon */}
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-bg-tertiary/60 flex items-center justify-center group-hover:bg-accent/10 transition-colors duration-300 border border-border-subtle/30">
        <Image className="w-4 h-4 text-text-muted/60 group-hover:text-accent transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-primary truncate">{image.name}</p>
        <p className="text-[10px] text-text-muted/60 mt-0.5">Image JPG</p>
      </div>

      {/* Download Button */}
      <button
        onClick={() => onDownload(image)}
        className="opacity-0 group-hover:opacity-100 flex-shrink-0 w-8 h-8 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-all duration-300 border border-accent/10 hover:border-accent/20 cursor-pointer"
        title="Télécharger"
      >
        <Download className="w-3.5 h-3.5 text-accent" />
      </button>
    </div>
  );
}