export interface PDFFile {
  id: string;
  name: string;
  file: File;
  size: number;
  status: 'pending' | 'converting' | 'done' | 'error';
  progress?: number;
  totalPages?: number;
  convertedImages?: ConvertedImage[];
}

export interface ConvertedImage {
  id: string;
  pdfId: string;
  name: string;
  url: string;
  isFolder: boolean;
  folderName?: string;
  pageNumber?: number;
}

export interface TerminalLine {
  id: string;
  text: string;
  type: 'info' | 'success' | 'error' | 'progress';
  timestamp: Date;
}

export interface ImageFolder {
  pdfId: string;
  pdfName: string;
  images: ConvertedImage[];
  isExpanded: boolean;
}
