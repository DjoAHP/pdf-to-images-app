import JSZip from 'jszip';
import type { ConvertedImage, ImageFolder } from '../types';

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadImage(image: ConvertedImage): void {
  fetch(image.url)
    .then(res => res.blob())
    .then(blob => downloadBlob(blob, image.name))
    .catch(err => console.error('Download failed:', err));
}

function dataURLtoBlob(dataURL: string): Blob {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

export async function downloadAllAsZip(
  singleImages: ConvertedImage[],
  folders: ImageFolder[]
): Promise<void> {
  const zip = new JSZip();

  // Add single images
  for (const image of singleImages) {
    const response = await fetch(image.url);
    const blob = await response.blob();
    zip.file(image.name, blob);
  }

  // Add folder images
  for (const folder of folders) {
    const folderZip = zip.folder(folder.pdfName);
    if (folderZip) {
      for (const image of folder.images) {
        const response = await fetch(image.url);
        const blob = await response.blob();
        folderZip.file(image.name, blob);
      }
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, 'images-converties.zip');
}

export async function downloadFolderAsZip(folder: ImageFolder): Promise<void> {
  const zip = new JSZip();

  for (const image of folder.images) {
    const response = await fetch(image.url);
    const blob = await response.blob();
    zip.file(image.name, blob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, `${folder.pdfName}.zip`);
}
