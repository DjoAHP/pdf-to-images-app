# 📄 PDF to Images Converter

Convertisseur PDF → images JPG en ligne, moderne et élégant.

## Fonctionnalités

- **Conversion PDF → JPG** — chaque page est rendue en haute qualité (zoom 3x, qualité 0.95)
- **Glisser-déposer** — déposez vos fichiers PDF directement dans la zone
- **Multi-pages** — les PDF multi-pages sont regroupés en dossiers dépliables
- **Téléchargement** — téléchargez individuellement, par dossier ZIP ou tout en un seul ZIP
- **Terminal intégré** — suivez la progression en temps réel dans le panneau de logs
- **Barre de progression** — indicateur global pendant la conversion

## Tech Stack

- React 19 + TypeScript
- Vite 8 (build + HMR)
- Tailwind CSS v4 (dark theme personnalisé)
- pdfjs-dist 5.7 (moteur PDF.js de Mozilla)
- JSZip 3 (génération ZIP côté client)

## Développement

```bash
# Installer les dépendances
npm install

# Lancer le serveur de dev
npm run dev

# Build production
npm run build

# Preview build local
npm run preview

# Lint
npm run lint
```

## Structure du projet

```
src/
  main.tsx                → point d'entrée React
  App.tsx                 → orchestre les hooks et composants
  index.css               → variables CSS, Tailwind, animations
  App.css                 → (vide, nettoyé)
  components/
    Header.tsx            → barre haute avec compteur + progression
    AppLayout.tsx         → layout 3 colonnes avec header
    LeftSidebar.tsx       → upload PDF + liste des fichiers
    RightSidebar.tsx      → images converties + bouton ZIP
    Terminal.tsx          → panneau de logs repliable
    ui/
      button.tsx          → bouton pill-shape avec variants
      PdfCard.tsx         → carte PDF avec statut
      FolderItem.tsx      → dossier dépliable multi-images
      ImageItem.tsx       → ligne d'image avec bouton DL
  hooks/
    usePdfConverter.ts    → logique de conversion PDF.js
    useImageStore.ts      → state management des images
    useTerminal.ts        → logs du terminal
  lib/
    utils.ts              → helper cn() (clsx + tailwind-merge)
  types/
    index.ts              → interfaces TypeScript partagées
  utils/
    pdfToImages.ts        → rendu PDF pages via canvas
    downloadUtils.ts      → génération ZIP (JSZip)
```

## Design

- Thème sombre avec palette cyan (#22d3ee)
- Glassmorphism (backdrop-filter blur sur les panneaux)
- Boutons pill-shape avec glow shadow
- Animations d'entrée fluides (fade-in, pulse)
- Scrollbars stylisées custom

## Licence

MIT