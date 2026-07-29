import { VitePWA } from 'vite-plugin-pwa'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Mate+',        // Nombre completo
        short_name: 'Mate+',             // Nombre corto
        description: 'Aplicación de matemáticas',
        theme_color: '#ffffff',          // Color de la barra de título
        background_color: '#ffffff',     // Color de fondo al cargar
        display: 'fullscreen',           // Apariencia (standalone, fullscreen, etc.)
        start_url: '/login',                  // URL de inicio
        icons: [                         // ¡ICONOS OBLIGATORIOS!
          {
            src: '/192x192.png',    // Ruta al icono (debes crearlo)
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/512x512.png',    // Ruta al icono (debes crearlo)
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'      // Para mejor adaptación
          }
        ]
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
})
