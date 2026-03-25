import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  root: '.',
  publicDir: 'public',
  base: '/leetsrs_pwa/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './'),
      '#imports': resolve(__dirname, './services/storage-shim.ts'),
      'wxt/browser': resolve(__dirname, './services/browser-shim.ts'),
      '@/shared/messages': resolve(__dirname, './shared/messages.ts'),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify('1.0.0-pwa'),
  },
});