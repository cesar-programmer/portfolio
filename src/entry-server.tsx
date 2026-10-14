// Entrada del prerender (se compila con `vite build --ssr`). No se envía al navegador.
import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router'
import { SITE_URL } from './config'
import { routes } from './router'

export { SITE_URL }
export { allPaths, headFor, headTags } from './seo'

/**
 * HTML de la app para una ruta, con las pestañas diferidas (React.lazy) ya
 * resueltas. progressiveChunkSize: Infinity evita que React saque los bloques
 * grandes a segmentos ocultos de streaming: todo el texto queda en línea.
 */
export async function render(path: string) {
  const handler = createStaticHandler(routes)
  const context = await handler.query(new Request(`${SITE_URL}${path}`))
  if (context instanceof Response) throw new Error(`Respuesta inesperada al prerenderizar ${path}`)
  const router = createStaticRouter(handler.dataRoutes, context)
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </StrictMode>,
    { progressiveChunkSize: Number.POSITIVE_INFINITY },
  )
  let html = ''
  // prerenderToNodeStream entrega un Readable de Node (iterable asíncrono).
  for await (const chunk of prelude as unknown as AsyncIterable<string | Uint8Array>) {
    html += typeof chunk === 'string' ? chunk : new TextDecoder().decode(chunk)
  }
  return html
}
