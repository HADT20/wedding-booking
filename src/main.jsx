import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DisplaySizeProvider } from './contexts/DisplaySizeContext'

// Vô hiệu hóa React DevTools
if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === 'object') {
  for (let [key, value] of Object.entries(window.__REACT_DEVTOOLS_GLOBAL_HOOK__)) {
    window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] = typeof value === 'function' ? () => {} : null;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DisplaySizeProvider>
      <App />
    </DisplaySizeProvider>
  </StrictMode>,
)
