import type { RouteObject } from 'react-router'
import { RecruiterPage, GameRoute } from './pages'
import { Home, Root } from './Root'

/** Rutas compartidas por el cliente y el prerender. */
export const routes: RouteObject[] = [
  {
    element: <Root />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/:lang/cv', element: <RecruiterPage /> },
      { path: '*', element: <GameRoute /> },
    ],
  },
]
