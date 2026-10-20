import type { ReactNode } from 'react'

// **negritas**, H_2O / N_A (subíndice) y Mg^2+ / 10^-23 / Cl^- (superíndice)
const TOKEN = /\*\*(.+?)\*\*|_(\d+|[A-Z])|\^(-?\d+[+-]?|[+-]|[a-zA-Z])/g

export function ChemText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(TOKEN)) {
    const index = match.index ?? 0
    if (index > last) parts.push(text.slice(last, index))
    const [, bold, sub, sup] = match
    if (bold !== undefined) parts.push(<strong key={index} className="font-semibold"><ChemText text={bold} /></strong>)
    else if (sub !== undefined) parts.push(<sub key={index}>{sub}</sub>)
    else parts.push(<sup key={index}>{sup.replace('-', '−')}</sup>)
    last = index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}
