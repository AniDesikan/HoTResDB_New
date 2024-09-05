import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: './',
    sourcemap: false,
    rollupOptions: {
      // additional rollup options if needed
      // input: './src/main.tsx',
    }
  },
  server: {
    proxy: {
      // Proxy all requests starting with / to the Flask backend
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),  // Remove /api prefix when forwarding to Flask
      },
    },
  },
});

