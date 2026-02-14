import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Output ke folder dist
    outDir: 'dist',
    // Generate assets dengan hash untuk cache busting
    assetsDir: 'assets',
    // Relative paths untuk portability
    base: './',
    // Minify untuk production
    minify: true,
    // Source maps untuk debugging (optional)
    sourcemap: false,
  }
})
