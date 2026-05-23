/**
 * Registers the service worker after the page has finished loading.
 *
 * The worker itself is generated from `src/pwa/service-worker.ts` by
 * vite-plugin-pwa and emitted as `/service-worker.js` in the build.
 * Offline support is a progressive enhancement - failures never block the app.
 */
export function registerServiceWorker(): void {
  if (typeof window === 'undefined') return
  if (!('serviceWorker' in navigator)) return
  // The worker only exists in production builds.
  if (import.meta.env.DEV) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(() => {
      /* ignore - the app still works fully online */
    })
  })
}
