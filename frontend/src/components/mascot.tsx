import { useState, type ReactNode } from 'react'
import { ChemText } from './chemText.tsx'

export type MascotMood = 'feliz' | 'pensando' | 'triste'

type MascotProps = {
  title: string
  message: string
  mood?: MascotMood
  actions?: ReactNode
  onPoke?: () => void
}

function Mouth({ mood }: { mood: MascotMood }) {
  if (mood === 'triste') return <path d="M52 112 Q60 105 68 112" fill="none" stroke="#1E1C2E" strokeWidth="3" strokeLinecap="round" />
  if (mood === 'pensando') return <ellipse cx="62" cy="110" rx="3.5" ry="3" fill="#1E1C2E" />
  return <path d="M50 106 Q60 117 70 106" fill="#1E1C2E" stroke="#1E1C2E" strokeWidth="2" strokeLinejoin="round" />
}

/** Quimi: un matraz con cara que explica los conceptos clave en una burbuja de texto. */
export function Quimi({ mood }: { mood: MascotMood }) {
  return (
    <svg viewBox="0 0 120 140" className="mascot-bob h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id="quimi-body">
          <path d="M47 44 L19 108 Q13 126 32 128 L88 128 Q107 126 101 108 L73 44 Z" />
        </clipPath>
      </defs>
      <ellipse cx="60" cy="134" rx="34" ry="4" fill="#0f172a" opacity="0.12" />
      <rect x="47" y="12" width="26" height="34" fill="#f8fafc" stroke="#334155" strokeWidth="3" />
      <path d="M47 44 L19 108 Q13 126 32 128 L88 128 Q107 126 101 108 L73 44 Z" fill="#f8fafc" stroke="#334155" strokeWidth="3" strokeLinejoin="round" />
      <g clipPath="url(#quimi-body)">
        <path className="mascot-wave" d="M-40 84 Q-25 78 -10 84 T20 84 T50 84 T80 84 T110 84 T140 84 T170 84 V140 H-40 Z" fill="#2dd4bf" />
        <path d="M0 96 H120 V140 H0 Z" fill="#14b8a6" opacity="0.35" />
      </g>
      <rect x="42" y="6" width="36" height="9" rx="4" fill="#e2e8f0" stroke="#334155" strokeWidth="3" />
      <circle className="lp-bubble lp-bubble-1" cx="56" cy="30" r="3" fill="#99f6e4" />
      <circle className="lp-bubble lp-bubble-2" cx="64" cy="36" r="2.2" fill="#99f6e4" />
      <circle className="lp-bubble lp-bubble-3" cx="60" cy="24" r="1.8" fill="#99f6e4" />
      <g className="mascot-blink">
        <ellipse cx="48" cy="96" rx="5" ry="6" fill="#1E1C2E" />
        <ellipse cx="72" cy="96" rx="5" ry="6" fill="#1E1C2E" />
        <circle cx="50" cy="94" r="1.6" fill="white" />
        <circle cx="74" cy="94" r="1.6" fill="white" />
      </g>
      {mood === 'pensando' && <path d="M66 86 L78 83" stroke="#1E1C2E" strokeWidth="2.5" strokeLinecap="round" />}
      {mood === 'triste' && (
        <>
          <path d="M42 87 L53 90" stroke="#1E1C2E" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M78 87 L67 90" stroke="#1E1C2E" strokeWidth="2.5" strokeLinecap="round" />
        </>
      )}
      <ellipse cx="38" cy="106" rx="5" ry="3" fill="#fda4af" opacity="0.8" />
      <ellipse cx="82" cy="106" rx="5" ry="3" fill="#fda4af" opacity="0.8" />
      <Mouth mood={mood} />
    </svg>
  )
}

export function Mascot({ title, message, mood = 'feliz', actions, onPoke }: MascotProps) {
  const [jumpKey, setJumpKey] = useState(0)

  return (
    <div className="flex items-end gap-3 lg:flex-col lg:items-center lg:gap-2" aria-live="polite">
      <div key={`${title}-${message}`} className="mascot-pop relative order-2 min-w-0 flex-1 rounded-2xl border-2 border-teal-200 bg-white px-4 py-3 shadow-md lg:order-1 lg:w-full lg:flex-none">
        <p className="text-[11px] font-bold uppercase tracking-wider text-teal-700">{title}</p>
        <p className="mt-1 text-sm leading-6 text-ink"><ChemText text={message} /></p>
        {actions && <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">{actions}</div>}
        {/* Cola de la burbuja: a la izquierda en celular, abajo en escritorio */}
        <span className="absolute -left-[9px] bottom-6 h-4 w-4 rotate-45 border-b-2 border-l-2 border-teal-200 bg-white lg:hidden" aria-hidden="true" />
        <span className="absolute -bottom-[9px] left-1/2 hidden h-4 w-4 -translate-x-1/2 rotate-45 border-b-2 border-r-2 border-teal-200 bg-white lg:block" aria-hidden="true" />
      </div>
      <button
        key={jumpKey}
        type="button"
        className="order-1 h-24 w-20 shrink-0 cursor-pointer lg:order-2 lg:h-40 lg:w-32"
        aria-label="Quimi, tu guía. Tócalo para otro dato."
        onClick={() => {
          setJumpKey((key) => key + 1)
          onPoke?.()
        }}
      >
        <span className={`block h-full w-full ${jumpKey > 0 ? 'mascot-jump' : ''}`}>
          <Quimi mood={mood} />
        </span>
      </button>
      <p className="hidden text-xs font-semibold text-ink/60 lg:block">Quimi</p>
    </div>
  )
}
