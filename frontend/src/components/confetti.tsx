const COLORS = ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#3b82f6', '#22c55e', '#ec4899']

// Posiciones fijas (no aleatorias) para que el render sea puro
const PIECES = Array.from({ length: 28 }, (_, index) => ({
  left: (index * 37) % 100,
  delay: (index % 7) * 0.08,
  color: COLORS[index % COLORS.length],
  rotate: (index * 53) % 360,
}))

/** Lluvia de confeti; se repite cada vez que el componente se monta. */
export function Confetti() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden" aria-hidden="true">
      {PIECES.map((piece, index) => (
        <span
          key={index}
          className="confetti"
          style={{ left: `${piece.left}%`, background: piece.color, animationDelay: `${piece.delay}s`, rotate: `${piece.rotate}deg` }}
        />
      ))}
    </div>
  )
}
