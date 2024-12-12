import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        // eslint-disable-next-line no-undef
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        // eslint-disable-next-line no-undef
        target: process.env.VITE_API_URL,
        changeOrigin: true,
        ws: true,
      },
    },
  },
});