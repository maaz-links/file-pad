import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    css: {
        devSourcemap: true,
    },
    build: {
        sourcemap: true, // Ensure source maps are enabled for debugging
      },
      server: {
        open: true, // Optional: Automatically open the app in the browser
      },
    
})