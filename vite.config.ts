import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    // Phaser a un chunk separado
    rollupOptions: {
      output: { manualChunks: { phaser: ['phaser'] } }
    },
    chunkSizeWarningLimit: 2000
  }
});
