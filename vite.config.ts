
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      // Don't bundle @google/genai, it's loaded via import map from a CDN in index.html
      external: ['@google/genai'],
    },
  },
});
