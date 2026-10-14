import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useGame } from './store/game'

// La paleta y la carcasa se aplican de inmediato (antes del render) para que
// lo que lea los tokens CSS —como el dithering— vea siempre los valores actuales.
function applyTheme() {
  const { palette, shell } = useGame.getState()
  document.documentElement.dataset.palette = palette
  document.documentElement.dataset.shell = shell
}
applyTheme()
useGame.subscribe(applyTheme)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
