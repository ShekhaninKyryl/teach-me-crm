import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'app-router': resolve(__dirname, 'src/app-router'),
      api: resolve(__dirname, 'src/api'),
      assets: resolve(__dirname, 'src/assets'),
      components: resolve(__dirname, 'src/components'),
      configs: resolve(__dirname, 'src/configs'),
      hooks: resolve(__dirname, 'src/hooks'),
      pages: resolve(__dirname, 'src/pages'),
      stores: resolve(__dirname, 'src/stores'),
      translates: resolve(__dirname, 'src/translates'),
      types: resolve(__dirname, 'src/types'),
      utils: resolve(__dirname, 'src/utils'),
    },
  },
});
