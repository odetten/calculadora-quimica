import { ELEMENT_NAMES, extractElements } from './elements.ts'
import { REACTIONS, REAGENTS, type Reagent } from './reactions.ts'

export type ElementCategory =
  | 'no-metal'
  | 'gas-noble'
  | 'alcalino'
  | 'alcalinoterreo'
  | 'metaloide'
  | 'halogeno'
  | 'transicion'
  | 'otro-metal'
  | 'lantanido'
  | 'actinido'

export type PhysicalState = 'Sólido' | 'Líquido' | 'Gas' | 'Desconocido'

export type PeriodicElement = {
  number: number
  symbol: string
  name: string
  mass: number
  category: ElementCategory
  state: PhysicalState
  protons: number
  electrons: number
  neutrons: number
  // Posición en la rejilla de 18 columnas
  column: number
  row: number
}

export const CATEGORY_INFO: Record<ElementCategory, { label: string; cell: string; dot: string }> = {
  'no-metal': { label: 'No metal', cell: 'bg-emerald-100 border-emerald-300 text-emerald-900', dot: 'bg-emerald-300' },
  'gas-noble': { label: 'Gas noble', cell: 'bg-violet-100 border-violet-300 text-violet-900', dot: 'bg-violet-300' },
  alcalino: { label: 'Metal alcalino', cell: 'bg-rose-100 border-rose-300 text-rose-900', dot: 'bg-rose-300' },
  alcalinoterreo: { label: 'Metal alcalinotérreo', cell: 'bg-orange-100 border-orange-300 text-orange-900', dot: 'bg-orange-300' },
  metaloide: { label: 'Metaloide', cell: 'bg-lime-100 border-lime-300 text-lime-900', dot: 'bg-lime-300' },
  halogeno: { label: 'Halógeno', cell: 'bg-cyan-100 border-cyan-300 text-cyan-900', dot: 'bg-cyan-300' },
  transicion: { label: 'Metal de transición', cell: 'bg-sky-100 border-sky-300 text-sky-900', dot: 'bg-sky-300' },
  'otro-metal': { label: 'Otro metal', cell: 'bg-slate-100 border-slate-300 text-slate-900', dot: 'bg-slate-300' },
  lantanido: { label: 'Lantánido', cell: 'bg-amber-100 border-amber-300 text-amber-900', dot: 'bg-amber-300' },
  actinido: { label: 'Actínido', cell: 'bg-pink-100 border-pink-300 text-pink-900', dot: 'bg-pink-300' },
}

// Masa atómica estándar (u) por número atómico, de H (1) a Og (118)
const MASSES = [
  1.008, 4.0026, 6.94, 9.0122, 10.81, 12.011, 14.007, 15.999, 18.998, 20.18,
  22.99, 24.305, 26.982, 28.085, 30.974, 32.06, 35.45, 39.95, 39.098, 40.078,
  44.956, 47.867, 50.942, 51.996, 54.938, 55.845, 58.933, 58.693, 63.546, 65.38,
  69.723, 72.63, 74.922, 78.971, 79.904, 83.798, 85.468, 87.62, 88.906, 91.224,
  92.906, 95.95, 98, 101.07, 102.906, 106.42, 107.868, 112.414, 114.818, 118.71,
  121.76, 127.6, 126.904, 131.293, 132.905, 137.327, 138.905, 140.116, 140.908, 144.242,
  145, 150.36, 151.964, 157.25, 158.925, 162.5, 164.93, 167.259, 168.934, 173.045,
  174.967, 178.49, 180.948, 183.84, 186.207, 190.23, 192.217, 195.084, 196.967, 200.592,
  204.38, 207.2, 208.98, 209, 210, 222, 223, 226, 227, 232.038,
  231.036, 238.029, 237, 244, 243, 247, 247, 251, 252, 257,
  258, 259, 266, 267, 268, 269, 270, 277, 278, 281,
  282, 285, 286, 289, 290, 293, 294, 294,
]

const SYMBOLS = Object.keys(ELEMENT_NAMES)

