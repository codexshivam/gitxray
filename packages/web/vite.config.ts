import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'esnext'
  },
  // @ts-expect-error vitest options
  test: {
    exclude: ['e2e/**', 'node_modules/**']
  }
});
