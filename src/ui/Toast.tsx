import { useEffect } from 'react'
import { useGame } from '../store/game'

export function Toast() {
  const toast = useGame((s) => s.toast)
  const showToast = useGame((s) => s.showToast)
  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => showToast(null), 3500)
    return () => clearTimeout(timer)
  }, [toast, showToast])
  return (
    <div className="toast-slot" role="status" aria-live="polite">
      {toast && <div className="toast px-box">{toast}</div>}
    </div>
  )
}
