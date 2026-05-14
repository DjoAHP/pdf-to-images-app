import { useState, useCallback, useMemo } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { Terminal } from './components/Terminal';
import { RightSidebar } from './components/RightSidebar';
import { AppLayout } from './components/AppLayout';
import { Header } from './components/Header';
import { useTerminal } from './hooks/useTerminal';
import { useImageStore } from './hooks/useImageStore';
import { usePdfConverter } from './hooks/usePdfConverter';
import type { PDFFile, ConvertedImage, ImageFolder } from './types';

function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function App() {
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const { lines, clearTerminal, logInfo, logSuccess, logError, logProgress } = useTerminal();
  const { folders, singleImages, addSingleImage, addFolder, toggleFolder, clearAll } = useImageStore();

  const handleImageConverted = useCallback(
    (pdfId: string, images: { name: string; url: string; isFolder: boolean; folderName?: string }[]) => {
      const pdf = pdfs.find((p) => p.id === pdfId);
      if (!pdf) return;

      if (images[0]?.isFolder) {
        const folder: ImageFolder = {
          pdfId,
          pdfName: pdf.name.replace(/\.pdf$/i, ''),
          images: images.map((img) => ({
            id: generateId(),
            pdfId,
            name: img.name,
            url: img.url,
            isFolder: true,
            folderName: img.folderName,
          })),
          isExpanded: false,
        };
        addFolder(folder);
      } else {
        images.forEach((img) => {
          const convertedImage: ConvertedImage = {
            id: generateId(),
            pdfId,
            name: img.name,
            url: img.url,
            isFolder: false,
          };
          addSingleImage(convertedImage);
        });
      }
    },
    [pdfs, addFolder, addSingleImage]
  );

  const { isConverting, convertAll } = usePdfConverter({
    onLog: (text, type) => {
      switch (type) {
        case 'info':
          logInfo(text);
          break;
        case 'success':
          logSuccess(text);
          break;
        case 'error':
          logError(text);
          break;
        case 'progress':
          logProgress(text);
          break;
      }
    },
    onImageConverted: handleImageConverted,
    onStatusChange: (pdfId, status, totalPages, progress) => {
      setPdfs((prev) =>
        prev.map((p) =>
          p.id === pdfId
            ? { ...p, status, totalPages: totalPages || p.totalPages, progress }
            : p
        )
      );
    },
  });

  const handleAddPdfs = useCallback((files: File[]) => {
    const newPdfs: PDFFile[] = files.map((file) => ({
      id: generateId(),
      name: file.name,
      file,
      size: file.size,
      status: 'pending' as const,
    }));
    setPdfs((prev) => [...prev, ...newPdfs]);
    logInfo(`$ ${files.length} fichier(s) ajouté(s)`);
  }, [logInfo]);

  const handleConvertAll = useCallback(() => {
    convertAll(pdfs);
  }, [convertAll, pdfs]);

  const handleDownloadImage = useCallback((image: { name: string; url: string }) => {
    const a = document.createElement('a');
    a.href = image.url;
    a.download = image.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  const handleDownloadFolder = useCallback(async (folder: ImageFolder) => {
    const { downloadFolderAsZip } = await import('./utils/downloadUtils');
    await downloadFolderAsZip(folder);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    const { downloadAllAsZip } = await import('./utils/downloadUtils');
    await downloadAllAsZip(singleImages, folders);
  }, [singleImages, folders]);

  const handleClearAll = useCallback(() => {
    clearAll();
    setPdfs([]);
    clearTerminal();
    logInfo('$ Tout a été effacé');
  }, [clearAll, clearTerminal, logInfo]);

  const progressPercent = useMemo(() => {
    if (pdfs.length === 0) return 0;
    let totalProgress = 0;
    pdfs.forEach((pdf) => {
      if (pdf.status === 'done') {
        totalProgress += 100;
      } else if (pdf.status === 'converting' && pdf.progress != null && pdf.totalPages) {
        totalProgress += (pdf.progress / pdf.totalPages) * 100;
      }
    });
    return Math.round(totalProgress / pdfs.length);
  }, [pdfs]);

  const hasConvertedContent = folders.length > 0 || singleImages.length > 0;

  return (
    <AppLayout
      header={
        <Header
          pdfCount={pdfs.length}
          isConverting={isConverting}
          progressPercent={progressPercent}
        />
      }
      left={
        <LeftSidebar
          pdfs={pdfs}
          onAddPdfs={handleAddPdfs}
          onConvertAll={handleConvertAll}
          isConverting={isConverting}
          progressPercent={progressPercent}
        />
      }
      center={<Terminal lines={lines} onClear={clearTerminal} />}
      right={
        <RightSidebar
          folders={folders}
          singleImages={singleImages}
          onToggleFolder={toggleFolder}
          onDownloadImage={handleDownloadImage}
          onDownloadFolder={handleDownloadFolder}
          onDownloadAll={handleDownloadAll}
          onClearAll={handleClearAll}
          hasConvertedContent={hasConvertedContent}
        />
      }
    />
  );
}

export default App;