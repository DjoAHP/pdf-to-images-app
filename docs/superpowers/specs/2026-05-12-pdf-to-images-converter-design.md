# PDF to Images Converter - Design Specification

**Date**: 2026-05-12
**Project**: pdf-to-images-app
**Context**: Transformer un script Python (PyMuPDF) en application web React/Vite moderne avec interface sombre glassmorphism

---

## 1. Architecture & Stack Technique

### Technologies
- **Frontend**: React 18+ + TypeScript + Vite
- **PDF Processing**: `pdf.js` (Mozilla) - conversion 100% client-side dans le navigateur
- **ZIP**: `jszip` - création d'archives ZIP pour téléchargement groupé
- **Styling**: Tailwind CSS v4 avec glassmorphism
- **Drag & Drop**: HTML5 Drag & Drop API natif
- **Déploiement**: Netlify (site statique)

### Équivalence avec le script Python (`convert.py`)
- PDF 1 page → 1 fichier JPG (nom original + .jpg)
- PDF plusieurs pages → dossier (nom original) → page_001.jpg, page_002.jpg, etc.
- Zoom 3x via `canvas.scale(3)` avant rendu
- Export JPG qualité maximale

### Structure des dossiers
```
pdf-to-images-app/
├── src/
│   ├── components/
│   │   ├── LeftSidebar.tsx      # Zone drag & drop PDFs
│   │   ├── Terminal.tsx          # Terminal central (logs)
│   │   ├── RightSidebar.tsx      # Images converties + dossiers
│   │   └── ui/                   # Composants réutilisables
│   ├── hooks/
│   │   ├── usePdfConverter.ts    # Logique de conversion pdf.js
│   │   └── useTerminal.ts        # Gestion des logs terminal
│   ├── utils/
│   │   ├── pdfToImages.ts        # Fonction de conversion
│   │   └── downloadUtils.ts      # Création ZIP + téléchargement
│   ├── App.tsx
│   ├── index.css                 # Tailwind + vars ToneLab
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.ts (ou équivalent v4)
```

---

## 2. Composants & UI Design

### Layout général (3 colonnes)
```
┌─────────────┬──────────────────────┬──────────────┐
│  LEFT       │     CENTER           │  RIGHT       │
│  SIDEBAR    │     TERMINAL        │  SIDEBAR     │
│  300px      │     flex: 1          │  300px       │
│             │                      │              │
│  [PDF 1]    │  $ Conversion...     │  ▼ doc1/    │
│  [PDF 2]    │  > Page 1/3 done    │    [img1]    │
│  [PDF 3]    │  > Page 2/3 done    │    [img2]    │
│             │  > Terminé ✓         │              │
│             │                      │  [doc2.jpg]  │
│             │                      │              │
│ ┌─────────┐ │                      │ ┌──────────┐ │
│ │PDF>Images│ │                      │ │Télécharger│ │
│ └─────────┘ │                      │ └──────────┘ │
└─────────────┴──────────────────────┴──────────────┘
```

### 2.1 LeftSidebar.tsx (Sidebar gauche - 300px)
- **Fond**: `bg-[#13151C]/80 backdrop-blur-md` avec bordure droite `border-r border-[#1D7195]/20`
- **Zone de drag & drop**: Rectangle avec bordure en pointillés, icône PDF, texte "Glissez vos PDF ici"
- **Liste des PDFs**: Chaque PDF = carte avec icône fichier, nom, taille, status (pending/converting/done/error)
- **Bouton "PDF>Images"**: En bas, style glassmorphism, `bg-[#1D7195]`, transition 200ms ease-out
- **État vide**: Message "Aucun PDF ajouté"

### 2.2 Terminal.tsx (Centre - flex: 1)
- **Fond**: `#0a0a0a` avec glassmorphism `backdrop-blur-sm border-[#1D7195]/30`
- **Police**: Monospace `font-mono`
- **Préfixe**: `$` pour chaque ligne (style terminal Unix)
- **Couleurs**: Texte blanc/gris clair, succès en vert, erreurs en rouge, progress en bleu clair
- **Comportement**: Scroll automatique vers le bas, historique complet conservé
- **Exemple de sortie**:
  ```
  $ Conversion de "partiture.pdf"...
  > PDF chargé: 3 pages détectées
  > Page 1/3 convertie (zoom 3x)
  > Page 2/3 convertie (zoom 3x)
  > Page 3/3 convertie (zoom 3x)
  ✓ "partiture.pdf" terminé en 0.8s

  $ Conversion de "scan.pdf"...
  > PDF chargé: 1 page détectée
  > Page unique convertie (zoom 3x)
  ✓ "scan.pdf" terminé en 0.3s

  $ Conversion terminée ! (2 fichiers traités)
  ```

### 2.3 RightSidebar.tsx (Sidebar droite - 300px)
- **Fond**: Même style que la gauche (symétrique)
- **Structure arborescente**:
  - PDF 1 page → affichage direct `[icône] document.jpg` + bouton download
  - PDF plusieurs pages → dossier cliquable `▼ document/` qui se replie/déplie, contenant les `page_001.jpg`, `page_002.jpg` avec boutons download individuels
