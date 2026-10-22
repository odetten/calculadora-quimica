// 'none' es para las mezclas en las que no hay reacción: el vaso se queda como estaba
export type ReactionEffect = 'explosion' | 'water' | 'salt' | 'rust' | 'co2' | 'sparkle' | 'effervescence' | 'precipitation' | 'colorchange' | 'darkening' | 'whitesmoke' | 'eruption' | 'none'

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
  // Dos sustancias, o tres en las mezclas especiales de TRIPLES (mixtures.ts)
  ids: [string, string] | [string, string, string]
  title: string
  equation: string
  // Otras ecuaciones balanceadas que también pueden darse con los mismos reactivos
  otherEquations?: string[]
  // Texto que presenta las otras ecuaciones; por defecto habla de otros productos
  otherLabel?: string
  effect: ReactionEffect
  // Color del contenido del vaso al terminar la reacción; sin él cada sustancia conserva su color
  resultColor?: string
  // Color del humo del efecto whitesmoke; blanco si no se indica
  smokeColor?: string
  resultLine: string
  // Tiempo de la fase de mezclado antes de mostrar el resultado
  mixingMs?: number
  whatYouSaw: string[]
  why: string[]
  noteLabel?: string
  note?: string
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
    id: 'n2',
    formula: 'N₂',
    name: 'Nitrógeno',
    state: 'Gas incoloro',
    note: 'Gas inerte. Componente principal del aire.',
    color: '#cffafe',
    element: 'N',
  },
  {
    id: 'p',
    formula: 'P',
    name: 'Fósforo',
    state: 'Sólido blanco/rojo',
    note: 'Muy reactivo. El fósforo blanco arde solo.',
    color: '#fef3c7',
    element: 'P',
  },
  {
    id: 's',
    formula: 'S',
    name: 'Azufre',
    state: 'Sólido amarillo',
    note: 'Conocido como "azufre". Se quema con llama azul.',
    color: '#fde047',
    element: 'S',
  },
  {
    id: 'cu',
    formula: 'Cu',
    name: 'Cobre',
    state: 'Metal rojizo',
    note: 'Metal noble. Conductor de electricidad y calor.',
    color: '#ea580c',
    element: 'Cu',
  },
  {
    id: 'zn',
    formula: 'Zn',
    name: 'Zinc',
    state: 'Metal grisáceo',
    note: 'Usado en galvanizado para proteger acero.',
    color: '#a1a5af',
    element: 'Zn',
  },
  {
    id: 'al',
    formula: 'Al',
    name: 'Aluminio',
    state: 'Metal plateado y ligero',
    note: 'Metal más abundante de la corteza terrestre.',
    color: '#c7d2e0',
    element: 'Al',
  },
  {
    id: 'mg',
    formula: 'Mg',
    name: 'Magnesio',
    state: 'Metal plateado brillante',
    note: 'Muy reactivo. Arde con luz blanca intensa.',
    color: '#f0f1f2',
    element: 'Mg',
  },
  {
    id: 'i2',
    formula: 'I₂',
    name: 'Yodo',
    state: 'Cristales negros',
    note: 'Forma un vapor morado violeta. Poco soluble en agua.',
    color: '#6b21a8',
    element: 'I',
  },
  {
    id: 'br2',
    formula: 'Br₂',
    name: 'Bromo',
    state: 'Líquido rojo oscuro',
    note: 'El único elemento líquido no metal. Muy tóxico.',
    color: '#7c2d12',
    element: 'Br',
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
  {
    id: 'hcl',
    formula: 'HCl',
    name: 'Ácido clorhídrico',
    state: 'Solución incolora',
    note: 'Ácido fuerte. Corrosivo. Encontrado en jugos gástricos.',
    color: '#e0f2fe',
  },
  {
    id: 'naoh',
    formula: 'NaOH',
    name: 'Hidróxido de sodio',
    state: 'Sólido blanco/Solución incolora',
    note: 'Base fuerte muy corrosiva. Usado en limpiadores.',
    color: '#f3f4f6',
  },
  {
    id: 'h2so4',
    formula: 'H₂SO₄',
    name: 'Ácido sulfúrico',
    state: 'Líquido denso incoloro',
    note: 'Ácido más fuerte. Altamente corrosivo y deshidratante.',
    color: '#ecfdf5',
  },
  {
    id: 'caco3',
    formula: 'CaCO₃',
    name: 'Carbonato de calcio',
    state: 'Sólido blanco',
    note: 'Piedra caliza, mármol. Se quema para hacer cal.',
    color: '#f5f5f4',
  },
  {
    id: 'agno3',
    formula: 'AgNO₃',
    name: 'Nitrato de plata',
    state: 'Cristales incoloros',
    note: 'Sensible a la luz. Usado en fotografía. Corrosivo.',
    color: '#f1f5f9',
  },
  {
    id: 'nacl',
    formula: 'NaCl',
    name: 'Cloruro de sodio',
    state: 'Cristales blancos',
    note: 'Sal común de mesa. Muy importante en química.',
    color: '#ffffff',
  },
  {
    id: 'ki',
    formula: 'KI',
    name: 'Yoduro de potasio',
    state: 'Cristales blancos',
    note: 'Fuente de yodo. Se agrega a la sal de mesa y protege la tiroides de la radiación.',
    color: '#f5f5f4',
  },
  {
    id: 'cuso4',
    formula: 'CuSO₄',
    name: 'Sulfato de cobre(II)',
    state: 'Cristales azules',
    note: 'Disuelto pinta el agua de azul. Se usa como fungicida y para limpiar albercas.',
    color: '#38bdf8',
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
  {
    ids: ['cu', 'o2'],
    title: 'Cobre + oxígeno → óxido de cobre',
    equation: '2 Cu + O₂ → 2 CuO',
    effect: 'darkening',
    resultColor: '#1f1f1f',
    resultLine: 'El cobre se oscureció.',
    mixingMs: 2000,
    whatYouSaw: [
      'El cobre rojizo brilla al inicio, luego la superficie se cubre con una capa negra.',
      'La reacción es más lenta que otros metales pero los resultados son claros.',
      'El óxido de cobre forma una capa compacta de color negro que es bastante adherente.',
    ],
    why: [
      'El cobre se oxida (Cu → Cu²⁺) al ceder dos electrones y el oxígeno se reduce (O⁰ → O²⁻).',
      'A diferencia del hierro, el óxido de cobre (CuO) es negro y forma una capa más compacta. Sin embargo, sigue siendo permeable.',
      'En presencia de humedad y dióxido de carbono, el óxido de cobre se convierte en malaquita, un mineral verde azulado que ves en las estatuas antiguas.',
    ],
    noteLabel: 'Dato',
    note:
      'La Estatua de la Libertad está verde porque el cobre bajo la lluvia se convirtió en malaquita. Este proceso se llama pátina y tarda años en formarse.',
  },
  {
    ids: ['mg', 'o2'],
    title: 'Magnesio + oxígeno → óxido de magnesio',
    equation: '2 Mg + O₂ → 2 MgO',
    effect: 'sparkle',
    resultColor: '#fefce8',
    resultLine: '¡Luz blanca intensa!',
    mixingMs: 1200,
    whatYouSaw: [
      'El magnesio arde con una luz blanca cegadora tan brillante que duele mirar.',
      'Se produce un polvo blanco fino: óxido de magnesio (MgO), conocido como magnesia.',
      'La reacción libera muchísimo calor: la temperatura supera los 3000°C.',
    ],
    why: [
      'El magnesio se oxida muy rápidamente (Mg → Mg²⁺). La reacción es muy exotérmica y libera una energía tremenda.',
      'Esta luz blanca intensa es lo que ves en los antiguos flashes de fotografía y en bengalas. El MgO blanco absorbe la luz ultravioleta.',
      'El óxido de magnesio es básico y forma un hidróxido (Mg(OH)₂) con el agua. Es la magnesia que se usa en medicinas.',
    ],
    noteLabel: 'Seguridad',
    note:
      'La combustión del magnesio produce una luz tan intensa que puede dañar la vista. Es prácticamente imposible apagarla con agua porque el magnesio sigue reaccionando. Solo se apaga con arena o polvo químico.',
  },
  {
    ids: ['al', 'o2'],
    title: 'Aluminio + oxígeno → óxido de aluminio',
    equation: '4 Al + 3 O₂ → 2 Al₂O₃',
    effect: 'sparkle',
    resultColor: '#faf5ff',
    resultLine: 'Brillo intenso del aluminio.',
    mixingMs: 1800,
    whatYouSaw: [
      'El aluminio brillante arde con flamas y produce un brillo muy intenso.',
      'Se forma un polvo blanco: óxido de aluminio (Al₂O₃), conocido como alúmina.',
      'Libera mucho calor, aunque menos que el magnesio. La alúmina es muy resistente.',
    ],
    why: [
      'El aluminio se oxida rápidamente (Al → Al³⁺) al ceder tres electrones. Es muy exotérmico.',
      'El Al₂O₃ (alúmina) es extremadamente duro y refractario. Se usa en abrasivos, aislantes y cerámica.',
      'Aunque el aluminio se oxida fácilmente, forma una capa compacta de óxido que lo protege del resto de la corrosión. Por eso los aviones de aluminio duran tanto.',
    ],
    noteLabel: 'Dato',
    note:
      'El óxido de aluminio cristalino es el rubí y el zafiro. Son gemas valiosas. El rubí es rojo por impurezas de cromo y el zafiro es azul por impurezas de hierro.',
  },
  {
    ids: ['s', 'o2'],
    title: 'Azufre + oxígeno → dióxido de azufre',
    equation: 'S + O₂ → SO₂',
    effect: 'whitesmoke',
    resultColor: '#cbd5e0',
    resultLine: 'Gas de olor fuerte.',
    mixingMs: 1600,
    whatYouSaw: [
      'El azufre amarillo se quema con una llama azul-violeta.',
      'Se produce un gas incoloro con un olor muy fuerte y desagradable: dióxido de azufre (SO₂).',
      'El olor es característico y tóxico en grandes cantidades.',
    ],
    why: [
      'El azufre se oxida (S → S⁴⁺) al ceder cuatro electrones. El SO₂ es un gas muy importante.',
      'El dióxido de azufre se usa como desinfectante y conservante. También es un producto de quemar carbón con azufre.',
      'En la atmósfera, el SO₂ se oxida a SO₃ que forma ácido sulfúrico (H₂SO₄). Esto causa lluvia ácida que daña ecosistemas.',
    ],
    noteLabel: 'Dato',
    note:
      'El SO₂ es un gas reactivo que absorbe la radiación ultravioleta. En grandes cantidades en la atmósfera puede enfriar el planeta. Algunos volcanes al erupcionar inyectan SO₂ a la atmósfera.',
  },
  {
    ids: ['zn', 'hcl'],
    title: 'Zinc + ácido clorhídrico',
    equation: 'Zn + 2 HCl → ZnCl₂ + H₂',
    effect: 'effervescence',
    resultColor: '#f0f9ff',
    resultLine: 'Se libera gas de hidrógeno.',
    mixingMs: 1400,
    whatYouSaw: [
      'El zinc gris metálico reacciona casi inmediatamente con el ácido.',
      'Se producen muchas burbujas: es hidrógeno gaseoso (H₂) que se escapa.',
      'La solución se calienta. El zinc desaparece disuelto.',
    ],
    why: [
      'El zinc es más reactivo que el hidrógeno en la serie de reactividad. Desplaza al hidrógeno del ácido.',
      'El zinc se oxida (Zn → Zn²⁺) y el ácido se reduce liberando H₂. Zn es un reductor fuerte.',
      'El ZnCl₂ (cloruro de zinc) que se forma es soluble en agua y da una solución clara e incolora.',
    ],
    noteLabel: 'Nota',
    note:
      'Es la forma clásica de obtener hidrógeno en el laboratorio: el aparato de Kipp dejaba caer ácido clorhídrico sobre zinc y soltaba el gas a voluntad.',
  },
  {
    ids: ['naoh', 'hcl'],
    title: 'Hidróxido de sodio + ácido clorhídrico',
    equation: 'NaOH + HCl → NaCl + H₂O',
    effect: 'water',
    resultColor: '#fef3c7',
    resultLine: 'Neutralización ácido-base.',
    mixingMs: 1300,
    whatYouSaw: [
      'La mezcla del ácido y la base produce una reacción visible inmediata.',
      'El vaso se calienta significativamente. Se libera mucha energía.',
      'El resultado es una solución transparente e incolora (agua con sal disuelta).',
    ],
    why: [
      'Es una reacción ácido-base. El H⁺ del ácido y el OH⁻ de la base se combinan para formar agua (H₂O).',
      'La reacción es neutralización completa cuando se usan cantidades estequiométricas. El único otro producto es una sal (NaCl).',
      'Es una reacción muy exotérmica: libera alrededor de 57 kJ/mol. Esto es porque se rompen enlaces débiles y se forman uno muy fuerte (H-O).',
    ],
    noteLabel: 'Dato',
    note:
      'Las reacciones ácido-base son tan comunes que las usamos para hacer jabón, neutralizar quemaduras químicas y en innumerables procesos industriales. El pH final depende de qué ácido y qué base usemos.',
  },
  {
    ids: ['caco3', 'hcl'],
    title: 'Carbonato de calcio + ácido clorhídrico',
    equation: 'CaCO₃ + 2 HCl → CaCl₂ + CO₂ + H₂O',
    effect: 'effervescence',
    resultColor: '#e0f2fe',
    resultLine: 'Se desprende dióxido de carbono.',
    mixingMs: 1500,
    whatYouSaw: [
      'El sólido blanco comienza a disolverse inmediatamente.',
      'Se produce efervescencia: muchas burbujas finas de gas que escapan rápidamente.',
      'El sólido desaparece. La solución se calienta levemente.',
    ],
    why: [
      'El ácido reacciona con el carbonato. El CO₃²⁻ recibe protones y se convierte en CO₂ que escapa como gas.',
      'El calcio queda en solución como Ca²⁺ y con el cloro del ácido forma CaCl₂ soluble.',
      'Esta es la reacción que ocurre cuando viertes vinagre (ácido acético débil) sobre cáscaras de huevo (CaCO₃). También es cómo se disuelven depósitos de cal en tuberías.',
    ],
    noteLabel: 'Dato',
    note:
      'La piedra caliza y el mármol son principalmente CaCO₃. Esta reacción con ácidos es el proceso principal del karst: cómo se forman cuevas. El CO₂ del aire disuelto en agua lluvia reacciona lentamente con la piedra caliza.',
  },
  {
    ids: ['agno3', 'nacl'],
    title: 'Nitrato de plata + cloruro de sodio',
    equation: 'AgNO₃ + NaCl → AgCl↓ + NaNO₃',
    effect: 'precipitation',
    resultColor: '#f5f5f4',
    resultLine: 'Se forma un precipitado blanco.',
    mixingMs: 1200,
    whatYouSaw: [
      'Al mezclar las dos soluciones incoloras aparece inmediatamente un precipitado blanco.',
      'El polvo blanco es cloruro de plata (AgCl), que es insoluble en agua.',
      'La reacción es instantánea: es una reacción de precipitación.',
    ],
    why: [
      'El Ag⁺ y el Cl⁻ se combinan para formar AgCl que es insoluble. El sodio y el nitrato quedan en solución.',
      'Es una reacción iónica. Los iones se intercambian: Ag⁺ busca Cl⁻ porque forman un compuesto muy insoluble.',
      'El AgCl es fotosensible: se oscurece con la luz porque se reduce a plata metálica. Por eso se usa en película fotográfica antigua.',
    ],
    noteLabel: 'Nota',
    note:
      'Esta es una reacción clásica de análisis cualitativo: se usa para detectar la presencia de cloruros. Si aparece un precipitado blanco que se vuelve gris al exponerse a la luz, es cloruro.',
  },
  {
    ids: ['i2', 'h2'],
    title: 'Yodo + hidrógeno',
    equation: 'I₂ + H₂ ⇌ 2 HI',
    effect: 'colorchange',
    resultColor: '#c7d2e0',
    resultLine: 'El color morado desaparece.',
    mixingMs: 1800,
    whatYouSaw: [
      'Los cristales negros de yodo tienen un color morado cuando se vaporizan.',
      'Al mezclar con hidrógeno, el color morado desaparece gradualmente.',
      'Se forma yoduro de hidrógeno (HI), un gas incoloro.',
    ],
    why: [
      'Es una síntesis reversible (equilibrio químico). El yodo y el hidrógeno se combinan para formar dos moléculas de HI.',
      'La ecuación usa un signo igual con flechas (⇌) porque es reversible: el HI se descompone de nuevo en I₂ y H₂ si se calienta.',
      'Esta reacción fue importante en química porque demuestra el equilibrio químico: nunca llega a ser total, siempre quedan reactivos sin reaccionar.',
    ],
    noteLabel: 'Nota',
    note:
      'El yoduro de hidrógeno es corrosivo y tóxico, pero es importante en industria química. Es uno de los primeros ejemplos que se estudiaron para entender reacciones reversibles.',
  },
  {
    ids: ['p', 'o2'],
    title: 'Fósforo + oxígeno → pentóxido de fósforo',
    equation: '4 P + 5 O₂ → 2 P₂O₅',
    effect: 'whitesmoke',
    resultColor: '#f3f4f6',
    resultLine: 'Combustión brillante del fósforo.',
    mixingMs: 1400,
    whatYouSaw: [
      'El fósforo blanco arde con una llama brillante y amarilla.',
      'Se produce mucho humo blanco: es pentóxido de fósforo (P₂O₅).',
      'La reacción es muy rápida y libera mucho calor. El fósforo puede autoinflarse.',
    ],
    why: [
      'El fósforo es muy reactivo y se oxida fácilmente (P → P⁵⁺). Es muy exotérmico.',
      'El P₂O₅ es higroscópico: absorbe agua del aire con mucha avidez. Por eso el humo blanco es denso.',
      'El pentóxido de fósforo reacciona con agua para formar ácido fosfórico: P₂O₅ + 3 H₂O → 2 H₃PO₄. El ácido fosfórico es importante en industria.',
    ],
    noteLabel: 'Seguridad',
    note:
      'El fósforo blanco es altamente inflamable y tóxico. Se oxida espontáneamente al aire. Se debe guardar en agua o en ambiente inerte. Solo es para usar en laboratorio con experiencia.',
  },
]
