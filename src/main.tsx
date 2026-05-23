import React from 'react'
import ReactDOM from 'react-dom/client'
import '@fontsource-variable/inter'
import './index.css'
import { App } from './app/App'
import { ThemeProvider } from './theme/ThemeProvider'
import { registerServiceWorker } from './pwa/registerSW'

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element #root not found')

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)

// Enables offline use + installability once the app has loaded once.
registerServiceWorker()
