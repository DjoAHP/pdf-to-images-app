import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: 'generateSW',
      manifest: {
        start_url: '/',
        display: 'standalone',
        background_color: '#0f1117',
        theme_color: '#22d3ee',
        orientation: 'any',
        description: 'Convertisseur PDF → images JPG',
        categories: ['productivity', 'utilities'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,png,svg,json,ico}'],
      },
    }),
  ],
})