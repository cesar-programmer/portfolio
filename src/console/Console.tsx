import { useEffect, type ReactNode } from 'react'
import type { Lang } from '../config'
import { getContent } from '../content'
import { useGame } from '../store/game'
import './console.css'
import { installKeyboard } from './input'
import { ABButtons, BezelDecor, Brand, DPad, ShellKeys, Shoulder, Speaker, StartSelect } from './parts'
import { useTvMode } from './useTvMode'

type Props = { lang: Lang; children: ReactNode }

/**
 * Consola: un solo árbol de elementos que el CSS acomoda como horizontal,
 * horizontal compacta o concha (ver console.css). No mide la ventana con JS,
 * así el HTML prerenderizado ya se pinta en su tamaño final.
 *
 * Orden del DOM = orden de tabulación: primero la pantalla, luego las teclas
 * de la carcasa y al final los controles de juego.
 */
export function Console({ lang, children }: Props) {
  const ui = getContent(lang).ui.console
  const tv = useGame((s) => s.tv)
  const setTv = useGame((s) => s.setTv)

  useEffect(installKeyboard, [])
  useFirstLid()
  useTvMode()

  return (
    <div className="stage">
      <a href="#screen" className="sr-only-focusable fixed top-2 left-2 z-[200] bg-white px-3 py-2 text-black">
        {ui.skip}
      </a>
      <section className="console" aria-label={ui.controlsLabel}>
        <div className="plate plate--body" aria-hidden="true" />
        <div className="plate plate--base" aria-hidden="true" />
        <div className="hinge-barrel" aria-hidden="true" />
        <div className="lid">
          <div className="bezel">
            <BezelDecor />
            <div className="scr-frame">
              {children}
              {tv && (
                <button type="button" className="tv-exit" onClick={() => setTv(false)} aria-label={ui.tvExit} title={ui.tvExit}>
                  📺 ✕
                </button>
              )}
            </div>
          </div>
          <Brand lang={lang} />
        </div>
        <ShellKeys lang={lang} ui={ui} />
        <div className="wing-l">
          <Shoulder side="l" ui={ui} />
          <DPad ui={ui} />
        </div>
        <div className="wing-r">
          <Shoulder side="r" ui={ui} />
          <ABButtons ui={ui} />
          <StartSelect ui={ui} />
          <Speaker ui={ui} />
        </div>
      </section>
      <p className="console-hint">{ui.hint}</p>
    </div>
  )
}

/**
 * La animación de apertura de la concha la activa el script del <head>
 * (atributo data-first-lid) antes del primer pintado. Aquí solo se marca como
 * vista y se quita al terminar, o antes si la persona toca o pulsa algo.
 */
function useFirstLid() {
  const markSeen = useGame((s) => s.markSeen)
  useEffect(() => {
    const root = document.documentElement
    if (!('firstLid' in root.dataset)) return
    markSeen('lid')
    const done = () => delete root.dataset.firstLid
    const timer = window.setTimeout(done, 900)
    window.addEventListener('pointerdown', done, { once: true })
    window.addEventListener('keydown', done, { once: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('pointerdown', done)
      window.removeEventListener('keydown', done)
    }
  }, [markSeen])
}
