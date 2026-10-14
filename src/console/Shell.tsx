import { useEffect, type ReactNode } from 'react'
import { getContent } from '../content'
import { useGame } from '../store/game'
import { ABButtons, Speaker, StartSelect } from './Buttons'
import { DPad } from './DPad'
import { installKeyboard } from './input'
import { Screen } from './Screen'
import './shell.css'
import { useConsoleScale } from './useConsoleScale'

export function Shell({ children }: { children: ReactNode }) {
  const { px, layout } = useConsoleScale()
  const lang = useGame((s) => s.lang)
  const ui = getContent(lang).ui.console

  useEffect(installKeyboard, [])

  const scale = { '--px': `${px}px`, '--spacing': `${px}px` } as React.CSSProperties

  return (
    <div className={`flex min-h-dvh flex-col items-center ${layout === 'desktop' ? 'justify-center py-4' : ''}`}>
      <a href="#screen" className="sr-only-focusable fixed top-2 left-2 z-50 bg-white px-3 py-2 text-black">
        {ui.skip}
      </a>
      <div className={`console console--${layout}`} style={scale}>
        <div className="console__top" aria-hidden="true">
          <span>◁ OFF·ON ▷</span>
        </div>

        <div className="console__bezel">
          <div className="console__bezel-label" aria-hidden="true">
            PIXEL SCREEN · 4 SHADES
          </div>
          <div className="console__led" aria-hidden="true">
            POWER
          </div>
          <Screen label={ui.screenLabel}>{children}</Screen>
        </div>

        <div className="console__brand" aria-hidden="true">
          CESAR.DEV<small>portfolio</small>
        </div>

        <div className="console__controls">
          <DPad labels={ui.dpad} />
          <ABButtons ui={ui} />
          <StartSelect ui={ui} />
          <Speaker ui={ui} />
        </div>
      </div>

      {layout === 'desktop' && (
        <p className="console-hint">
          {ui.hint}
          <br />
          {ui.hintExtra}
        </p>
      )}
    </div>
  )
}
