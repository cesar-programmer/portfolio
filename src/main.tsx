import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { createBrowserRouter } from 'react-router'
import { RouterProvider } from 'react-router/dom'
import './index.css'
import { routes } from './router'
import { useGame } from './store/game'

// Paleta y carcasa en <html> (el script del <head> ya puso las guardadas).
// Se actualizan al instante para que lo que lee los tokens —como el
// dithering— vea siempre los valores actuales.
useGame.subscribe((state, prev) => {
  if (state.palette !== prev.palette) document.documentElement.dataset.palette = state.palette
  if (state.shell !== prev.shell) document.documentElement.dataset.shell = state.shell
})

const router = createBrowserRouter(routes)
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)

const container = document.getElementById('root')!
// HTML prerenderizado → se hidrata; en desarrollo (vacío) → se renderiza.
if (container.firstElementChild) hydrateRoot(container, app)
else createRoot(container).render(app)
