import { useState, useCallback } from 'react';
import type { PDFFile } from '../types';
import { convertPdfToImages } from '../utils/pdfToImages';
import type { ProgressCallback } from '../utils/pdfToImages';

interface UsePdfConverterProps {
  onLog: (text: string, type: 'info' | 'success' | 'error' | 'progress') => void;
  onImageConverted: (pdfId: string, images: { name: string; url: string; isFolder: boolean; folderName?: string }[]) => void;
  onStatusChange: (pdfId: string, status: PDFFile['status'], totalPages?: number, progress?: number) => void;
}

export function usePdfConverter({
  onLog,
  onImageConverted,
  onStatusChange,
}: UsePdfConverterProps) {
  const [isConverting, setIsConverting] = useState(false);

  const convertPdf = useCallback(
    async (pdfFile: PDFFile) => {
      onStatusChange(pdfFile.id, 'converting', undefined, 0);
      onLog(`$ Conversion de "${pdfFile.name}"...`, 'info');

      try {
        const onProgress: ProgressCallback = (progress) => {
          onLog(
            `> Page ${progress.currentPage}/${progress.totalPages} convertie (zoom 3x)`,
            'progress'
          );
          onStatusChange(
            pdfFile.id,
            'converting',
            progress.totalPages,
            progress.currentPage
          );
        };

        const result = await convertPdfToImages(pdfFile.file, onProgress);

        onLog(
          `> PDF chargé: ${result.images.length} page${result.images.length > 1 ? 's' : ''} détectée${result.images.length > 1 ? 's' : ''}`,
          'progress'
        );

        const convertedImages = [];

        if (result.isMultiPage) {
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
        } else {
          const url = URL.createObjectURL(result.images[0]);
          convertedImages.push({
            name: result.name + '.jpg',
            url,
            isFolder: false,
          });
        }

        onImageConverted(pdfFile.id, convertedImages);
        onStatusChange(pdfFile.id, 'done', result.images.length);
        onLog(`✔ "${pdfFile.name}" converti avec succès (${result.images.length} page${result.images.length > 1 ? 's' : ''})`, 'success');
      } catch (error) {
        onStatusChange(pdfFile.id, 'error');
        onLog(`✘ Erreur lors de la conversion de "${pdfFile.name}": ${error instanceof Error ? error.message : 'Erreur inconnue'}`, 'error');
      }
    },
    [onLog, onImageConverted, onStatusChange]
  );

  const convertAll = useCallback(
    async (files: PDFFile[]) => {
      if (files.length === 0) return;
      setIsConverting(true);
      onLog(`$ Démarrage de la conversion de ${files.length} fichier(s)...`, 'info');

      for (const file of files) {
        await convertPdf(file);
      }

      setIsConverting(false);
      onLog(`$ Conversion terminée.`, 'success');
    },
    [convertPdf, onLog]
  );

  return { isConverting, convertAll };
}