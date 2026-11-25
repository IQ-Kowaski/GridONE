import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/sakuga.js'
import { startAmbient } from './lib/ambient'
import App from './App.jsx'
import './index.css'

startAmbient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