const NO_METALS = new Set([1, 6, 7, 8, 15, 16, 34])
const NOBLE_GASES = new Set([2, 10, 18, 36, 54, 86, 118])
const ALKALI = new Set([3, 11, 19, 37, 55, 87])
const ALKALINE_EARTH = new Set([4, 12, 20, 38, 56, 88])
const METALLOIDS = new Set([5, 14, 32, 33, 51, 52])
const HALOGENS = new Set([9, 17, 35, 53, 85, 117])
const OTHER_METALS = new Set([13, 31, 49, 50, 81, 82, 83, 84, 113, 114, 115, 116])
const GASES = new Set([1, 2, 7, 8, 9, 10, 17, 18, 36, 54, 86])
const LIQUIDS = new Set([35, 80])

function categoryOf(z: number): ElementCategory {
  if (NO_METALS.has(z)) return 'no-metal'
  if (NOBLE_GASES.has(z)) return 'gas-noble'
  if (ALKALI.has(z)) return 'alcalino'
  if (ALKALINE_EARTH.has(z)) return 'alcalinoterreo'
  if (METALLOIDS.has(z)) return 'metaloide'
  if (HALOGENS.has(z)) return 'halogeno'
  if (OTHER_METALS.has(z)) return 'otro-metal'
  if (z >= 57 && z <= 71) return 'lantanido'
  if (z >= 89 && z <= 103) return 'actinido'
  return 'transicion'
}

function stateOf(z: number): PhysicalState {
  if (GASES.has(z)) return 'Gas'
  if (LIQUIDS.has(z)) return 'Líquido'
  return z >= 104 ? 'Desconocido' : 'Sólido'
}

// Columna (grupo) y fila en la tabla; lantánidos y actínidos van en dos filas aparte debajo
function positionOf(z: number): { column: number; row: number } {
  if (z === 1) return { column: 1, row: 1 }
  if (z === 2) return { column: 18, row: 1 }
  if (z <= 4) return { column: z - 2, row: 2 }
  if (z <= 10) return { column: z + 8, row: 2 }
  if (z <= 12) return { column: z - 10, row: 3 }
  if (z <= 18) return { column: z, row: 3 }
  if (z <= 36) return { column: z - 18, row: 4 }
  if (z <= 54) return { column: z - 36, row: 5 }
  if (z <= 56) return { column: z - 54, row: 6 }
  if (z <= 71) return { column: z - 57 + 3, row: 9 }
  if (z <= 86) return { column: z - 68, row: 6 }
  if (z <= 88) return { column: z - 86, row: 7 }
  if (z <= 103) return { column: z - 89 + 3, row: 10 }
  return { column: z - 100, row: 7 }
}

export const PERIODIC_ELEMENTS: PeriodicElement[] = SYMBOLS.map((symbol, index) => {
  const number = index + 1
  const mass = MASSES[index]
  return {
    number,
    symbol,
    name: ELEMENT_NAMES[symbol],
    mass,
    category: categoryOf(number),
    state: stateOf(number),
    protons: number,
    electrons: number,
    neutrons: Math.round(mass) - number,
    ...positionOf(number),
  }
})

export function elementBySymbol(symbol: string): PeriodicElement | undefined {
  return PERIODIC_ELEMENTS.find((element) => element.symbol === symbol)
}

export function reagentElements(reagent: Reagent): string[] {
  return extractElements(reagent.formula).map((element) => element.symbol)
}

export type LabCompatibility = {
  // Sustancias del laboratorio que se añaden al elegir el elemento: el elemento puro si existe,
  // y si no, los compuestos que lo contienen
  reagents: Reagent[]
  // Elementos de las sustancias con las que esas sustancias reaccionan
  compatible: string[]
}

export function labCompatibility(symbol: string): LabCompatibility {
  const pure = REAGENTS.filter((reagent) => reagent.element === symbol)
  const reagents = pure.length > 0 ? pure : REAGENTS.filter((reagent) => reagentElements(reagent).includes(symbol))
  const ownIds = new Set(reagents.map((reagent) => reagent.id))

  const partnerIds = new Set<string>()
  for (const { ids } of REACTIONS) {
    if (ownIds.has(ids[0])) partnerIds.add(ids[1])
    if (ownIds.has(ids[1])) partnerIds.add(ids[0])
  }

  const compatible = new Set<string>()
  for (const reagent of REAGENTS) {
    if (!partnerIds.has(reagent.id)) continue
    for (const other of reagentElements(reagent)) {
      if (other !== symbol) compatible.add(other)
    }
  }

  return { reagents, compatible: [...compatible] }
}
