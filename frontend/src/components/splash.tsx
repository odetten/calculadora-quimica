import { useEffect, useState } from 'react'

const SHOW_MS = 1800
const FADE_MS = 500

export default function Splash() {
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const leaveTimer = window.setTimeout(() => setLeaving(true), SHOW_MS)
    const goneTimer = window.setTimeout(() => setGone(true), SHOW_MS + FADE_MS)
    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(goneTimer)
    }
  }, [])

  if (gone) return null

  return (
    <div className={`splash${leaving ? ' splash-leave' : ''}`} role="status" aria-label="Cargando">
      <svg className="splash-logo" viewBox="0 0 64 64" fill="none" aria-hidden="true">
        <path d="M26 6h12M29 6v18L12 52a5 5 0 0 0 4.4 7.5h31.2A5 5 0 0 0 52 52L35 24V6" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18 42h28l6 10a5 5 0 0 1-4.4 7.5H16.4A5 5 0 0 1 12 52z" fill="#14b8a6" opacity="0.35" />
        <circle className="splash-bubble splash-bubble-1" cx="28" cy="48" r="2.5" fill="#0f766e" />
        <circle className="splash-bubble splash-bubble-2" cx="36" cy="50" r="2" fill="#0f766e" />
        <circle className="splash-bubble splash-bubble-3" cx="32" cy="52" r="1.6" fill="#0f766e" />
      </svg>
      <p className="splash-title">Quimica Clara</p>
      <div className="splash-bar" aria-hidden="true">
        <span />
      </div>
    </div>
  )
}