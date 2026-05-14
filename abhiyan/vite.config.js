import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Keeps your usual port
    open: true, // Opens browser on start
  },
  build: {
    outDir: 'build', // Matches CRA's default output folder
  },
});