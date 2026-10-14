import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import type { Lang } from '../config'
import { getContent } from '../content'
import { useGame } from '../store/game'
import './console.css'
import { installKeyboard } from './input'
import { ABButtons, BezelDecor, Brand, DPad, ShellKeys, Shoulder, Speaker, StartSelect } from './parts'
import { useLayout, type LayoutState } from './useLayout'
import { useTvMode } from './useTvMode'

type Props = { lang: Lang; children: ReactNode }

export function Console({ lang, children }: Props) {
  const state = useLayout()
  const ui = getContent(lang).ui.console
  const tv = useGame((s) => s.tv)

  useEffect(installKeyboard, [])
  useTvMode()

  const style = { '--u': `${state.u}px` } as CSSProperties
  const screen = (
    <ScreenFrame state={state} tv={tv} exitLabel={ui.tvExit}>
      {children}
    </ScreenFrame>
  )

  return (
    <div className={`stage stage--${state.layout}`}>
      <a href="#screen" className="sr-only-focusable fixed top-2 left-2 z-[200] bg-white px-3 py-2 text-black">
        {ui.skip}
      </a>
      {state.layout === 'clamshell' ? (
        <Clamshell state={state} style={style} lang={lang} ui={ui} screen={screen} />
      ) : (
        <Horizontal compact={state.layout === 'compact'} style={style} lang={lang} ui={ui} screen={screen} />
      )}
      {state.hint && <p className="console-hint">{ui.hint}</p>}
    </div>
  )
}

type ConsoleUi = ReturnType<typeof getContent>['ui']['console']
type LayoutProps = { style: CSSProperties; lang: Lang; ui: ConsoleUi; screen: ReactNode }

function Horizontal({ compact, style, lang, ui, screen }: LayoutProps & { compact: boolean }) {
  return (
    <section className={`console console--${compact ? 'compact' : 'horizontal'}`} style={style} aria-label={ui.controlsLabel}>
      {!compact && (
        <>
          <Shoulder side="l" ui={ui} />
          <Shoulder side="r" ui={ui} />
        </>
      )}
      <div className="console__body">
        <div className="wing wing--left">
          {compact && <Shoulder side="l" ui={ui} />}
          <DPad ui={ui} />
          {compact && <ShellKeys lang={lang} ui={ui} />}
        </div>
        <div className="console__center">
          <div className="bezel">
            <BezelDecor />
            {screen}
          </div>
          {!compact && (
            <div className="strip">
              <Brand lang={lang} />
              <ShellKeys lang={lang} ui={ui} />
            </div>
          )}
        </div>
        <div className="wing wing--right">
          {compact && <Shoulder side="r" ui={ui} />}
          <ABButtons ui={ui} />
          <StartSelect ui={ui} />
          <Speaker ui={ui} />
        </div>
      </div>
    </section>
  )
}

function Clamshell({ state, style, lang, ui, screen }: LayoutProps & { state: LayoutState }) {
  const seenLid = useGame((s) => s.seen.lid)
  const markSeen = useGame((s) => s.markSeen)
  const [opening, setOpening] = useState(!seenLid)

  // Animación de apertura solo la primera vez; cualquier toque o tecla la salta.
  useEffect(() => {
    if (!opening) return
    markSeen('lid')
    const done = () => setOpening(false)
    const timer = window.setTimeout(done, 900)
    window.addEventListener('pointerdown', done, { once: true })
    window.addEventListener('keydown', done, { once: true })
    return () => {
      clearTimeout(timer)
      window.removeEventListener('pointerdown', done)
      window.removeEventListener('keydown', done)
    }
  }, [opening, markSeen])

  const size = { ...style, width: state.width, height: state.height } as CSSProperties
  return (
    <section className="console console--clamshell" style={size} aria-label={ui.controlsLabel}>
      <div className={`lid ${opening ? 'lid--opening' : ''}`}>
        <div className="bezel">
          <BezelDecor />
          {screen}
        </div>
        <Brand lang={lang} />
      </div>
      <div className="hinge">
        <Shoulder side="l" ui={ui} />
        <span className="hinge__barrel" aria-hidden="true" />
        <Shoulder side="r" ui={ui} />
      </div>
      <div className="base">
        <ShellKeys lang={lang} ui={ui} />
        <div className="base__controls">
          <DPad ui={ui} />
          <ABButtons ui={ui} />
        </div>
        <div className="base__bottom">
          <StartSelect ui={ui} />
          <Speaker ui={ui} />
        </div>
      </div>
    </section>
  )
}

function ScreenFrame({ state, tv, exitLabel, children }: { state: LayoutState; tv: boolean; exitLabel: string; children: ReactNode }) {
  const setTv = useGame((s) => s.setTv)
  return (
    <div className="scr-frame" style={tv ? undefined : { width: state.screenW, height: state.screenH }}>
      {children}
      {tv && (
        <button type="button" className="tv-exit" onClick={() => setTv(false)} aria-label={exitLabel} title={exitLabel}>
          📺 ✕
        </button>
      )}
    </div>
  )
}
