import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import { applyStoredTheme } from './lib/theme.js'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { I18nProvider } from './lib/i18n.jsx'

applyStoredTheme()

function PwaRegistration() {
  useRegisterSW({
    immediate: true,
  })
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PwaRegistration />
      <I18nProvider>
        <App />
      </I18nProvider>
    </BrowserRouter>
  </StrictMode>,
)
