import type { UiText } from '../content'
import { ConsoleButton } from './ConsoleButton'

const ARROWS = { up: '▲', down: '▼', left: '◀', right: '▶' } as const

export function DPad({ labels }: { labels: UiText['console']['dpad'] }) {
  return (
    <div className="dpad" role="group" aria-label="D-pad">
      {(['up', 'left', 'right', 'down'] as const).map((dir) => (
        <ConsoleButton key={dir} action={dir} label={labels[dir]} className={`dpad__btn dpad__btn--${dir}`}>
          <span aria-hidden="true">{ARROWS[dir]}</span>
        </ConsoleButton>
      ))}
      <span className="dpad__center" aria-hidden="true" />
    </div>
  )
}
