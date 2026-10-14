import { useEffect } from 'react'
import { Shell } from './console/Shell'
import { useControls } from './console/useControls'
import { getContent } from './content'
import { ControlTest } from './screens/ControlTest'
import { useGame } from './store/game'

export default function App() {
  const lang = useGame((s) => s.lang)
  const palette = useGame((s) => s.palette)
  const toggleLang = useGame((s) => s.toggleLang)

  useEffect(() => {
    const { ui } = getContent(lang)
    document.documentElement.lang = lang
    document.title = ui.meta.title
  }, [lang])

  useEffect(() => {
    document.documentElement.dataset.palette = palette
  }, [palette])

  // Acciones globales (base de la pila): SELECT cambia el idioma.
  useControls((action) => {
    if (action === 'select') {
      toggleLang()
      return true
    }
  })

  return (
    <Shell>
      <ControlTest />
    </Shell>
  )
}