- **Bouton "Télécharger tout"**: En bas, génère un ZIP contenant toutes les images converties (structure de dossiers préservée)

### 2.4 Design System (cohérent avec ToneLab)
- **Background principal**: `#13151C`
- **Accent**: `#1D7195` (RGB 29, 113, 149)
- **Glassmorphism**: `backdrop-blur-md`, `bg-opacity-80`, bordures subtiles
- **Boutons**: `bg-[#1D7195] hover:bg-[#1D7195]/80`, transition 200ms ease-out
- **Texte**: `text-white` (titres), `text-gray-300` (corps), `text-gray-400` (secondaire)
- **Animations**: 200ms ease-out (comme ToneLab Landing Page)

---

## 3. Flux de données & Logique

### État global (State)
```typescript
interface PDFFile {
  id: string;
  name: string;
  file: File;
  status: 'pending' | 'converting' | 'done' | 'error';
  progress?: number;
}

interface ConvertedImage {
  id: string;
  pdfId: string;
  name: string;
  url: string;          // URL blob pour aperçu/download
  isFolder: boolean;    // true si dossier (multi-pages)
  folderName?: string;  // nom du dossier parent
}

interface TerminalLine {
  id: string;
  text: string;
  type: 'info' | 'success' | 'error' | 'progress';
  timestamp: Date;
}
```

### Flux de conversion
1. Utilisateur glisse PDFs → LeftSidebar (état: pending)
2. Clic "PDF>Images" → démarre la conversion groupée
3. Pour CHAQUE PDF (séquentiel) :
   a. Ouvrir le PDF avec pdf.js
   b. Lire le nombre de pages (`pdf.numPages`)
   c. **Si 1 page** :
      - Rendre la page sur canvas (`scale: 3`)
      - Convertir canvas → JPG (`toBlob('image/jpeg', 0.95)`)
      - Sauvegarder: `{nom}.jpg`
   d. **Si plusieurs pages** :
      - Créer entrée dossier virtuel (nom du PDF)
      - Pour chaque page: rendre → convertir → JPG: `page_001.jpg`, `page_002.jpg`...
      - Ajouter au dossier virtuel
   e. Mettre à jour le terminal en temps réel (une ligne par étape)
   f. Ajouter les images dans RightSidebar
4. Tous les PDFs traités → afficher "$ Conversion terminée !" dans le terminal

### Connexion Terminal ↔ Conversion
Le Terminal reçoit une liste de lignes à afficher via props. La conversion ajoute des lignes au fur et à mesure via un callback `onLog`.

---

## 4. Gestion des erreurs

- **PDF corrompu**: Ligne rouge dans terminal, status 'error' sur le PDF, passage au suivant
- **PDF protégé par mot de passe**: Message d'erreur dans terminal, PDF marqué 'error'
- **Fichier non-PDF glissé**: Refusé dès le drag & drop (vérification `file.type === 'application/pdf'`)
- **Erreur de conversion inattendue**: Capture dans `try/catch`, log dans terminal, continuation avec le PDF suivant
- **Fichier trop volumineux** (>50MB): Avertissement dans terminal, mais tentative de conversion quand même

---

## 5. Téléchargement

### Individuel
- Chaque image (ou dossier multi-pages) a un bouton de téléchargement
- Clic → création d'une URL blob → déclenchement du téléchargement via `a.click()`
- Pour un dossier multi-pages: création d'un mini-ZIP contenant les pages de ce PDF uniquement

### Groupé (Tout télécharger)
- Bouton "Télécharger tout" en bas de la sidebar droite
- Utilise `jszip` pour créer une archive ZIP structurée :
  ```
  images-converties.zip
  ├── document1.jpg
  ├── document2/
  │   ├── page_001.jpg
  │   ├── page_002.jpg
  │   └── page_003.jpg
  └── document3.jpg
  ```
- Le ZIP est généré côté client et téléchargé

---

## 6. Déploiement Netlify

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Site statique**: Pas de fonctions serverless nécessaires (tout est client-side)
- ** taille maximale des PDFs**: Limitée par la mémoire du navigateur (côté client)

---

## 7. Contraintes & Limitations

- **100% client-side**: Aucune donnée n'est envoyée vers un serveur, tout reste sur l'ordinateur de l'utilisateur
- **Mémoire navigateur**: PDFs volumineux peuvent saturer la mémoire (limitation navigateur)
- **Compatibilité**: Navigateurs modernes uniquement (Chrome, Firefox, Edge, Safari récent)
- **Fichiers supportés**: PDFs uniquement, version PDF 1.0 à 2.0 supportée par pdf.js

---

## 8. Validation du design

- ✅ Architecture React + Vite validée
- ✅ Design sombre + glassmorphism cohérent avec ToneLab validé
- ✅ Layout 3 colonnes (LeftSidebar / Terminal / RightSidebar) validé
- ✅ Flux de conversion batch (bouton "PDF>Images") validé
- ✅ Système de dossiers repliables (multi-pages) validé
- ✅ Téléchargement individuel + ZIP groupé validé
- ✅ Gestion d'erreurs validée
