import type { ManifestOptions } from 'vite-plugin-pwa'

/**
 * Web App Manifest. Consumed by vite-plugin-pwa, which emits
 * `manifest.webmanifest` and links it from the built HTML.
 */
export const pwaManifest: Partial<ManifestOptions> = {
  name: 'Spielgarten',
  short_name: 'Spielgarten',
  description: 'Ruhige, Montessori-inspirierte Spiele fuer Kleinkinder.',
  lang: 'de',
  dir: 'ltr',
  start_url: '/',
  scope: '/',
  display: 'standalone',
  orientation: 'portrait',
  background_color: '#f3eee0',
  theme_color: '#f3eee0',
  categories: ['games', 'education', 'kids'],
  icons: [
    { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    {
      src: 'icons/icon-maskable-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'maskable',
    },
  ],
}
