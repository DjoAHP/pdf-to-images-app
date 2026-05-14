# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PDF to Images Converter** — A modern dark-themed web application that converts PDF files into JPG images using pdfjs-dist (PDF.js). Built with React 19, TypeScript, Vite, and Tailwind CSS v4.

**Core functionality:**
- Drag-and-drop or click to upload PDF files
- Converts each PDF page to a high-quality JPG image (3x zoom / ~288 DPI equivalent)
- Multi-page PDFs are grouped into collapsible folders; single-page PDFs appear as standalone images
- Download individual images, per-PDF folders as ZIP, or all converted images as a single ZIP archive
- Terminal-style log panel showing real-time conversion progress, success, and error messages

## Architecture

### Entry point and component tree

```
src/
  main.tsx              → createRoot → <StrictMode><App /></StrictMode>
  App.tsx               → Orchestrates all hooks, wires layout + sidebars + terminal
  index.css             → Tailwind import + CSS custom properties (dark theme tokens + glass system)
  components/
    AppLayout.tsx       → 3-row flex layout: header(top) | content area(left | center | right)
    Header.tsx          → Fixed top bar: logo, file counter, inline progress bar
    LeftSidebar.tsx     → PDF upload (drag-drop + file input) + PdfCard list + Convert All button
    RightSidebar.tsx    → Converted image/folder list + individual download + "Download All" ZIP button
    Terminal.tsx         → Collapsible log panel with macOS-style dots, color-coded messages
    ui/
      button.tsx        → shadcn-style Button with cva variants (pill-shape, rounded-full)
      PdfCard.tsx        → Status card with left border, badge, hover action buttons
      FolderItem.tsx     → Collapsible folder for multi-page PDFs, contains ImageItem children
      ImageItem.tsx      → Single converted image row with download button
  hooks/
    usePdfConverter.ts  → Core conversion logic: orchestrates pdfToImages, updates status, logs
    useImageStore.ts    → State store for converted images (folders + singles), toggle, clear, getAll
    useTerminal.ts      → Terminal log state: addLine, logInfo/Success/Error/Progress, clearTerminal
  lib/
    utils.ts            → `cn()` helper: clsx + tailwind-merge for class composition
  types/
    index.ts            → Shared TypeScript interfaces: PDFFile, ConvertedImage, TerminalLine, ImageFolder
  utils/
    pdfToImages.ts      → PDF.js integration: renders each page to canvas → Blob, returns image array
    downloadUtils.ts    → ZIP generation (JSZip) and blob-triggered file downloads
  assets/               → Static assets directory (icons, logos)
```

### Data flow

1. **User uploads PDFs** → `LeftSidebar` captures `File[]` via drag-drop or `<input type="file">` → calls `onAddPdfs`
2. **App creates `PDFFile[]`** entries with `status: 'pending'` and passes them to `usePdfConverter`
3. **"Convert All" clicked** → `usePdfConverter.convertAll()` iterates pending PDFs sequentially
4. **Each PDF** is processed by `convertPdfToImages()` (pdfToImages.ts) using PDF.js:
   - Renders each page at `scale: 3` onto an off-screen `<canvas>`
   - Converts canvas to `Blob` (JPEG, quality 0.95)
   - Calls `onProgress` callback per page
   - Returns `{ name, images: Blob[], isMultiPage }`
5. **Results flow back** via callbacks:
   - Multi-page → `useImageStore.addFolder()` groups images under a folder
   - Single-page → `useImageStore.addSingleImage()` adds directly to the list
   - `useTerminal` logs progress per page and final success/error
   - `onStatusChange` updates each PDF's status+progress → recalculates global progress
6. **Right Sidebar** reads from `useImageStore` to display folders and images with download buttons
7. **Download** uses `downloadUtils.ts`: individual images via `<a download>`, ZIP archives via JSZip

### Key interfaces (src/types/index.ts)

- **`PDFFile`**: `{ id, name, file, size, status, progress?, totalPages? }`
  - `status` is a union: `'pending' | 'converting' | 'done' | 'error'`
- **`ConvertedImage`**: `{ id, pdfId, name, url, isFolder, folderName?, pageNumber? }`
  - `url` is an `objectURL` created via `URL.createObjectURL(blob)`
- **`ImageFolder`**: `{ pdfId, pdfName, images: ConvertedImage[], isExpanded }`
- **`TerminalLine`**: `{ id, text, type: 'info'|'success'|'error'|'progress', timestamp }`

## Design system

### Color palette (`src/index.css` → `@theme`)

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg-primary` | `#0f1117` | Page background, sidebar base |
| `--color-bg-secondary` | `#161922` | Cards, panels |
| `--color-bg-tertiary` | `#1c2030` | Inputs, badge backgrounds |
| `--color-accent` | `#22d3ee` | Primary buttons, progress bar, links |
| `--color-accent-secondary` | `#67e8f9` | Hover states |
| `--color-text-primary` | `#f1f5f9` | Headings, primary text |
| `--color-text-secondary` | `#cbd5e1` | Subheadings |
| `--color-text-muted` | `#94a3b8` | Labels, captions |
| `--color-success` | `#4ade80` | Success status, green dot |
| `--color-error` | `#f87171` | Error status, red dot |
| `--color-progress` | `#818cf8` | Converting status, indigo dot |
| `--color-amber` | `#fbbf24` | Folder icons, amber dot |

