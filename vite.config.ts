import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    build: {
      rollupOptions: {
        // Don't bundle @google/genai, it's loaded via import map from a CDN in index.html
        external: ['@google/genai'],
      },
    },
    // This makes the environment variable available in the browser during build time
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  });
}
