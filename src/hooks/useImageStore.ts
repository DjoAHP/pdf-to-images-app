import { useState, useCallback } from 'react';
import type { ConvertedImage, ImageFolder } from '../types';

export function useImageStore() {
  const [folders, setFolders] = useState<ImageFolder[]>([]);
  const [singleImages, setSingleImages] = useState<ConvertedImage[]>([]);

  const addSingleImage = useCallback((image: ConvertedImage) => {
    setSingleImages(prev => [...prev, image]);
  }, []);

  const addFolder = useCallback((folder: ImageFolder) => {
    setFolders(prev => [...prev, folder]);
  }, []);

  const toggleFolder = useCallback((pdfId: string) => {
    setFolders(prev =>
      prev.map(folder =>
        folder.pdfId === pdfId
          ? { ...folder, isExpanded: !folder.isExpanded }
          : folder
      )
    );
  }, []);

  const clearAll = useCallback(() => {
    // Revoke object URLs to prevent memory leaks
    singleImages.forEach(img => URL.revokeObjectURL(img.url));
    folders.forEach(folder => {
      folder.images.forEach(img => URL.revokeObjectURL(img.url));
    });
    setSingleImages([]);
    setFolders([]);
  }, [singleImages, folders]);

  const getAllImages = useCallback(() => {
    const imagesFromFolders = folders.flatMap(f => f.images);
    return [...singleImages, ...imagesFromFolders];
  }, [singleImages, folders]);

  return {
    folders,
    singleImages,
    addSingleImage,
    addFolder,
    toggleFolder,
    clearAll,
    getAllImages,
  };
}
