import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' keeps the build portable (GitHub Pages sub-paths, Netlify, Vercel, file hosting).
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks: {
          codemirror: ['@uiw/react-codemirror', '@uiw/codemirror-themes'],
        },
      },
    },
  },
});
