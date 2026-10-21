import { REACTIONS, REAGENTS, type Reaction } from './reactions.ts'

// Todas las combinaciones del laboratorio: las reacciones destacadas de REACTIONS más el resto de
// pares de reactivos, incluidos los que no reaccionan, para que cualquier mezcla tenga explicación.
// Al agregar un reactivo a REAGENTS hay que agregar aquí su par con cada uno de los demás.

const N2_INERT =
  'El nitrógeno casi no reacciona: sus dos átomos están unidos por un triple enlace (N≡N), uno de los más fuertes que existen. Romperlo cuesta muchísima energía.'
const METALS =
  'Los dos son metales: ambos tienden a ceder electrones y ninguno a recibirlos, así que no pueden formar un compuesto entre ellos.'
const OXIDIZERS =
  'Los dos son oxidantes: quieren recibir electrones y ninguno los cede. Sin una sustancia que los done, no hay reacción.'

function reagent(id: string) {
  const found = REAGENTS.find((candidate) => candidate.id === id)
  if (!found) throw new Error(`Reactivo desconocido: ${id}`)
  return found
}

type Calm = {
  saw?: string[]
  why: string[]
  // Ecuaciones de lo que sí pasaría con calor, presión o catalizadores que no hay en el vaso
  conditions?: string[]
  noteLabel?: string
  note?: string
}

// Mezclas en las que no hay reacción: el vaso se queda como estaba y se explica por qué
function noReaction(a: string, b: string, { saw, why, conditions, noteLabel = 'Dato', note }: Calm): Reaction {
  const first = reagent(a)
  const second = reagent(b)
  return {
    ids: [a, b],
    title: `${first.name} + ${second.name.charAt(0).toLowerCase()}${second.name.slice(1)}`,
    equation: `${first.formula} + ${second.formula} → no reaccionan`,
    otherEquations: conditions,
    otherLabel: 'Solo reaccionan en condiciones especiales:',
    effect: 'none',
    resultLine: conditions ? 'No reaccionan en condiciones normales.' : 'No pasó nada: no reaccionan.',
    mixingMs: 1000,
    whatYouSaw: saw ?? ['Las dos sustancias quedan juntas en el vaso, pero ninguna cambia: no hay burbujas, ni calor, ni cambio de color.'],
    why,
    noteLabel: note ? noteLabel : undefined,
    note,
  }
}

