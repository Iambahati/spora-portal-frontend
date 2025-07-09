import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  envPrefix: 'VITE_',
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Performance optimizations
    chunkSizeWarningLimit: 1000,
    minify: true, // Use default minification (esbuild for better performance)
  },
  // Environment variables
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  css: {
    postcss: './postcss.config.mjs',
  },
})
