export type Reagent = {
  id: string
  formula: string
  name: string
  state: string
  note: string
  // Color de la solución dentro del vaso
  color: string
}

export type Reaction = {
  ids: [string, string]
  title: string
  equation: string
  whatYouSaw: string[]
  why: string[]
  safety: string
}

export const REAGENTS: Reagent[] = [
  {
    id: 'h2o2',
    formula: 'H₂O₂',
    name: 'Peróxido de hidrógeno',
    state: 'Líquido incoloro',
    note: 'Agua oxigenada. Se descompone en agua y oxígeno.',
    color: '#bae6fd',
  },
  {
    id: 'kmno4',
    formula: 'KMnO₄',
    name: 'Permanganato de potasio',
    state: 'Cristales violeta oscuro',
    note: 'Oxidante muy fuerte. Disuelto tiñe el agua de morado.',
    color: '#7e22ce',
  },
]

export const MIXED_COLOR = '#5b3417'

export const REACTIONS: Reaction[] = [
  {
    ids: ['h2o2', 'kmno4'],
    title: 'Peróxido de hidrógeno + permanganato de potasio',
    equation: '2 KMnO₄ + 3 H₂O₂ → 2 MnO₂ + 3 O₂ + 2 KOH + 2 H₂O',
    whatYouSaw: [
      'El morado del permanganato desaparece y aparece un sólido café oscuro: dióxido de manganeso (MnO₂).',
      'Se desprende mucho gas a toda velocidad. Es oxígeno (O₂), y por eso se forma espuma y burbujas.',
      'La mezcla se calienta rápido. Con peróxido concentrado el vaso suelta vapor y puede salpicar líquido caliente.',
    ],
    why: [
      'Es una reacción redox. El manganeso del permanganato (Mn⁷⁺) se reduce a Mn⁴⁺ y el oxígeno del peróxido (O⁻¹) se oxida hasta O₂ (O⁰).',
      'Además, el MnO₂ que se forma es un catalizador: acelera la descomposición del propio peróxido (2 H₂O₂ → 2 H₂O + O₂). Cada vez va más rápido, y toda esa energía se libera como calor.',
      'Gas + calor + vapor liberados en muy poco tiempo se ven como una "explosión". Con reactivos concentrados es una reacción violenta y exotérmica, no una detonación como la de un explosivo.',
    ],
    safety:
      'Con reactivos muy concentrados esto es peligroso: puede proyectar líquido caliente e incendiar papel, madera u otros materiales. Solo se hace en laboratorio, con protección y supervisión. No lo intentes en casa.',
  },
]

export function findReaction(a: string, b: string): Reaction | undefined {
  return REACTIONS.find(({ ids }) => (ids[0] === a && ids[1] === b) || (ids[0] === b && ids[1] === a))
}
