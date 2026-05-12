import { useState, useCallback } from 'react';
import type { PDFFile } from '../types';
import { convertPdfToImages } from '../utils/pdfToImages';
import type { ProgressCallback } from '../utils/pdfToImages';

interface UsePdfConverterProps {
  onLog: (text: string, type: 'info' | 'success' | 'error' | 'progress') => void;
  onImageConverted: (pdfId: string, images: { name: string; url: string; isFolder: boolean; folderName?: string }[]) => void;
  onStatusChange: (pdfId: string, status: PDFFile['status'], totalPages?: number) => void;
}

export function usePdfConverter({
  onLog,
  onImageConverted,
  onStatusChange,
}: UsePdfConverterProps) {
  const [isConverting, setIsConverting] = useState(false);

  const convertPdf = useCallback(
    async (pdfFile: PDFFile) => {
      onStatusChange(pdfFile.id, 'converting', undefined);
      onLog(`$ Conversion de "${pdfFile.name}"...`, 'info');

      try {
        const onProgress: ProgressCallback = (progress) => {
          onLog(
            `> Page ${progress.currentPage}/${progress.totalPages} convertie (zoom 3x)`,
            'progress'
          );
        };

        const result = await convertPdfToImages(pdfFile.file, onProgress);

        onLog(
          `> PDF chargé: ${result.images.length} pages détectées`,
          'progress'
        );

        const convertedImages = [];

        if (result.isMultiPage) {
          // Multi-page: create folder structure
          for (let i = 0; i < result.images.length; i++) {
            const pageNum = String(i + 1).padStart(3, '0');
            const filename = `page_${pageNum}.jpg`;
            const url = URL.createObjectURL(result.images[i]);
            convertedImages.push({
              name: filename,
              url,
              isFolder: true,
              folderName: result.name,
            });
          }
          onLog(
            `✓ "${pdfFile.name}" terminé (${result.images.length} pages)`,
            'success'
          );
        } else {
          // Single page: single image
          const filename = `${result.name}.jpg`;
          const url = URL.createObjectURL(result.images[0]);
          convertedImages.push({
            name: filename,
            url,
            isFolder: false,
          });
          onLog(`✓ "${pdfFile.name}" terminé (1 page)`, 'success');
        }

        onImageConverted(pdfFile.id, convertedImages);
        onStatusChange(pdfFile.id, 'done', result.images.length);
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Erreur inconnue';
        onLog(`✗ Erreur conversion "${pdfFile.name}": ${message}`, 'error');
        onStatusChange(pdfFile.id, 'error');
      }
    },
    [onLog, onImageConverted, onStatusChange]
  );

  const convertAll = useCallback(
    async (pdfFiles: PDFFile[]) => {
      setIsConverting(true);
      const pendingFiles = pdfFiles.filter(f => f.status === 'pending');

      onLog(`$ Début de la conversion de ${pendingFiles.length} fichier(s)...`, 'info');

      for (const pdfFile of pendingFiles) {
        await convertPdf(pdfFile);
      }

      onLog(`$ Conversion terminée ! (${pendingFiles.length} fichiers traités)`, 'success');
      setIsConverting(false);
    },
    [convertPdf]
  );

  return {
    isConverting,
    convertAll,
  };
}
