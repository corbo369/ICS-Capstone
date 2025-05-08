/**
 * @file Vite Configuration File
 * @author Sam DeCoursey <samdecoursey@ksu.edu>
 */

//Import Libraries
import { defineConfig } from 'vite'
import path from "path"
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
      react(),
      tailwindcss()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy all API requests
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      // Proxy Open API Docs
      '/docs': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      // Proxy Authentication Requests
      '/auth': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
    }
  }
})
