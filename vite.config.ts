import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
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
    // Enable History API fallback for SPA routing
    historyApiFallback: true,
  },
  preview: {
    port: 3000,
    // Enable History API fallback for production preview
    historyApiFallback: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Optimize chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Framework chunk - React core
          react: ['react', 'react-dom'],
          // Router chunk
          router: ['react-router-dom'],
          // UI library chunk - Radix UI components
          ui: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-slot'],
          // Utilities chunk
          utils: ['clsx', 'class-variance-authority', 'tailwind-merge'],
          // Icons
          icons: ['lucide-react'],
        },
      },
    },
    // Performance optimizations
    chunkSizeWarningLimit: 1000,
    minify: true, // Use default minification (esbuild for better performance)
  },
  // Environment variables
  define: {
    // Replace Next.js env variables
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
  css: {
    postcss: './postcss.config.mjs',
  },
})
