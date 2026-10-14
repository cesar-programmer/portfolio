import { Link } from 'react-router'
import { getContent } from './content'
import { sectionPath } from './routes'
import './notfound.css'

/**
 * GAME OVER: página 404 en los dos idiomas a la vez. Es la misma para cualquier
 * ruta inexistente, así el 404.html estático hidrata sin diferencias.
 */
export function NotFound() {
  const es = getContent('es').ui.notFound
  const en = getContent('en').ui.notFound
  return (
    <main className="game-over">
      <h1 className="game-over__title">{es.heading}</h1>
      <p lang="es">{es.text}</p>
      <p lang="en">{en.text}</p>
      <div className="game-over__actions">
        <Link to={sectionPath('es', 'projects')} className="game-over__btn">
          <span aria-hidden="true">▶ </span>
          {es.continue}
        </Link>
        <Link to={sectionPath('en', 'projects')} className="game-over__btn" lang="en">
          <span aria-hidden="true">▶ </span>
          {en.continue}
        </Link>
      </div>
    </main>
  )
}
