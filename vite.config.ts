import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { pwaManifest } from './src/pwa/manifest'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig({
  // Single source of truth for the app version (shown in the parent area).
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      // We author our own service worker in TypeScript and let the plugin
      // inject the precache manifest into it (offline support).
      strategies: 'injectManifest',
      srcDir: 'src/pwa',
      filename: 'service-worker.ts',
      registerType: 'autoUpdate',
      injectRegister: null, // registered manually in src/pwa/registerSW.ts
      manifest: pwaManifest,
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2,webmanifest}'],
        // Icons are listed in the manifest icons array and the manifest itself
        // is injected by vite-plugin-pwa; exclude both from the glob to avoid
        // duplicate precache entries.
        globIgnores: ['icons/**', '*.webmanifest'],
      },
      devOptions: {
        // Keep the dev server clean; offline behaviour is verified in builds.
        enabled: false,
      },
    }),
  ],
})