const MORE_REACTIONS: Reaction[] = [
  // Hidrógeno
  {
    ids: ['h2', 'na'],
    title: 'Hidrógeno + sodio → hidruro de sodio',
    equation: '2 Na + H₂ → 2 NaH',
    effect: 'precipitation',
    resultColor: '#e5e7eb',
    resultLine: 'Se formó hidruro de sodio.',
    mixingMs: 2000,
    whatYouSaw: [
      'Hay que calentar el sodio a unos 300 °C dentro del hidrógeno; a temperatura ambiente no pasa nada.',
      'El metal plateado se va cubriendo de un polvo blanco grisáceo: hidruro de sodio (NaH).',
      'El gas se consume poco a poco, sin llamas ni explosión.',
    ],
    why: [
      'Aquí el hidrógeno hace algo poco común: gana un electrón. El sodio cede el suyo (Na → Na⁺) y el hidrógeno queda como ion hidruro (H⁻).',
      'El NaH es un compuesto iónico, como la sal, pero con H⁻ en lugar de Cl⁻. Como cada molécula de H₂ tiene 2 átomos, se necesitan 2 átomos de sodio.',
      'El ion hidruro es muy reactivo: con agua libera hidrógeno de inmediato (NaH + H₂O → NaOH + H₂). Por eso el NaH se usa en química orgánica como una base muy fuerte.',
    ],
    noteLabel: 'Seguridad',
    note: 'El hidruro de sodio arde en contacto con el agua o la humedad del aire. Se guarda en aceite mineral y se maneja lejos del agua.',
  },
  {
    ids: ['h2', 'cl2'],
    title: 'Hidrógeno + cloro → cloruro de hidrógeno',
    equation: 'H₂ + Cl₂ → 2 HCl',
    effect: 'explosion',
    resultColor: '#f1f5f9',
    resultLine: '¡Explotó y se formó cloruro de hidrógeno!',
    mixingMs: 1200,
    whatYouSaw: [
      'En la oscuridad los dos gases pueden convivir. Con luz intensa (el sol o un flash) o una chispa, la mezcla explota.',
      'El color verde amarillento del cloro desaparece.',
      'Queda un gas incoloro que forma niebla blanca al tocar la humedad del aire: cloruro de hidrógeno (HCl).',
    ],
    why: [
      'Es una síntesis redox: el hidrógeno se oxida (H⁰ → H⁺) y el cloro se reduce (Cl⁰ → Cl⁻). Por cada H₂ y cada Cl₂ se forman 2 moléculas de HCl.',
      'La luz rompe moléculas de Cl₂ en átomos sueltos (radicales). Cada radical le arranca un hidrógeno a una molécula de H₂ y deja otro radical libre: es una reacción en cadena que se acelera sola hasta explotar.',
      'El HCl disuelto en agua es el ácido clorhídrico. Así se fabrica en la industria, quemando hidrógeno en cloro de forma controlada.',
    ],
    noteLabel: 'Seguridad',
    note: 'La mezcla de hidrógeno y cloro puede explotar solo con la luz del sol, y el cloro es tóxico. Nunca se prepara fuera de un laboratorio especializado.',
  },
  noReaction('h2', 'fe', {
    saw: ['El hierro sigue gris y el gas no se consume.'],
    why: [
      'El hierro no forma un compuesto estable con el hidrógeno: los dos tienden a ceder electrones y ninguno los acepta con fuerza.',
      'Sin embargo, el hierro sí ayuda a otras reacciones del hidrógeno: es el catalizador del proceso Haber, que une hidrógeno y nitrógeno para fabricar amoniaco.',
    ],
    note: 'El hidrógeno puede meterse entre los átomos del acero y volverlo quebradizo. A eso se le llama fragilización por hidrógeno y es un problema en tuberías y tanques.',
  }),
  noReaction('h2', 'c', {
    saw: ['El carbón negro se queda igual y el gas no cambia.'],
    why: [
      'A temperatura ambiente no reaccionan: habría que romper el enlace H–H y separar los átomos de carbono del sólido, y eso requiere mucha energía.',
      'Solo a cientos de grados y con un catalizador de níquel se forma metano (CH₄), el componente principal del gas natural.',
    ],
    conditions: ['C + 2 H₂ → CH₄ (con calor y catalizador de níquel)'],
  }),
  noReaction('h2', 'n2', {
    saw: ['Los dos gases incoloros se mezclan, pero no se forma nada nuevo.'],
    why: [
      N2_INERT,
      'Para que reaccionen, la industria usa el proceso Haber: unos 450 °C, una presión 200 veces mayor que la del aire y un catalizador de hierro. Así se obtiene amoniaco (NH₃).',
      'Aun así la reacción es reversible (⇌) y solo una parte de los gases se convierte en cada pasada.',
    ],
    conditions: ['N₂ + 3 H₂ ⇌ 2 NH₃ (450 °C, 200 atm y catalizador de hierro)'],
    note: 'Casi todos los fertilizantes del mundo se hacen con amoniaco del proceso Haber. Se calcula que la mitad de los alimentos que comemos dependen de él.',
  }),
  noReaction('h2', 'p', {
    why: [
      'El fósforo y el hidrógeno atraen los electrones casi con la misma fuerza (tienen electronegatividades parecidas), así que ninguno le gana al otro y unirlos directamente no libera energía.',
      'El compuesto que forman, la fosfina (PH₃), se obtiene por otros caminos: por ejemplo, con fósforo blanco y una base caliente (prueba P + NaOH).',
    ],
  }),
  {
    ids: ['h2', 's'],
    title: 'Hidrógeno + azufre → sulfuro de hidrógeno',
    equation: 'H₂ + S → H₂S',
    effect: 'whitesmoke',
    resultColor: '#fef9c3',
    smokeColor: '#fef08a',
    resultLine: 'Huele a huevo podrido.',
    mixingMs: 1800,
    whatYouSaw: [
      'Hay que fundir y calentar el azufre amarillo dentro del hidrógeno.',
      'El azufre se va consumiendo y aparece un gas incoloro con olor a huevo podrido: sulfuro de hidrógeno (H₂S). En la animación lo dibujamos como nubecitas para que lo veas.',
    ],
    why: [
      'El azufre es más electronegativo que el hidrógeno: lo oxida (H⁰ → H⁺) y él se reduce (S⁰ → S²⁻).',
      'El azufre está justo debajo del oxígeno en la tabla periódica, por eso el H₂S se parece al agua (H₂O) y también tiene forma de V. Pero sus moléculas se atraen menos entre sí y a temperatura ambiente es un gas.',
      'La reacción libera poca energía (unos 20 kJ por mol), por eso necesita calor constante para avanzar.',
    ],
    noteLabel: 'Seguridad',
    note: 'El H₂S es muy tóxico. En concentraciones altas deja de olerse porque paraliza el olfato, y eso lo hace todavía más peligroso.',
  },
  noReaction('h2', 'cu', {
    saw: ['El cobre conserva su color rojizo y el gas no se consume.'],
    why: [
      'El cobre es un metal poco reactivo y no forma un compuesto estable con el hidrógeno.',
      'Lo interesante es al revés: si el cobre ya está oxidado (CuO, negro), el hidrógeno caliente le quita el oxígeno y lo devuelve a cobre rojizo, formando agua: CuO + H₂ → Cu + H₂O.',
    ],
  }),
  noReaction('h2', 'zn', {
    why: [
      'El zinc y el hidrógeno no se combinan: los dos tienden a ceder electrones.',
      'De hecho, el zinc es una forma clásica de obtener hidrógeno: al ponerlo en un ácido, lo libera (prueba Zn + HCl).',
    ],
  }),
  noReaction('h2', 'al', {
    why: [
      'El aluminio está cubierto por una capa invisible de óxido (Al₂O₃) y, además, no forma un compuesto estable con el hidrógeno directamente.',
      'El hidruro de aluminio (AlH₃) existe, pero se fabrica con otros reactivos, no mezclando el metal con el gas.',
    ],
  }),
  noReaction('h2', 'mg', {
    why: [
      'A temperatura y presión normales, el magnesio no reacciona con el hidrógeno.',
      'Calentado a unos 300 °C y con mucha presión, el magnesio sí absorbe hidrógeno y forma hidruro de magnesio (MgH₂). Se estudia como una forma de almacenar hidrógeno para usarlo como combustible.',
    ],
    conditions: ['Mg + H₂ → MgH₂ (alta presión y unos 300 °C)'],
  }),
  {
    ids: ['h2', 'br2'],
    title: 'Hidrógeno + bromo → bromuro de hidrógeno',
    equation: 'H₂ + Br₂ → 2 HBr',
    effect: 'colorchange',
    resultColor: '#f1f5f9',
    resultLine: 'El color rojizo del bromo desapareció.',
    mixingMs: 1800,
    whatYouSaw: [
      'Con calor o luz, el vapor rojizo del bromo reacciona con el hidrógeno.',
      'El color rojo café va desapareciendo poco a poco.',
      'Queda un gas incoloro que echa humo blanco con la humedad del aire: bromuro de hidrógeno (HBr).',
    ],
    why: [
      'Es una síntesis redox, igual que con el cloro: el hidrógeno se oxida (H⁰ → H⁺) y el bromo se reduce (Br⁰ → Br⁻).',
      'Es más tranquila que la del cloro: el bromo es menos reactivo, así que no explota con la luz del sol, aunque sí necesita calor o luz para empezar.',
      'Bajando por el grupo de los halógenos la reactividad disminuye: el cloro explota con el hidrógeno, el bromo reacciona con calor y el yodo apenas llega a un equilibrio (prueba I₂ + H₂).',
    ],
    noteLabel: 'Seguridad',
    note: 'El bromo es muy tóxico y quema la piel. Se maneja con guantes y en campana de extracción.',
  },
  noReaction('h2', 'h2o2', {
    saw: ['El gas burbujea en el líquido sin cambiar nada.'],
    why: [
      'La molécula de hidrógeno (H–H) es muy estable y a temperatura ambiente no reacciona con el peróxido.',
      'Con un catalizador de paladio sí se combinan. La industria fabrica el propio peróxido de hidrógeno con hidrógeno, pero por un camino indirecto y también con paladio.',
    ],
  }),
  noReaction('h2', 'kmno4', {
    saw: ['El gas burbujea en la solución y el morado no cambia.'],
    why: [
      'Aunque el permanganato es un oxidante fuerte, el hidrógeno gaseoso es muy poco reactivo a temperatura ambiente: romper el enlace H–H cuesta mucha energía.',
      'Es un ejemplo de que una reacción puede ser posible en teoría y aun así ser tan lenta que no se nota.',
    ],
  }),
  noReaction('h2', 'hcl', {
    why: [
      'Los dos ya tienen hidrógeno y no hay nada que intercambiar: el cloro del HCl ya tiene su electrón extra y el hidrógeno no puede quitárselo.',
      'De hecho, el hidrógeno es uno de los productos cuando el HCl ataca a un metal (prueba Zn + HCl).',
    ],
  }),
  noReaction('h2', 'naoh', {
    saw: ['El gas solo burbujea y se escapa.'],
    why: ['El hidrógeno no es ácido ni básico, así que la base no tiene nada que neutralizar. Tampoco hay electrones que intercambiar.'],
  }),
  noReaction('h2', 'h2so4', {
    why: [
      'El H₂ no es una base, y aunque el ácido sulfúrico concentrado es oxidante, no logra romper el enlace H–H.',
      'Antes se usaba ácido sulfúrico para secar gases como el hidrógeno: atrapa el vapor de agua sin reaccionar con el gas.',
    ],
  }),
  noReaction('h2', 'caco3', {
    why: [
      'El carbonato de calcio es muy estable y el hidrógeno no reacciona con él.',
      'Para descomponer el CaCO₃ hay que calentarlo a unos 900 °C o atacarlo con un ácido (prueba CaCO₃ + HCl).',
    ],
  }),
  noReaction('h2', 'agno3', {
    saw: ['El gas burbujea y la solución sigue incolora.'],
    why: [
      'En teoría el hidrógeno podría reducir los iones de plata (Ag⁺) a plata metálica, porque la plata es un metal noble que acepta electrones con facilidad.',
      'Pero sin un catalizador la reacción es tan lenta que no se ve nada. Que una reacción sea posible no significa que sea rápida.',
    ],
  }),
  noReaction('h2', 'nacl', {
    why: ['El sodio y el cloro de la sal ya intercambiaron su electrón y están muy estables como iones (Na⁺ y Cl⁻). El hidrógeno no tiene nada que hacer con ellos.'],
  }),

  // Oxígeno
  {
    ids: ['o2', 'na'],
    title: 'Oxígeno + sodio → óxido de sodio',
    equation: '4 Na + O₂ → 2 Na₂O',
    otherEquations: ['2 Na + O₂ → Na₂O₂'],
    effect: 'salt',
    resultColor: '#f8fafc',
    resultLine: 'El sodio ardió con llama amarilla.',
    whatYouSaw: [
      'Recién cortado el sodio brilla, pero en segundos se opaca: ya está reaccionando con el aire.',
      'Calentado, arde con una llama amarilla muy intensa.',
      'Queda un polvo blanco: óxido de sodio (Na₂O) y, si sobra oxígeno, peróxido de sodio (Na₂O₂), amarillento.',
    ],
    why: [
      'El sodio cede su único electrón externo con mucha facilidad (Na → Na⁺) y el oxígeno lo recibe (O⁰ → O²⁻). Se necesitan 4 átomos de sodio por cada molécula de O₂.',
      'El amarillo de la llama es característico del sodio: el calor excita sus electrones y, al regresar a su nivel, emiten luz amarilla. Es el mismo color de las lámparas de sodio del alumbrado público.',
      'El óxido de sodio es básico: con agua forma hidróxido de sodio (Na₂O + H₂O → 2 NaOH).',
    ],
    noteLabel: 'Seguridad',
    note: 'El sodio se guarda bajo aceite porque reacciona con el oxígeno y con la humedad del aire. Un incendio de sodio no se apaga con agua: empeora.',
  },
  noReaction('o2', 'cl2', {
    saw: ['El gas verde amarillento del cloro se mezcla con el oxígeno y sigue igual.'],
    why: [
      'Los dos son no metales muy electronegativos: ambos quieren ganar electrones y ninguno los cede.',
      'Los óxidos de cloro existen, pero son inestables y se fabrican por otros caminos. Uno de ellos, el dióxido de cloro (ClO₂), se usa para potabilizar agua.',
    ],
  }),
  noReaction('o2', 'n2', {
    saw: ['Se mezclan sin ningún cambio. ¡Esta mezcla es casi el aire que respiras!'],
    why: [
      'El aire tiene cerca de 78 % de nitrógeno y 21 % de oxígeno, y no reaccionan: el triple enlace del nitrógeno es demasiado fuerte.',
      'Solo a temperaturas altísimas, como en un rayo o dentro del motor de un coche, se forma monóxido de nitrógeno (NO). Ese gas contribuye al smog y a la lluvia ácida.',
    ],
    conditions: ['N₂ + O₂ → 2 NO (en un rayo o en un motor)'],
  }),
  {
    ids: ['o2', 'zn'],
    title: 'Oxígeno + zinc → óxido de zinc',
    equation: '2 Zn + O₂ → 2 ZnO',
    effect: 'whitesmoke',
    resultColor: '#f8fafc',
    resultLine: 'El zinc ardió y formó humo blanco.',
    mixingMs: 1600,
    whatYouSaw: [
      'El zinc en polvo, calentado, arde con una llama verde azulada.',
      'Se forma un humo blanco muy fino que cae como copos de algodón: óxido de zinc (ZnO).',
      'El óxido de zinc es amarillo mientras está caliente y vuelve a ser blanco al enfriarse.',
    ],
    why: [
      'El zinc se oxida (Zn → Zn²⁺) al ceder dos electrones y el oxígeno se reduce (O⁰ → O²⁻).',
      'Los alquimistas llamaban a ese humo "lana filosófica" por su aspecto de algodón.',
      'El cambio de color con la temperatura se llama termocromismo: al calentarse, el cristal de ZnO pierde un poco de oxígeno, absorbe luz azul y por eso se ve amarillo.',
    ],
    noteLabel: 'Dato',
    note: 'El óxido de zinc es el ingrediente blanco de muchos bloqueadores solares y de la pomada para rozaduras.',
  },
  noReaction('o2', 'i2', {
    saw: ['Los cristales negros siguen igual y, si se calientan, sueltan vapor morado.'],
    why: [
      'El yodo y el oxígeno no reaccionan directamente: los dos son no metales que prefieren ganar electrones.',
      'El yodo solo se sublima: pasa de sólido a vapor morado sin fundirse, y ese vapor se mezcla con el oxígeno sin cambiar.',
    ],
  }),
  noReaction('o2', 'br2', {
    saw: ['El vapor rojizo del bromo se mezcla con el oxígeno sin cambiar de color.'],
    why: [
      'El bromo y el oxígeno no reaccionan: ambos quieren ganar electrones.',
      'Los óxidos de bromo existen, pero son tan inestables que se descomponen muy por debajo de la temperatura ambiente.',
    ],
  }),
  noReaction('o2', 'h2o2', {
    why: [
      'El peróxido de hidrógeno se descompone solo, poco a poco, en agua y oxígeno (2 H₂O₂ → 2 H₂O + O₂). Agregar más oxígeno no cambia nada.',
      'Por eso el agua oxigenada se guarda en frascos oscuros: la luz acelera esa descomposición.',
    ],
  }),
  noReaction('o2', 'kmno4', {
    why: [
      OXIDIZERS,
      'Al calentar el permanganato sólido pasa al revés: él mismo libera oxígeno (2 KMnO₄ → K₂MnO₄ + MnO₂ + O₂).',
    ],
  }),
  noReaction('o2', 'hcl', {
    why: [
      'A temperatura ambiente no reaccionan.',
      'A unos 400 °C y con un catalizador de cobre, el oxígeno le quita el hidrógeno al HCl y se forma cloro. Es el proceso Deacon, que se usó para fabricar cloro.',
    ],
    conditions: ['4 HCl + O₂ → 2 Cl₂ + 2 H₂O (400 °C y catalizador)'],
  }),
  noReaction('o2', 'naoh', {
    why: [
      'El oxígeno no reacciona con el hidróxido de sodio: no tiene nada que oxidar.',
      'Lo que sí absorbe el NaOH del aire es el dióxido de carbono (CO₂) y la humedad. Por eso los frascos de sosa deben estar bien cerrados.',
    ],
  }),
  noReaction('o2', 'h2so4', {
    why: ['En el ácido sulfúrico el azufre ya tiene su número de oxidación más alto (+6). El oxígeno no puede oxidarlo más.'],
  }),
  noReaction('o2', 'caco3', {
    why: ['El carbonato de calcio ya está lleno de oxígeno (CO₃²⁻) y su carbono está en +4, el máximo. El oxígeno no tiene nada que oxidar.'],
  }),
  noReaction('o2', 'agno3', {
    why: ['Tanto la plata (Ag⁺) como el nitrógeno del nitrato (+5) ya están oxidados. El oxígeno no tiene a quién quitarle electrones.'],
  }),
  noReaction('o2', 'nacl', {
    why: ['El sodio de la sal (Na⁺) ya está oxidado, y el oxígeno no es lo bastante fuerte para quitarle el electrón al ion cloruro (Cl⁻). La sal sigue igual.'],
  }),

  // Sodio
  noReaction('na', 'fe', {
    saw: ['Los dos metales quedan juntos, pero cada uno conserva su aspecto.'],
    why: [
      METALS,
      'Ni siquiera fundidos se mezclan: el sodio funde a 98 °C y el hierro a 1538 °C, y sus átomos son demasiado distintos para formar una aleación.',
    ],
    note: 'Por eso el sodio líquido que enfría algunos reactores nucleares puede circular por tuberías de acero.',
  }),
  noReaction('na', 'c', {
    why: [
      'El carbono sólido es muy estable y no es lo bastante electronegativo para quitarle electrones al sodio.',
      'El carburo de sodio (Na₂C₂) existe, pero se prepara con acetileno, no con carbón.',
    ],
  }),
  noReaction('na', 'n2', {
    why: [
      N2_INERT,
      'Al sodio, aunque es muy reactivo, no le alcanza para romperlo. El litio, su vecino de arriba en la tabla, sí lo hace: es el único metal alcalino que reacciona con el nitrógeno a temperatura ambiente.',
    ],
    note: 'Las bolsas de aire de los coches se inflan con el nitrógeno que suelta la azida de sodio al descomponerse: 2 NaN₃ → 2 Na + 3 N₂.',
  }),
  noReaction('na', 'p', {
    why: [
      'A temperatura ambiente no reaccionan: el fósforo rojo es un sólido estable y el sodio está cubierto de una capa de óxido.',
      'Calentándolos juntos y sin aire, el sodio le cede electrones al fósforo y se forma fosfuro de sodio (Na₃P), un sólido oscuro.',
      'El fosfuro reacciona con el agua y libera fosfina (PH₃), un gas muy tóxico.',
    ],
    conditions: ['3 Na + P → Na₃P (calentando sin aire)'],
  }),
  {
    ids: ['na', 's'],
    title: 'Sodio + azufre → sulfuro de sodio',
    equation: '2 Na + S → Na₂S',
    effect: 'sparkle',
    resultColor: '#fefce8',
    resultLine: '¡Reacción violenta con chispas!',
    mixingMs: 1400,
    whatYouSaw: [
      'Al calentarlos juntos, la mezcla se enciende de golpe y lanza chispas.',
      'Se forma un sólido blanco amarillento: sulfuro de sodio (Na₂S).',
    ],
    why: [
      'El sodio cede un electrón (Na → Na⁺) y cada átomo de azufre necesita dos (S → S²⁻). Por eso hacen falta 2 átomos de sodio por cada uno de azufre.',
      'Es muy exotérmica (unos 365 kJ por mol) y todo pasa muy rápido, por eso se ve como una explosión de chispas.',
      'Esta misma reacción, controlada y con el sodio y el azufre fundidos, da energía a las baterías de sodio-azufre que guardan electricidad para la red eléctrica.',
    ],
    noteLabel: 'Seguridad',
    note: 'Molidos juntos, el sodio y el azufre pueden explotar. Además, el sulfuro de sodio con ácidos libera H₂S, un gas muy tóxico.',
  },
  noReaction('na', 'cu', {
    why: [
      METALS,
      'El sodio es mucho más reactivo que el cobre, pero eso solo importa cuando el cobre está como ion (Cu²⁺, en una sal). Al cobre metálico no hay nada que quitarle.',
    ],
  }),
  noReaction('na', 'zn', {
    why: [
      METALS,
      'Las mezclas de metales fundidos se llaman aleaciones. No son compuestos nuevos: los átomos se acomodan juntos sin intercambiar electrones.',
    ],
  }),
  noReaction('na', 'al', {
    why: [
      METALS,
      'El aluminio, además, está protegido por su capa de óxido. Que el sodio sea más reactivo solo importaría si el aluminio estuviera como ion en una sal.',
    ],
  }),
  noReaction('na', 'mg', {
    why: [
      METALS,
      'El magnesio es casi tan reactivo como el sodio: los dos son "donadores" de electrones. Juntos no hay quien los reciba.',
    ],
  }),
  {
    ids: ['na', 'i2'],
    title: 'Sodio + yodo → yoduro de sodio',
    equation: '2 Na + I₂ → 2 NaI',
    effect: 'salt',
    resultColor: '#ffffff',
    resultLine: 'Se formó yoduro de sodio.',
    mixingMs: 2000,
    whatYouSaw: [
      'A temperatura ambiente reaccionan muy lento. Al calentar, el sodio arde en el vapor morado del yodo.',
      'El color morado desaparece y queda un sólido blanco: yoduro de sodio (NaI).',
    ],
    why: [
      'Es la misma idea que con el cloro: el sodio cede un electrón (Na → Na⁺) y el yodo lo recibe (I → I⁻), formando un cristal iónico.',
      'El yodo es el menos reactivo de los halógenos del laboratorio: su átomo es grande y atrae menos los electrones. Por eso la reacción es más lenta que con cloro o bromo.',
    ],
    noteLabel: 'Dato',
    note: 'A la sal de mesa se le agrega yodo, en forma de yoduro o yodato de potasio, porque la tiroides lo necesita para funcionar.',
  },
  {
    ids: ['na', 'br2'],
    title: 'Sodio + bromo → bromuro de sodio',
    equation: '2 Na + Br₂ → 2 NaBr',
    effect: 'salt',
    resultColor: '#ffffff',
    resultLine: 'Se formó bromuro de sodio.',
    mixingMs: 1600,
    whatYouSaw: [
      'El sodio reacciona con el bromo líquido rojo oscuro; con calor la reacción se vuelve muy violenta.',
      'El color rojizo desaparece y queda un sólido blanco: bromuro de sodio (NaBr).',
    ],
    why: [
      'El sodio cede un electrón (Na → Na⁺) y el bromo lo recibe (Br → Br⁻). Los iones forman un cristal como el de la sal de mesa.',
      'El bromo es menos reactivo que el cloro pero más que el yodo, así que esta reacción queda en medio de las dos.',
    ],
    noteLabel: 'Seguridad',
    note: 'El potasio, vecino del sodio, explota al tocar el bromo líquido. Con sodio también es peligroso si se calienta o se golpea.',
  },
  {
    ids: ['na', 'h2o2'],
    title: 'Sodio + peróxido de hidrógeno',
    equation: '2 Na + H₂O₂ → 2 NaOH',
    otherEquations: ['2 Na + 2 H₂O → 2 NaOH + H₂'],
    otherLabel: 'Al mismo tiempo, el sodio reacciona con el agua:',
    effect: 'explosion',
    resultColor: '#f1f5f9',
    resultLine: '¡Reacción violenta!',
    whatYouSaw: [
      'El sodio reacciona de inmediato con el agua oxigenada: se funde, corre por la superficie y suelta chispas.',
      'Se desprenden gases y la mezcla se calienta tanto que puede encenderse con una llama amarilla.',
      'Queda una solución incolora y muy básica: hidróxido de sodio.',
    ],
    why: [
      'El agua oxigenada es peróxido disuelto en agua, y el sodio reacciona con los dos: con el peróxido forma hidróxido de sodio y con el agua, además, libera hidrógeno.',
      'El calor descompone parte del peróxido en oxígeno. Hidrógeno, oxígeno y calor juntos pueden provocar una pequeña explosión.',
    ],
    noteLabel: 'Seguridad',
    note: 'El sodio con agua ya es peligroso; con peróxido de hidrógeno es todavía más violento. Nunca se mezclan fuera de una demostración controlada.',
  },
  {
    ids: ['na', 'kmno4'],
    title: 'Sodio + permanganato de potasio',
    equation: '2 Na + 2 H₂O → 2 NaOH + H₂',
    otherEquations: ['4 MnO₄⁻ + 4 OH⁻ → 4 MnO₄²⁻ + O₂ + 2 H₂O'],
    otherLabel: 'Después, en la solución básica:',
    effect: 'effervescence',
    resultColor: '#15803d',
    resultLine: 'El morado se volvió verde.',
    mixingMs: 1800,
    whatYouSaw: [
      'El sodio reacciona con el agua de la solución morada: burbujea, se funde y corre por la superficie.',
      'Alrededor del sodio el color morado cambia a verde.',
    ],
    why: [
      'El sodio reacciona con el agua, no directamente con el permanganato: forma hidróxido de sodio y libera hidrógeno.',
      'La solución se vuelve muy básica, y en medio básico el permanganato (MnO₄⁻, morado) se reduce a manganato (MnO₄²⁻, verde).',
      'El color de los compuestos de manganeso depende de su número de oxidación: +7 es morado, +6 verde y +4 café (MnO₂).',
    ],
    noteLabel: 'Seguridad',
    note: 'El sodio reacciona con violencia con cualquier solución en agua y el hidrógeno puede encenderse. Solo en laboratorio y con protección.',
  },
  {
    ids: ['na', 'hcl'],
    title: 'Sodio + ácido clorhídrico',
    equation: '2 Na + 2 HCl → 2 NaCl + H₂',
    effect: 'explosion',
    resultColor: '#f1f5f9',
    resultLine: '¡Explosión!',
    whatYouSaw: [
      'El sodio reacciona con el ácido con muchísima más violencia que con el agua.',
      'Libera hidrógeno tan rápido y con tanto calor que el gas se enciende y explota.',
      'Al final queda agua con sal disuelta: cloruro de sodio.',
    ],
    why: [
      'El sodio es de los metales más reactivos: le cede su electrón a los H⁺ del ácido y los convierte en hidrógeno (2 H⁺ + 2e⁻ → H₂).',
      'El ácido tiene muchísimos más iones H⁺ que el agua pura, así que la reacción es más rápida y suelta el calor de golpe.',
      'Curiosamente, el producto es sal de mesa: dos sustancias peligrosas dan una inofensiva, igual que con el cloro (prueba Na + Cl₂).',
    ],
    noteLabel: 'Seguridad',
    note: 'Es una de las mezclas más peligrosas del laboratorio: puede proyectar ácido y sodio encendido. Nunca se hace.',
  },
  {
    ids: ['na', 'naoh'],
    title: 'Sodio + hidróxido de sodio',
    equation: '2 Na + 2 H₂O → 2 NaOH + H₂',
    effect: 'effervescence',
    resultColor: '#f3f4f6',
    resultLine: 'El sodio reaccionó con el agua.',
    mixingMs: 1600,
    whatYouSaw: [
      'El sodio flota, se funde en una bolita plateada y corre por la superficie mientras burbujea.',
      'Puede encenderse con una llama amarilla y hacer un pequeño "pop".',
    ],
    why: [
      'El hidróxido de sodio no reacciona con el sodio; quien reacciona es el agua de la solución. El sodio le cede su electrón y el agua libera hidrógeno.',
      'El producto es más hidróxido de sodio: la solución queda todavía más concentrada.',
      'El sodio flota porque es menos denso que el agua, y se funde porque la reacción libera calor y él funde a solo 98 °C.',
    ],
    noteLabel: 'Seguridad',
    note: 'El hidrógeno que se libera puede encenderse y salpicar sosa caliente, que quema la piel. Solo en laboratorio y con protección.',
  },
  {
    ids: ['na', 'h2so4'],
    title: 'Sodio + ácido sulfúrico',
    equation: '2 Na + H₂SO₄ → Na₂SO₄ + H₂',
    effect: 'explosion',
    resultColor: '#f8fafc',
    resultLine: '¡Explosión!',
    whatYouSaw: [
      'El sodio reacciona de forma explosiva con el ácido.',
      'Se libera hidrógeno de golpe, con calor, chispas y salpicaduras.',
      'Queda sulfato de sodio (Na₂SO₄) disuelto.',
    ],
    why: [
      'El sodio convierte los H⁺ del ácido en H₂. Como el ácido sulfúrico tiene dos hidrógenos ácidos, se necesitan 2 átomos de sodio por cada molécula.',
      'El ácido concentrado, además, es oxidante y puede formar también dióxido de azufre (SO₂) o sulfuro de hidrógeno (H₂S).',
    ],
    noteLabel: 'Seguridad',
    note: 'Extremadamente peligrosa: proyecta ácido hirviendo. Nunca se hace.',
  },
  noReaction('na', 'caco3', {
    why: [
      'El carbonato de calcio es un sólido seco: no tiene agua ni iones H⁺ que el sodio pueda atacar.',
      'El calcio ya está como ion Ca²⁺ y es casi tan reactivo como el sodio, así que el sodio no puede desplazarlo.',
    ],
  }),
  {
    ids: ['na', 'agno3'],
    title: 'Sodio + nitrato de plata',
    equation: '2 Na + 2 H₂O → 2 NaOH + H₂',
    otherEquations: ['2 AgNO₃ + 2 NaOH → Ag₂O↓ + 2 NaNO₃ + H₂O'],
    otherLabel: 'Después, la sosa reacciona con la plata:',
    effect: 'darkening',
    resultColor: '#57534e',
    resultLine: 'Apareció un sólido café oscuro.',
    mixingMs: 1600,
    whatYouSaw: [
      'El sodio burbujea y corre por la superficie, como en el agua.',
      'A su alrededor aparece un sólido café oscuro que se va al fondo.',
    ],
    why: [
      'Esperarías que el sodio desplazara a la plata, pero reacciona primero con el agua: forma hidróxido de sodio y libera hidrógeno.',
      'Ese hidróxido reacciona con el nitrato de plata y forma óxido de plata (Ag₂O), un precipitado café oscuro.',
      'Para desplazar a la plata de su sal se usa un metal que no reaccione con el agua, como el cobre (prueba Cu + AgNO₃).',
    ],
    noteLabel: 'Seguridad',
    note: 'El sodio reacciona con violencia con cualquier solución en agua, y el nitrato de plata mancha y quema la piel.',
  },
  {
    ids: ['na', 'nacl'],
    title: 'Sodio + cloruro de sodio',
    equation: '2 Na + 2 H₂O → 2 NaOH + H₂',
    effect: 'effervescence',
    resultColor: '#f3f4f6',
    resultLine: 'El sodio reaccionó con el agua salada.',
    mixingMs: 1600,
    whatYouSaw: ['El sodio burbujea, se funde en una bolita y corre por la superficie del agua salada.'],
    why: [
      'La sal no participa: su sodio ya es Na⁺ y no puede oxidarse más. Quien reacciona es el agua, que libera hidrógeno.',
      'Al final la solución tiene sal y además hidróxido de sodio, así que se vuelve básica.',
      'Si la sal estuviera seca, en cristales, no pasaría nada.',
    ],
    noteLabel: 'Seguridad',
    note: 'El hidrógeno que se libera puede encenderse. El sodio nunca se pone en agua fuera de una demostración controlada.',
  },

  // Cloro
  {
    ids: ['cl2', 'fe'],
    title: 'Cloro + hierro → cloruro de hierro(III)',
    equation: '2 Fe + 3 Cl₂ → 2 FeCl₃',
    effect: 'whitesmoke',
    resultColor: '#92400e',
    smokeColor: '#b45309',
    resultLine: 'El hierro ardió en el cloro.',
    mixingMs: 1600,
    whatYouSaw: [
      'La lana de hierro caliente se pone incandescente dentro del cloro.',
      'Sale un humo café rojizo y queda un sólido café oscuro: cloruro de hierro(III) (FeCl₃).',
    ],
    why: [
      'El cloro es un oxidante tan fuerte que lleva al hierro hasta Fe³⁺ (cede 3 electrones). Cada átomo de cloro recibe uno (Cl → Cl⁻).',
      'Por eso se necesitan 3 moléculas de Cl₂ (6 átomos de cloro) por cada 2 átomos de hierro.',
      'Con yodo es distinto: es un oxidante más débil y solo lleva al hierro a Fe²⁺ (prueba Fe + I₂).',
    ],
    noteLabel: 'Dato',
    note: 'El cloruro de hierro(III) se usa para limpiar agua y para grabar circuitos electrónicos en placas de cobre.',
  },
  noReaction('cl2', 'c', {
    saw: ['El carbón negro sigue igual y el gas verde no cambia.'],
    why: [
      'El carbono sólido no reacciona con el cloro: sus átomos están muy bien unidos entre sí y el cloro no logra separarlos.',
      'Los compuestos de carbono y cloro, como el tetracloruro de carbono (CCl₄), se fabrican a partir de otras sustancias, como el metano.',
    ],
    note: 'Los filtros de carbón activado sí quitan el cloro del agua de la llave: con agua de por medio, la enorme superficie del carbón lo convierte en iones cloruro.',
  }),
  noReaction('cl2', 'n2', {
    why: [N2_INERT, 'El tricloruro de nitrógeno (NCl₃) existe, pero se hace con amoniaco y es un explosivo muy inestable.'],
  }),
  {
    ids: ['cl2', 'p'],
    title: 'Cloro + fósforo → cloruros de fósforo',
    equation: '2 P + 3 Cl₂ → 2 PCl₃',
    otherEquations: ['2 P + 5 Cl₂ → 2 PCl₅'],
    effect: 'whitesmoke',
    resultColor: '#f8fafc',
    resultLine: 'El fósforo ardió solo en el cloro.',
    mixingMs: 1200,
    whatYouSaw: [
      'El fósforo se enciende solo al entrar en contacto con el cloro, sin necesidad de calentarlo.',
      'Se forma un humo blanco y gotas de un líquido incoloro: tricloruro de fósforo (PCl₃).',
      'Si sobra cloro, se forma también un sólido amarillo pálido: pentacloruro de fósforo (PCl₅).',
    ],
    why: [
      'El cloro le quita electrones al fósforo. Con poco cloro el fósforo queda con número de oxidación +3 (PCl₃) y con mucho cloro llega a +5 (PCl₅).',
      'El fósforo puede rodearse de 5 átomos de cloro porque es un átomo grande, con espacio para ellos. El nitrógeno, arriba en el mismo grupo, es tan pequeño que nunca forma NCl₅.',
    ],
    noteLabel: 'Seguridad',
    note: 'Los cloruros de fósforo reaccionan con el agua y liberan ácido clorhídrico. El humo es corrosivo para los ojos y los pulmones.',
  },
  {
    ids: ['cl2', 's'],
    title: 'Cloro + azufre → cloruro de azufre',
    equation: '2 S + Cl₂ → S₂Cl₂',
    otherEquations: ['S₂Cl₂ + Cl₂ ⇌ 2 SCl₂'],
    effect: 'colorchange',
    resultColor: '#f59e0b',
    resultLine: 'Se formó un líquido amarillo anaranjado.',
    mixingMs: 1800,
    whatYouSaw: [
      'Se hace pasar cloro sobre azufre fundido.',
      'El gas verde se consume y se forma un líquido amarillo anaranjado de olor muy irritante: monocloruro de azufre (S₂Cl₂).',
    ],
    why: [
      'El cloro es más electronegativo que el azufre, así que lo oxida. En el S₂Cl₂ los dos azufres están unidos entre sí y cada uno lleva un cloro: Cl–S–S–Cl.',
      'Con más cloro se forma dicloruro de azufre (SCl₂), un líquido rojo.',
    ],
    noteLabel: 'Dato',
    note: 'El S₂Cl₂ se usó para vulcanizar hule: une las cadenas del caucho con puentes de azufre y lo vuelve más resistente.',
  },
  {
    ids: ['cl2', 'cu'],
    title: 'Cloro + cobre → cloruro de cobre(II)',
    equation: 'Cu + Cl₂ → CuCl₂',
    effect: 'whitesmoke',
    resultColor: '#a16207',
    smokeColor: '#ca8a04',
    resultLine: 'El cobre ardió en el cloro.',
    mixingMs: 1600,
    whatYouSaw: [
      'La lámina de cobre caliente se pone al rojo y arde dentro del cloro.',
      'Se forma un humo café amarillento: cloruro de cobre(II) (CuCl₂).',
      'Si se le añade agua, el sólido se disuelve y da una solución verde azulada.',
    ],
    why: [
      'El cloro oxida al cobre hasta Cu²⁺ (Cu → Cu²⁺ + 2e⁻) y cada molécula de Cl₂ recibe esos dos electrones.',
      'El cobre no reacciona con el ácido clorhídrico (prueba Cu + HCl), pero el cloro gaseoso es un oxidante mucho más fuerte y sí logra atacarlo.',
      'El color verde azulado en agua se debe a los iones Cu²⁺ rodeados de moléculas de agua y de cloruro.',
    ],
  },
  {
    ids: ['cl2', 'zn'],
    title: 'Cloro + zinc → cloruro de zinc',
    equation: 'Zn + Cl₂ → ZnCl₂',
    effect: 'whitesmoke',
    resultColor: '#f8fafc',
    resultLine: 'Se formó cloruro de zinc.',
    mixingMs: 1600,
    whatYouSaw: [
      'El zinc caliente reacciona con el cloro y se pone incandescente.',
      'Se forma un sólido blanco: cloruro de zinc (ZnCl₂).',
    ],
    why: [
      'El zinc cede dos electrones (Zn → Zn²⁺) y cada átomo de la molécula de Cl₂ recibe uno.',
      'El ZnCl₂ absorbe tanta humedad del aire que termina disolviéndose en ella. A esto se le llama ser delicuescente.',
    ],
    noteLabel: 'Dato',
    note: 'El cloruro de zinc se usa como fundente al soldar: limpia el óxido de los metales para que la soldadura pegue bien.',
  },
  {
    ids: ['cl2', 'al'],
    title: 'Cloro + aluminio → cloruro de aluminio',
    equation: '2 Al + 3 Cl₂ → 2 AlCl₃',
    effect: 'sparkle',
    resultColor: '#fefce8',
    resultLine: '¡El aluminio ardió en el cloro!',
    mixingMs: 1600,
    whatYouSaw: [
      'El aluminio en polvo o en papel, calentado, arde en el cloro con una luz brillante.',
      'Se forma un humo blanco amarillento: cloruro de aluminio (AlCl₃).',
    ],
    why: [
      'El aluminio cede tres electrones (Al → Al³⁺) y el cloro los recibe. Para 2 Al (6 electrones) se necesitan 3 Cl₂ (6 átomos de cloro).',
      'El AlCl₃ es curioso: aunque viene de un metal y un no metal, tiene mucho carácter covalente y pasa de sólido a gas a solo 180 °C.',
    ],
    noteLabel: 'Seguridad',
    note: 'El cloruro de aluminio reacciona con violencia con el agua y suelta humos de ácido clorhídrico.',
  },
  {
    ids: ['cl2', 'mg'],
    title: 'Cloro + magnesio → cloruro de magnesio',
    equation: 'Mg + Cl₂ → MgCl₂',
    effect: 'sparkle',
    resultColor: '#ffffff',
    resultLine: 'El magnesio ardió con luz blanca.',
    mixingMs: 1200,
    whatYouSaw: [
      'El magnesio encendido sigue ardiendo dentro del cloro con una luz blanca intensa.',
      'Queda un sólido blanco: cloruro de magnesio (MgCl₂).',
    ],
    why: [
      'El magnesio cede dos electrones (Mg → Mg²⁺) y la molécula de Cl₂ los recibe. Se forma un compuesto iónico.',
      'El cloruro de magnesio abunda en el agua de mar. De hecho, el magnesio metálico se obtiene al revés: separando con electricidad el MgCl₂ fundido en magnesio y cloro.',
    ],
  },
  {
    ids: ['cl2', 'i2'],
    title: 'Cloro + yodo → cloruro de yodo',
    equation: 'I₂ + Cl₂ → 2 ICl',
    otherEquations: ['I₂ + 3 Cl₂ → 2 ICl₃'],
    effect: 'colorchange',
    resultColor: '#991b1b',
    resultLine: 'Se formó un compuesto entre dos halógenos.',
    mixingMs: 1600,
    whatYouSaw: [
      'El cloro pasa sobre los cristales de yodo y el sólido negro se convierte en un líquido rojo oscuro: monocloruro de yodo (ICl).',
      'Con exceso de cloro se forma un sólido amarillo: tricloruro de yodo (ICl₃).',
    ],
    why: [
      'Los dos son halógenos, pero el cloro es más electronegativo: jala hacia sí los electrones del enlace. El yodo queda con carga parcial positiva y el cloro con carga parcial negativa.',
      'Los compuestos entre halógenos se llaman interhalógenos. El ICl tiene propiedades intermedias entre las del Cl₂ y las del I₂.',
    ],
    noteLabel: 'Dato',
    note: 'El monocloruro de yodo se usa en el "índice de yodo", una prueba que mide qué tan insaturados son los aceites y las grasas.',
  },
  {
    ids: ['cl2', 'br2'],
    title: 'Cloro + bromo → cloruro de bromo',
    equation: 'Br₂ + Cl₂ ⇌ 2 BrCl',
    effect: 'colorchange',
    resultColor: '#d97706',
    resultLine: 'Se formó cloruro de bromo.',
    mixingMs: 1600,
    whatYouSaw: [
      'El vapor rojizo del bromo y el gas verde del cloro se mezclan y el color cambia a un amarillo rojizo.',
      'Se forma cloruro de bromo (BrCl), aunque parte de los dos gases queda sin reaccionar.',
    ],
    why: [
      'Es un equilibrio (⇌): el BrCl se forma y se descompone al mismo tiempo, así que siempre queda una mezcla de los tres gases.',
      'Como el cloro es más electronegativo, en el enlace Br–Cl el bromo queda con carga parcial positiva.',
    ],
    noteLabel: 'Dato',
    note: 'El cloruro de bromo se usa para desinfectar aguas residuales, como alternativa al cloro.',
  },
  {
    ids: ['cl2', 'h2o2'],
    title: 'Cloro + peróxido de hidrógeno',
    equation: 'H₂O₂ + Cl₂ → 2 HCl + O₂',
    effect: 'effervescence',
    resultColor: '#e0f2fe',
    resultLine: 'Se desprendió oxígeno.',
    mixingMs: 1500,
    whatYouSaw: [
      'El gas verde se disuelve en el agua oxigenada y su color desaparece.',
      'Se forman burbujas: es oxígeno.',
      'En la oscuridad y en medio básico, la mezcla brilla con una tenue luz roja.',
    ],
    why: [
      'El cloro oxida al peróxido: le quita electrones y lo convierte en oxígeno (O⁻¹ → O⁰). El cloro se reduce a cloruro (Cl⁰ → Cl⁻).',
      'Ese oxígeno sale con energía de sobra, en un estado llamado oxígeno singlete. Al relajarse emite luz roja: es quimioluminiscencia.',
    ],
    noteLabel: 'Seguridad',
    note: 'El cloro es un gas tóxico. Esta reacción solo se hace en campana de extracción.',
  },
  noReaction('cl2', 'kmno4', {
    why: [OXIDIZERS, 'Al revés sí funciona: el permanganato con ácido clorhídrico produce cloro (prueba KMnO₄ + HCl).'],
  }),
  noReaction('cl2', 'hcl', {
    why: [
      'El cloro del HCl ya ganó su electrón (es Cl⁻) y el cloro gaseoso no puede quitarle nada más: son el mismo elemento.',
      'El cloro solo se disuelve un poco en la solución y le da un tono amarillo verdoso.',
    ],
  }),
  {
    ids: ['cl2', 'naoh'],
    title: 'Cloro + hidróxido de sodio → blanqueador',
    equation: 'Cl₂ + 2 NaOH → NaCl + NaClO + H₂O',
    otherEquations: ['3 Cl₂ + 6 NaOH → 5 NaCl + NaClO₃ + 3 H₂O (en caliente)'],
    effect: 'colorchange',
    resultColor: '#f0fdf4',
    resultLine: 'Se formó blanqueador (cloro para la ropa).',
    mixingMs: 1500,
    whatYouSaw: [
      'El gas verde amarillento se disuelve rápido en la solución y su color desaparece.',
      'La solución queda incolora y con el olor típico del cloro para la ropa.',
    ],
    why: [
      'Es una dismutación: el mismo elemento se reduce y se oxida a la vez. Un átomo de cloro gana un electrón (Cl⁰ → Cl⁻, cloruro) y el otro pierde uno (Cl⁰ → Cl⁺, hipoclorito).',
      'El hipoclorito de sodio (NaClO) es el ingrediente activo del blanqueador que se usa para la ropa y para desinfectar.',
      'Si la solución está caliente, el hipoclorito se transforma en clorato (NaClO₃).',
    ],
    noteLabel: 'Seguridad',
    note: 'Nunca mezcles cloro para la ropa con ácidos, como algunos limpiadores de baño: la reacción se invierte y se libera cloro gaseoso, que es tóxico.',
  },
  noReaction('cl2', 'h2so4', {
    why: [
      'El azufre del ácido ya está totalmente oxidado (+6) y el cloro no puede quitarle más electrones. Tampoco es una base que el ácido pueda neutralizar.',
      'Por eso en la industria el cloro se seca haciéndolo burbujear en ácido sulfúrico concentrado: el ácido atrapa el agua y deja pasar el cloro sin tocarlo.',
    ],
  }),
  noReaction('cl2', 'caco3', {
    why: [
      'Seco, el carbonato de calcio es muy estable y el cloro gaseoso no reacciona con él.',
      'En agua sería distinto: el cloro forma un poco de ácido (Cl₂ + H₂O ⇌ HCl + HClO) que, lentamente, disuelve la piedra caliza.',
    ],
  }),
  {
    ids: ['cl2', 'agno3'],
    title: 'Cloro + nitrato de plata → cloruro de plata',
    equation: 'Cl₂ + H₂O + AgNO₃ → AgCl↓ + HClO + HNO₃',
    effect: 'precipitation',
    resultColor: '#f5f5f4',
    resultLine: 'Se formó un precipitado blanco.',
    mixingMs: 1400,
    whatYouSaw: [
      'Al burbujear cloro en la solución de nitrato de plata, aparece una nube blanca.',
      'El sólido blanco se va al fondo: es cloruro de plata (AgCl).',
    ],
    why: [
      'Primero el cloro reacciona con el agua y forma iones cloruro (Cl⁻) y ácido hipocloroso (HClO).',
      'Esos cloruros se encuentran con los iones plata (Ag⁺) y forman AgCl, que es insoluble. Es la misma prueba que detecta cloruros (prueba AgNO₃ + NaCl).',
    ],
  },
  noReaction('cl2', 'nacl', {
    why: [
      'El cloro de la sal ya ganó su electrón (es Cl⁻): son el mismo elemento y no hay nada que intercambiar.',
      'Lo interesante es al revés: haciendo pasar electricidad por agua salada se obtiene cloro. Así se fabrica casi todo el cloro del mundo.',
    ],
  }),

  // Hierro
  noReaction('fe', 'c', {
    why: [
      'A temperatura ambiente no reaccionan. Haría falta calentarlos a más de 1000 °C para que el carbono empiece a disolverse en el hierro.',
      'Así se fabrica el acero: hierro con un poco de carbono. Parte del carbono forma cementita (Fe₃C), un compuesto muy duro que le da resistencia.',
    ],
    conditions: ['3 Fe + C → Fe₃C (al fabricar acero)'],
    note: 'El acero tiene menos de 2 % de carbono. Con más carbono se obtiene el hierro fundido, más duro pero también más quebradizo.',
  }),
  noReaction('fe', 'n2', {
    why: [
      N2_INERT,
      'Para endurecer piezas de acero con nitrógeno (nitruración) no se usa N₂: se usa amoniaco caliente, que suelta átomos de nitrógeno que entran en la superficie del metal.',
    ],
  }),
  noReaction('fe', 'p', {
    why: [
      'A temperatura ambiente no reaccionan. Solo fundidos juntos forman fosfuros de hierro, como el Fe₃P.',
      'Al fabricar acero el fósforo es una impureza indeseable: aunque sea muy poco, vuelve al acero quebradizo en frío. Por eso se elimina al refinarlo.',
    ],
    conditions: ['3 Fe + P → Fe₃P (fundidos)'],
  }),
  {
    ids: ['fe', 's'],
    title: 'Hierro + azufre → sulfuro de hierro',
    equation: 'Fe + S → FeS',
    effect: 'darkening',
    resultColor: '#1c1917',
    resultLine: 'Se formó sulfuro de hierro.',
    mixingMs: 2000,
    whatYouSaw: [
      'Antes de calentar, la mezcla se puede separar con un imán: el hierro se pega y el azufre no.',
      'Al calentar un punto, la mezcla se pone al rojo vivo y el brillo avanza solo por toda la mezcla, aunque se quite la flama.',
      'Queda un sólido negro y quebradizo: sulfuro de hierro(II) (FeS). El imán ya no lo atrae como antes.',
    ],
    why: [
      'El hierro se oxida (Fe → Fe²⁺) y el azufre se reduce (S → S²⁻). Al formarse el compuesto, las propiedades de los dos elementos desaparecen.',
      'Es el ejemplo clásico de la diferencia entre mezcla y compuesto: la mezcla conserva las propiedades de cada sustancia; el compuesto tiene propiedades nuevas.',
      'Es exotérmica: libera suficiente calor para seguir avanzando sola una vez que empieza.',
    ],
    noteLabel: 'Dato',
    note: 'La pirita (FeS₂), otro sulfuro de hierro, brilla como el oro. Por eso se le dice "oro de los tontos".',
  },
  noReaction('fe', 'cu', {
    why: [
      METALS,
      'Ni siquiera fundidos se mezclan bien: el hierro y el cobre casi no se disuelven uno en el otro.',
      'Pero si el cobre está como ion (Cu²⁺, en una solución), el hierro sí lo desplaza: un clavo en sulfato de cobre se cubre de cobre rojizo.',
    ],
  }),
  noReaction('fe', 'zn', {
    why: [
      METALS,
      'Aunque no reaccionan, el zinc protege al hierro: en el galvanizado se cubre el acero con zinc. Si algo los ataca, el zinc, más reactivo, se oxida primero y el hierro queda a salvo.',
    ],
  }),
  noReaction('fe', 'al', {
    why: [
      METALS,
      'Si en lugar de hierro hubiera óxido de hierro (Fe₂O₃), el aluminio le quitaría el oxígeno en la famosa reacción de termita, que pasa de 2500 °C y funde el hierro.',
    ],
    note: 'La termita (2 Al + Fe₂O₃ → Al₂O₃ + 2 Fe) se usa para soldar los rieles del tren.',
  }),
  noReaction('fe', 'mg', {
    why: [
      METALS,
      'El magnesio sí protege al hierro: se atornillan bloques de magnesio a los cascos de los barcos y a las tuberías. El magnesio se corroe en lugar del acero; por eso se llaman ánodos de sacrificio.',
    ],
  }),
  {
    ids: ['fe', 'i2'],
    title: 'Hierro + yodo → yoduro de hierro(II)',
    equation: 'Fe + I₂ → FeI₂',
    effect: 'colorchange',
    resultColor: '#57534e',
    resultLine: 'Se formó yoduro de hierro(II).',
    mixingMs: 2000,
    whatYouSaw: [
      'Al calentar el hierro con yodo, el vapor morado se va consumiendo.',
      'Queda un sólido gris oscuro: yoduro de hierro(II) (FeI₂).',
    ],
    why: [
      'El hierro se oxida y el yodo se reduce (I → I⁻). Pero el yodo es un oxidante débil y solo lleva al hierro hasta Fe²⁺, no hasta Fe³⁺.',
      'Compáralo con el cloro, que forma FeCl₃ (prueba Fe + Cl₂). El Fe³⁺ y el yoduro no pueden convivir: el Fe³⁺ le quitaría un electrón al I⁻ y volvería a formar I₂.',
    ],
  },
  {
    ids: ['fe', 'br2'],
    title: 'Hierro + bromo → bromuro de hierro(III)',
    equation: '2 Fe + 3 Br₂ → 2 FeBr₃',
    effect: 'colorchange',
    resultColor: '#7f1d1d',
    resultLine: 'Se formó bromuro de hierro(III).',
    mixingMs: 1800,
    whatYouSaw: [
      'El hierro caliente reacciona con el vapor de bromo y el color rojo del vapor se va.',
      'Queda un sólido rojo oscuro: bromuro de hierro(III) (FeBr₃).',
    ],
    why: [
      'El bromo oxida al hierro hasta Fe³⁺, igual que el cloro. Cada átomo de bromo recibe un electrón (Br → Br⁻).',
      'Eso pone al bromo en medio de los halógenos: lleva al hierro a Fe³⁺ como el cloro, pero reacciona más despacio. El yodo, en cambio, solo llega a Fe²⁺.',
    ],
    noteLabel: 'Dato',
    note: 'El FeBr₃ es un catalizador muy usado en química orgánica para añadir bromo a los anillos de benceno.',
  },
  {
    ids: ['fe', 'h2o2'],
    title: 'Hierro + peróxido de hidrógeno',
    equation: '2 Fe + 3 H₂O₂ → 2 Fe(OH)₃',
    otherEquations: ['2 H₂O₂ → 2 H₂O + O₂'],
    otherLabel: 'Al mismo tiempo, el hierro acelera la descomposición del peróxido:',
    effect: 'rust',
    resultColor: '#9a3412',
    resultLine: 'El hierro se oxidó muy rápido.',
    mixingMs: 2500,
    whatYouSaw: [
      'El hierro se cubre de óxido café rojizo mucho más rápido que en el aire.',
      'Salen algunas burbujas: parte del peróxido se descompone en oxígeno.',
    ],
    why: [
      'El peróxido de hidrógeno es mejor oxidante que el oxígeno del aire: lleva al hierro hasta Fe³⁺, que queda como hidróxido de hierro(III), una forma de herrumbre.',
      'Además, los iones de hierro aceleran la descomposición del peróxido en agua y oxígeno. Por eso se ven burbujas.',
    ],
    noteLabel: 'Dato',
    note: 'La mezcla de peróxido con iones de hierro se llama reactivo de Fenton y se usa para destruir contaminantes en aguas residuales.',
  },
  {
    ids: ['fe', 'kmno4'],
    title: 'Hierro + permanganato de potasio',
    equation: 'Fe + KMnO₄ + 2 H₂O → Fe(OH)₃ + MnO₂ + KOH',
    effect: 'colorchange',
    resultColor: '#78350f',
    resultLine: 'El morado se volvió café.',
    mixingMs: 2500,
    whatYouSaw: [
      'La reacción es lenta: el morado de la solución se va aclarando poco a poco.',
      'Sobre el hierro y en el fondo aparece un sólido café: dióxido de manganeso (MnO₂) y óxido de hierro.',
    ],
    why: [
      'El permanganato oxida al hierro (Fe → Fe³⁺) y el manganeso se reduce de +7 a +4. Cada átomo de hierro cede 3 electrones y cada manganeso recibe 3.',
      'Sin ácido la reacción es lenta y el manganeso se queda como MnO₂ café. Con ácido sería más rápida y el manganeso llegaría hasta Mn²⁺, casi incoloro.',
    ],
  },
  {
    ids: ['fe', 'hcl'],
    title: 'Hierro + ácido clorhídrico',
    equation: 'Fe + 2 HCl → FeCl₂ + H₂',
    effect: 'effervescence',
    resultColor: '#d9f99d',
    resultLine: 'Burbujas de hidrógeno y solución verdosa.',
    mixingMs: 1800,
    whatYouSaw: [
      'El hierro se cubre de burbujas: es hidrógeno.',
      'Poco a poco el hierro se disuelve y la solución toma un tono verde pálido.',
    ],
    why: [
      'El hierro es más reactivo que el hidrógeno, así que le cede electrones a los H⁺ del ácido: Fe → Fe²⁺ y 2 H⁺ → H₂.',
      'El verde pálido es el color de los iones Fe²⁺. Con este ácido el hierro solo llega a Fe²⁺, porque el H⁺ es un oxidante débil.',
      'Burbujea más despacio que el zinc porque el hierro es menos reactivo.',
    ],
    noteLabel: 'Dato',
    note: 'Así se limpia el óxido del acero antes de galvanizarlo o pintarlo: se sumerge en ácido. A eso se le llama decapado.',
  },
  noReaction('fe', 'naoh', {
    why: [
      'El hierro no reacciona con las bases: no es un metal anfótero como el aluminio o el zinc.',
      'De hecho, la sosa cáustica se guarda y se transporta en tanques de acero.',
    ],
  }),
  {
    ids: ['fe', 'h2so4'],
    title: 'Hierro + ácido sulfúrico',
    equation: 'Fe + H₂SO₄ → FeSO₄ + H₂',
    effect: 'effervescence',
    resultColor: '#d9f99d',
    resultLine: 'Burbujas de hidrógeno.',
    mixingMs: 1800,
    whatYouSaw: [
      'Con el ácido diluido, el hierro se cubre de burbujas de hidrógeno y se va disolviendo.',
      'La solución toma un color verde pálido por el sulfato de hierro(II).',
    ],
    why: [
      'Es un desplazamiento: el hierro, más reactivo que el hidrógeno, le cede electrones a los H⁺ del ácido.',
      'Con el ácido concentrado y frío pasa algo sorprendente: casi no reacciona. Se forma una capa de óxido que protege al hierro; a eso se le llama pasivación.',
    ],
    noteLabel: 'Dato',
    note: 'Gracias a la pasivación, el ácido sulfúrico concentrado se transporta en tanques de acero. Pero si se diluye con agua, ¡ataca el tanque!',
  },
  noReaction('fe', 'caco3', {
    why: [
      'El carbonato de calcio no es ácido ni oxidante: no tiene con qué atacar al hierro.',
      'El calcio es mucho más reactivo que el hierro, así que el hierro tampoco puede desplazarlo.',
    ],
  }),
  {
    ids: ['fe', 'agno3'],
    title: 'Hierro + nitrato de plata',
    equation: 'Fe + 2 AgNO₃ → Fe(NO₃)₂ + 2 Ag',
    effect: 'darkening',
    resultColor: '#ecfccb',
    resultLine: 'El hierro se cubrió de plata.',
    mixingMs: 2000,
    whatYouSaw: [
      'El hierro se cubre de un depósito gris plateado: son cristales de plata.',
      'La solución, antes incolora, toma un tono verdoso pálido.',
    ],
    why: [
      'El hierro es más reactivo que la plata, así que le cede electrones a los iones Ag⁺ y los convierte en plata metálica (Ag⁺ + e⁻ → Ag).',
      'Cada átomo de hierro cede 2 electrones, así que reduce a 2 iones de plata. El hierro pasa a la solución como Fe²⁺, que es verdoso.',
    ],
  },
  noReaction('fe', 'nacl', {
    why: [
      'El hierro no puede desplazar al sodio: el sodio es mucho más reactivo y no suelta su lugar.',
      'Pero el agua salada acelera mucho la oxidación del hierro con el oxígeno del aire: los iones disueltos ayudan a que circule la corriente de la corrosión. Por eso los coches se oxidan más rápido cerca del mar.',
    ],
  }),

  // Carbono
  noReaction('c', 'n2', {
    why: [N2_INERT, 'Con el carbono no forma ningún compuesto estable. Por eso, cuando el carbón arde en el aire, reacciona con el oxígeno y el nitrógeno no participa.'],
  }),
  noReaction('c', 'p', {
    why: [
      'El carbono y el fósforo no reaccionan: los dos son no metales sólidos y estables, y ninguno tiene fuerza para quitarle electrones al otro.',
      'De hecho, el carbono se usa para obtener fósforo: se calienta roca fosfórica con arena y coque en un horno eléctrico, y el carbón le quita el oxígeno al fosfato.',
    ],
  }),
  noReaction('c', 's', {
    why: [
      'A temperatura ambiente no pasa nada: los dos sólidos son estables.',
      'Haciendo pasar vapor de azufre sobre carbón al rojo vivo se forma disulfuro de carbono (CS₂), un líquido muy volátil e inflamable.',
    ],
    conditions: ['C + 2 S → CS₂ (vapor de azufre sobre carbón a unos 800 °C)'],
    note: 'El CS₂ es como un CO₂ con azufre en lugar de oxígeno. Se usó para fabricar el rayón y el celofán.',
  }),
  noReaction('c', 'cu', {
    why: [
      'El cobre y el carbono no forman ningún compuesto: el cobre casi no disuelve carbono ni siquiera fundido.',
      'El carbón sí sirve para obtener cobre: calentado con óxido de cobre le quita el oxígeno (2 CuO + C → 2 Cu + CO₂). Así se obtuvieron los primeros metales en la prehistoria.',
    ],
  }),
  noReaction('c', 'zn', {
    why: [
      'El zinc y el carbono no forman compuestos.',
      'Sí aparecen juntos en las pilas comunes de zinc-carbono: una barra de grafito conduce la corriente mientras el zinc se oxida. Pero no reaccionan entre ellos.',
    ],
  }),
  noReaction('c', 'al', {
    why: [
      'A temperatura ambiente no reaccionan; además, el aluminio está protegido por su capa de óxido.',
      'A temperaturas muy altas forman carburo de aluminio (Al₄C₃), un sólido amarillo que con agua libera metano.',
    ],
    conditions: ['4 Al + 3 C → Al₄C₃ (a temperaturas muy altas)'],
  }),
  noReaction('c', 'mg', {
    why: [
      'El magnesio y el carbono no reaccionan directamente.',
      'Lo sorprendente es que el magnesio encendido sí le quita el oxígeno al CO₂: un listón de magnesio ardiendo sigue quemándose dentro de dióxido de carbono y deja manchas negras de carbono (2 Mg + CO₂ → 2 MgO + C).',
    ],
    noteLabel: 'Seguridad',
    note: 'Por eso un incendio de magnesio no se apaga con un extintor de CO₂.',
  }),
  noReaction('c', 'i2', {
    why: [
      'El yodo no es lo bastante reactivo para formar enlaces con el carbono sólido.',
      'Los compuestos de carbono y yodo, como el yodoformo (CHI₃) que se usaba como antiséptico, se fabrican a partir de moléculas orgánicas, no del carbón.',
    ],
  }),
  noReaction('c', 'br2', {
    why: [
      'El bromo no logra romper los enlaces entre los átomos del carbono sólido.',
      'El grafito puede atrapar moléculas de bromo entre sus capas, pero el carbono no se transforma en un compuesto nuevo.',
    ],
  }),
  {
    ids: ['c', 'h2o2'],
    title: 'Carbono + peróxido de hidrógeno',
    equation: '2 H₂O₂ → 2 H₂O + O₂',
    effect: 'effervescence',
    resultColor: '#94a3b8',
    resultLine: 'Se desprendió oxígeno.',
    mixingMs: 1800,
    whatYouSaw: [
      'Sobre la superficie del carbón aparecen burbujas finas.',
      'El carbón no se gasta: al final sigue ahí.',
    ],
    why: [
      'El carbón, sobre todo el carbón activado, tiene una superficie enorme llena de poros. Ahí el peróxido se descompone más rápido en agua y oxígeno.',
      'El carbón actúa como catalizador: acelera la reacción sin consumirse.',
      'Las burbujas son de oxígeno, no de dióxido de carbono: el carbón no se quema.',
    ],
  },
  noReaction('c', 'kmno4', {
    why: [
      'En solución y a temperatura ambiente, el carbón y el permanganato casi no reaccionan: los átomos del carbono sólido están muy bien unidos.',
      'En cambio, mezclados en seco y calentados pueden arder con violencia, porque el permanganato libera oxígeno al calentarse.',
    ],
    noteLabel: 'Seguridad',
    note: 'No mezcles permanganato sólido con carbón, azúcar u otros combustibles: puede encenderse con calor o con un roce.',
  }),
  noReaction('c', 'hcl', {
    why: [
      'El carbono no es un metal: no puede cederle electrones a los H⁺ del ácido para formar hidrógeno.',
      'Por eso los electrodos de grafito se usan en soluciones ácidas: aguantan sin disolverse.',
    ],
  }),
  noReaction('c', 'naoh', {
    why: ['El carbono no es ácido, así que la base no tiene nada que neutralizar. Las dos sustancias quedan como estaban.'],
  }),
  {
    ids: ['c', 'h2so4'],
    title: 'Carbono + ácido sulfúrico',
    equation: 'C + 2 H₂SO₄ → CO₂ + 2 SO₂ + 2 H₂O',
    effect: 'whitesmoke',
    resultColor: '#57534e',
    resultLine: 'Salieron gases de olor picante.',
    mixingMs: 2000,
    whatYouSaw: [
      'En frío no pasa nada. Al calentar el ácido concentrado con el carbón, empiezan a salir gases.',
      'Se desprende un gas con olor picante, como de cerillo recién encendido: dióxido de azufre (SO₂), junto con dióxido de carbono.',
    ],
    why: [
      'El ácido sulfúrico concentrado y caliente es un oxidante fuerte: oxida al carbono hasta CO₂ (C⁰ → C⁴⁺) y su azufre baja de +6 a +4 (SO₂).',
      'Cada átomo de carbono cede 4 electrones y cada azufre recibe 2; por eso se necesitan 2 moléculas de ácido por cada carbono.',
    ],
    noteLabel: 'Seguridad',
    note: 'El SO₂ es tóxico e irrita los pulmones, y el ácido sulfúrico caliente provoca quemaduras graves. Solo en campana de extracción.',
  },
  noReaction('c', 'caco3', {
    why: [
      'A temperatura ambiente no reaccionan.',
      'En un horno, a unos 900 °C, el carbonato se descompone en cal y CO₂, y el carbón al rojo puede convertir ese CO₂ en monóxido de carbono.',
    ],
    conditions: ['CaCO₃ → CaO + CO₂ (a unos 900 °C)', 'C + CO₂ → 2 CO (con el carbón al rojo vivo)'],
  }),
  noReaction('c', 'agno3', {
    why: ['El carbono es muy poco reactivo y, a temperatura ambiente, no le cede electrones a los iones de plata. Las dos sustancias quedan como estaban.'],
  }),
  noReaction('c', 'nacl', {
    why: [
      'El carbono no puede quitarle ni darle electrones a los iones de la sal: los dos están muy estables.',
      'Es solo una mezcla de un polvo negro y uno blanco. Se separa disolviendo la sal en agua y filtrando: el carbón se queda en el filtro.',
    ],
  }),

  // Nitrógeno
  noReaction('n2', 'p', {
    why: [N2_INERT, 'Por eso el fósforo blanco, que arde solo en el aire, puede guardarse sin peligro en nitrógeno: sin oxígeno no tiene con qué reaccionar.'],
  }),
  noReaction('n2', 's', {
    why: [N2_INERT, 'Los compuestos de azufre y nitrógeno, como el S₄N₄, existen, pero se preparan con amoniaco y algunos son explosivos.'],
  }),
  noReaction('n2', 'cu', {
    why: [
      N2_INERT,
      'El cobre tampoco es muy reactivo. Por eso se usa cobre caliente para quitarle el oxígeno al aire: el oxígeno reacciona con el cobre y el nitrógeno pasa sin cambiar.',
    ],
  }),
  noReaction('n2', 'zn', {
    why: [N2_INERT, 'Por eso se usa nitrógeno para proteger metales: soldar o guardar piezas en una atmósfera de nitrógeno evita que se oxiden.'],
  }),
  noReaction('n2', 'al', {
    why: [N2_INERT, 'A más de 800 °C el aluminio sí forma nitruro de aluminio (AlN), una cerámica que conduce muy bien el calor y se usa en electrónica.'],
    conditions: ['2 Al + N₂ → 2 AlN (a más de 800 °C)'],
  }),
  {
    ids: ['n2', 'mg'],
    title: 'Nitrógeno + magnesio → nitruro de magnesio',
    equation: '3 Mg + N₂ → Mg₃N₂',
    effect: 'sparkle',
    resultColor: '#fef08a',
    resultLine: '¡El magnesio arde hasta en nitrógeno!',
    mixingMs: 1600,
    whatYouSaw: [
      'A temperatura ambiente no pasa nada. Pero si se mete un listón de magnesio ya encendido, ¡sigue ardiendo dentro del nitrógeno!',
      'Queda un polvo amarillo verdoso: nitruro de magnesio (Mg₃N₂).',
    ],
    why: [
      'El magnesio ardiendo está tan caliente y es tan reactivo que logra romper el triple enlace del nitrógeno. Cada Mg cede dos electrones y cada N recibe tres (N³⁻).',
      'Para que las cargas cuadren, 3 Mg²⁺ (+6) se combinan con 2 N³⁻ (−6). Por eso la fórmula es Mg₃N₂.',
      'Cuando el magnesio arde en el aire, una parte se convierte en nitruro y no solo en óxido. Con agua, el nitruro libera amoniaco y se nota su olor.',
    ],
    noteLabel: 'Dato',
    note: 'Muy pocos metales reaccionan con el nitrógeno. El litio es otro, y lo hace incluso a temperatura ambiente.',
  },
  noReaction('n2', 'i2', {
    why: [N2_INERT, 'El triyoduro de nitrógeno existe, pero se hace con amoniaco y es tan inestable que explota con el roce de una pluma.'],
  }),
  noReaction('n2', 'br2', {
    why: [N2_INERT, 'Por eso el nitrógeno se usa como gas de relleno para guardar o mover sustancias reactivas sin que pase nada.'],
  }),
  noReaction('n2', 'h2o2', {
    saw: ['El gas burbujea en el agua oxigenada sin cambiarla.'],
    why: [N2_INERT],
  }),
  noReaction('n2', 'kmno4', {
    why: [N2_INERT, 'Ni siquiera un oxidante tan fuerte como el permanganato puede con él: el nitrógeno del N₂ no cede sus electrones.'],
  }),
  noReaction('n2', 'hcl', {
    why: [N2_INERT, 'Con un ácido tampoco reacciona, porque el N₂ no es una base. El amoniaco (NH₃) sí lo es: con el HCl forma un humo blanco de cloruro de amonio.'],
  }),
  noReaction('n2', 'naoh', {
    why: [N2_INERT, 'Tampoco es ácido, así que la base no tiene nada que neutralizar.'],
  }),
  noReaction('n2', 'h2so4', {
    why: [N2_INERT, 'Tampoco es una base, así que el ácido no tiene con qué reaccionar.'],
  }),
  noReaction('n2', 'caco3', {
    why: [N2_INERT, 'Por eso las bolsas de papas vienen "infladas" con nitrógeno: como no reacciona con nada, mantiene la comida fresca.'],
  }),
  noReaction('n2', 'agno3', {
    why: [
      N2_INERT,
      'El nitrato de plata tiene nitrógeno, pero dentro del ion nitrato (NO₃⁻) y con número de oxidación +5. El N₂ libre no se une a él.',
    ],
  }),
  noReaction('n2', 'nacl', {
    why: [N2_INERT, 'Y los iones de la sal (Na⁺ y Cl⁻) también son muy estables.'],
  }),

  // Fósforo
  {
    ids: ['p', 's'],
    title: 'Fósforo + azufre → sulfuro de fósforo',
    equation: '4 P + 3 S → P₄S₃',
    otherEquations: ['4 P + 10 S → P₄S₁₀'],
    effect: 'sparkle',
    resultColor: '#facc15',
    resultLine: 'Se formó sulfuro de fósforo.',
    mixingMs: 1800,
    whatYouSaw: [
      'Al calentar fósforo rojo con azufre, la mezcla reacciona con fuerza y suelta calor.',
      'Se forma un sólido amarillo: trisulfuro de tetrafósforo (P₄S₃).',
    ],
    why: [
      'El azufre es un poco más electronegativo que el fósforo y lo oxida. En el P₄S₃ los átomos forman una jaula: 4 fósforos y 3 azufres unidos por enlaces covalentes.',
      'Según las cantidades se forman otros sulfuros de fósforo, como el P₄S₁₀.',
    ],
    noteLabel: 'Dato',
    note: 'El P₄S₃ está en la cabeza de los cerillos que se encienden frotándolos contra cualquier superficie.',
  },
  noReaction('p', 'cu', {
    why: [
      'A temperatura ambiente no reaccionan. Fundidos juntos forman fosfuro de cobre (Cu₃P).',
      'Un poco de fósforo mezclado con cobre y estaño da el bronce fosforado: un metal resistente y elástico que se usa en resortes y en cuerdas de guitarra.',
    ],
    conditions: ['3 Cu + P → Cu₃P (fundidos)'],
  }),
  noReaction('p', 'zn', {
    why: [
      'A temperatura ambiente no reaccionan. Calentados juntos sin aire forman fosfuro de zinc (Zn₃P₂).',
      'El fosfuro de zinc se usa como veneno para ratas: en el estómago, el ácido lo convierte en fosfina (PH₃), un gas muy tóxico.',
    ],
    conditions: ['3 Zn + 2 P → Zn₃P₂ (calentando sin aire)'],
  }),
  noReaction('p', 'al', {
    why: [
      'A temperatura ambiente no reaccionan; el aluminio está protegido por su capa de óxido.',
      'A temperaturas muy altas forman fosfuro de aluminio (AlP). Se usa para fumigar granos almacenados: con la humedad libera fosfina, que mata a las plagas.',
    ],
    conditions: ['Al + P → AlP (a temperaturas muy altas)'],
  }),
  noReaction('p', 'mg', {
    why: [
      'A temperatura ambiente no reaccionan.',
      'Calentados juntos sin aire forman fosfuro de magnesio (Mg₃P₂): 3 Mg²⁺ (+6) se combinan con 2 P³⁻ (−6), igual que en el nitruro de magnesio.',
    ],
    conditions: ['3 Mg + 2 P → Mg₃P₂ (calentando sin aire)'],
  }),
  {
    ids: ['p', 'i2'],
    title: 'Fósforo + yodo → triyoduro de fósforo',
    equation: '2 P + 3 I₂ → 2 PI₃',
    effect: 'colorchange',
    resultColor: '#991b1b',
    resultLine: 'Se formó triyoduro de fósforo.',
    mixingMs: 1600,
    whatYouSaw: [
      'El fósforo y el yodo reaccionan con facilidad, sin necesidad de mucho calor.',
      'El color negro violeta del yodo cambia y queda un sólido rojo oscuro: triyoduro de fósforo (PI₃).',
    ],
    why: [
      'El yodo oxida al fósforo hasta +3. Como el átomo de yodo es muy grande, solo caben 3 alrededor del fósforo: el PI₅ no es estable.',
      'Compáralo con el cloro, que sí forma PCl₅ (prueba P + Cl₂): el cloro es más pequeño y más oxidante.',
    ],
    noteLabel: 'Dato',
    note: 'En química orgánica se mezclan fósforo rojo y yodo para convertir alcoholes en yoduros de alquilo.',
  },
  {
    ids: ['p', 'br2'],
    title: 'Fósforo + bromo → bromuros de fósforo',
    equation: '2 P + 3 Br₂ → 2 PBr₃',
    otherEquations: ['2 P + 5 Br₂ → 2 PBr₅'],
    effect: 'whitesmoke',
    resultColor: '#fef3c7',
    resultLine: 'Se formó tribromuro de fósforo.',
    mixingMs: 1400,
    whatYouSaw: [
      'El fósforo reacciona con el bromo con mucha energía: hay destellos y calor.',
      'El color rojo del bromo desaparece y queda un líquido incoloro que humea: tribromuro de fósforo (PBr₃).',
    ],
    why: [
      'El bromo oxida al fósforo hasta +3. Si sobra bromo, también se forma PBr₅, un sólido amarillo.',
      'El PBr₃ humea al aire porque reacciona con la humedad y libera bromuro de hidrógeno (HBr).',
    ],
    noteLabel: 'Seguridad',
    note: 'El fósforo y el bromo juntos reaccionan con violencia, y el bromo es muy tóxico y quema la piel.',
  },
  noReaction('p', 'h2o2', {
    why: [
      'A temperatura ambiente, el fósforo rojo y el agua oxigenada diluida reaccionan tan despacio que no se nota.',
      'El fósforo blanco se oxida con mucha más facilidad, pero para él basta el oxígeno del aire: arde solo.',
    ],
    noteLabel: 'Seguridad',
    note: 'Con peróxido concentrado, el fósforo puede reaccionar con violencia.',
  }),
  {
    ids: ['p', 'kmno4'],
    title: 'Fósforo + permanganato de potasio',
    equation: '3 P + 5 KMnO₄ + 2 H₂O → 5 MnO₂ + 2 K₂HPO₄ + KH₂PO₄',
    effect: 'colorchange',
    resultColor: '#78350f',
    resultLine: 'El morado se volvió café.',
    mixingMs: 2500,
    whatYouSaw: [
      'El morado se va aclarando poco a poco y aparece un sólido café: dióxido de manganeso (MnO₂).',
      'El fósforo se va consumiendo.',
    ],
    why: [
      'El permanganato oxida al fósforo hasta su número de oxidación más alto (+5) y forma fosfatos. El manganeso se reduce de +7 a +4.',
      'Cada fósforo cede 5 electrones y cada manganeso recibe 3. Para que salgan iguales se necesitan 3 P por cada 5 KMnO₄: 15 electrones en total.',
    ],
    noteLabel: 'Seguridad',
    note: 'Mezclados en seco, el fósforo y los oxidantes fuertes como el permanganato pueden estallar con un simple roce.',
  },
  noReaction('p', 'hcl', {
    why: ['El fósforo es un no metal: no puede cederle electrones a los H⁺ del ácido para formar hidrógeno. Por eso no hay burbujas ni cambio de color.'],
  }),
  {
    ids: ['p', 'naoh'],
    title: 'Fósforo + hidróxido de sodio → fosfina',
    equation: 'P₄ + 3 NaOH + 3 H₂O → PH₃ + 3 NaH₂PO₂',
    effect: 'whitesmoke',
    resultColor: '#f8fafc',
    resultLine: 'Salió fosfina, que se enciende sola.',
    mixingMs: 2000,
    whatYouSaw: [
      'Con fósforo blanco y la solución caliente, empiezan a salir burbujas.',
      'Al llegar al aire, las burbujas se encienden solas y forman anillos de humo blanco.',
    ],
    why: [
      'Es una dismutación: parte del fósforo se reduce a fosfina (PH₃, fósforo −3) y parte se oxida a hipofosfito (H₂PO₂⁻, fósforo +1).',
      'El fósforo blanco está formado por moléculas de 4 átomos (P₄); por eso la ecuación usa P₄.',
      'La fosfina suele llevar un poco de difosfina (P₂H₄), que se enciende sola en el aire. El humo blanco es óxido de fósforo.',
    ],
    noteLabel: 'Seguridad',
    note: 'La fosfina es extremadamente tóxica. Esta reacción solo se hace en laboratorio y en campana de extracción.',
  },
  {
    ids: ['p', 'h2so4'],
    title: 'Fósforo + ácido sulfúrico',
    equation: '2 P + 5 H₂SO₄ → 2 H₃PO₄ + 5 SO₂ + 2 H₂O',
    effect: 'whitesmoke',
    resultColor: '#fef9c3',
    resultLine: 'Salió un gas picante.',
    mixingMs: 2000,
    whatYouSaw: [
      'Con el ácido concentrado y caliente, el fósforo se disuelve poco a poco.',
      'Se desprende dióxido de azufre (SO₂), un gas incoloro de olor picante.',
    ],
    why: [
      'El ácido sulfúrico concentrado es oxidante: lleva al fósforo hasta +5 (ácido fosfórico) y su azufre baja de +6 a +4.',
      'Cada fósforo cede 5 electrones y cada azufre recibe 2: por eso hay 2 P por cada 5 H₂SO₄.',
    ],
    noteLabel: 'Seguridad',
    note: 'Se liberan gases tóxicos y el ácido caliente provoca quemaduras graves.',
  },
  noReaction('p', 'caco3', {
    why: [
      'El carbonato de calcio no es oxidante ni ácido: el fósforo no tiene con qué reaccionar.',
      'Curiosamente, los dos aparecen juntos en la naturaleza: los huesos y la roca fosfórica son fosfato de calcio, y las conchas y la caliza son carbonato de calcio.',
    ],
  }),
  {
    ids: ['p', 'agno3'],
    title: 'Fósforo + nitrato de plata',
    equation: 'P₄ + 20 AgNO₃ + 16 H₂O → 20 Ag + 4 H₃PO₄ + 20 HNO₃',
    effect: 'darkening',
    resultColor: '#44403c',
    resultLine: 'El fósforo se cubrió de plata negra.',
    mixingMs: 2000,
    whatYouSaw: [
      'El fósforo blanco se cubre de un depósito negro.',
      'Es plata metálica en partículas muy finas: así de pequeña, la plata se ve negra en lugar de brillante.',
    ],
    why: [
      'El fósforo blanco es un reductor fuerte: le cede electrones a los iones Ag⁺ y los convierte en plata metálica.',
      'El fósforo se oxida hasta +5 y forma ácido fosfórico. Cada átomo de fósforo reduce a 5 iones de plata.',
    ],
  },
  noReaction('p', 'nacl', {
    why: ['La sal es muy estable y el fósforo no puede quitarle ni darle electrones a sus iones.'],
  }),

  // Azufre
  {
    ids: ['s', 'cu'],
    title: 'Azufre + cobre → sulfuro de cobre',
    equation: '2 Cu + S → Cu₂S',
    effect: 'darkening',
    resultColor: '#111827',
    resultLine: 'El cobre se volvió negro.',
    mixingMs: 2000,
    whatYouSaw: [
      'Al calentar cobre con azufre, el cobre se pone incandescente en el vapor de azufre.',
      'El cobre rojizo se convierte en un sólido negro y quebradizo: sulfuro de cobre(I) (Cu₂S).',
    ],
    why: [
      'El azufre oxida al cobre (Cu → Cu⁺) y se reduce (S → S²⁻). Dos Cu⁺ (+2) compensan un S²⁻ (−2), por eso la fórmula es Cu₂S.',
      'Muchos metales se encuentran en la naturaleza como sulfuros. El Cu₂S es la calcocita, uno de los minerales de los que se saca el cobre.',
    ],
    noteLabel: 'Dato',
    note: 'La plata se ennegrece por lo mismo: el azufre del aire y de algunos alimentos, como el huevo, forma sulfuro de plata en su superficie.',
  },
  {
    ids: ['s', 'zn'],
    title: 'Azufre + zinc → sulfuro de zinc',
    equation: 'Zn + S → ZnS',
    effect: 'explosion',
    resultColor: '#fefce8',
    resultLine: '¡Reacción explosiva con llama verdosa!',
    mixingMs: 1200,
    whatYouSaw: [
      'Al encender la mezcla de polvos, reacciona de golpe con un destello, una llama verdosa y una nube de humo.',
      'Queda un polvo blanco amarillento: sulfuro de zinc (ZnS).',
    ],
    why: [
      'El zinc cede dos electrones (Zn → Zn²⁺) y el azufre los recibe (S → S²⁻). Es muy exotérmica: libera unos 206 kJ por mol.',
      'Como los dos están en polvo y bien mezclados, toda la reacción ocurre en un instante. Por eso parece una explosión.',
    ],
    noteLabel: 'Dato',
    note: 'Algunos aficionados usan esta mezcla como combustible de cohetes. Y el ZnS, con un poco de cobre, brilla en la oscuridad: se usó en relojes y en pantallas de televisión antiguas.',
  },
  {
    ids: ['s', 'al'],
    title: 'Azufre + aluminio → sulfuro de aluminio',
    equation: '2 Al + 3 S → Al₂S₃',
    effect: 'sparkle',
    resultColor: '#d6d3d1',
    resultLine: 'Se formó sulfuro de aluminio.',
    mixingMs: 2000,
    whatYouSaw: [
      'Hay que calentar mucho la mezcla para encenderla, porque el aluminio está protegido por su capa de óxido.',
      'Una vez que empieza, reacciona con mucha luz y calor. Queda un sólido gris: sulfuro de aluminio (Al₂S₃).',
    ],
    why: [
      'El aluminio cede tres electrones (Al → Al³⁺) y cada azufre recibe dos (S → S²⁻). Para que las cargas cuadren: 2 Al³⁺ (+6) y 3 S²⁻ (−6).',
      'El Al₂S₃ no dura en el aire: con la humedad se descompone y libera H₂S, el gas con olor a huevo podrido.',
    ],
    noteLabel: 'Seguridad',
    note: 'Al reaccionar con la humedad, el sulfuro de aluminio libera sulfuro de hidrógeno, que es tóxico.',
  },
  {
    ids: ['s', 'mg'],
    title: 'Azufre + magnesio → sulfuro de magnesio',
    equation: 'Mg + S → MgS',
    effect: 'sparkle',
    resultColor: '#f5f5f4',
    resultLine: 'Se formó sulfuro de magnesio.',
    mixingMs: 1600,
    whatYouSaw: [
      'Al calentar la mezcla, se enciende y arde con una luz blanca intensa.',
      'Queda un sólido blanquecino: sulfuro de magnesio (MgS).',
    ],
    why: [
      'El magnesio cede dos electrones y el azufre los recibe: Mg²⁺ y S²⁻ en proporción 1 a 1.',
      'Se parece a la combustión del magnesio en oxígeno: el azufre está en el mismo grupo que el oxígeno y se comporta de forma parecida, aunque es un oxidante más débil.',
    ],
  },
  noReaction('s', 'i2', {
    saw: ['Los cristales amarillos y negros quedan revueltos sin cambiar.'],
    why: [
      'El yodo y el azufre atraen los electrones casi con la misma fuerza: ninguno puede oxidar al otro, así que no forman un compuesto estable.',
      'Fundidos juntos solo se disuelven uno en el otro, como el azúcar en agua: es una mezcla, no un compuesto nuevo.',
    ],
  }),
  {
    ids: ['s', 'br2'],
    title: 'Azufre + bromo → bromuro de azufre',
    equation: '2 S + Br₂ → S₂Br₂',
    effect: 'colorchange',
    resultColor: '#c2410c',
    resultLine: 'Se formó un líquido rojo anaranjado.',
    mixingMs: 1800,
    whatYouSaw: [
      'El azufre se disuelve en el bromo líquido y, al calentar, reaccionan.',
      'Se forma un líquido rojo anaranjado: monobromuro de azufre (S₂Br₂).',
    ],
    why: [
      'El bromo es más electronegativo que el azufre y lo oxida, igual que el cloro. La molécula es Br–S–S–Br.',
      'A diferencia del cloro, el bromo no forma un dibromuro estable (SBr₂): es menos oxidante y se queda en S₂Br₂.',
    ],
  },
  noReaction('s', 'h2o2', {
    saw: ['El polvo amarillo flota sobre la solución sin cambiar.'],
    why: [
      'A temperatura ambiente el azufre casi no se oxida con el agua oxigenada.',
      'Además, el azufre repele el agua: no se moja ni se disuelve, así que casi no hay contacto entre los dos.',
    ],
  }),
  noReaction('s', 'kmno4', {
    why: [
      'En solución neutra y fría, el azufre apenas reacciona con el permanganato: no se disuelve en agua y casi no hay contacto entre ellos.',
      'El morado se mantiene.',
    ],
  }),
  noReaction('s', 'hcl', {
    why: ['El azufre es un no metal: no le cede electrones a los H⁺ y no forma hidrógeno. Tampoco es una base que el ácido pueda neutralizar.'],
  }),
  {
    ids: ['s', 'naoh'],
    title: 'Azufre + hidróxido de sodio',
    equation: '3 S + 6 NaOH → 2 Na₂S + Na₂SO₃ + 3 H₂O',
    effect: 'colorchange',
    resultColor: '#fbbf24',
    resultLine: 'El azufre se disolvió.',
    mixingMs: 2000,
    whatYouSaw: [
      'Hirviendo la solución, el polvo amarillo se va disolviendo.',
      'La solución se pone amarilla anaranjada.',
    ],
    why: [
      'Es una dismutación: parte del azufre se reduce a sulfuro (S²⁻) y parte se oxida a sulfito (SO₃²⁻, azufre +4).',
      'El sulfuro que se forma disuelve más azufre y forma polisulfuros, que son los que dan el color amarillo anaranjado.',
    ],
  },
  {
    ids: ['s', 'h2so4'],
    title: 'Azufre + ácido sulfúrico → dióxido de azufre',
    equation: 'S + 2 H₂SO₄ → 3 SO₂ + 2 H₂O',
    effect: 'whitesmoke',
    resultColor: '#fef9c3',
    resultLine: 'Salió dióxido de azufre.',
    mixingMs: 2000,
    whatYouSaw: [
      'Con el ácido concentrado y caliente, el azufre se va disolviendo.',
      'Se desprende un gas picante, como de cerillo recién encendido: dióxido de azufre (SO₂).',
    ],
    why: [
      'Es una comproporción: el azufre del elemento (0) sube a +4 y el azufre del ácido (+6) baja a +4. Los dos terminan en el mismo SO₂.',
      'Por eso todo el azufre de los productos está en una sola sustancia: 3 moléculas de SO₂.',
    ],
    noteLabel: 'Seguridad',
    note: 'El SO₂ es tóxico e irrita los pulmones, y el ácido caliente provoca quemaduras graves.',
  },
  noReaction('s', 'caco3', {
    why: [
      'El azufre no es ácido ni un oxidante fuerte, y el carbonato de calcio es muy estable.',
      'En el campo se usan los dos, pero para cosas opuestas: la caliza le quita acidez al suelo y el azufre, poco a poco y gracias a las bacterias, se la aumenta.',
    ],
  }),
  noReaction('s', 'agno3', {
    why: [
      'El azufre sólido no se disuelve en agua y casi no toca a los iones de plata, así que no se nota ningún cambio.',
      'La plata sí reacciona con compuestos de azufre como el H₂S, y forma sulfuro de plata negro.',
    ],
  }),
  noReaction('s', 'nacl', {
    why: [
      'La sal es muy estable y el azufre no puede quitarle ni darle electrones.',
      'Es solo una mezcla de dos polvos. Se separa con agua: la sal se disuelve y el azufre flota.',
    ],
  }),

  // Cobre
  noReaction('cu', 'zn', {
    why: [
      METALS,
      'Fundidos juntos, el cobre y el zinc forman latón, la aleación dorada de las llaves y de los instrumentos de viento. Pero es una aleación: una mezcla de metales, no un compuesto.',
    ],
  }),
  noReaction('cu', 'al', {
    why: [METALS, 'Cobre con un poco de aluminio forma el bronce de aluminio, dorado y muy resistente a la corrosión, que se usa en hélices de barcos.'],
  }),
  noReaction('cu', 'mg', {
    why: [METALS, 'Pero si se juntan en agua salada forman una pila: el magnesio, más reactivo, se corroe y el cobre queda intacto.'],
  }),
  {
    ids: ['cu', 'i2'],
    title: 'Cobre + yodo → yoduro de cobre(I)',
    equation: '2 Cu + I₂ → 2 CuI',
    effect: 'colorchange',
    resultColor: '#e7e5e4',
    resultLine: 'Se formó yoduro de cobre(I).',
    mixingMs: 2000,
    whatYouSaw: [
      'Al calentar el cobre con yodo, el vapor morado se consume.',
      'La superficie del cobre se cubre de un sólido blanquecino: yoduro de cobre(I) (CuI).',
    ],
    why: [
      'Esperarías CuI₂, como con el cloro (CuCl₂). Pero el Cu²⁺ es lo bastante oxidante para quitarle un electrón al yoduro, así que el CuI₂ se descompone solo en CuI y yodo.',
      'Por eso el yodo solo lleva al cobre hasta Cu⁺.',
    ],
    noteLabel: 'Dato',
    note: 'El yoduro de cobre(I) se agrega a la sal de mesa en algunos países, y a la comida para animales, como fuente de yodo.',
  },
  {
    ids: ['cu', 'br2'],
    title: 'Cobre + bromo → bromuro de cobre(II)',
    equation: 'Cu + Br₂ → CuBr₂',
    effect: 'darkening',
    resultColor: '#111827',
    resultLine: 'El cobre se cubrió de bromuro negro.',
    mixingMs: 1800,
    whatYouSaw: [
      'El cobre reacciona con el bromo, sobre todo si se calienta.',
      'El rojo del bromo se va y el cobre queda cubierto de un sólido casi negro: bromuro de cobre(II) (CuBr₂).',
    ],
    why: [
      'El bromo oxida al cobre hasta Cu²⁺. Tiene fuerza suficiente para eso, a diferencia del yodo, que solo llega a Cu⁺.',
      'Disuelto en agua, el CuBr₂ da una solución verde azulada por los iones Cu²⁺.',
    ],
  },
  noReaction('cu', 'h2o2', {
    why: [
      'El cobre es un metal noble y el agua oxigenada sola, sin ácido, apenas lo ataca. Con el tiempo el cobre solo se oscurece un poco.',
      'Con ácido sí reacciona: así se graban los circuitos de cobre de las tarjetas electrónicas (Cu + H₂O₂ + 2 HCl → CuCl₂ + 2 H₂O).',
    ],
  }),
  noReaction('cu', 'kmno4', {
    why: [
      'En solución neutra el permanganato ataca al cobre tan despacio que, en el tiempo del experimento, no se nota ningún cambio.',
      'Con ácido la reacción sí avanza: el cobre se disuelve como Cu²⁺ (azul) y el morado desaparece.',
    ],
  }),
  noReaction('cu', 'hcl', {
    why: [
      'El cobre está por debajo del hidrógeno en la serie de reactividad: es menos reactivo, así que no puede cederle electrones a los H⁺ para formar H₂.',
      'Por eso las tuberías y las monedas de cobre resisten a muchos ácidos. Compáralo con el zinc, que en el mismo ácido burbujea (prueba Zn + HCl).',
    ],
    note: 'Si el ácido tiene oxígeno disuelto, sí ataca al cobre muy lentamente: el que oxida al cobre es el oxígeno, no el ácido.',
  }),
  noReaction('cu', 'naoh', {
    why: ['El cobre es poco reactivo y no es anfótero: no reacciona con las bases.'],
  }),
  {
    ids: ['cu', 'h2so4'],
    title: 'Cobre + ácido sulfúrico → sulfato de cobre',
    equation: 'Cu + 2 H₂SO₄ → CuSO₄ + SO₂ + 2 H₂O',
    effect: 'colorchange',
    resultColor: '#38bdf8',
    resultLine: 'La solución se volvió azul.',
    mixingMs: 2000,
    whatYouSaw: [
      'Con el ácido diluido no pasa nada. Con el ácido concentrado y caliente, el cobre se disuelve.',
      'Se desprende un gas picante (SO₂) y, al diluir con agua, la solución se vuelve azul por el sulfato de cobre.',
    ],
    why: [
      'El cobre no puede desplazar al hidrógeno, pero el ácido concentrado y caliente es oxidante: su azufre (+6) le quita electrones al cobre y baja a +4 (SO₂).',
      'Por eso no sale hidrógeno sino dióxido de azufre. Una molécula de ácido oxida al cobre y la otra le aporta el ion sulfato.',
      'El azul es el color de los iones Cu²⁺ rodeados de agua.',
    ],
    noteLabel: 'Seguridad',
    note: 'El ácido sulfúrico concentrado y caliente es muy peligroso, y el SO₂ es tóxico. Al diluir, siempre se echa el ácido sobre el agua, nunca al revés.',
  },
  noReaction('cu', 'caco3', {
    why: ['El carbonato de calcio no puede oxidar al cobre, y el cobre no puede desplazar al calcio, que es mucho más reactivo.'],
  }),
  {
    ids: ['cu', 'agno3'],
    title: 'Cobre + nitrato de plata → árbol de plata',
    equation: 'Cu + 2 AgNO₃ → Cu(NO₃)₂ + 2 Ag',
    effect: 'colorchange',
    resultColor: '#7dd3fc',
    resultLine: '¡Crecieron cristales de plata y la solución se volvió azul!',
    mixingMs: 2500,
    whatYouSaw: [
      'Sobre el cobre empiezan a crecer cristales grises y brillantes, como ramitas: es plata.',
      'Poco a poco la solución incolora se vuelve azul.',
    ],
    why: [
      'El cobre es más reactivo que la plata, así que le cede electrones a los iones Ag⁺: Cu → Cu²⁺ y Ag⁺ → Ag.',
      'Cada átomo de cobre cede 2 electrones, por eso reduce a 2 iones de plata.',
      'El cobre que se disuelve como Cu²⁺ es el que pinta la solución de azul.',
    ],
    noteLabel: 'Dato',
    note: 'A este experimento se le llama "árbol de plata". Es una forma clásica de ver la serie de reactividad de los metales.',
  },
  noReaction('cu', 'nacl', {
    why: [
      'El cobre es menos reactivo que el sodio y no puede desplazarlo de la sal.',
      'Con el tiempo, el agua salada y el aire sí forman en el cobre una capa verde, como en las estatuas que están cerca del mar.',
    ],
  }),

  // Zinc
  noReaction('zn', 'al', {
    why: [METALS, 'Fundido con un poco de aluminio, el zinc forma el zamak, una aleación con la que se hacen manijas, cierres y juguetes de metal.'],
  }),
  noReaction('zn', 'mg', {
    why: [METALS, 'Los dos se usan como metales de sacrificio: protegen al acero de la corrosión porque se oxidan antes que él.'],
  }),
  {
    ids: ['zn', 'i2'],
    title: 'Zinc + yodo → yoduro de zinc',
    equation: 'Zn + I₂ → ZnI₂',
    effect: 'whitesmoke',
    resultColor: '#f8fafc',
    smokeColor: '#a855f7',
    resultLine: '¡Unas gotas de agua desataron la reacción!',
    mixingMs: 1800,
    whatYouSaw: [
      'Mezclados en seco casi no pasa nada. Con unas gotas de agua, la mezcla se calienta y suelta vapor morado de yodo.',
      'El color oscuro desaparece y queda yoduro de zinc (ZnI₂), un sólido blanco que se disuelve en el agua.',
    ],
    why: [
      'El zinc se oxida (Zn → Zn²⁺) y el yodo se reduce (I → I⁻).',
      'El agua actúa como catalizador: disuelve un poco de yodo y deja que los iones se muevan, y así la reacción arranca. El calor que libera evapora parte del yodo; de ahí el humo morado.',
    ],
    noteLabel: 'Dato',
    note: 'Si se hace pasar corriente por la solución de yoduro de zinc, la reacción se invierte y se vuelven a formar zinc y yodo.',
  },
  {
    ids: ['zn', 'br2'],
    title: 'Zinc + bromo → bromuro de zinc',
    equation: 'Zn + Br₂ → ZnBr₂',
    effect: 'colorchange',
    resultColor: '#f8fafc',
    resultLine: 'Se formó bromuro de zinc.',
    mixingMs: 1600,
    whatYouSaw: [
      'El zinc reacciona con el bromo y la mezcla se calienta.',
      'El color rojo café desaparece y queda bromuro de zinc (ZnBr₂), un sólido blanco.',
    ],
    why: [
      'El zinc cede dos electrones y cada átomo de bromo recibe uno (Br → Br⁻).',
      'Esta reacción, en solución y hacia los dos sentidos, es la base de las baterías de flujo de zinc-bromo, que guardan la energía de los paneles solares.',
    ],
  },
  {
    ids: ['zn', 'h2o2'],
    title: 'Zinc + peróxido de hidrógeno',
    equation: 'Zn + H₂O₂ → Zn(OH)₂',
    effect: 'precipitation',
    resultColor: '#f1f5f9',
    resultLine: 'El zinc se cubrió de una capa blanca.',
    mixingMs: 2500,
    whatYouSaw: [
      'La reacción es lenta: el zinc pierde su brillo y se cubre de una capa blanca.',
      'A veces se ven algunas burbujas de oxígeno.',
    ],
    why: [
      'El peróxido oxida al zinc (Zn → Zn²⁺) y su oxígeno se reduce de −1 a −2. Se forma hidróxido de zinc, blanco e insoluble.',
      'Esa capa blanca frena la reacción, porque cubre el metal.',
    ],
  },
  {
    ids: ['zn', 'kmno4'],
    title: 'Zinc + permanganato de potasio',
    equation: '3 Zn + 2 KMnO₄ + 4 H₂O → 3 Zn(OH)₂ + 2 MnO₂ + 2 KOH',
    effect: 'colorchange',
    resultColor: '#78350f',
    resultLine: 'El morado se volvió café.',
    mixingMs: 2500,
    whatYouSaw: [
      'El morado se va aclarando lentamente.',
      'Sobre el zinc y en el fondo aparece un sólido café: dióxido de manganeso (MnO₂).',
    ],
    why: [
      'El zinc es un buen reductor: le cede electrones al permanganato. El manganeso baja de +7 a +4 (MnO₂, café).',
      'Cada zinc cede 2 electrones y cada manganeso recibe 3. El mínimo común es 6: 3 Zn por cada 2 KMnO₄.',
    ],
  },
  {
    ids: ['zn', 'naoh'],
    title: 'Zinc + hidróxido de sodio',
    equation: 'Zn + 2 NaOH + 2 H₂O → Na₂[Zn(OH)₄] + H₂',
    effect: 'effervescence',
    resultColor: '#f3f4f6',
    resultLine: 'El zinc burbujea incluso en una base.',
    mixingMs: 2000,
    whatYouSaw: [
      'Con la solución caliente, el zinc se cubre de burbujas: es hidrógeno.',
      'El zinc se va disolviendo y la solución queda incolora.',
    ],
    why: [
      'El zinc es anfótero: reacciona con ácidos y también con bases fuertes.',
      'En la base queda como ion cincato, [Zn(OH)₄]²⁻, que es soluble. El agua es la que aporta los hidrógenos que se convierten en H₂.',
      'La mayoría de los metales, como el hierro o el cobre, no hacen esto.',
    ],
  },
  {
    ids: ['zn', 'h2so4'],
    title: 'Zinc + ácido sulfúrico',
    equation: 'Zn + H₂SO₄ → ZnSO₄ + H₂',
    effect: 'effervescence',
    resultColor: '#f0f9ff',
    resultLine: 'Se libera gas de hidrógeno.',
    mixingMs: 1400,
    whatYouSaw: [
      'Con el ácido diluido, el zinc se cubre de burbujas de hidrógeno.',
      'El zinc se disuelve y la solución queda incolora.',
    ],
    why: [
      'El zinc es más reactivo que el hidrógeno y le cede electrones a los H⁺: Zn → Zn²⁺ y 2 H⁺ → H₂.',
      'Es la misma reacción que con el ácido clorhídrico; solo cambia la sal que queda disuelta: sulfato de zinc en lugar de cloruro.',
    ],
    noteLabel: 'Dato',
    note: 'Con el ácido concentrado y caliente, el zinc forma también SO₂ o incluso H₂S, porque el ácido actúa como oxidante.',
  },
  noReaction('zn', 'caco3', {
    why: ['El carbonato de calcio no es ácido ni oxidante, y el calcio es más reactivo que el zinc. No hay reacción.'],
  }),
  {
    ids: ['zn', 'agno3'],
    title: 'Zinc + nitrato de plata',
    equation: 'Zn + 2 AgNO₃ → Zn(NO₃)₂ + 2 Ag',
    effect: 'darkening',
    resultColor: '#f1f5f9',
    resultLine: 'El zinc se cubrió de plata.',
    mixingMs: 2000,
    whatYouSaw: [
      'El zinc se cubre rápido de un depósito gris oscuro y esponjoso: es plata.',
      'La solución sigue incolora, porque los iones de zinc no tienen color.',
    ],
    why: [
      'El zinc es mucho más reactivo que la plata y la desplaza de su sal: Zn → Zn²⁺ y 2 Ag⁺ → 2 Ag.',
      'Compáralo con el cobre, que hace lo mismo pero deja la solución azul (prueba Cu + AgNO₃). El color depende del ion metálico que queda disuelto.',
    ],
  },
  noReaction('zn', 'nacl', {
    why: [
      'El zinc es menos reactivo que el sodio y no puede desplazarlo de la sal.',
      'Eso sí, el agua salada hace que el zinc se corroa más rápido con el aire, como pasa con casi todos los metales.',
    ],
  }),

  // Aluminio
  noReaction('al', 'mg', {
    why: [METALS, 'Fundidos juntos forman el magnalio, una aleación ligera. En polvo, el magnalio se usa en los fuegos artificiales para dar chispas brillantes.'],
  }),
  {
    ids: ['al', 'i2'],
    title: 'Aluminio + yodo → yoduro de aluminio',
    equation: '2 Al + 3 I₂ → 2 AlI₃',
    effect: 'whitesmoke',
    resultColor: '#f5f5f4',
    smokeColor: '#a855f7',
    resultLine: '¡Una gota de agua y sale humo morado!',
    mixingMs: 2000,
    whatYouSaw: [
      'Mezclados en seco no pasa nada. Al añadir una gota de agua, después de unos segundos la mezcla empieza a humear.',
      'Sale una nube espesa de vapor morado de yodo, y a veces aparecen llamas.',
      'Queda un sólido blanco amarillento: yoduro de aluminio (AlI₃).',
    ],
    why: [
      'El aluminio cede tres electrones (Al → Al³⁺) y el yodo los recibe. Se necesitan 3 I₂ (6 átomos de yodo) por cada 2 Al.',
      'El agua es el catalizador: ataca la capa de óxido del aluminio y deja que los reactivos se toquen. La reacción libera tanto calor que el yodo sobrante se evapora como humo morado.',
    ],
    noteLabel: 'Seguridad',
    note: 'El vapor de yodo irrita los ojos y los pulmones. Esta demostración solo se hace en campana de extracción.',
  },
  {
    ids: ['al', 'br2'],
    title: 'Aluminio + bromo → bromuro de aluminio',
    equation: '2 Al + 3 Br₂ → 2 AlBr₃',
    effect: 'sparkle',
    resultColor: '#f5f5f4',
    resultLine: '¡El aluminio chispea en el bromo!',
    mixingMs: 1800,
    whatYouSaw: [
      'Al echar aluminio en bromo líquido, después de unos segundos reacciona con violencia: chispas, luz y humo rojizo.',
      'Queda un sólido blanco: bromuro de aluminio (AlBr₃).',
    ],
    why: [
      'Es la misma reacción que con el yodo, pero el bromo es más oxidante: no necesita agua para empezar.',
      'La pequeña espera se debe a que el bromo primero tiene que atravesar la capa de óxido del aluminio. Después la reacción libera tanto calor que se acelera sola.',
    ],
    noteLabel: 'Seguridad',
    note: 'Es una reacción violenta que salpica bromo, muy tóxico y corrosivo. Solo se hace como demostración, en campana y con protección.',
  },
  noReaction('al', 'h2o2', {
    why: [
      'El aluminio está cubierto por una capa invisible de óxido (Al₂O₃) que lo protege, y el agua oxigenada no logra atravesarla.',
      'Por eso el peróxido de hidrógeno concentrado se puede guardar en tanques de aluminio muy puro.',
    ],
  }),
  noReaction('al', 'kmno4', {
    why: ['La capa de óxido protege al aluminio y la reacción es tan lenta que no se nota: el morado sigue igual.'],
  }),
  {
    ids: ['al', 'hcl'],
    title: 'Aluminio + ácido clorhídrico',
    equation: '2 Al + 6 HCl → 2 AlCl₃ + 3 H₂',
    effect: 'effervescence',
    resultColor: '#f0f9ff',
    resultLine: 'Después de una espera, ¡muchas burbujas!',
    mixingMs: 2500,
    whatYouSaw: [
      'Al principio casi no pasa nada: el ácido primero tiene que disolver la capa de óxido del aluminio.',
      'Después de unos segundos la reacción arranca con fuerza: muchas burbujas de hidrógeno y la mezcla se calienta.',
    ],
    why: [
      'El aluminio cede 3 electrones (Al → Al³⁺) y cada par de H⁺ forma una molécula de H₂. Con 2 Al (6 electrones) se forman 3 H₂.',
      'Los iones cloruro ayudan a romper la capa de óxido. Una vez que el metal queda expuesto, la reacción libera calor y se acelera sola.',
    ],
  },
  {
    ids: ['al', 'naoh'],
    title: 'Aluminio + hidróxido de sodio',
    equation: '2 Al + 2 NaOH + 6 H₂O → 2 Na[Al(OH)₄] + 3 H₂',
    effect: 'effervescence',
    resultColor: '#f3f4f6',
    resultLine: 'El aluminio burbujea en la base.',
    mixingMs: 2000,
    whatYouSaw: [
      'El aluminio se cubre de burbujas de hidrógeno y la mezcla se calienta mucho.',
      'El metal se va disolviendo hasta desaparecer.',
    ],
    why: [
      'El aluminio es anfótero, como el zinc: reacciona con ácidos y también con bases fuertes.',
      'La base disuelve la capa de óxido protectora y luego el aluminio reacciona con el agua. Queda como ion aluminato, [Al(OH)₄]⁻, que es soluble.',
    ],
    noteLabel: 'Dato',
    note: 'Algunos destapacaños traen sosa y trocitos de aluminio: el calor y las burbujas ayudan a deshacer la grasa del caño.',
  },
  {
    ids: ['al', 'h2so4'],
    title: 'Aluminio + ácido sulfúrico',
    equation: '2 Al + 3 H₂SO₄ → Al₂(SO₄)₃ + 3 H₂',
    effect: 'effervescence',
    resultColor: '#f0f9ff',
    resultLine: 'Se libera hidrógeno lentamente.',
    mixingMs: 2500,
    whatYouSaw: [
      'Con el ácido diluido, el aluminio tarda en reaccionar y luego libera burbujas de hidrógeno.',
      'Con el ácido concentrado y frío casi no pasa nada: el aluminio se pasiva.',
    ],
    why: [
      'El aluminio desplaza al hidrógeno del ácido: 2 Al ceden 6 electrones y se forman 3 moléculas de H₂.',
      'Es más lenta que con el ácido clorhídrico: el ion sulfato no rompe la capa de óxido tan bien como el cloruro.',
    ],
  },
  noReaction('al', 'caco3', {
    why: ['El carbonato no es ácido ni oxidante, y el aluminio está protegido por su capa de óxido. No pasa nada.'],
  }),
  noReaction('al', 'agno3', {
    why: [
      'Aunque el aluminio es mucho más reactivo que la plata, su capa de óxido lo protege y la reacción casi no avanza.',
      'Si se lija el aluminio para quitarle esa capa, sí se cubre de plata.',
    ],
    conditions: ['Al + 3 AgNO₃ → Al(NO₃)₃ + 3 Ag (con el aluminio sin su capa de óxido)'],
  }),
  noReaction('al', 'nacl', {
    why: [
      'El aluminio no puede desplazar al sodio, que es más reactivo.',
      'Pero los iones cloruro sí atacan su capa de óxido en algunos puntos y, con el tiempo, forman pequeños agujeros. Por eso el aluminio se corroe más rápido en el agua de mar.',
    ],
  }),

  // Magnesio
  {
    ids: ['mg', 'i2'],
    title: 'Magnesio + yodo → yoduro de magnesio',
    equation: 'Mg + I₂ → MgI₂',
    effect: 'whitesmoke',
    resultColor: '#f5f5f4',
    smokeColor: '#a855f7',
    resultLine: 'Se formó yoduro de magnesio.',
    mixingMs: 1800,
    whatYouSaw: [
      'En seco reaccionan muy poco. Con una gota de agua, la mezcla se calienta y suelta vapor morado.',
      'Queda un sólido blanco: yoduro de magnesio (MgI₂).',
    ],
    why: [
      'El magnesio cede dos electrones (Mg → Mg²⁺) y la molécula de yodo los recibe.',
      'Como con el zinc y el aluminio, el agua actúa como catalizador y el calor de la reacción evapora parte del yodo.',
    ],
  },
  {
    ids: ['mg', 'br2'],
    title: 'Magnesio + bromo → bromuro de magnesio',
    equation: 'Mg + Br₂ → MgBr₂',
    effect: 'sparkle',
    resultColor: '#f5f5f4',
    resultLine: 'Se formó bromuro de magnesio.',
    mixingMs: 1600,
    whatYouSaw: [
      'El magnesio reacciona con el bromo liberando calor; con el metal en polvo la reacción es vigorosa.',
      'El color rojizo desaparece y queda un sólido blanco: bromuro de magnesio (MgBr₂).',
    ],
    why: [
      'El magnesio cede dos electrones y cada átomo de bromo recibe uno.',
      'El magnesio también reacciona con los bromuros orgánicos: así se preparan los reactivos de Grignard, una herramienta clásica para construir moléculas orgánicas.',
    ],
  },
  {
    ids: ['mg', 'h2o2'],
    title: 'Magnesio + peróxido de hidrógeno',
    equation: 'Mg + H₂O₂ → Mg(OH)₂',
    effect: 'precipitation',
    resultColor: '#f1f5f9',
    resultLine: 'Se formó hidróxido de magnesio.',
    mixingMs: 2000,
    whatYouSaw: [
      'El magnesio pierde su brillo y se cubre de un sólido blanco.',
      'Hay algunas burbujas y la mezcla se calienta un poco.',
    ],
    why: [
      'El peróxido oxida al magnesio (Mg → Mg²⁺) y su oxígeno pasa de −1 a −2. Se forma hidróxido de magnesio, blanco y poco soluble.',
      'El magnesio también reacciona despacio con el agua de la solución y libera algo de hidrógeno (Mg + 2 H₂O → Mg(OH)₂ + H₂).',
    ],
    noteLabel: 'Dato',
    note: 'El hidróxido de magnesio es la "leche de magnesia", un antiácido.',
  },
  {
    ids: ['mg', 'kmno4'],
    title: 'Magnesio + permanganato de potasio',
    equation: '3 Mg + 2 KMnO₄ + 4 H₂O → 3 Mg(OH)₂ + 2 MnO₂ + 2 KOH',
    effect: 'colorchange',
    resultColor: '#78350f',
    resultLine: 'El morado se volvió café.',
    mixingMs: 2500,
    whatYouSaw: [
      'El morado se va aclarando y aparece un sólido café: dióxido de manganeso.',
      'Sobre el magnesio también se forma una capa blanca de hidróxido.',
    ],
    why: [
      'El magnesio es un reductor muy fuerte y le cede electrones al permanganato: el manganeso baja de +7 a +4.',
      'Cada magnesio cede 2 electrones y cada manganeso recibe 3. El mínimo común es 6: 3 Mg por cada 2 KMnO₄.',
    ],
  },
  {
    ids: ['mg', 'hcl'],
    title: 'Magnesio + ácido clorhídrico',
    equation: 'Mg + 2 HCl → MgCl₂ + H₂',
    effect: 'effervescence',
    resultColor: '#f0f9ff',
    resultLine: '¡Burbujeo muy rápido!',
    mixingMs: 1200,
    whatYouSaw: [
      'El magnesio reacciona muy rápido: se llena de burbujas y se mueve por el líquido.',
      'La mezcla se calienta y el metal desaparece en poco tiempo.',
    ],
    why: [
      'El magnesio es más reactivo que el zinc y el hierro, así que le cede electrones a los H⁺ con más facilidad: Mg → Mg²⁺ y 2 H⁺ → H₂.',
      'Si comparas Mg, Zn y Fe en el mismo ácido, el magnesio burbujea más rápido y el hierro más lento. Eso muestra la serie de reactividad.',
    ],
  },
  noReaction('mg', 'naoh', {
    why: [
      'A diferencia del aluminio y el zinc, el magnesio no es anfótero: no se disuelve en las bases.',
      'Al contrario: el hidróxido de magnesio de su superficie es insoluble en medio básico y lo protege.',
    ],
  }),
  {
    ids: ['mg', 'h2so4'],
    title: 'Magnesio + ácido sulfúrico',
    equation: 'Mg + H₂SO₄ → MgSO₄ + H₂',
    effect: 'effervescence',
    resultColor: '#f0f9ff',
    resultLine: '¡Burbujeo muy rápido!',
    mixingMs: 1200,
    whatYouSaw: [
      'Con el ácido diluido, el magnesio burbujea con fuerza y se calienta.',
      'El metal se disuelve y queda sulfato de magnesio en la solución.',
    ],
    why: [
      'El magnesio desplaza al hidrógeno del ácido: Mg → Mg²⁺ y 2 H⁺ → H₂.',
      'El sulfato de magnesio que queda es la sal de Epsom, que se usa en baños para relajar los músculos.',
    ],
  },
  noReaction('mg', 'caco3', {
    why: [
      'El carbonato de calcio no es ácido, y el calcio es más reactivo que el magnesio, así que no hay desplazamiento.',
      'En la naturaleza el calcio y el magnesio se juntan en la dolomita, CaMg(CO₃)₂, un mineral muy parecido a la caliza.',
    ],
  }),
  {
    ids: ['mg', 'agno3'],
    title: 'Magnesio + nitrato de plata',
    equation: 'Mg + 2 AgNO₃ → Mg(NO₃)₂ + 2 Ag',
    effect: 'darkening',
    resultColor: '#f1f5f9',
    resultLine: 'El magnesio se cubrió de plata.',
    mixingMs: 1500,
    whatYouSaw: [
      'El magnesio se cubre rápido de un depósito oscuro: es plata.',
      'También salen algunas burbujas de hidrógeno, porque el magnesio reacciona un poco con el agua.',
    ],
    why: [
      'El magnesio es muchísimo más reactivo que la plata y la desplaza de su sal: Mg → Mg²⁺ y 2 Ag⁺ → 2 Ag.',
      'Entre más separados estén dos metales en la serie de reactividad, más rápido ocurre el desplazamiento.',
    ],
  },
  {
    ids: ['mg', 'nacl'],
    title: 'Magnesio + cloruro de sodio',
    equation: 'Mg + 2 H₂O → Mg(OH)₂ + H₂',
    effect: 'effervescence',
    resultColor: '#f1f5f9',
    resultLine: 'Burbujeo lento y algo de calor.',
    mixingMs: 2500,
    whatYouSaw: [
      'Sobre el magnesio aparecen, poco a poco, burbujas pequeñas de hidrógeno.',
      'La mezcla se calienta ligeramente.',
    ],
    why: [
      'La sal no reacciona con el magnesio: el magnesio no puede desplazar al sodio. Quien reacciona es el agua.',
      'En agua fría el magnesio reacciona muy despacio porque se cubre de hidróxido. Los iones de la sal rompen esa capa y la reacción sigue.',
    ],
    noteLabel: 'Dato',
    note: 'Los calentadores de las raciones militares funcionan así: magnesio, un poco de hierro y agua salada calientan la comida sin fuego.',
  },

  // Yodo
  {
    ids: ['i2', 'br2'],
    title: 'Yodo + bromo → bromuro de yodo',
    equation: 'I₂ + Br₂ → 2 IBr',
    effect: 'colorchange',
    resultColor: '#7f1d1d',
    resultLine: 'Se formó bromuro de yodo.',
    mixingMs: 1600,
    whatYouSaw: [
      'El yodo se disuelve en el bromo y los dos reaccionan.',
      'Se forma un sólido negro rojizo: monobromuro de yodo (IBr).',
    ],
    why: [
      'Es un interhalógeno, como el ICl. El bromo es más electronegativo, así que en el enlace I–Br el yodo queda con carga parcial positiva.',
      'Sus propiedades quedan entre las del bromo y las del yodo; por ejemplo, funde a unos 40 °C.',
    ],
  },
  noReaction('i2', 'h2o2', {
    why: [
      'Sin ácido y a temperatura ambiente, el yodo no es lo bastante oxidante para quitarle electrones al peróxido, y el peróxido no lo oxida más.',
      'Lo que sí pasa es con el yoduro (I⁻): en la famosa "pasta de dientes de elefante", el yoduro de potasio hace que el peróxido se descomponga de golpe en una montaña de espuma.',
    ],
  }),
  noReaction('i2', 'kmno4', {
    why: [OXIDIZERS, 'Los dos tiñen de morado, así que solo se suman los colores.'],
  }),
  noReaction('i2', 'hcl', {
    why: [
      'El yodo no puede oxidar al cloruro: el cloro es más electronegativo y retiene mejor su electrón.',
      'El yodo apenas se disuelve en el ácido y le da un tono café amarillento.',
    ],
  }),
  {
    ids: ['i2', 'naoh'],
    title: 'Yodo + hidróxido de sodio',
    equation: '3 I₂ + 6 NaOH → 5 NaI + NaIO₃ + 3 H₂O',
    effect: 'colorchange',
    resultColor: '#f8fafc',
    resultLine: 'El color del yodo desapareció.',
    mixingMs: 1800,
    whatYouSaw: [
      'Los cristales oscuros de yodo se disuelven en la base.',
      'El color café desaparece y la solución queda incolora.',
    ],
    why: [
      'Es una dismutación: de cada 6 átomos de yodo, 5 se reducen a yoduro (I⁻) y 1 se oxida a yodato (IO₃⁻, yodo +5).',
      'Es la misma idea que el cloro con NaOH, pero con yodo el hipoyodito que se forma primero (IO⁻) se transforma rápido en yodato.',
    ],
  },
  noReaction('i2', 'h2so4', {
    why: [
      'El yodo no reacciona con el ácido sulfúrico: los dos son oxidantes y ninguno cede electrones.',
      'Al revés sí pasa algo: el ácido sulfúrico concentrado oxida al yoduro (I⁻) y forma yodo violeta.',
    ],
  }),
  noReaction('i2', 'caco3', {
    why: [
      'El yodo no reacciona con el carbonato de calcio: el carbonato no es ácido ni reductor.',
      'Si se calienta la mezcla, el yodo se sublima y deja el polvo blanco tal como estaba. Así se pueden separar.',
    ],
  }),
  {
    ids: ['i2', 'agno3'],
    title: 'Yodo + nitrato de plata → yoduro de plata',
    equation: '3 I₂ + 5 AgNO₃ + 3 H₂O → 5 AgI↓ + HIO₃ + 5 HNO₃',
    effect: 'precipitation',
    resultColor: '#fef08a',
    resultLine: 'Se formó un precipitado amarillo.',
    mixingMs: 2000,
    whatYouSaw: [
      'Aparece un sólido amarillo pálido que se va al fondo: yoduro de plata (AgI).',
      'El color del yodo se va perdiendo.',
    ],
    why: [
      'El yodo reacciona un poco con el agua y forma yoduro (I⁻). Los iones plata atrapan ese yoduro como AgI, que es muy insoluble, y eso empuja la reacción hacia adelante.',
      'Para que los electrones cuadren, parte del yodo se oxida a yodato (IO₃⁻). Es una dismutación, como la del cloro con NaOH.',
    ],
    noteLabel: 'Dato',
    note: 'El yoduro de plata se usa para "sembrar" nubes y provocar lluvia: sus cristales se parecen a los del hielo y ayudan a que el agua se congele.',
  },
  noReaction('i2', 'nacl', {
    why: [
      'El yodo es menos reactivo que el cloro, así que no puede quitarle su lugar en la sal. Al revés sí funcionaría: el cloro desplaza al yodo de un yoduro.',
      'Esto muestra la reactividad de los halógenos: cloro > bromo > yodo.',
    ],
  }),

  // Bromo
  {
    ids: ['br2', 'h2o2'],
    title: 'Bromo + peróxido de hidrógeno',
    equation: 'Br₂ + H₂O₂ → 2 HBr + O₂',
    effect: 'effervescence',
    resultColor: '#fed7aa',
    resultLine: 'El bromo se aclaró y salieron burbujas.',
    mixingMs: 2000,
    whatYouSaw: ['El color rojo café del bromo se va aclarando.', 'Se forman burbujas de oxígeno.'],
    why: [
      'El bromo oxida al peróxido hasta oxígeno (O⁻¹ → O⁰) y se reduce a bromuro (Br⁰ → Br⁻).',
      'En medio ácido, el peróxido también puede volver a oxidar el bromuro a bromo. Por eso el bromo termina ayudando a descomponer el peróxido y el color no siempre desaparece del todo.',
    ],
  },
  noReaction('br2', 'kmno4', {
    why: [OXIDIZERS, 'Al revés sí funcionaría: el permanganato con ácido oxida a los bromuros (Br⁻) y libera bromo.'],
  }),
  noReaction('br2', 'hcl', {
    why: [
      'El bromo es menos reactivo que el cloro, así que no puede quitarle electrones al ion cloruro.',
      'El bromo solo se disuelve un poco y tiñe la solución de naranja.',
    ],
  }),
  {
    ids: ['br2', 'naoh'],
    title: 'Bromo + hidróxido de sodio',
    equation: 'Br₂ + 2 NaOH → NaBr + NaBrO + H₂O',
    otherEquations: ['3 Br₂ + 6 NaOH → 5 NaBr + NaBrO₃ + 3 H₂O (en caliente)'],
    effect: 'colorchange',
    resultColor: '#fefce8',
    resultLine: 'El color del bromo desapareció.',
    mixingMs: 1500,
    whatYouSaw: [
      'El bromo rojo café se disuelve en la base y su color desaparece.',
      'La solución queda casi incolora.',
    ],
    why: [
      'Como el cloro, el bromo se dismuta: un átomo se reduce a bromuro (Br⁻) y otro se oxida a hipobromito (BrO⁻).',
      'Si se calienta, el hipobromito se convierte en bromato (BrO₃⁻).',
    ],
  },
  noReaction('br2', 'h2so4', {
    why: [
      'Los dos son oxidantes y ninguno cede electrones, así que no reaccionan.',
      'El bromo es más denso, así que se queda en el fondo como una capa rojiza.',
    ],
  }),
  noReaction('br2', 'caco3', {
    why: [
      'Seco, el bromo no reacciona con el carbonato de calcio.',
      'En agua, el bromo forma un poco de ácido (Br₂ + H₂O ⇌ HBr + HBrO), que atacaría lentamente al carbonato.',
    ],
  }),
  {
    ids: ['br2', 'agno3'],
    title: 'Bromo + nitrato de plata → bromuro de plata',
    equation: 'Br₂ + H₂O + AgNO₃ → AgBr↓ + HBrO + HNO₃',
    effect: 'precipitation',
    resultColor: '#fef9c3',
    resultLine: 'Se formó un precipitado amarillo pálido.',
    mixingMs: 1500,
    whatYouSaw: ['Aparece un sólido amarillo pálido: bromuro de plata (AgBr).', 'El color del bromo se va perdiendo.'],
    why: [
      'El bromo reacciona con el agua y forma iones bromuro (Br⁻). La plata los atrapa como AgBr, que es insoluble.',
      'Los halogenuros de plata tienen colores distintos: AgCl blanco, AgBr amarillo pálido y AgI amarillo. Así se distinguen en el laboratorio.',
    ],
    noteLabel: 'Dato',
    note: 'El bromuro de plata es la sustancia sensible a la luz de las películas fotográficas en blanco y negro.',
  },
  noReaction('br2', 'nacl', {
    why: [
      'El bromo es menos reactivo que el cloro y no puede sacarlo de la sal.',
      'Al revés sí funciona: el cloro desplaza al bromo de los bromuros. Así se obtiene el bromo del agua de mar.',
    ],
  }),

  // Peróxido de hidrógeno
  noReaction('h2o2', 'hcl', {
    why: [
      'En soluciones diluidas no se nota ninguna reacción: solo se mezclan.',
      'Con ácido muy concentrado el peróxido puede oxidar lentamente al cloruro y liberar algo de cloro; por eso no se guardan juntos.',
    ],
  }),
  {
    ids: ['h2o2', 'naoh'],
    title: 'Peróxido de hidrógeno + hidróxido de sodio',
    equation: '2 H₂O₂ → 2 H₂O + O₂',
    effect: 'effervescence',
    resultColor: '#e0f2fe',
    resultLine: 'El peróxido se descompone más rápido.',
    mixingMs: 2000,
    whatYouSaw: [
      'Se forman burbujas pequeñas de oxígeno, más que en el agua oxigenada sola.',
      'La mezcla se calienta un poco.',
    ],
    why: [
      'En medio básico el peróxido es menos estable: el OH⁻ le quita un H⁺ y forma el ion HO₂⁻, que acelera su descomposición en agua y oxígeno.',
      'Por eso el agua oxigenada se vende ligeramente ácida: así dura más tiempo.',
    ],
  },
  {
    ids: ['h2o2', 'h2so4'],
    title: 'Peróxido de hidrógeno + ácido sulfúrico → solución piraña',
    equation: 'H₂SO₄ + H₂O₂ → H₂SO₅ + H₂O',
    effect: 'whitesmoke',
    resultColor: '#f8fafc',
    resultLine: 'Se formó solución piraña: ¡muy caliente!',
    mixingMs: 1500,
    whatYouSaw: [
      'Al mezclarlos, la solución se calienta muchísimo, hasta más de 100 °C, y puede soltar vapor.',
      'Se ve igual de incolora, pero ahora es un oxidante extremadamente fuerte.',
    ],
    why: [
      'El ácido sulfúrico reacciona con el peróxido y forma ácido peroxomonosulfúrico (H₂SO₅), conocido como ácido de Caro.',
      'Además, mezclar ácido sulfúrico concentrado con agua libera muchísimo calor, y la solución de peróxido es casi toda agua.',
    ],
    noteLabel: 'Seguridad',
    note: 'A esta mezcla se le llama "solución piraña" porque disuelve la materia orgánica casi al instante, y puede explotar si toca sustancias orgánicas. Solo se usa en laboratorios especializados para limpiar vidrio y chips.',
  },
  noReaction('h2o2', 'caco3', {
    why: ['El carbonato de calcio no es ácido ni reductor: el peróxido no tiene con qué reaccionar.'],
  }),
  noReaction('h2o2', 'agno3', {
    why: [
      'En solución neutra no se nota ninguna reacción: la plata ya está oxidada (Ag⁺) y el peróxido no la cambia.',
      'Si se añade una base, se forma óxido de plata, y ese óxido hace que el peróxido se descomponga con muchas burbujas.',
    ],
  }),
  noReaction('h2o2', 'nacl', {
    why: [
      'En una solución neutra el peróxido no oxida al cloruro, y la sal tampoco le hace nada al peróxido.',
      'Queda simplemente sal disuelta en agua oxigenada.',
    ],
  }),

  // Permanganato de potasio
  {
    ids: ['kmno4', 'hcl'],
    title: 'Permanganato de potasio + ácido clorhídrico → cloro',
    equation: '2 KMnO₄ + 16 HCl → 2 KCl + 2 MnCl₂ + 5 Cl₂ + 8 H₂O',
    effect: 'colorchange',
    resultColor: '#ecfccb',
    resultLine: 'El morado desapareció y salió cloro.',
    mixingMs: 1800,
    whatYouSaw: [
      'El morado intenso desaparece rápidamente.',
      'Se desprende un gas verde amarillento de olor irritante: cloro (Cl₂).',
    ],
    why: [
      'En medio ácido el permanganato es un oxidante muy fuerte: le quita electrones al cloruro (Cl⁻ → Cl⁰) y el manganeso baja de +7 a +2.',
      'El Mn²⁺ casi no tiene color; por eso desaparece el morado.',
      'Cada manganeso recibe 5 electrones y cada cloro cede 1. Por eso la ecuación es tan grande: de los 16 HCl, solo 10 se oxidan a cloro.',
    ],
    noteLabel: 'Seguridad',
    note: 'Es una forma de preparar cloro en el laboratorio, y el cloro es tóxico. Solo se hace en campana de extracción.',
  },
  {
    ids: ['kmno4', 'naoh'],
    title: 'Permanganato de potasio + hidróxido de sodio',
    equation: '4 MnO₄⁻ + 4 OH⁻ → 4 MnO₄²⁻ + O₂ + 2 H₂O',
    effect: 'colorchange',
    resultColor: '#15803d',
    resultLine: 'El morado se volvió verde.',
    mixingMs: 2500,
    whatYouSaw: [
      'Con la base concentrada, el morado se va volviendo verde poco a poco.',
      'Si se deja más tiempo, termina café, porque se forma dióxido de manganeso.',
    ],
    why: [
      'En medio muy básico el permanganato (MnO₄⁻, Mn +7, morado) se reduce a manganato (MnO₄²⁻, Mn +6, verde) y libera un poco de oxígeno.',
      'El manganato tampoco es muy estable y con el tiempo se transforma en MnO₂ café.',
    ],
    noteLabel: 'Dato',
    note: 'Si además se añade azúcar, la solución pasa de morado a azul, verde, naranja y café. Por eso a ese experimento se le llama "camaleón químico".',
  },
  {
    ids: ['kmno4', 'h2so4'],
    title: 'Permanganato de potasio + ácido sulfúrico',
    equation: '2 KMnO₄ + H₂SO₄ → K₂SO₄ + Mn₂O₇ + H₂O',
    effect: 'colorchange',
    resultColor: '#14532d',
    resultLine: 'Se formó un aceite verde muy peligroso.',
    mixingMs: 1800,
    whatYouSaw: [
      'Con el ácido concentrado, los cristales morados forman un líquido aceitoso verde oscuro: heptóxido de manganeso (Mn₂O₇).',
      'Puede soltar vapores violetas y explotar si se calienta o toca algo orgánico.',
    ],
    why: [
      'El ácido sulfúrico concentrado le quita agua al permanganato y forma el óxido de manganeso con número de oxidación +7.',
      'El Mn₂O₇ es uno de los oxidantes más fuertes que existen: enciende el papel, el alcohol o el algodón con solo tocarlos.',
      'Con ácido diluido no pasa esto: el permanganato con ácido diluido se usa todos los días en titulaciones.',
    ],
    noteLabel: 'Seguridad',
    note: 'Esta mezcla es explosiva. Jamás se prepara fuera de un laboratorio especializado.',
  },
  noReaction('kmno4', 'caco3', {
    saw: ['El polvo blanco solo se tiñe de morado.'],
    why: ['El carbonato de calcio no es reductor: su carbono ya está en +4, el máximo. El permanganato no tiene electrones que quitarle.'],
  }),
  noReaction('kmno4', 'agno3', {
    why: [
      'Los dos son oxidantes y sus metales ya están oxidados (Mn +7 y Ag +1). Nadie cede electrones, así que no hay reacción redox.',
      'La solución simplemente queda morada.',
    ],
  }),
  noReaction('kmno4', 'nacl', {
    why: [
      'Sin ácido, el permanganato no logra oxidar al cloruro: le faltan los H⁺ que necesita para reaccionar.',
      'Compáralo con el ácido clorhídrico, donde sí se forma cloro (prueba KMnO₄ + HCl). El ácido hace toda la diferencia.',
    ],
  }),

  // Ácido clorhídrico
  {
    ids: ['hcl', 'h2so4'],
    title: 'Ácido clorhídrico + ácido sulfúrico',
    equation: 'HCl(ac) → HCl(g)',
    effect: 'whitesmoke',
    resultColor: '#f1f5f9',
    resultLine: 'Salió humo blanco de cloruro de hidrógeno.',
    mixingMs: 1400,
    whatYouSaw: ['La mezcla se calienta y empieza a soltar un humo blanco y picante.'],
    why: [
      'Dos ácidos no se neutralizan entre sí: no hay una base que reciba los H⁺, así que no se forma ningún compuesto nuevo.',
      'Pero el ácido sulfúrico concentrado atrapa el agua con muchísima fuerza. Le quita el agua al ácido clorhídrico y el HCl escapa como gas, que forma humo blanco al tocar la humedad del aire.',
    ],
    noteLabel: 'Seguridad',
    note: 'El gas HCl es corrosivo para los ojos y los pulmones. Así se obtiene HCl gaseoso en el laboratorio.',
  },
  {
    ids: ['hcl', 'agno3'],
    title: 'Ácido clorhídrico + nitrato de plata',
    equation: 'HCl + AgNO₃ → AgCl↓ + HNO₃',
    effect: 'precipitation',
    resultColor: '#f5f5f4',
    resultLine: 'Se formó un precipitado blanco.',
    mixingMs: 1200,
    whatYouSaw: [
      'Aparece de inmediato un precipitado blanco, como leche cortada: cloruro de plata (AgCl).',
      'Si se deja a la luz, el sólido se va poniendo violeta grisáceo.',
    ],
    why: [
      'Es una doble sustitución: los iones intercambian pareja. El Ag⁺ se une al Cl⁻ y forma AgCl, que es insoluble; el H⁺ y el NO₃⁻ quedan disueltos como ácido nítrico.',
      'Pasa lo mismo con cualquier fuente de cloruro, como la sal (prueba AgNO₃ + NaCl). Lo que importa es el ion Cl⁻.',
    ],
  },
  noReaction('hcl', 'nacl', {
    why: [
      'El ácido clorhídrico y la sal comparten el ion cloruro (Cl⁻), y el sodio ya está oxidado. No hay nada nuevo que formar.',
      'Si la salmuera está saturada, al añadir ácido concentrado aparecen cristales de sal: el exceso de cloruro "empuja" a la sal fuera de la solución. Es el efecto del ion común.',
    ],
  }),

  // Hidróxido de sodio
  {
    ids: ['naoh', 'h2so4'],
    title: 'Hidróxido de sodio + ácido sulfúrico',
    equation: '2 NaOH + H₂SO₄ → Na₂SO₄ + 2 H₂O',
    otherEquations: ['NaOH + H₂SO₄ → NaHSO₄ + H₂O (con poca base)'],
    effect: 'water',
    resultColor: '#f1f5f9',
    resultLine: 'Neutralización ácido-base.',
    mixingMs: 1300,
    whatYouSaw: [
      'La mezcla se calienta mucho: la neutralización libera energía.',
      'Queda una solución incolora: agua con sulfato de sodio disuelto.',
    ],
    why: [
      'Es una neutralización: los H⁺ del ácido se unen a los OH⁻ de la base y forman agua.',
      'El ácido sulfúrico tiene dos hidrógenos ácidos, así que necesita 2 NaOH por cada molécula. Con menos base se forma bisulfato de sodio (NaHSO₄).',
    ],
    noteLabel: 'Seguridad',
    note: 'Con ácido sulfúrico concentrado el calor es tanto que la mezcla puede hervir y salpicar. Siempre se añade poco a poco y con protección.',
  },
  noReaction('naoh', 'caco3', {
    why: [
      'Las dos sustancias son básicas: el carbonato también acepta H⁺. Dos bases no se neutralizan entre sí.',
      'El carbonato de calcio, además, es insoluble y se queda en el fondo sin cambiar.',
    ],
  }),
  {
    ids: ['naoh', 'agno3'],
    title: 'Hidróxido de sodio + nitrato de plata',
    equation: '2 AgNO₃ + 2 NaOH → Ag₂O↓ + 2 NaNO₃ + H₂O',
    effect: 'darkening',
    resultColor: '#57534e',
    resultLine: 'Se formó un precipitado café.',
    mixingMs: 1300,
    whatYouSaw: [
      'Al mezclar las dos soluciones incoloras aparece un precipitado café oscuro.',
      'El sólido se va al fondo: es óxido de plata (Ag₂O).',
    ],
    why: [
      'Los iones Ag⁺ se encuentran con los OH⁻ de la base. Esperarías hidróxido de plata (AgOH), pero es tan inestable que pierde agua al instante: 2 AgOH → Ag₂O + H₂O.',
      'El sodio y el nitrato quedan disueltos como nitrato de sodio.',
    ],
    noteLabel: 'Dato',
    note: 'El óxido de plata disuelto en amoniaco es el reactivo de Tollens, que forma un espejo de plata sobre el vidrio. Así se hacían los espejos antiguamente.',
  },
  noReaction('naoh', 'nacl', {
    why: [
      'Comparten el ion sodio (Na⁺) y ninguno es ácido. No hay neutralización ni intercambio posible.',
      'De hecho, se obtienen juntos: al pasar electricidad por agua salada se produce sosa y cloro, y la sosa queda mezclada con la sal que no reaccionó.',
    ],
  }),

  // Ácido sulfúrico
  {
    ids: ['h2so4', 'caco3'],
    title: 'Ácido sulfúrico + carbonato de calcio',
    equation: 'CaCO₃ + H₂SO₄ → CaSO₄ + CO₂ + H₂O',
    effect: 'effervescence',
    resultColor: '#f5f5f4',
    resultLine: 'Burbujeó... y se detuvo.',
    mixingMs: 1500,
    whatYouSaw: [
      'Al principio hay efervescencia: burbujas de dióxido de carbono.',
      'Pronto las burbujas se detienen, aunque todavía quede carbonato sin reaccionar.',
    ],
    why: [
      'El ácido ataca al carbonato igual que el clorhídrico y libera CO₂.',
      'Pero el sulfato de calcio (CaSO₄) que se forma es casi insoluble: cubre los trozos de carbonato como una costra y no deja que el ácido siga llegando.',
      'Por eso, para disolver caliza en el laboratorio se usa ácido clorhídrico: el CaCl₂ que forma sí es soluble.',
    ],
    noteLabel: 'Dato',
    note: 'El sulfato de calcio es el yeso. La lluvia ácida, que contiene ácido sulfúrico, convierte poco a poco el mármol de las estatuas en yeso.',
  },
  {
    ids: ['h2so4', 'agno3'],
    title: 'Ácido sulfúrico + nitrato de plata',
    equation: '2 AgNO₃ + H₂SO₄ → Ag₂SO₄↓ + 2 HNO₃',
    effect: 'precipitation',
    resultColor: '#f5f5f4',
    resultLine: 'Apareció un poco de precipitado blanco.',
    mixingMs: 1500,
    whatYouSaw: [
      'Si las soluciones están concentradas, aparece un poco de precipitado blanco: sulfato de plata (Ag₂SO₄).',
      'Con soluciones diluidas casi no se ve nada.',
    ],
    why: [
      'Es una doble sustitución: el Ag⁺ se une al sulfato (SO₄²⁻). El sulfato de plata es poco soluble, pero mucho menos insoluble que el cloruro de plata.',
      'Por eso solo precipita cuando hay mucha plata y mucho sulfato juntos. Con el cloruro, en cambio, basta muy poquito (prueba HCl + AgNO₃).',
    ],
  },
  {
    ids: ['h2so4', 'nacl'],
    title: 'Ácido sulfúrico + cloruro de sodio',
    equation: 'NaCl + H₂SO₄ → NaHSO₄ + HCl',
    otherEquations: ['2 NaCl + H₂SO₄ → Na₂SO₄ + 2 HCl (calentando)'],
    effect: 'whitesmoke',
    resultColor: '#f8fafc',
    resultLine: 'Salió gas de cloruro de hidrógeno.',
    mixingMs: 1500,
    whatYouSaw: [
      'La sal burbujea al contacto con el ácido concentrado.',
      'Sale un gas picante que forma humo blanco en el aire húmedo: cloruro de hidrógeno (HCl).',
    ],
    why: [
      'El ácido sulfúrico concentrado le da un H⁺ al cloruro de la sal y forma HCl. Como el HCl es un gas, escapa y la reacción sigue avanzando.',
      'Durante siglos así se fabricó el ácido clorhídrico: disolviendo en agua el gas que sale de esta reacción.',
    ],
    noteLabel: 'Seguridad',
    note: 'El gas HCl es muy corrosivo para los ojos y las vías respiratorias.',
  },

  // Carbonato de calcio
  noReaction('caco3', 'agno3', {
    why: [
      'El carbonato de calcio es casi insoluble y suelta muy pocos iones carbonato al agua, así que casi no reacciona con los iones de plata.',
      'A simple vista, el polvo blanco se queda igual en el fondo.',
    ],
  }),
  noReaction('caco3', 'nacl', {
    why: [
      'Las dos son sales muy estables y, al intercambiar sus iones, no se formaría ningún sólido ni gas nuevo.',
      'El carbonato de calcio no se disuelve en agua y la sal sí. Así se separan: se disuelve la sal, se filtra y el carbonato queda en el papel.',
    ],
  }),
]

export const MIXTURES: Reaction[] = [...REACTIONS, ...MORE_REACTIONS]

export function reacts(reaction: Reaction): boolean {
  return reaction.effect !== 'none'
}

export function findReaction(a: string, b: string): Reaction | undefined {
  return MIXTURES.find(({ ids }) => (ids[0] === a && ids[1] === b) || (ids[0] === b && ids[1] === a))
}