### Radius scale

| Token | Value |
|-------|-------|
| `--radius-sm` | `12px` |
| `--radius-md` | `16px` |
| `--radius-lg` | `24px` |
| `--radius-xl` | `32px` |

### Shadows

| Token | Value |
|-------|-------|
| `--shadow-glass` | `0 8px 32px rgba(0, 0, 0, 0.3)` |
| `--shadow-accent` | `0 4px 20px rgba(34, 211, 238, 0.15)` |

### Buttons (`src/components/ui/button.tsx`)

All buttons use **pill-shape** (`rounded-full`) by default:

| Variant | Style |
|---------|-------|
| `default` | Cyan accent with glow shadow, hover brightens |
| `destructive` | Red background, white text |
| `outline` | Subtle border, hover fills with accent/5 |
| `secondary` | Glass-card look with subtle border |
| `ghost` | Transparent, hover accent/10 |
| `link` | Underline on hover |

Sizes: `sm` (h-9), `default` (h-11), `lg` (h-13), `xl` (h-14), `icon` (h-11 w-11) — all with `rounded-full` or `rounded-xl`/`rounded-2xl`.

## Styling approach

- **Tailwind CSS v4** via `@tailwindcss/vite` plugin
- **Dark theme** defined as CSS custom properties in `src/index.css` under `@theme`
- **Glassmorphism**: `backdrop-filter: blur(20px) saturate(160%)` on header + sidebars
- **Transition system**: All interactive elements use `duration-300 cubic-bezier(0.16, 1, 0.3, 1)` for smooth feel
- **Consistent spacing**: 8px grid system (px-8, py-6, py-7, p-4, etc.)
- **Typography**: Inter font family, `font-feature-settings: 'cv02', 'cv03', 'ss01'` for refined rendering

## Build & Development

```bash
# Install dependencies (already done, node_modules exists)
npm install

# Start dev server with HMR
npm run dev

# Build for production (tsc + vite build)
npm run build

# Preview production build locally
npm run preview

# Lint with ESLint
npm run lint
```

### Tooling

| Tool | Purpose |
|------|---------|
| **Vite 8** | Dev server + bundler with HMR |
| **TypeScript ~6.0** | Type checking, `bundler` module resolution |
| **ESLint 10** | Linting (js/recommended, typescript/recommended, react-hooks, react-refresh) |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **pdfjs-dist 5.7** | PDF rendering engine (Mozilla's PDF.js) |
| **JSZip 3** | Client-side ZIP archive generation |
| **Lucide React 1.14** | Icon library (FileText, Download, Folder, etc.) |

## Important notes

- **No test framework** is configured. There are no test files in the project.
- **`convert.py`** is a separate Python script (using PyMuPDF/fitz) for server-side PDF→image conversion. The web app uses the client-side `pdfToImages.ts` (PDF.js) instead.
- **`session.txt`** is untracked and not part of the source code.
- The `dist/` directory is gitignored — it's the build output.
- ESLint config (`eslint.config.js`) follows the flat config format for ESLint 10.
- No CI/CD configuration exists in the repo.
- Dependencies are already installed in `node_modules/`.

## Recent changes (modernisation pass)

- ✅ Removed all Vite template CSS from `App.css`
- ✅ Replaced accent color from teal (`#1D7195`) to cyan (`#22d3ee`) for a modern feel
- ✅ Added glassmorphism effect (`backdrop-filter: blur`) on header, sidebars, and terminal
- ✅ All buttons switched to pill-shape (`rounded-full`)
- ✅ Added CSS custom properties for radius scale (`--radius-sm/md/lg/xl`)
- ✅ Terminal now has macOS-style dots and a collapsible toggle
- ✅ All cards/folders use consistent border-left status indicators
- ✅ Added `--color-bg-tertiary` for layered depth
- ✅ Sidebar width increased from 320px to 340px for better readability
- ✅ Padding and spacing increased everywhere for a more spacious layout
- ✅ Added global `glass-card` and `glass-card-hover` utility classes
- ✅ Added `animate-slide-down` and refined `animate-fade-in` animations
- ✅ Drop zone enlarged and padded for better drag-and-drop UX

## Common development tasks

**Add a new UI component**: Create a file in `src/components/ui/`, follow the existing pattern (props interface at top, export named function, use `cn()` for class composition, use Lucide icons, apply glass/card hover styles).

**Add a new hook**: Create a file in `src/hooks/`, follow the custom hook pattern (useState + useCallback, typed return object).

**Modify the theme**: Edit CSS custom properties in `src/index.css` under the `@theme` block. Use the cyan-based palette for consistency.

**Change PDF rendering quality**: Modify `scale` (currently `3`) in `src/utils/pdfToImages.ts` line 27. Also adjust JPEG quality (currently `0.95`) on line 63.

**Add testing**: Install Vitest + React Testing Library, create `*.test.tsx` files alongside components. No test setup currently exists.