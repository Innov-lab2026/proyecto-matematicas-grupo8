import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  root: resolve(__dirname, 'demo'),
  plugins: [react()],
  resolve: {
    alias: {
      'math-mascot': resolve(__dirname, 'src'),
    },
  },
});
