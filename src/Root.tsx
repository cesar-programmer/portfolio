import { Suspense, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router'
import { GameRoute } from './pages'
import { preferredLang, sectionPath } from './routes'
import { headFor } from './seo'
import { useGame } from './store/game'

/** Raíz: lee localStorage después de hidratar y mantiene el <head> al navegar. */
export function Root() {
  const { pathname } = useLocation()

  useEffect(() => {
    useGame.getState().hydrate()
  }, [])

  useDocumentHead(pathname)

  return (
    <Suspense fallback={null}>
      <Outlet />
    </Suspense>
  )
}

/** "/" muestra Proyectos en español (lo que trae el HTML) y luego redirige al idioma del navegador. */
export function Home() {
  const navigate = useNavigate()
  useEffect(() => {
    navigate(sectionPath(preferredLang(), 'projects'), { replace: true })
  }, [navigate])
  return <GameRoute path={sectionPath('es', 'projects')} />
}

/** Al navegar en el cliente, actualiza lang, título, descripción y canonical. */
function useDocumentHead(pathname: string) {
  useEffect(() => {
    const head = headFor(pathname)
    const root = document.documentElement
    root.lang = head.lang
    document.title = head.title
    const set = (selector: string, attr: string, value: string) => document.querySelector(selector)?.setAttribute(attr, value)
    set('meta[name="description"]', 'content', head.description)
    set('link[rel="canonical"]', 'href', head.canonical)
    set('meta[property="og:title"]', 'content', head.title)
    set('meta[property="og:description"]', 'content', head.description)
    set('meta[property="og:url"]', 'content', head.canonical)
    set('meta[property="og:image"]', 'content', head.image)
  }, [pathname])
}
