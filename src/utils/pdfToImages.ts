import * as pdfjsLib from 'pdfjs-dist';

// Configure pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.mjs',
  import.meta.url
).toString();

export interface ConversionProgress {
  currentPage: number;
  totalPages: number;
  pdfName: string;
}

export type ProgressCallback = (progress: ConversionProgress) => void;

export async function convertPdfToImages(
  file: File,
  onProgress?: ProgressCallback
): Promise<{ name: string; images: Blob[]; isMultiPage: boolean }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;
  const pdfName = file.name.replace(/\.pdf$/i, '');
  const images: Blob[] = [];

  const scale = 3; // Equivalent to zoom 3x in Python script

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);

    if (onProgress) {
      onProgress({
        currentPage: pageNum,
        totalPages,
        pdfName: file.name,
      });
    }

    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Cannot get 2d context from canvas');
    }

    await page.render({
      canvasContext: context,
      viewport,
    }).promise;

    const blob: Blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (result) resolve(result);
          else reject(new Error('Failed to convert canvas to blob'));
        },
        'image/jpeg',
        0.95 // High quality JPG
      );
    });

    images.push(blob);
  }

  return {
    name: pdfName,
    images,
    isMultiPage: totalPages > 1,
  };
}
