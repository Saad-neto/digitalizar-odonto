import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 8080,
    historyApiFallback: true, // Enable SPA routing in development
  },
  plugins: [
    react(),
    splitVendorChunkPlugin(), // Smart vendor chunk splitting
    mode === "development" && componentTagger(),
    // Bundle analyzer - generates stats.html after build
    mode === "production" && visualizer({
      filename: './dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
    })
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Let Vite's splitVendorChunkPlugin handle ALL chunking automatically
        // This prevents dependency order issues and circular references
        // Ensure consistent file names for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      },
    },
    // Remove console.log in production
    esbuild: mode === 'production' ? {
      drop: ['console', 'debugger'],
    } : undefined,
    // Copy .htaccess to dist directory during build
    copyPublicDir: true,
  },
  // Ensure SPA routing works in preview mode
  preview: {
    port: 4173,
    host: true,
    open: true,
  },
}));
