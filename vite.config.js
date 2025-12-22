import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Divida apenas bibliotecas que vão para o cliente (browser)
          'react-vendor': ['react', 'react-dom'],
        },
      },
    },
  },
})