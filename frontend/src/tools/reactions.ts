export type ReactionEffect = 'explosion' | 'water' | 'salt' | 'rust' | 'co2'

export type Reagent = {
  id: string
  formula: string
  name: string
  state: string
  note: string
  // Color de la sustancia dentro del vaso
  color: string
  // Símbolo del elemento, solo en las sustancias que son un elemento puro
  element?: string
}

export type Reaction = {
  ids: [string, string]
  title: string
  equation: string
  // Otras ecuaciones balanceadas que también pueden darse con los mismos reactivos
  otherEquations?: string[]
  effect: ReactionEffect
  // Color del contenido del vaso al terminar la reacción
  resultColor: string
  resultLine: string
  // Tiempo de la fase de mezclado antes de mostrar el resultado
  mixingMs?: number
  whatYouSaw: string[]
  why: string[]
  noteLabel: string
  note: string
}

export const REAGENTS: Reagent[] = [
  {
    id: 'h2',
    formula: 'H₂',
    name: 'Hidrógeno',
    state: 'Gas incoloro',
    note: 'El elemento más ligero. Muy inflamable.',
    color: '#e2e8f0',
    element: 'H',
  },
  {
    id: 'o2',
    formula: 'O₂',
    name: 'Oxígeno',
    state: 'Gas incoloro',
    note: 'Mantiene la combustión y la respiración.',
    color: '#bfdbfe',
    element: 'O',
  },
  {
    id: 'na',
    formula: 'Na',
    name: 'Sodio',
    state: 'Metal plateado y blando',
    note: 'Metal alcalino muy reactivo.',
    color: '#cbd5e1',
    element: 'Na',
  },
  {
    id: 'cl2',
    formula: 'Cl₂',
    name: 'Cloro',
    state: 'Gas verde amarillento',
    note: 'Halógeno tóxico y muy reactivo.',
    color: '#d9f99d',
    element: 'Cl',
  },
  {
    id: 'fe',
    formula: 'Fe',
    name: 'Hierro',
    state: 'Metal gris',
    note: 'Metal de transición muy común.',
    color: '#64748b',
    element: 'Fe',
  },
  {
    id: 'c',
    formula: 'C',
    name: 'Carbono',
    state: 'Sólido negro',
    note: 'Base de la química orgánica.',
    color: '#1f2937',
    element: 'C',
  },
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

export const REACTIONS: Reaction[] = [
  {
    ids: ['h2o2', 'kmno4'],
    title: 'Peróxido de hidrógeno + permanganato de potasio',
    equation: '2 KMnO₄ + 3 H₂O₂ → 2 MnO₂ + 3 O₂ + 2 KOH + 2 H₂O',
    effect: 'explosion',
    resultColor: '#5b3417',
    resultLine: '¡Boom!',
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
    noteLabel: 'Seguridad',
    note:
      'Con reactivos muy concentrados esto es peligroso: puede proyectar líquido caliente e incendiar papel, madera u otros materiales. Solo se hace en laboratorio, con protección y supervisión. No lo intentes en casa.',
  },
  {
    ids: ['h2', 'o2'],
    title: 'Hidrógeno + oxígeno → agua',
    equation: '2 H₂ + O₂ → 2 H₂O',
    effect: 'water',
    resultColor: '#7dd3fc',
    resultLine: '¡Se formó agua!',
    whatYouSaw: [
      'Los dos gases son incoloros. Al darles una chispa hay un destello y un pequeño "pop".',
      'Aparecen gotitas de agua que escurren por el vaso y se juntan en el fondo.',
      'El vaso se calienta: la reacción libera mucha energía.',
    ],
    why: [
      'Es una síntesis y también una reacción redox. Cada átomo de hidrógeno cede su electrón al oxígeno (H⁰ → H⁺ y O⁰ → O²⁻) y juntos forman moléculas de agua con enlaces covalentes polares.',
      'La ecuación necesita coeficientes para quedar balanceada: una molécula de O₂ tiene 2 átomos de oxígeno, así que reacciona con 2 moléculas de H₂ (4 átomos de H) y se obtienen 2 moléculas de H₂O.',
      'Es muy exotérmica: se liberan unos 286 kJ por cada mol de agua líquida formada. Por eso el hidrógeno sirve como combustible, y lo único que produce al quemarse es agua.',
    ],
    noteLabel: 'Seguridad',
    note:
      'Una mezcla de hidrógeno y oxígeno puede explotar con una simple chispa. Se maneja solo en laboratorio, en cantidades pequeñas y con protección.',
  },
  {
    ids: ['na', 'cl2'],
    title: 'Sodio + cloro → cloruro de sodio',
    equation: '2 Na + Cl₂ → 2 NaCl',
    effect: 'salt',
    resultColor: '#e2e8f0',
    resultLine: '¡Se formó sal común!',
    whatYouSaw: [
      'El sodio, un metal plateado y blando, arde con una llama amarilla intensa dentro del cloro, un gas verde amarillento.',
      'El gas verde desaparece y se forma un polvo blanco: cristales de cloruro de sodio (NaCl).',
      'Se libera mucho calor y luz.',
    ],
    why: [
      'Es una transferencia de electrones. Cada átomo de sodio cede un electrón (Na → Na⁺) y cada átomo de cloro lo recibe (Cl → Cl⁻).',
      'Los iones con cargas opuestas se atraen y se ordenan en un cristal: es un enlace iónico. Como cada molécula de Cl₂ tiene 2 átomos de cloro, se necesitan 2 átomos de sodio y se forman 2 unidades de NaCl.',
      'Por separado el sodio y el cloro son peligrosos, pero el NaCl que resulta es estable e inofensivo: es la sal de mesa. La reacción libera unos 411 kJ por cada mol de NaCl.',
    ],
    noteLabel: 'Seguridad',
    note:
      'El cloro es un gas tóxico y el sodio reacciona violentamente con el agua y la humedad. Esta reacción solo se hace en laboratorio y con campana de extracción.',
  },
  {
    ids: ['fe', 'o2'],
    title: 'Hierro + oxígeno → óxidos de hierro',
    equation: '4 Fe + 3 O₂ → 2 Fe₂O₃',
    otherEquations: ['3 Fe + 2 O₂ → Fe₃O₄', '2 Fe + O₂ → 2 FeO'],
    effect: 'rust',
    resultColor: '#9a3412',
    resultLine: 'El hierro se oxidó.',
    mixingMs: 2500,
    whatYouSaw: [
      'El hierro gris va cambiando poco a poco a un color café rojizo: es la herrumbre.',
      'La capa de óxido es escamosa y se desprende en hojuelas.',
      'En la vida real es lenta: tarda días o años en el aire, y va más rápido con humedad. Aquí se acelera para que la veas.',
    ],
    why: [
      'El hierro se oxida (Fe → Fe³⁺) al ceder electrones y el oxígeno se reduce (O⁰ → O²⁻). El producto principal es el óxido de hierro(III), Fe₂O₃, la herrumbre.',
      'Según la temperatura y la cantidad de oxígeno también se pueden formar otros óxidos: Fe₃O₄ (magnetita, negro) y FeO (óxido de hierro(II)). Por eso se habla de óxidos de hierro, en plural.',
      'La capa de herrumbre es porosa y deja pasar más oxígeno, así que el hierro sigue corroyéndose hacia adentro. El aluminio, en cambio, forma una capa de óxido compacta que lo protege.',
    ],
    noteLabel: 'Dato',
    note:
      'La corrosión debilita estructuras de acero como puentes y barcos. Se previene con pintura, galvanizado (una capa de zinc) o aleaciones como el acero inoxidable.',
  },
  {
    ids: ['c', 'o2'],
    title: 'Carbono + oxígeno → dióxido de carbono',
    equation: 'C + O₂ → CO₂',
    otherEquations: ['2 C + O₂ → 2 CO'],
    effect: 'co2',
    resultColor: '#94a3b8',
    resultLine: '¡Se formó dióxido de carbono!',
    whatYouSaw: [
      'El carbono negro se pone al rojo vivo y arde con una llama.',
      'Se produce calor y se desprende un gas incoloro: dióxido de carbono (CO₂). En la animación lo dibujamos como nubecitas para poder verlo.',
      'El sólido va desapareciendo porque sus átomos pasan a formar parte del gas.',
    ],
    why: [
      'Es una combustión completa. El carbono se oxida (C⁰ → C⁴⁺) y el oxígeno se reduce, y cada átomo de carbono queda unido a dos de oxígeno mediante enlaces dobles (O=C=O).',
      'La ecuación ya está balanceada con coeficientes 1: hay un átomo de carbono y dos de oxígeno de cada lado. Libera unos 394 kJ por cada mol de CO₂.',
      'Si falta oxígeno la combustión es incompleta y se forma monóxido de carbono (2 C + O₂ → 2 CO), un gas tóxico. El CO₂ de quemar carbón, gasolina o gas es el principal gas de efecto invernadero que se emite.',
    ],
    noteLabel: 'Seguridad',
    note:
      'Quemar carbón en un espacio cerrado produce CO, que no se ve ni huele y es mortal. Cualquier combustión necesita buena ventilación.',
  },
]

export function findReaction(a: string, b: string): Reaction | undefined {
  return REACTIONS.find(({ ids }) => (ids[0] === a && ids[1] === b) || (ids[0] === b && ids[1] === a))
}
