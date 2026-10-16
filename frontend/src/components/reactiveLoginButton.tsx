import { useEffect, useRef, useState } from 'react'

const COLORS = ['#14b8a6', '#f59e0b']

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const EXPAND_MS = 750
const FADE_MS = 400

// Onda expansiva desde (x, y) que cubre la pantalla; al cubrirla llama onCovered y se funde.
function explode(x: number, y: number, onCovered: () => void) {
  const layer = document.createElement('div')
  layer.style.cssText = 'position:fixed;inset:0;overflow:hidden;z-index:9999'
  document.body.append(layer)

  const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) + 8

  const cover = document.createElement('div')
  cover.style.cssText = `position:absolute;inset:0;background:radial-gradient(circle at ${x}px ${y}px,#ffffff 0%,#fef3c7 10%,#ccfbf1 40%,#5eead4 100%)`
  cover.animate(
    [{ clipPath: `circle(0px at ${x}px ${y}px)` }, { clipPath: `circle(${radius}px at ${x}px ${y}px)` }],
    { duration: EXPAND_MS, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' },
  )
  layer.append(cover)

  const ring = document.createElement('div')
  ring.style.cssText = `position:absolute;left:${x - radius}px;top:${y - radius}px;width:${radius * 2}px;height:${radius * 2}px;box-sizing:border-box;border-radius:50%;border:6px solid #fde68a;box-shadow:0 0 24px 6px #f59e0b,inset 0 0 24px 6px #ffffff`
  ring.animate(
    [{ transform: 'scale(0)' }, { transform: 'scale(1)' }],
    { duration: EXPAND_MS, easing: 'cubic-bezier(.5,0,.75,.4)', fill: 'forwards' },
  )
  layer.append(ring)

  const particles: HTMLElement[] = []
  const count = 18
  for (let i = 0; i < count; i++) {
    const size = 4 + Math.random() * 5
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4
    const distance = 45 + Math.random() * 55
    const particle = document.createElement('div')
    particle.style.cssText = `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;width:${size}px;height:${size}px;border-radius:50%;background:${COLORS[i % 2]}`
    particle.animate(
      [
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(angle) * distance}px,${Math.sin(angle) * distance}px) scale(0)`, opacity: 0.2 },
      ],
      { duration: 550 + Math.random() * 250, easing: 'cubic-bezier(.1,.7,.3,1)', fill: 'forwards' },
    )
    layer.append(particle)
    particles.push(particle)
  }

  const settle = window.setTimeout(() => {
    ring.remove()
    particles.forEach((particle) => particle.remove())
    onCovered()
    // Deja pasar un instante para que el login ya esté pintado debajo y luego se funde
    window.setTimeout(() => {
      layer.style.pointerEvents = 'none'
      layer
        .animate([{ opacity: 1 }, { opacity: 0 }], { duration: FADE_MS, fill: 'forwards' })
        .finished.then(() => layer.remove(), () => layer.remove())
    }, 80)
  }, EXPAND_MS)

  return settle
}

export default function ReactiveLoginButton({ onClick }: { onClick?: () => void }) {
  const button = useRef<HTMLButtonElement>(null)
  const left = useRef<HTMLSpanElement>(null)
  const right = useRef<HTMLSpanElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  const idle = useRef<Animation[]>([])
  const timers = useRef<number[]>([])
  const [busy, setBusy] = useState(false)

  const startIdle = () => {
    if (prefersReducedMotion()) return
    idle.current = [left.current, right.current].flatMap((dot, i) =>
      dot
        ? [
            dot.animate(
              [{ transform: 'translateY(-3px)' }, { transform: 'translateY(3px)' }],
              { duration: 900, delay: i * -450, direction: 'alternate', iterations: Infinity, easing: 'ease-in-out' },
            ),
          ]
        : [],
    )
  }

  useEffect(() => {
    startIdle()
    const pending = timers.current
    return () => {
      idle.current.forEach((animation) => animation.cancel())
      pending.forEach((timer) => window.clearTimeout(timer))
    }
  }, [])

  const handleClick = async () => {
    if (busy) return
    if (prefersReducedMotion() || !button.current || !left.current || !right.current || !label.current) {
      onClick?.()
      return
    }

    setBusy(true)
    idle.current.forEach((animation) => animation.cancel())

    const box = button.current.getBoundingClientRect()
    const cx = box.left + box.width / 2
    const cy = box.top + box.height / 2

    label.current.animate(
      [{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(0.85)' }],
      { duration: 380, fill: 'forwards' },
    )

    const merging = [left.current, right.current].map((dot) => {
      const r = dot.getBoundingClientRect()
      const dx = cx - (r.left + r.width / 2)
      const dy = cy - (r.top + r.height / 2)
      return dot.animate(
        [
          { transform: 'translate(0,0) scale(1)' },
          { transform: `translate(${dx}px,${dy}px) scale(1.6)` },
        ],
        { duration: 380, easing: 'cubic-bezier(.6,0,.9,.5)', fill: 'forwards' },
      ).finished
    })
    await Promise.all(merging)

    timers.current.push(explode(cx, cy, () => onClick?.()))
    ;[left.current, right.current].forEach((dot) => {
      if (dot) dot.style.visibility = 'hidden'
    })

    timers.current.push(
      window.setTimeout(() => {
        button.current?.getAnimations({ subtree: true }).forEach((animation) => animation.cancel())
        ;[left.current, right.current].forEach((dot) => {
          if (dot) dot.style.visibility = ''
        })
        startIdle()
        setBusy(false)
      }, EXPAND_MS + 100),
    )
  }

  return (
    <button
      ref={button}
      type="button"
      onClick={handleClick}
      className="group relative px-6 text-sm text-gray-600 transition-colors hover:text-gray-900 sm:text-base"
    >
      <span
        ref={left}
        aria-hidden="true"
        className="absolute left-0 top-1/2 -mt-1.25 size-2.5 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ background: COLORS[0] }}
      />
      <span ref={label} className="inline-block">
        Iniciar sesión
      </span>
      <span
        ref={right}
        aria-hidden="true"
        className="absolute right-0 top-1/2 -mt-1.25 size-2.5 rounded-full opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
        style={{ background: COLORS[1] }}
      />
    </button>
  )
}
