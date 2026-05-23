/// <reference lib="webworker" />

/**
 * Spielgarten service worker.
 *
 * Authored in TypeScript; vite-plugin-pwa (injectManifest strategy) compiles
 * this file and replaces `self.__WB_MANIFEST` with the build's precache list.
 *
 * Strategy:
 *  - precache the whole app shell on install  -> usable offline after first load
 *  - cache-first for static assets            -> fast and offline-friendly
 *  - network, then cached shell, for navigations
 *
 * This file is excluded from the app's tsconfig (it targets the worker, not
 * the DOM) and is bundled separately by the plugin.
 */

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>
}

const CACHE = 'spielgarten-cache-v1'
const PRECACHE_URLS = self.__WB_MANIFEST.map((entry) => entry.url)

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(['/', ...PRECACHE_URLS]))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return

  // Navigations: try the network first, fall back to the cached app shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE)
        const shell = (await cache.match('/')) ?? (await cache.match('/index.html'))
        return shell ?? Response.error()
      }),
    )
    return
  }

  // Static assets: serve from cache, otherwise fetch and cache for next time.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached
      return fetch(request)
        .then((response) => {
          if (response.ok && response.type === 'basic') {
            const copy = response.clone()
            void caches.open(CACHE).then((cache) => cache.put(request, copy))
          }
          return response
        })
        .catch(() => cached ?? Response.error())
    }),
  )
})
