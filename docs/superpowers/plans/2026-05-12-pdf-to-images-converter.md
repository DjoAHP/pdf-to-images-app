# PDF to Images Converter Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a modern, dark-themed, glassmorphism PDF to images converter web app with 3-column layout (LeftSidebar, Terminal, RightSidebar) using React + Vite + TypeScript.

**Architecture:** Single-page React application with 3-column layout. PDF processing is 100% client-side using pdf.js. State managed via React hooks (useState/useReducer). Tailwind CSS v4 for styling with glassmorphism effects matching ToneLab design system (#13151C background, #1D7195 accent).

**Tech Stack:** React 18+, TypeScript, Vite, pdf.js, jszip, Tailwind CSS v4, lucide-react

---

## File Structure

```
pdf-to-images-app/
├── src/
│   ├── components/
│   │   ├── LeftSidebar.tsx          # Drag & drop zone + PDF list + convert button
│   │   ├── LeftSidebar.css          # Component-specific styles
│   │   ├── Terminal.tsx             # Unix-style terminal output
│   │   ├── Terminal.css            # Terminal styling
│   │   ├── RightSidebar.tsx         # Converted images + folders + download
│   │   ├── RightSidebar.css        # Component-specific styles
│   │   ├── AppLayout.tsx           # 3-column layout wrapper
│   │   └── ui/
│   │       ├── PdfCard.tsx          # Individual PDF item in left sidebar
│   │       ├── ImageItem.tsx        # Individual image item in right sidebar
│   │       └── FolderItem.tsx       # Expandable folder for multi-page PDFs
│   ├── hooks/
│   │   ├── usePdfConverter.ts       # PDF conversion logic with pdf.js
│   │   ├── useTerminal.ts          # Terminal log management
│   │   └── useImageStore.ts        # Global state for images
│   ├── utils/
│   │   ├── pdfToImages.ts          # Core conversion function
│   │   └── downloadUtils.ts        # ZIP creation + download triggers
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── App.tsx                     # Main app component
│   ├── index.css                   # Tailwind + design system vars
│   └── main.tsx                    # Entry point
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

### Task 1: Initialize Vite + React + TypeScript Project

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`

- [ ] **Step 1: Create project with npm create vite**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
npm create vite@latest . -- --template react-ts
```

Expected: Vite project scaffolded with React + TypeScript template

- [ ] **Step 2: Install base dependencies**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
npm install
```

Expected: node_modules installed, package-lock.json generated

- [ ] **Step 3: Verify dev server starts**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
npm run dev
```

Expected: Vite dev server running on localhost:5173

- [ ] **Step 4: Commit initial scaffolding**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add .
git commit -m "feat: initialise Vite + React + TypeScript project"
```

---

### Task 2: Install Project Dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install pdf.js, jszip, and lucide-react**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
npm install pdfjs-dist jszip lucide-react
```

Expected: Dependencies added to package.json

- [ ] **Step 2: Verify pdf.js version**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
npm list pdfjs-dist
```

Expected: pdfjs-dist version 4.x or 5.x installed

- [ ] **Step 3: Commit dependency changes**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add package.json package-lock.json
git commit -m "feat: add pdf.js, jszip, lucide-react dependencies"
```

---

### Task 3: Configure Tailwind CSS v4 + Design System

**Files:**
- Create: `src/index.css`
- Modify: `src/main.tsx`

- [ ] **Step 1: Install Tailwind CSS v4**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
npm install tailwindcss @tailwindcss/vite
```

Expected: Tailwind v4 installed with Vite plugin

- [ ] **Step 2: Configure vite.config.ts with Tailwind plugin**

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 3: Create index.css with Tailwind v4 + design system**

```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-bg-primary: #13151C;
  --color-bg-secondary: #1a1a2e;
  --color-accent: #1D7195;
  --color-accent-hover: rgba(29, 113, 149, 0.8);
  --color-border-subtle: rgba(29, 113, 149, 0.2);
  --color-border-accent: rgba(29, 113, 149, 0.3);
  --color-text-primary: #ffffff;
  --color-text-secondary: #d1d5db;
  --color-text-muted: #9ca3af;
  --color-terminal-bg: #0a0a0a;
  --color-success: #22c55e;
  --color-error: #ef4444;
  --color-progress: #60a5fa;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  overflow: hidden;
  height: 100vh;
}

#root {
  height: 100vh;
}
```

- [ ] **Step 4: Update main.tsx to import index.css**

```typescript
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 5: Commit Tailwind configuration**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add src/index.css src/main.tsx vite.config.ts package.json package-lock.json
git commit -m "feat: configure Tailwind CSS v4 with ToneLab design system"
```

---

### Task 4: Create TypeScript Interfaces

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Define all TypeScript interfaces**

```typescript
// src/types/index.ts

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
```

- [ ] **Step 2: Commit types**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add src/types/index.ts
git commit -m "feat: add TypeScript interfaces for PDF converter"
```

---

### Task 5: Create Terminal Hook (useTerminal)

**Files:**
- Create: `src/hooks/useTerminal.ts`

- [ ] **Step 1: Create terminal hook with log management**

```typescript
// src/hooks/useTerminal.ts
import { useState, useCallback } from 'react';
import type { TerminalLine } from '../types';

export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);

  const addLine = useCallback((text: string, type: TerminalLine['type'] = 'info') => {
    const newLine: TerminalLine = {
      id: `line-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      type,
      timestamp: new Date(),
    };
    setLines(prev => [...prev, newLine]);
  }, []);

  const clearTerminal = useCallback(() => {
    setLines([]);
  }, []);

  const logInfo = useCallback((text: string) => addLine(text, 'info'), [addLine]);
  const logSuccess = useCallback((text: string) => addLine(text, 'success'), [addLine]);
  const logError = useCallback((text: string) => addLine(text, 'error'), [addLine]);
  const logProgress = useCallback((text: string) => addLine(text, 'progress'), [addLine]);

  return {
    lines,
    addLine,
    clearTerminal,
    logInfo,
    logSuccess,
    logError,
    logProgress,
  };
}
```

- [ ] **Step 2: Commit terminal hook**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add src/hooks/useTerminal.ts
git commit -m "feat: add useTerminal hook for managing terminal logs"
```

---

### Task 6: Create Image Store Hook (useImageStore)

**Files:**
- Create: `src/hooks/useImageStore.ts`

- [ ] **Step 1: Create image store for managing converted images**

```typescript
// src/hooks/useImageStore.ts
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
```

- [ ] **Step 2: Commit image store hook**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add src/hooks/useImageStore.ts
git commit -m "feat: add useImageStore hook for managing converted images"
```

---

### Task 7: Create PDF Conversion Utility (pdfToImages.ts)

**Files:**
- Create: `src/utils/pdfToImages.ts`

- [ ] **Step 1: Create core PDF to images conversion function**

```typescript
// src/utils/pdfToImages.ts
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
```

- [ ] **Step 2: Commit PDF conversion utility**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add src/utils/pdfToImages.ts
git commit -m "feat: add pdfToImages utility using pdf.js with 3x zoom"
```

---

### Task 8: Create Download Utilities (downloadUtils.ts)

**Files:**
- Create: `src/utils/downloadUtils.ts`

- [ ] **Step 1: Create download utilities for ZIP and individual files**

```typescript
// src/utils/downloadUtils.ts
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
  const blob = dataURLtoBlob(image.url);
  downloadBlob(blob, image.name);
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
    const blob = dataURLtoBlob(image.url);
    zip.file(image.name, blob);
  }

  // Add folder images
  for (const folder of folders) {
    const folderZip = zip.folder(folder.pdfName);
    if (folderZip) {
      for (const image of folder.images) {
        const blob = dataURLtoBlob(image.url);
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
    const blob = dataURLtoBlob(image.url);
    zip.file(image.name, blob);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  downloadBlob(content, `${folder.pdfName}.zip`);
}
```

- [ ] **Step 2: Commit download utilities**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add src/utils/downloadUtils.ts
git commit -m "feat: add download utilities for individual and ZIP downloads"
```

---

### Task 9: Create PDF Converter Hook (usePdfConverter.ts)

**Files:**
- Create: `src/hooks/usePdfConverter.ts`

- [ ] **Step 1: Create main conversion hook wiring pdfToImages + terminal + imageStore**

```typescript
// src/hooks/usePdfConverter.ts
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
```

- [ ] **Step 2: Commit PDF converter hook**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add src/hooks/usePdfConverter.ts
git commit -m "feat: add usePdfConverter hook for batch PDF conversion"
```

---

### Task 10: Create LeftSidebar Component

**Files:**
- Create: `src/components/LeftSidebar.tsx`
- Create: `src/components/LeftSidebar.css`
- Create: `src/components/ui/PdfCard.tsx`

- [ ] **Step 1: Create PdfCard component**

```tsx
// src/components/ui/PdfCard.tsx
import type { PDFFile } from '../../types';
import { FileText, Loader2, CheckCircle, XCircle } from 'lucide-react';

interface PdfCardProps {
  pdf: PDFFile;
}

export function PdfCard({ pdf }: PdfCardProps) {
  const getStatusIcon = () => {
    switch (pdf.status) {
      case 'converting':
        return <Loader2 className="w-4 h-4 text-progress animate-spin" />;
      case 'done':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <FileText className="w-4 h-4 text-text-muted" />;
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-bg-secondary/50 rounded-lg border border-border-subtle hover:border-border-accent transition-all duration-200">
      {getStatusIcon()}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary truncate">{pdf.name}</p>
        <p className="text-xs text-text-muted">{formatSize(pdf.size)}</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create LeftSidebar component with drag & drop**

```tsx
// src/components/LeftSidebar.tsx
import { useCallback, useRef, useState } from 'react';
import type { PDFFile } from '../types';
import { PdfCard } from './ui/PdfCard';
import { FileDown } from 'lucide-react';

interface LeftSidebarProps {
  pdfs: PDFFile[];
  onAddPdfs: (files: File[]) => void;
  onConvertAll: () => void;
  isConverting: boolean;
}

export function LeftSidebar({ pdfs, onAddPdfs, onConvertAll, isConverting }: LeftSidebarProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter(
        (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
      );
      if (files.length > 0) {
        onAddPdfs(files);
      }
    },
    [onAddPdfs]
  );

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );
    if (files.length > 0) {
      onAddPdfs(files);
    }
    e.target.value = '';
  };

  return (
    <div className="w-[300px] h-full bg-bg-primary/80 backdrop-blur-md border-r border-border-subtle flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border-subtle">
        <h2 className="text-lg font-semibold text-text-primary">PDFs</h2>
      </div>

      {/* Drop Zone */}
      <div
        className={`flex-1 p-4 overflow-y-auto ${
          isDragOver ? 'bg-accent/10 border-accent/50' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {pdfs.length === 0 ? (
          <div
            onClick={handleClick}
            className="border-2 border-dashed border-border-subtle rounded-lg p-8 text-center cursor-pointer hover:border-border-accent transition-all duration-200"
          >
            <FileDown className="w-12 h-12 mx-auto mb-3 text-text-muted" />
            <p className="text-text-secondary">Glissez vos PDF ici</p>
            <p className="text-sm text-text-muted mt-1">ou cliquez pour sélectionner</p>
          </div>
        ) : (
          <div className="space-y-2">
            {pdfs.map((pdf) => (
              <PdfCard key={pdf.id} pdf={pdf} />
            ))}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,application/pdf"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Convert Button */}
      <div className="p-4 border-t border-border-subtle">
        <button
          onClick={onConvertAll}
          disabled={pdfs.length === 0 || isConverting}
          className="w-full py-2 px-4 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isConverting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Conversion...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              PDF&gt;Images
            </>
          )}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit LeftSidebar component**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add src/components/LeftSidebar.tsx src/components/ui/PdfCard.tsx
git commit -m "feat: add LeftSidebar with drag & drop and PDF list"
```

---

### Task 11: Create Terminal Component

**Files:**
- Create: `src/components/Terminal.tsx`

- [ ] **Step 1: Create Terminal component with auto-scroll**

```tsx
// src/components/Terminal.tsx
import { useEffect, useRef } from 'react';
import type { TerminalLine } from '../types';

interface TerminalProps {
  lines: TerminalLine[];
}

export function Terminal({ lines }: TerminalProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines.length]);

  const getLineColor = (type: TerminalLine['type']) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'progress':
        return 'text-progress';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="flex-1 h-full bg-terminal-bg/90 backdrop-blur-sm border border-border-accent rounded-lg m-2 overflow-hidden flex flex-col">
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-bg-secondary/50 border-b border-border-subtle">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-error/80" />
          <div className="w-3 h-3 rounded-full bg-progress/80" />
          <div className="w-3 h-3 rounded-full bg-success/80" />
        </div>
        <span className="text-sm text-text-muted ml-2">Terminal</span>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm">
        {lines.length === 0 ? (
          <p className="text-text-muted">
            $ Prêt pour la conversion...
          </p>
        ) : (
          lines.map((line) => (
            <div key={line.id} className={`mb-1 ${getLineColor(line.type)}`}>
              {line.text}
            </div>
          ))
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit Terminal component**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add src/components/Terminal.tsx
git commit -m "feat: add Terminal component with auto-scroll and colored output"
```

---

### Task 12: Create RightSidebar Component

**Files:**
- Create: `src/components/RightSidebar.tsx`
- Create: `src/components/ui/ImageItem.tsx`
- Create: `src/components/ui/FolderItem.tsx`

- [ ] **Step 1: Create ImageItem component**

```tsx
// src/components/ui/ImageItem.tsx
import type { ConvertedImage } from '../../types';
import { Download } from 'lucide-react';

interface ImageItemProps {
  image: ConvertedImage;
  onDownload: (image: ConvertedImage) => void;
}

export function ImageItem({ image, onDownload }: ImageItemProps) {
  return (
    <div className="flex items-center gap-3 p-2 bg-bg-secondary/30 rounded-md hover:bg-bg-secondary/50 transition-all duration-200 group">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary truncate">{image.name}</p>
      </div>
      <button
        onClick={() => onDownload(image)}
        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent/20 rounded transition-all duration-200"
        title="Télécharger"
      >
        <Download className="w-4 h-4 text-text-muted" />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create FolderItem component (expandable)**

```tsx
// src/components/ui/FolderItem.tsx
import { useState } from 'react';
import type { ImageFolder } from '../../types';
import { FolderOpen, Folder, Download } from 'lucide-react';
import { ImageItem } from './ImageItem';

interface FolderItemProps {
  folder: ImageFolder;
  onToggle: (pdfId: string) => void;
  onDownloadImage: (image: { name: string; url: string }) => void;
  onDownloadFolder: (folder: ImageFolder) => void;
}

export function FolderItem({
  folder,
  onToggle,
  onDownloadImage,
  onDownloadFolder,
}: FolderItemProps) {
  return (
    <div className="mb-2">
      <div
        className="flex items-center gap-2 p-2 bg-bg-secondary/30 rounded-md hover:bg-bg-secondary/50 cursor-pointer transition-all duration-200"
        onClick={() => onToggle(folder.pdfId)}
      >
        {folder.isExpanded ? (
          <FolderOpen className="w-4 h-4 text-accent" />
        ) : (
          <Folder className="w-4 h-4 text-accent" />
        )}
        <span className="flex-1 text-sm text-text-primary truncate">{folder.pdfName}/</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownloadFolder(folder);
          }}
          className="p-1 hover:bg-accent/20 rounded transition-all duration-200"
          title="Télécharger le dossier (ZIP)"
        >
          <Download className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>

      {folder.isExpanded && (
        <div className="ml-6 mt-1 space-y-1">
          {folder.images.map((image) => (
            <ImageItem
              key={image.id}
              image={image}
              onDownload={onDownloadImage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 3: Create RightSidebar component**

```tsx
// src/components/RightSidebar.tsx
import { Download } from 'lucide-react';
import type { ImageFolder, ConvertedImage } from '../types';
import { FolderItem } from './ui/FolderItem';
import { ImageItem } from './ui/ImageItem';

interface RightSidebarProps {
  folders: ImageFolder[];
  singleImages: ConvertedImage[];
  onToggleFolder: (pdfId: string) => void;
  onDownloadImage: (image: ConvertedImage) => void;
  onDownloadFolder: (folder: ImageFolder) => void;
  onDownloadAll: () => void;
}

export function RightSidebar({
  folders,
  singleImages,
  onToggleFolder,
  onDownloadImage,
  onDownloadFolder,
  onDownloadAll,
}: RightSidebarProps) {
  const hasContent = folders.length > 0 || singleImages.length > 0;

  return (
    <div className="w-[300px] h-full bg-bg-primary/80 backdrop-blur-md border-l border-border-subtle flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border-subtle">
        <h2 className="text-lg font-semibold text-text-primary">Images converties</h2>
      </div>

      {/* Images List */}
      <div className="flex-1 p-4 overflow-y-auto">
        {!hasContent ? (
          <p className="text-text-muted text-center mt-8">
            Aucune image convertie
          </p>
        ) : (
          <div className="space-y-2">
            {/* Folders (multi-page PDFs) */}
            {folders.map((folder) => (
              <FolderItem
                key={folder.pdfId}
                folder={folder}
                onToggle={onToggleFolder}
                onDownloadImage={onDownloadImage}
                onDownloadFolder={onDownloadFolder}
              />
            ))}

            {/* Single images (1-page PDFs) */}
            {singleImages.map((image) => (
              <ImageItem
                key={image.id}
                image={image}
                onDownload={onDownloadImage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Download All Button */}
      <div className="p-4 border-t border-border-subtle">
        <button
          onClick={onDownloadAll}
          disabled={!hasContent}
          className="w-full py-2 px-4 bg-accent hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed text-text-primary font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          Télécharger tout (ZIP)
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit RightSidebar component**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add src/components/RightSidebar.tsx src/components/ui/ImageItem.tsx src/components/ui/FolderItem.tsx
git commit -m "feat: add RightSidebar with image list, folders, and download buttons"
```

---

### Task 13: Create AppLayout and Wire Up App.tsx

**Files:**
- Create: `src/components/AppLayout.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create AppLayout component**

```tsx
// src/components/AppLayout.tsx
import type { ReactNode } from 'react';

interface AppLayoutProps {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}

export function AppLayout({ left, center, right }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {left}
      <div className="flex-1 flex flex-col overflow-hidden">
        {center}
      </div>
      {right}
    </div>
  );
}
```

- [ ] **Step 2: Wire up App.tsx with all components and state**

```tsx
// src/App.tsx
import { useState, useCallback } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { Terminal } from './components/Terminal';
import { RightSidebar } from './components/RightSidebar';
import { AppLayout } from './components/AppLayout';
import { useTerminal } from './hooks/useTerminal';
import { useImageStore } from './hooks/useImageStore';
import { usePdfConverter } from './hooks/usePdfConverter';
import type { PDFFile, ConvertedImage, ImageFolder } from './types';

function generateId() {
  return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function App() {
  const [pdfs, setPdfs] = useState<PDFFile[]>([]);
  const { lines, logInfo, logSuccess, logError, logProgress } = useTerminal();
  const { folders, singleImages, addSingleImage, addFolder, toggleFolder, clearAll, getAllImages } = useImageStore();

  const handleImageConverted = useCallback(
    (pdfId: string, images: { name: string; url: string; isFolder: boolean; folderName?: string }[]) => {
      const pdf = pdfs.find((p) => p.id === pdfId);
      if (!pdf) return;

      if (images[0]?.isFolder) {
        // Multi-page: create folder
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
        // Single page: add single image
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
    onStatusChange: (pdfId, status, totalPages) => {
      setPdfs((prev) =>
        prev.map((p) =>
          p.id === pdfId ? { ...p, status, totalPages: totalPages || p.totalPages } : p
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

  return (
    <AppLayout
      left={
        <LeftSidebar
          pdfs={pdfs}
          onAddPdfs={handleAddPdfs}
          onConvertAll={handleConvertAll}
          isConverting={isConverting}
        />
      }
      center={<Terminal lines={lines} />}
      right={
        <RightSidebar
          folders={folders}
          singleImages={singleImages}
          onToggleFolder={toggleFolder}
          onDownloadImage={handleDownloadImage}
          onDownloadFolder={handleDownloadFolder}
          onDownloadAll={handleDownloadAll}
        />
      }
    />
  );
}

export default App;
```

- [ ] **Step 3: Commit App.tsx and AppLayout**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add src/App.tsx src/components/AppLayout.tsx
git commit -m "feat: wire up App with all components, state management, and event handlers"
```

---

### Task 14: Update index.html with SEO and French Language

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Update index.html**

```html
<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Convertisseur PDF vers images moderne - Glissez vos PDF et convertissez-les en images JPG" />
    <meta property="og:title" content="PDF to Images Converter" />
    <meta property="og:description" content="Convertissez vos PDF en images JPG avec un zoom 3x - Application moderne sombre" />
    <title>PDF to Images Converter</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 2: Commit index.html update**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add index.html
git commit -m "feat: update index.html with SEO meta tags and French language"
```

---

### Task 15: Build and Verify

**Files:**
- Modify: `package.json` (if needed for build scripts)

- [ ] **Step 1: Run build to verify no errors**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
npm run build
```

Expected: Build succeeds without errors, output in `dist/` folder

- [ ] **Step 2: Test dev server manually**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
npm run dev
```

Expected: App loads at localhost:5173 with 3-column layout

- [ ] **Step 3: Final commit - build verification**

```bash
cd "C:\devapp\35.PDFtoIMAGES\pdf-to-images-app"
git add .
git commit -m "feat: complete PDF to Images Converter - build verified"
```

---

## Self-Review Checklist

**1. Spec coverage:**
- ✅ Architecture React + Vite + TypeScript (Task 1)
- ✅ Design sombre + glassmorphism (Task 3)
- ✅ LeftSidebar with drag & drop (Task 10)
- ✅ Terminal component (Task 11)
- ✅ RightSidebar with folders (Task 12)
- ✅ PDF conversion with pdf.js 3x zoom (Task 7)
- ✅ ZIP download with jszip (Task 8)
- ✅ Batch conversion "PDF>Images" button (Task 10)
- ✅ Individual + ZIP download (Task 8, 12)
- ✅ Multi-page PDF folder structure (Task 12)
- ✅ Error handling in conversion (Task 9)

**2. Placeholder scan:** No TBD/TODO found ✓

**3. Type consistency:** All interfaces defined in Task 4, used consistently across Tasks 9-13 ✓

**4. No ambiguities detected** ✓

---

Plan complete and saved to `docs/superpowers/plans/2026-05-12-pdf-to-images-converter.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
