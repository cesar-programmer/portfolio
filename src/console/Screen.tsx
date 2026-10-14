import type { ReactNode } from 'react'

export function Screen({ label, children }: { label: string; children: ReactNode }) {
  return (
    <main id="screen" className="gb-screen gb-power-on" aria-label={label} tabIndex={-1}>
      {children}
    </main>
  )
}
