import { lazy } from 'react'

// Cada página se carga en su propio chunk; el prerender agrega <link rel="modulepreload">
// para los chunks de cada ruta, así no hay cascada al cargar.
export const GameRoute = lazy(() => import('./GameRoute'))
export const RecruiterPage = lazy(() => import('./recruiter/RecruiterPage'))
