import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import { GameRoute } from './GameRoute'
import { RecruiterPage } from './recruiter/RecruiterPage'
import { preferredLang, sectionPath } from './routes'

const router = createBrowserRouter([
  { path: '/', element: <Navigate to={sectionPath(preferredLang(), 'projects')} replace /> },
  { path: '/:lang/cv', element: <RecruiterPage /> },
  { path: '*', element: <GameRoute /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
