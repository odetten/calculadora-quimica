"""Lecciones del nivel básico (formato descrito en lessons/__init__.py).

Están pensadas para niños: frases cortas, ejemplos de la vida diaria, emojis
y una actividad interactiva en cada tema.
"""

LECCIONES = {
    "quimica-1": [
        # --------------------------------------------------------------
        {
            "titulo": "La materia y sus estados",
            "resumen": "Descubre de qué están hechas las cosas y por qué el hielo se derrite.",
            "teoria": [
                {
                    "emoji": "🌍",
                    "titulo": "Todo lo que te rodea es materia",
                    "parrafos": [
                        "La **materia** es todo lo que **pesa** y **ocupa un lugar**.",
                        "Tu mochila, el agua, el aire dentro de un globo y hasta tú… ¡todo es materia!",
                        "Pero hay cosas que **no** son materia: la luz ☀️, los sonidos 🔊 y los sueños 💭. No se pueden pesar ni guardar en una caja.",
                    ],
                    "tip": "Truco: si lo puedes pesar y ocupa un lugar, ¡es materia!",
                    "actividad": {
                        "tipo": "clasificar",
                        "instruccion": "¿Es materia o no? Lleva cada cosa a su grupo.",
                        "grupos": [
                            {"nombre": "Es materia", "emoji": "✅"},
                            {"nombre": "No es materia", "emoji": "❌"},
                        ],
                        "elementos": [
                            {"texto": "Una piedra", "emoji": "🪨", "grupo": "Es materia"},
                            {"texto": "La luz del sol", "emoji": "☀️", "grupo": "No es materia"},
                            {"texto": "El aire de un globo", "emoji": "🎈", "grupo": "Es materia"},
                            {"texto": "Una canción", "emoji": "🎵", "grupo": "No es materia"},
                            {"texto": "Un vaso de leche", "emoji": "🥛", "grupo": "Es materia"},
                            {"texto": "Tu perro", "emoji": "🐶", "grupo": "Es materia"},
                        ],
                    },
                },
                {
                    "emoji": "🧊",
                    "titulo": "Sólido, líquido y gas",
                    "parrafos": [
                        "La materia puede estar en tres **estados**. ¡Vamos a conocerlos!",
                    ],
                    "puntos": [
                        "🧊 **Sólido**: tiene su propia forma. Una piedra o un lápiz no cambian de forma solos.",
                        "💧 **Líquido**: toma la forma del recipiente. El jugo toma la forma del vaso.",
                        "💨 **Gas**: se esparce por todos lados y casi siempre es invisible, como el aire.",
                    ],
                    "ejemplo": "Si pasas jugo de una botella a un vaso, cambia de forma, ¡pero sigue habiendo la misma cantidad de jugo!",
                    "tip": "El sólido tiene forma, el líquido se adapta y el gas se escapa por todos lados.",
                    "actividad": {
                        "tipo": "clasificar",
                        "instruccion": "¿Sólido, líquido o gas? Acomoda cada cosa.",
                        "grupos": [
                            {"nombre": "Sólido", "emoji": "🧊"},
                            {"nombre": "Líquido", "emoji": "💧"},
                            {"nombre": "Gas", "emoji": "💨"},
                        ],
                        "elementos": [
                            {"texto": "Un cubo de hielo", "emoji": "🧊", "grupo": "Sólido"},
                            {"texto": "Jugo de naranja", "emoji": "🧃", "grupo": "Líquido"},
                            {"texto": "Vapor de la olla", "emoji": "♨️", "grupo": "Gas"},
                            {"texto": "Un lápiz", "emoji": "✏️", "grupo": "Sólido"},
                            {"texto": "Miel", "emoji": "🍯", "grupo": "Líquido"},
                            {"texto": "Aire de un globo", "emoji": "🎈", "grupo": "Gas"},
                            {"texto": "Una piedra", "emoji": "🪨", "grupo": "Sólido"},
                            {"texto": "Leche", "emoji": "🥛", "grupo": "Líquido"},
                        ],
                    },
                },
                {
                    "emoji": "🔬",
                    "titulo": "Partículas que bailan",
                    "parrafos": [
                        "Toda la materia está hecha de pedacitos diminutos llamados **partículas**. ¡Son tan pequeñas que no se ven ni con lupa!",
                        "Las partículas siempre se están moviendo. Lo que cambia en cada estado es **qué tan juntas están**.",
                    ],
                    "puntos": [
                        "🧊 En un **sólido** están muy juntitas, como niños formados en fila: solo se mueven un poquito en su lugar.",
                        "💧 En un **líquido** están juntas, pero se deslizan, como niños jugando en el recreo.",
                        "💨 En un **gas** están muy separadas y corren rapidísimo por todos lados, ¡como a la hora de la salida!",
                    ],
                    "tip": "Las partículas del hielo, del agua y del vapor son las mismas. Solo cambia cómo se mueven.",
                    "actividad": {
                        "tipo": "descubre",
                        "instruccion": "Toca cada tarjeta para descubrir cómo se mueven las partículas.",
                        "tarjetas": [
                            {"emoji": "🧊", "frente": "¿Cómo están las partículas en un sólido?", "reverso": "Muy juntitas y ordenadas. Solo vibran en su lugar."},
                            {"emoji": "💧", "frente": "¿Y en un líquido?", "reverso": "Juntas, pero se deslizan unas sobre otras."},
                            {"emoji": "💨", "frente": "¿Y en un gas?", "reverso": "Muy separadas y moviéndose rapidísimo."},
                        ],
                    },
                },
                {
                    "emoji": "🔥",
                    "titulo": "Cambios de estado",
                    "parrafos": [
                        "Si calientas 🔥 o enfrías ❄️ algo, puede cambiar de estado. ¡Pero sigue siendo lo mismo! El hielo, el agua y el vapor son todos agua.",
                    ],
                    "tabla": {
                        "columnas": ["Cambio", "¿Qué pasa?", "Ejemplo"],
                        "filas": [
                            ["Fusión", "Sólido → líquido", "🍦 Un helado se derrite"],
                            ["Solidificación", "Líquido → sólido", "🧊 Agua en el congelador"],
                            ["Evaporación", "Líquido → gas", "☀️ Un charco se seca"],
                            ["Condensación", "Gas → líquido", "🥤 Gotitas en un vaso frío"],
                        ],
                    },
                    "tip": "Con calor 🔥 las partículas se mueven más y se separan. Con frío ❄️ se mueven menos y se juntan.",
                    "actividad": {
                        "tipo": "descubre",
                        "instruccion": "Toca cada tarjeta y descubre el nombre del cambio.",
                        "tarjetas": [
                            {"emoji": "🍦", "frente": "Un helado se derrite", "reverso": "**Fusión**: de sólido a líquido 🔥"},
                            {"emoji": "🧊", "frente": "El agua se congela", "reverso": "**Solidificación**: de líquido a sólido ❄️"},
                            {"emoji": "☀️", "frente": "Un charco se seca", "reverso": "**Evaporación**: de líquido a gas 🔥"},
                            {"emoji": "🥤", "frente": "Salen gotitas en un vaso frío", "reverso": "**Condensación**: de gas a líquido ❄️"},
                        ],
                    },
                },
                {
                    "emoji": "🛟",
                    "titulo": "¿Flota o se hunde?",
                    "parrafos": [
                        "Algunas cosas flotan en el agua y otras se hunden. ¡Y no depende solo de qué tan grandes son!",
                        "Las cosas que tienen su materia muy **apretada** en poco espacio se hunden, como una moneda. Las que tienen su materia más **ligera y esponjada** flotan, como la madera. Los científicos le llaman a esto **densidad**.",
                    ],
                    "ejemplo": "Un barco enorme 🚢 flota porque por dentro tiene mucho aire, ¡y el aire es muy ligero!",
                    "tip": "Una moneda pequeñita se hunde y un tronco enorme flota. ¡Lo que importa es qué tan apretada está su materia!",
                    "actividad": {
                        "tipo": "clasificar",
                        "instruccion": "Si los metieras en agua, ¿flotan o se hunden?",
                        "grupos": [
                            {"nombre": "Flota", "emoji": "🛟"},
                            {"nombre": "Se hunde", "emoji": "⚓"},
                        ],
                        "elementos": [
                            {"texto": "Un pedazo de madera", "emoji": "🪵", "grupo": "Flota"},
                            {"texto": "Una moneda", "emoji": "🪙", "grupo": "Se hunde"},
                            {"texto": "Una pelota de playa", "emoji": "🏐", "grupo": "Flota"},
                            {"texto": "Una llave", "emoji": "🔑", "grupo": "Se hunde"},
                            {"texto": "Una hoja de árbol", "emoji": "🍃", "grupo": "Flota"},
                            {"texto": "Una piedra", "emoji": "🪨", "grupo": "Se hunde"},
                        ],
                    },
                },
            ],
            "ejemplos": [
                {
                    "titulo": "¿Qué estado es?",
                    "enunciado": "¿En qué estado está el aire dentro de un globo 🎈?",
                    "pasos": [
                        {"texto": "¿Tiene su propia forma? No: toma la forma del globo.", "detalle": "Si tuviera su propia forma, sería un sólido."},
                        {"texto": "Si desatas el globo, ¿qué pasa? El aire sale y se esparce por todo el cuarto.", "detalle": "Esparcirse por todos lados es lo que hacen los gases."},
                        {"texto": "Entonces, ¡es un gas!", "detalle": "Sus partículas están muy separadas y se mueven rapidísimo."},
                    ],
                    "resultado": "El aire es un **gas** 💨.",
                    "tip": "Aunque no lo veas, el aire es materia: ¡por eso el globo se infla!",
                },
                {
                    "titulo": "¿Qué cambio de estado es?",
                    "enunciado": "Pones agua en el congelador y al día siguiente es hielo 🧊. ¿Qué cambio ocurrió?",
                    "pasos": [
                        {"texto": "Al principio el agua era líquida 💧.", "detalle": "Tomaba la forma del recipiente."},
                        {"texto": "Al final es hielo, un sólido 🧊.", "detalle": "Ahora tiene su propia forma."},
                        {"texto": "De líquido a sólido se llama solidificación.", "detalle": "Pasó porque el congelador le quitó calor ❄️: las partículas se movieron menos y se juntaron."},
                    ],
                    "resultado": "Ocurrió una **solidificación** ❄️.",
                    "tip": "Si sacas el hielo del congelador, pasará lo contrario: ¡una fusión!",
                },
            ],
            "examen": [
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuál de estos **no** es materia?",
                    "opciones": ["Una piedra", "El aire", "La luz", "El agua"],
                    "respuesta": "La luz",
                    "pista": "Piensa: ¿cuál de estos no se puede pesar ni guardar en una caja?",
                    "explicacion": "La luz no pesa ni ocupa un lugar. ¡El aire sí es materia, aunque no lo veas!",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿En qué estado está el jugo de naranja 🧃?",
                    "opciones": ["Sólido", "Líquido", "Gas"],
                    "respuesta": "Líquido",
                    "pista": "Si lo pasas a un vaso, ¿toma la forma del vaso?",
                    "explicacion": "El jugo toma la forma del recipiente: es un líquido.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿En qué estado las partículas están más separadas y corren más rápido?",
                    "opciones": ["Sólido", "Líquido", "Gas"],
                    "respuesta": "Gas",
                    "pista": "Recuerda a los niños a la hora de la salida.",
                    "explicacion": "En un gas las partículas están muy separadas y se mueven rapidísimo.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Un helado que se derrite 🍦 es un ejemplo de…",
                    "opciones": ["Condensación", "Fusión", "Solidificación"],
                    "respuesta": "Fusión",
                    "pista": "El helado pasa de sólido a líquido.",
                    "explicacion": "De sólido a líquido se llama fusión.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Cuando el hielo se derrite, el agua…",
                    "opciones": ["Se convierte en jugo", "Sigue siendo agua", "Desaparece"],
                    "respuesta": "Sigue siendo agua",
                    "pista": "Un cambio de estado no cambia lo que es la sustancia.",
                    "explicacion": "El hielo, el agua y el vapor son todos agua.",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "Los átomos: los ladrillos de todo",
            "resumen": "Conoce los pedacitos más pequeños de la materia y sus partes.",
            "teoria": [
                {
                    "emoji": "🧱",
                    "titulo": "Pedacitos muy, muy pequeños",
                    "parrafos": [
                        "Imagina un castillo hecho con bloques de juguete 🏰. Si lo desarmas, te quedan muchos bloquecitos.",
                        "¡La materia es igual! Todo está hecho de bloquecitos diminutos llamados **átomos**.",
                        "Los átomos son tan pequeños que en el puntito de una letra «i» caben millones de ellos.",
                    ],
                    "tip": "Todo lo que puedes tocar está hecho de átomos: tu mesa, tu comida… ¡y tú también!",
                    "actividad": {
                        "tipo": "verdadero_falso",
                        "instruccion": "¿Verdadero o falso?",
                        "afirmaciones": [
                            {"texto": "Todo lo que puedes tocar está hecho de átomos.", "respuesta": True, "explicacion": "¡Así es! Los átomos son los bloquecitos de toda la materia."},
                            {"texto": "Podemos ver un átomo con una lupa.", "respuesta": False, "explicacion": "Son muchísimo más pequeños. Ni con un microscopio de la escuela se ven."},
                            {"texto": "Tu cuerpo también está hecho de átomos.", "respuesta": True, "explicacion": "¡Claro! Tienes muchísimos átomos de carbono, oxígeno e hidrógeno."},
                        ],
                    },
                },
                {
                    "emoji": "⚛️",
                    "titulo": "Las partes del átomo",
                    "parrafos": [
                        "En el centro del átomo hay un **núcleo**. Ahí viven los **protones** ➕ y los **neutrones** ⚪.",
                        "Alrededor del núcleo giran los **electrones** ➖, muy rápido, como abejas alrededor de su colmena 🐝.",
                    ],
                    "tabla": {
                        "columnas": ["Partícula", "Carga", "¿Dónde vive?"],
                        "filas": [
                            ["Protón", "➕ Positiva", "En el núcleo"],
                            ["Neutrón", "⚪ Sin carga", "En el núcleo"],
                            ["Electrón", "➖ Negativa", "Alrededor del núcleo"],
                        ],
                    },
                    "tip": "Truco: **P**rotón = **P**ositivo. **N**eutrón = **N**eutro (sin carga). ¡El que queda, el electrón, es negativo!",
                    "actividad": {
                        "tipo": "descubre",
                        "instruccion": "Toca cada tarjeta para conocer a las partículas del átomo.",
                        "tarjetas": [
                            {"emoji": "➕", "frente": "Protón", "reverso": "Tiene carga **positiva** y vive en el núcleo."},
                            {"emoji": "⚪", "frente": "Neutrón", "reverso": "**No tiene carga** y también vive en el núcleo."},
                            {"emoji": "➖", "frente": "Electrón", "reverso": "Tiene carga **negativa** y gira alrededor del núcleo, ¡rapidísimo!"},
                        ],
                    },
                },
                {
                    "emoji": "🔢",
                    "titulo": "Cada elemento tiene su número",
                    "parrafos": [
                        "Hay distintos tipos de átomos. Cada tipo es un **elemento**: el oxígeno, el hierro, el oro…",
                        "Lo que hace diferente a cada elemento es **cuántos protones** tiene. A ese número le llamamos **número atómico**.",
                    ],
                    "puntos": [
                        "1 protón 👉 hidrógeno.",
                        "6 protones 👉 carbono.",
                        "8 protones 👉 oxígeno.",
                    ],
                    "tip": "El número atómico es como el número en la camiseta de un futbolista ⚽: ¡cada elemento tiene el suyo!",
                    "actividad": {
                        "tipo": "verdadero_falso",
                        "instruccion": "¿Verdadero o falso?",
                        "afirmaciones": [
                            {"texto": "Todos los átomos de oxígeno tienen 8 protones.", "respuesta": True, "explicacion": "Sí. Si tuviera otro número de protones, ya no sería oxígeno."},
                            {"texto": "El número atómico cuenta los neutrones.", "respuesta": False, "explicacion": "El número atómico cuenta los **protones**."},
                            {"texto": "Un átomo con 1 protón es hidrógeno.", "respuesta": True, "explicacion": "¡Correcto! El hidrógeno es el elemento número 1."},
                        ],
                    },
                },
                {
                    "emoji": "🔤",
                    "titulo": "Los símbolos químicos",
                    "parrafos": [
                        "Cada elemento tiene un apodo cortito: su **símbolo**.",
                        "**Regla de oro**: la primera letra va en MAYÚSCULA y la segunda, si hay, en minúscula.",
                        "Algunos símbolos vienen del latín, un idioma muy antiguo. Por eso el oro es Au (de «aurum») y el hierro es Fe (de «ferrum»).",
                    ],
                    "tabla": {
                        "columnas": ["Elemento", "Símbolo"],
                        "filas": [
                            ["Hidrógeno", "H"],
                            ["Oxígeno", "O"],
                            ["Carbono", "C"],
                            ["Calcio", "Ca"],
                            ["Hierro", "Fe"],
                            ["Oro", "Au"],
                        ],
                    },
                    "tip": "Una mayúscula siempre empieza un símbolo nuevo. ¡Por eso Ca es calcio, pero CA estaría mal escrito!",
                    "actividad": {
                        "tipo": "clasificar",
                        "instruccion": "¿Está bien escrito el símbolo? ¡Acomódalo!",
                        "grupos": [
                            {"nombre": "Bien escrito", "emoji": "✅"},
                            {"nombre": "Mal escrito", "emoji": "❌"},
                        ],
                        "elementos": [
                            {"texto": "Na", "grupo": "Bien escrito"},
                            {"texto": "NA", "grupo": "Mal escrito"},
                            {"texto": "Fe", "grupo": "Bien escrito"},
                            {"texto": "fE", "grupo": "Mal escrito"},
                            {"texto": "Ca", "grupo": "Bien escrito"},
                            {"texto": "cA", "grupo": "Mal escrito"},
                        ],
                    },
                },
            ],
            "ejemplos": [
                {
                    "titulo": "¿Qué elemento es?",
                    "enunciado": "Un átomo tiene 8 protones. ¿Qué elemento es?",
                    "pasos": [
                        {"texto": "El número de protones es su número atómico: 8.", "detalle": "Los protones son como su número de camiseta."},
                        {"texto": "El elemento número 8 es el oxígeno.", "detalle": "Puedes buscarlo en la tabla periódica."},
                    ],
                    "resultado": "Es el **oxígeno (O)**, ¡el que respiramos!",
                    "tip": "Si cambiara el número de protones, sería otro elemento.",
                },
                {
                    "titulo": "Protones y electrones",
                    "enunciado": "El carbono tiene 6 protones. ¿Cuántos electrones tiene un átomo de carbono?",
                    "pasos": [
                        {"texto": "Un átomo normal tiene la misma cantidad de electrones ➖ que de protones ➕.", "detalle": "Así las cargas positivas y negativas quedan parejas."},
                        {"texto": "Si tiene 6 protones, tiene 6 electrones.", "detalle": "6 positivos y 6 negativos: ¡empate!"},
                    ],
                    "resultado": "Tiene **6 electrones**.",
                    "tip": "Protones y electrones van en parejas: uno positivo por cada negativo.",
                },
            ],
            "examen": [
                {
                    "tipo": "opcion",
                    "pregunta": "¿Qué partícula del átomo tiene carga negativa ➖?",
                    "opciones": ["Protón", "Neutrón", "Electrón"],
                    "respuesta": "Electrón",
                    "pista": "Recuerda el truco: Protón = Positivo y Neutrón = Neutro.",
                    "explicacion": "El electrón es negativo y gira alrededor del núcleo.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Dónde viven los protones?",
                    "opciones": ["En el núcleo", "Alrededor del núcleo", "Fuera del átomo"],
                    "respuesta": "En el núcleo",
                    "pista": "Viven junto con los neutrones, en el centro.",
                    "explicacion": "Protones y neutrones viven en el núcleo, el centro del átomo.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "El número atómico es el número de…",
                    "opciones": ["Neutrones", "Protones", "Átomos"],
                    "respuesta": "Protones",
                    "pista": "Es lo que hace diferente a cada elemento.",
                    "explicacion": "El número atómico cuenta los protones.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuál símbolo está bien escrito?",
                    "opciones": ["MG", "Mg", "mg"],
                    "respuesta": "Mg",
                    "pista": "La primera letra mayúscula y la segunda minúscula.",
                    "explicacion": "Mg es el magnesio: M mayúscula y g minúscula.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuál es el símbolo del oro 🥇?",
                    "opciones": ["Or", "Au", "O", "Ag"],
                    "respuesta": "Au",
                    "pista": "Viene del latín «aurum».",
                    "explicacion": "El oro es Au, del latín aurum.",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "La tabla periódica",
            "resumen": "El gran mapa de todos los elementos y sus familias.",
            "teoria": [
                {
                    "emoji": "🗺️",
                    "titulo": "El mapa de los elementos",
                    "parrafos": [
                        "Todos los elementos conocidos están acomodados en la **tabla periódica**. ¡Hay 118!",
                        "Están ordenados por su número atómico: 1, 2, 3, 4… como los números de las casas de una calle 🏠.",
                        "La inventó un científico ruso llamado **Dmitri Mendeléiev** hace más de 150 años. ¡Hasta dejó lugares vacíos para elementos que todavía no se descubrían!",
                    ],
                    "tip": "El hidrógeno es el número 1, así que va primero, arriba a la izquierda.",
                    "actividad": {
                        "tipo": "verdadero_falso",
                        "instruccion": "¿Verdadero o falso?",
                        "afirmaciones": [
                            {"texto": "En la tabla periódica hay 118 elementos.", "respuesta": True, "explicacion": "¡Sí! Y algunos solo se han creado en laboratorios."},
                            {"texto": "Los elementos están en orden alfabético.", "respuesta": False, "explicacion": "Están en orden por su número atómico: 1, 2, 3…"},
                            {"texto": "El hidrógeno es el elemento número 1.", "respuesta": True, "explicacion": "Tiene 1 protón, así que es el primero."},
                        ],
                    },
                },
                {
                    "emoji": "↕️",
                    "titulo": "Filas y columnas",
                    "puntos": [
                        "Las **filas** (acostadas ↔️) se llaman **periodos**. Hay 7.",
                        "Las **columnas** (paradas ↕️) se llaman **grupos** o **familias**. Hay 18.",
                        "Los elementos de una misma columna se parecen mucho, ¡como hermanos de una familia! 👨‍👩‍👧",
                    ],
                    "tip": "Si quieres saber a quién se parece un elemento, busca en su misma columna.",
                    "actividad": {
                        "tipo": "descubre",
                        "instruccion": "Toca cada tarjeta para descubrir su nombre.",
                        "tarjetas": [
                            {"emoji": "↔️", "frente": "Las filas acostadas", "reverso": "Se llaman **periodos**. Hay 7."},
                            {"emoji": "↕️", "frente": "Las columnas paradas", "reverso": "Se llaman **grupos** o **familias**. Hay 18."},
                            {"emoji": "👨‍👩‍👧", "frente": "Elementos en la misma columna…", "reverso": "¡Se parecen, como una familia!"},
                        ],
                    },
                },
                {
                    "emoji": "👨‍👩‍👦",
                    "titulo": "Familias famosas",
                    "parrafos": [
                        "Algunas familias de la tabla tienen nombre propio. ¡Conócelas!",
                    ],
                    "puntos": [
                        "💥 **Metales alcalinos** (columna 1): el sodio y el potasio. Son tan inquietos que reaccionan con el agua.",
                        "🏊 **Halógenos** (columna 17): el cloro y el flúor. El cloro limpia el agua de las albercas.",
                        "😴 **Gases nobles** (columna 18): el helio y el neón. Son muy tranquilos: casi no reaccionan con nada. El helio infla globos 🎈.",
                    ],
                    "tip": "Los gases nobles son los «tranquilos» de la tabla. ¡Por eso el helio es seguro para los globos!",
                    "actividad": {
                        "tipo": "descubre",
                        "instruccion": "Toca cada tarjeta para conocer a la familia.",
                        "tarjetas": [
                            {"emoji": "💥", "frente": "Columna 1", "reverso": "**Metales alcalinos**: muy inquietos, ¡reaccionan con el agua!"},
                            {"emoji": "🏊", "frente": "Columna 17", "reverso": "**Halógenos**: como el cloro, que limpia las albercas."},
                            {"emoji": "😴", "frente": "Columna 18", "reverso": "**Gases nobles**: muy tranquilos, como el helio de los globos."},
                        ],
                    },
                },
                {
                    "emoji": "⚡",
                    "titulo": "Metales y no metales",
                    "parrafos": [
                        "Los **metales** están a la izquierda y en el centro de la tabla. Los **no metales** están a la derecha.",
                    ],
                    "tabla": {
                        "columnas": ["", "Metales", "No metales"],
                        "filas": [
                            ["¿Brillan?", "Sí ✨", "No"],
                            ["¿Llevan la electricidad?", "Sí ⚡", "Casi no"],
                            ["Ejemplos", "Hierro, cobre, oro", "Oxígeno, carbono, cloro"],
                        ],
                    },
                    "tip": "Los cables son de cobre porque los metales llevan muy bien la electricidad ⚡.",
                    "actividad": {
                        "tipo": "clasificar",
                        "instruccion": "¿Metal o no metal?",
                        "grupos": [
                            {"nombre": "Metal", "emoji": "🔩"},
                            {"nombre": "No metal", "emoji": "💨"},
                        ],
                        "elementos": [
                            {"texto": "Hierro", "emoji": "🔩", "grupo": "Metal"},
                            {"texto": "Oxígeno", "emoji": "💨", "grupo": "No metal"},
                            {"texto": "Oro", "emoji": "🥇", "grupo": "Metal"},
                            {"texto": "Carbono (punta del lápiz)", "emoji": "✏️", "grupo": "No metal"},
                            {"texto": "Cobre (cables)", "emoji": "🔌", "grupo": "Metal"},
                            {"texto": "Cloro", "emoji": "🏊", "grupo": "No metal"},
                        ],
                    },
                },
            ],
            "ejemplos": [
                {
                    "titulo": "¿Quién se parece al sodio?",
                    "enunciado": "El sodio está en la columna 1. ¿Quién se le parece más: el potasio (columna 1) o el cloro (columna 17)?",
                    "pasos": [
                        {"texto": "Los parecidos están en la misma columna.", "detalle": "Como los hermanos de una familia."},
                        {"texto": "El potasio también está en la columna 1.", "detalle": "Los dos son metales alcalinos e inquietos."},
                    ],
                    "resultado": "Se parece más el **potasio**.",
                    "tip": "¡Siempre busca en la misma columna!",
                },
                {
                    "titulo": "¿Reacciona el helio?",
                    "enunciado": "El helio está en la columna 18. ¿Crees que reacciona fácilmente?",
                    "pasos": [
                        {"texto": "La columna 18 es la familia de los gases nobles.", "detalle": "Es la última columna de la derecha."},
                        {"texto": "Los gases nobles son muy tranquilos.", "detalle": "Casi no reaccionan con nada."},
                    ],
                    "resultado": "**No**: el helio casi no reacciona. ¡Por eso se usa en los globos!",
                    "tip": "Saber la familia te ayuda a adivinar cómo se porta un elemento.",
                },
            ],
            "examen": [
                {
                    "tipo": "opcion",
                    "pregunta": "Las filas acostadas ↔️ de la tabla periódica se llaman…",
                    "opciones": ["Grupos", "Periodos", "Familias"],
                    "respuesta": "Periodos",
                    "pista": "Grupos y familias son las columnas.",
                    "explicacion": "Las filas son periodos y las columnas son grupos o familias.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Los elementos de la tabla están ordenados por…",
                    "opciones": ["Orden alfabético", "Su número atómico", "Su color"],
                    "respuesta": "Su número atómico",
                    "pista": "Como los números de las casas de una calle.",
                    "explicacion": "Van en orden por su número atómico: 1, 2, 3…",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuál de estos es un gas noble 😴?",
                    "opciones": ["Sodio", "Neón", "Hierro"],
                    "respuesta": "Neón",
                    "pista": "Los gases nobles están en la columna 18 y son muy tranquilos.",
                    "explicacion": "El neón es un gas noble, como el helio.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Qué pueden hacer los metales?",
                    "opciones": ["Llevar la electricidad", "Volar", "Desaparecer"],
                    "respuesta": "Llevar la electricidad",
                    "pista": "Piensa de qué están hechos los cables.",
                    "explicacion": "Los metales llevan la electricidad; por eso los cables son de cobre.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Quién se parece al flúor (columna 17)?",
                    "opciones": ["Oxígeno", "Sodio", "Cloro"],
                    "respuesta": "Cloro",
                    "pista": "Busca uno que esté en la misma columna.",
                    "explicacion": "El cloro también es un halógeno, de la columna 17.",
                },
            ],
        },
    ],
    "quimica-2": [
        # --------------------------------------------------------------
        {
            "titulo": "Moléculas: átomos de la mano",
            "resumen": "Cómo se juntan los átomos y cómo se leen las fórmulas.",
            "teoria": [
                {
                    "emoji": "🤝",
                    "titulo": "Átomos que se juntan",
                    "parrafos": [
                        "A los átomos les gusta estar acompañados. Cuando se juntan, forman una **molécula**.",
                        "El oxígeno que respiras no son átomos sueltos: son parejitas de dos átomos de oxígeno tomados de la mano. Se escribe O_2.",
                    ],
                    "tip": "Una molécula es un equipo de átomos que se tomaron de la mano.",
                    "actividad": {
                        "tipo": "construye",
                        "instruccion": "¡Arma las moléculas! Toca los átomos para agregarlos.",
                        "atomos": ["H", "O"],
                        "moleculas": [
                            {"formula": "H_2", "nombre": "Hidrógeno"},
                            {"formula": "O_2", "nombre": "Oxígeno (el que respiras)"},
                        ],
                    },
                },
                {
                    "emoji": "📝",
                    "titulo": "Cómo leer una fórmula",
                    "parrafos": [
                        "Una **fórmula** dice qué átomos tiene una molécula y cuántos.",
                        "El numerito pequeño de abajo (el **subíndice**) dice cuántos átomos hay del elemento que está **justo antes**. Si no hay numerito, hay 1.",
                    ],
                    "tabla": {
                        "columnas": ["Fórmula", "Nombre", "¿Qué tiene?"],
                        "filas": [
                            ["H_2O", "Agua 💧", "2 H y 1 O"],
                            ["CO_2", "Dióxido de carbono 😮‍💨", "1 C y 2 O"],
                            ["CH_4", "Metano, el gas de la estufa 🔥", "1 C y 4 H"],
                        ],
                    },
                    "ejemplo": "El dióxido de carbono (CO_2) es lo que sale de tu boca cuando exhalas.",
                    "tip": "El numerito pequeño solo cuenta al átomo que tiene justo a su izquierda.",
                    "actividad": {
                        "tipo": "construye",
                        "instruccion": "Lee la fórmula y arma la molécula con los átomos correctos.",
                        "atomos": ["H", "O", "C"],
                        "moleculas": [
                            {"formula": "H_2O", "nombre": "Agua"},
                            {"formula": "CO_2", "nombre": "Dióxido de carbono"},
                            {"formula": "CH_4", "nombre": "Metano"},
                        ],
                    },
                },
                {
                    "emoji": "🧩",
                    "titulo": "Elementos y compuestos",
                    "parrafos": [
                        "Si una sustancia tiene **un solo tipo** de átomo, es un **elemento** (como O_2 o Fe).",
                        "Si tiene **dos o más tipos distintos** de átomos, es un **compuesto** (como H_2O o CO_2).",
                        "¡Un compuesto puede ser muy diferente a sus ingredientes! El sodio es un metal peligroso y el cloro es un gas venenoso… pero juntos forman la sal de cocina 🧂 (NaCl).",
                    ],
                    "tip": "Cuenta las letras mayúsculas distintas: si hay una sola, es elemento; si hay dos o más, es compuesto.",
                    "actividad": {
                        "tipo": "clasificar",
                        "instruccion": "¿Elemento o compuesto?",
                        "grupos": [
                            {"nombre": "Elemento", "emoji": "🔵"},
                            {"nombre": "Compuesto", "emoji": "🧩"},
                        ],
                        "elementos": [
                            {"texto": "O_2", "grupo": "Elemento"},
                            {"texto": "H_2O", "grupo": "Compuesto"},
                            {"texto": "Fe", "grupo": "Elemento"},
                            {"texto": "CO_2", "grupo": "Compuesto"},
                            {"texto": "NaCl", "grupo": "Compuesto"},
                            {"texto": "N_2", "grupo": "Elemento"},
                        ],
                    },
                },
                {
                    "emoji": "✖️",
                    "titulo": "Muchas moléculas",
                    "parrafos": [
                        "El número **grande** que va adelante dice **cuántas moléculas** hay. 3H_2O son tres moléculas de agua 💧💧💧.",
                        "Para contar los átomos, multiplica: en 3H_2O hay 3 × 2 = 6 hidrógenos.",
                    ],
                    "tip": "Número grande de adelante = cuántas moléculas. Numerito pequeño de abajo = cuántos átomos en cada una.",
                    "actividad": {
                        "tipo": "verdadero_falso",
                        "instruccion": "¿Verdadero o falso?",
                        "afirmaciones": [
                            {"texto": "2O_2 son dos moléculas de oxígeno.", "respuesta": True, "explicacion": "El 2 grande dice que hay dos moléculas."},
                            {"texto": "En 2H_2O hay 2 hidrógenos.", "respuesta": False, "explicacion": "Hay 2 moléculas con 2 hidrógenos cada una: 2 × 2 = 4."},
                            {"texto": "En una molécula de H_2O hay 3 átomos.", "respuesta": True, "explicacion": "2 hidrógenos + 1 oxígeno = 3 átomos."},
                        ],
                    },
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Cuenta los átomos del amoníaco",
                    "enunciado": "¿Cuántos átomos tiene una molécula de amoníaco, NH_3?",
                    "pasos": [
                        {"texto": "N no tiene numerito: hay 1 nitrógeno.", "detalle": "Sin numerito significa 1."},
                        {"texto": "H_3 tiene un 3: hay 3 hidrógenos.", "detalle": "El 3 está justo después de la H."},
                        {"texto": "Suma: 1 + 3 = 4 átomos.", "detalle": "Juntamos todos los átomos de la molécula."},
                    ],
                    "resultado": "El NH_3 tiene **4 átomos**.",
                    "tip": "El amoníaco se usa en algunos productos de limpieza.",
                },
                {
                    "titulo": "Varias moléculas",
                    "enunciado": "¿Cuántos átomos de oxígeno hay en 2CO_2?",
                    "pasos": [
                        {"texto": "Una molécula de CO_2 tiene 2 oxígenos.", "detalle": "El numerito 2 está junto a la O."},
                        {"texto": "El 2 grande dice que hay 2 moléculas.", "detalle": "Es como tener dos paquetes iguales."},
                        {"texto": "Multiplica: 2 × 2 = 4 oxígenos.", "detalle": "2 moléculas con 2 oxígenos cada una."},
                    ],
                    "resultado": "Hay **4 átomos de oxígeno**.",
                    "tip": "Primero cuenta una molécula y luego multiplica por el número grande.",
                },
            ],
            "examen": [
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuántos átomos de hidrógeno hay en una molécula de NH_3?",
                    "respuesta": 3,
                    "pista": "Mira el numerito que está junto a la H.",
                    "explicacion": "El 3 está junto a la H: hay 3 hidrógenos.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuántos átomos hay en total en una molécula de CO_2?",
                    "respuesta": 3,
                    "pista": "Suma el carbono y los oxígenos.",
                    "explicacion": "1 carbono + 2 oxígenos = 3 átomos.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuál de estos es un compuesto?",
                    "opciones": ["O_2", "H_2O", "Fe"],
                    "respuesta": "H_2O",
                    "pista": "Busca el que tenga dos tipos distintos de átomos.",
                    "explicacion": "El agua tiene hidrógeno y oxígeno: dos tipos de átomos.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuántos átomos de hidrógeno hay en 2H_2O?",
                    "respuesta": 4,
                    "pista": "Cada molécula tiene 2 hidrógenos y hay 2 moléculas.",
                    "explicacion": "2 × 2 = 4 hidrógenos.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Qué te dice el numerito pequeño de abajo en una fórmula?",
                    "opciones": ["Cuántas moléculas hay", "Cuántos átomos hay de ese elemento", "Qué tan grande es el átomo"],
                    "respuesta": "Cuántos átomos hay de ese elemento",
                    "pista": "En H_2O, el 2 es de la H.",
                    "explicacion": "El subíndice dice cuántos átomos hay del elemento que tiene a su izquierda.",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "Cambios físicos y químicos",
            "resumen": "¿Cuándo algo solo cambia de forma y cuándo se convierte en algo nuevo?",
            "teoria": [
                {
                    "emoji": "✂️",
                    "titulo": "Cambios físicos",
                    "parrafos": [
                        "En un **cambio físico** algo cambia de forma, de tamaño o de estado… ¡pero sigue siendo lo mismo!",
                    ],
                    "puntos": [
                        "✂️ Recortar una hoja: sigue siendo papel.",
                        "🍦 Derretir un helado: sigue siendo helado, aunque líquido.",
                        "🥤 Disolver azúcar en agua: el azúcar sigue ahí, por eso el agua sabe dulce.",
                    ],
                    "tip": "Si al final sigues teniendo lo mismo, aunque se vea distinto, es un cambio físico.",
                    "actividad": {
                        "tipo": "verdadero_falso",
                        "instruccion": "¿Verdadero o falso?",
                        "afirmaciones": [
                            {"texto": "Si rompes un vaso, sigue siendo vidrio.", "respuesta": True, "explicacion": "Solo cambió de forma: es un cambio físico."},
                            {"texto": "Cuando el agua se congela, se convierte en otra sustancia.", "respuesta": False, "explicacion": "El hielo sigue siendo agua. Es un cambio físico."},
                        ],
                    },
                },
                {
                    "emoji": "🔥",
                    "titulo": "Cambios químicos",
                    "parrafos": [
                        "En un **cambio químico** se forma algo **nuevo y diferente**. Los átomos se reacomodan, como las piezas de un rompecabezas que arman una figura nueva 🧩.",
                        "A un cambio químico también se le llama **reacción química**.",
                    ],
                    "puntos": [
                        "🔥 Quemar papel: queda ceniza, que ya no es papel.",
                        "🎂 Hornear un pastel: la masa se convierte en pan esponjoso.",
                        "🍎 Una manzana mordida se pone café.",
                        "🔩 Un clavo se oxida.",
                    ],
                    "tip": "Pregunta mágica: ¿apareció algo nuevo? Si sí, ¡es un cambio químico!",
                    "actividad": {
                        "tipo": "clasificar",
                        "instruccion": "¿Cambio físico o cambio químico?",
                        "grupos": [
                            {"nombre": "Físico", "emoji": "✂️"},
                            {"nombre": "Químico", "emoji": "🔥"},
                        ],
                        "elementos": [
                            {"texto": "Recortar papel", "emoji": "✂️", "grupo": "Físico"},
                            {"texto": "Quemar papel", "emoji": "🔥", "grupo": "Químico"},
                            {"texto": "Derretir un helado", "emoji": "🍦", "grupo": "Físico"},
                            {"texto": "Hornear un pastel", "emoji": "🎂", "grupo": "Químico"},
                            {"texto": "Manzana que se pone café", "emoji": "🍎", "grupo": "Químico"},
                            {"texto": "Inflar un globo", "emoji": "🎈", "grupo": "Físico"},
                        ],
                    },
                },
                {
                    "emoji": "🕵️",
                    "titulo": "Pistas de un cambio químico",
                    "parrafos": [
                        "No podemos ver los átomos, pero como buenos detectives 🔍 podemos buscar **pistas** de que hubo un cambio químico:",
                    ],
                    "puntos": [
                        "🎨 Cambia el color.",
                        "🫧 Salen burbujas de un gas nuevo.",
                        "💡 Sale luz o calor.",
                        "👃 Aparece un olor nuevo.",
                    ],
                    "ejemplo": "¡Cuidado! Al hervir agua salen burbujas, pero son de agua en forma de vapor. Sigue siendo agua: es un cambio físico.",
                    "tip": "Las pistas ayudan, pero confirma siempre: ¿se formó algo nuevo?",
                    "actividad": {
                        "tipo": "descubre",
                        "instruccion": "Toca cada caso para descubrir la pista.",
                        "tarjetas": [
                            {"emoji": "🍎", "frente": "La manzana se puso café", "reverso": "Pista: **cambio de color** 🎨"},
                            {"emoji": "🫧", "frente": "Bicarbonato con vinagre", "reverso": "Pista: **burbujas** de un gas nuevo"},
                            {"emoji": "🕯️", "frente": "Una vela encendida", "reverso": "Pista: sale **luz y calor** 💡"},
                            {"emoji": "🥛", "frente": "Leche echada a perder", "reverso": "Pista: **olor nuevo** 👃"},
                        ],
                    },
                },
                {
                    "emoji": "⚖️",
                    "titulo": "Nada se pierde",
                    "parrafos": [
                        "En un cambio químico los átomos **no desaparecen**: solo se reacomodan.",
                        "Por eso, si nada se escapa, todo **pesa lo mismo** antes y después. Lo descubrió el científico Antoine Lavoisier.",
                    ],
                    "ejemplo": "Si en un frasco cerrado mezclas 10 g de bicarbonato con 50 g de vinagre, al final sigue habiendo 60 g. ¡Nada se perdió!",
                    "tip": "«Nada se crea, nada se pierde, todo se transforma».",
                    "actividad": {
                        "tipo": "verdadero_falso",
                        "instruccion": "¿Verdadero o falso?",
                        "afirmaciones": [
                            {"texto": "En un cambio químico los átomos desaparecen.", "respuesta": False, "explicacion": "Los átomos solo se reacomodan; ¡ninguno desaparece!"},
                            {"texto": "En un frasco cerrado, todo pesa lo mismo antes y después de la reacción.", "respuesta": True, "explicacion": "Como nada se escapa, el peso total no cambia."},
                        ],
                    },
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Hornear un pastel",
                    "enunciado": "Cuando horneas un pastel 🎂, ¿es un cambio físico o químico?",
                    "pasos": [
                        {"texto": "Antes: masa líquida y pegajosa.", "detalle": "Harina, huevo, leche y azúcar mezclados."},
                        {"texto": "Después: un pan esponjoso, dorado y con olor rico.", "detalle": "Cambió el color y apareció un olor nuevo: ¡son pistas!"},
                        {"texto": "Se formó algo nuevo y no puedes volver a tener la masa.", "detalle": "Eso es lo que pasa en un cambio químico."},
                    ],
                    "resultado": "Es un **cambio químico** 🔥.",
                    "tip": "La cocina está llena de química. ¡Cocinar es hacer reacciones!",
                },
                {
                    "titulo": "Burbujas que engañan",
                    "enunciado": "Al hervir agua salen muchas burbujas. ¿Es un cambio químico?",
                    "pasos": [
                        {"texto": "Las burbujas son una pista… pero hay que confirmar.", "detalle": "Un buen detective no se queda con la primera pista."},
                        {"texto": "Esas burbujas son de vapor de agua.", "detalle": "Es agua que pasó de líquido a gas."},
                        {"texto": "No se formó nada nuevo: sigue siendo agua.", "detalle": "Solo cambió de estado."},
                    ],
                    "resultado": "Es un **cambio físico** ✂️.",
                    "tip": "En cambio, las burbujas del bicarbonato con vinagre sí son de un gas nuevo: eso sí es químico.",
                },
            ],
            "examen": [
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuál de estos es un cambio químico?",
                    "opciones": ["Derretir mantequilla", "Recortar papel", "Quemar madera"],
                    "respuesta": "Quemar madera",
                    "pista": "¿En cuál aparece algo nuevo?",
                    "explicacion": "Al quemarse, la madera se convierte en ceniza y humo: algo nuevo.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuál de estos es un cambio físico?",
                    "opciones": ["Freír un huevo", "Inflar un globo", "Oxidar un clavo"],
                    "respuesta": "Inflar un globo",
                    "pista": "¿En cuál todo sigue siendo lo mismo?",
                    "explicacion": "El globo solo cambia de tamaño: sigue siendo el mismo globo.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuál es una pista de un cambio químico?",
                    "opciones": ["Cambio de tamaño", "Cambio de color", "Cambio de lugar"],
                    "respuesta": "Cambio de color",
                    "pista": "Piensa en la manzana que se pone café.",
                    "explicacion": "Un color nuevo puede indicar que se formó algo nuevo.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "En un frasco cerrado mezclas 12 g de una sustancia con 8 g de otra. ¿Cuántos gramos hay al final?",
                    "unidad": "g",
                    "respuesta": 20,
                    "pista": "Nada se pierde: suma lo que había al principio.",
                    "explicacion": "12 g + 8 g = 20 g. ¡Nada se perdió!",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "En un cambio químico, los átomos…",
                    "opciones": ["Desaparecen", "Se reacomodan", "Se hacen más grandes"],
                    "respuesta": "Se reacomodan",
                    "pista": "Como las piezas de un rompecabezas.",
                    "explicacion": "Los átomos no desaparecen: se reacomodan y forman algo nuevo.",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "Ecuaciones: recetas de la química",
            "resumen": "Aprende a leer una reacción y a dejarla pareja como una balanza.",
            "teoria": [
                {
                    "emoji": "👩‍🍳",
                    "titulo": "Una receta química",
                    "parrafos": [
                        "Una **ecuación química** es como una receta de cocina: dice qué ingredientes se usan y qué se obtiene.",
                        "Los ingredientes se llaman **reactivos** y van a la **izquierda**. Lo que se obtiene se llama **productos** y va a la **derecha**. La flecha → se lee «produce».",
                    ],
                    "ejemplo": "2H_2 + O_2 → 2H_2O: el hidrógeno y el oxígeno producen agua 💧.",
                    "tip": "Ingredientes a la izquierda, resultado a la derecha. ¡Como una receta!",
                    "actividad": {
                        "tipo": "clasificar",
                        "instruccion": "En la receta Zn + 2HCl → ZnCl_2 + H_2, ¿quién es reactivo y quién es producto?",
                        "grupos": [
                            {"nombre": "Reactivo", "emoji": "🥚"},
                            {"nombre": "Producto", "emoji": "🎂"},
                        ],
                        "elementos": [
                            {"texto": "Zn", "grupo": "Reactivo"},
                            {"texto": "HCl", "grupo": "Reactivo"},
                            {"texto": "ZnCl_2", "grupo": "Producto"},
                            {"texto": "H_2", "grupo": "Producto"},
                        ],
                    },
                },
                {
                    "emoji": "⚖️",
                    "titulo": "Una balanza pareja",
                    "parrafos": [
                        "Como los átomos no desaparecen, debe haber **los mismos átomos de cada lado** de la flecha. Es como una balanza ⚖️ que tiene que quedar pareja.",
                        "Cuando eso pasa, decimos que la ecuación está **balanceada**.",
                    ],
                    "tabla": {
                        "columnas": ["Átomo", "Izquierda (2H_2 + O_2)", "Derecha (2H_2O)"],
                        "filas": [
                            ["H", "4", "4 ✅"],
                            ["O", "2", "2 ✅"],
                        ],
                    },
                    "tip": "Cuenta cada tipo de átomo de los dos lados. Si todo empata, ¡está balanceada!",
                    "actividad": {
                        "tipo": "verdadero_falso",
                        "instruccion": "¿Está balanceada? Cuenta los átomos de cada lado.",
                        "afirmaciones": [
                            {"texto": "H_2 + Cl_2 → 2HCl está balanceada.", "respuesta": True, "explicacion": "Hay 2 H y 2 Cl de cada lado."},
                            {"texto": "H_2 + O_2 → H_2O está balanceada.", "respuesta": False, "explicacion": "Hay 2 O a la izquierda, pero solo 1 a la derecha."},
                            {"texto": "2Na + Cl_2 → 2NaCl está balanceada.", "respuesta": True, "explicacion": "Hay 2 Na y 2 Cl de cada lado."},
                        ],
                    },
                },
                {
                    "emoji": "🎯",
                    "titulo": "¡A balancear!",
                    "parrafos": [
                        "Para balancear solo puedes cambiar los **números grandes de adelante**. ¡Nunca los numeritos pequeños! Si cambias H_2O por H_2O_2, ya no sería agua.",
                    ],
                    "puntos": [
                        "1. Cuenta los átomos de cada lado.",
                        "2. Si un átomo no está parejo, pon un número grande adelante.",
                        "3. Vuelve a contar todo. ¡Repite hasta que todo empate!",
                    ],
                    "tip": "Ve poco a poco: arregla un átomo, vuelve a contar y sigue con el siguiente.",
                    "actividad": {
                        "tipo": "balanza",
                        "instruccion": "Usa los botones + y − hasta que la balanza quede pareja.",
                        "ecuaciones": [
                            {"ecuacion": "H_2 + O_2 -> H_2O", "respuesta": [2, 1, 2]},
                            {"ecuacion": "Na + Cl_2 -> NaCl", "respuesta": [2, 1, 2]},
                        ],
                    },
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Formación de agua",
                    "enunciado": "Balancea: H_2 + O_2 → H_2O",
                    "pasos": [
                        {"texto": "Cuenta: hay 2 O a la izquierda y 1 O a la derecha.", "detalle": "El oxígeno no está parejo."},
                        {"texto": "Pon un 2 delante del agua: 2H_2O. Ahora hay 2 O de cada lado.", "detalle": "¡Pero ahora hay 4 H a la derecha!"},
                        {"texto": "Pon un 2 delante del H_2: 2H_2. Ahora hay 4 H de cada lado.", "detalle": "Vuelve a contar todo para revisar."},
                    ],
                    "resultado": "**2H_2 + O_2 → 2H_2O** ⚖️",
                    "tip": "Si no hay número adelante, vale 1.",
                },
                {
                    "titulo": "Sal de cocina",
                    "enunciado": "Balancea: Na + Cl_2 → NaCl",
                    "pasos": [
                        {"texto": "Hay 2 Cl a la izquierda y 1 a la derecha → pon 2NaCl.", "detalle": "Ahora hay 2 Cl de cada lado."},
                        {"texto": "Ahora hay 2 Na a la derecha → pon 2Na a la izquierda.", "detalle": "¡Todo empató!"},
                    ],
                    "resultado": "**2Na + Cl_2 → 2NaCl** 🧂",
                    "tip": "Así se forma la sal que le pones a la comida.",
                },
            ],
            "examen": [
                {
                    "tipo": "opcion",
                    "pregunta": "En Zn + 2HCl → ZnCl_2 + H_2, ¿cuáles son los reactivos (los ingredientes)?",
                    "opciones": ["Zn y HCl", "ZnCl_2 y H_2", "Solo H_2"],
                    "respuesta": "Zn y HCl",
                    "pista": "Los ingredientes van a la izquierda de la flecha.",
                    "explicacion": "Los reactivos están a la izquierda: Zn y HCl.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Para balancear una ecuación puedes cambiar…",
                    "opciones": ["Los numeritos pequeños", "Los números grandes de adelante", "Las letras"],
                    "respuesta": "Los números grandes de adelante",
                    "pista": "Si cambias los numeritos pequeños, cambias la sustancia.",
                    "explicacion": "Solo se cambian los números grandes de adelante (coeficientes).",
                },
                {
                    "tipo": "coeficientes",
                    "pregunta": "Balancea la ecuación.",
                    "ecuacion": "Mg + O_2 -> MgO",
                    "respuesta": [2, 1, 2],
                    "pista": "Primero empareja los oxígenos: hay 2 a la izquierda.",
                    "explicacion": "2Mg + O_2 → 2MgO: 2 Mg y 2 O de cada lado.",
                },
                {
                    "tipo": "coeficientes",
                    "pregunta": "Balancea la ecuación.",
                    "ecuacion": "H_2 + Cl_2 -> HCl",
                    "respuesta": [1, 1, 2],
                    "pista": "Hay 2 Cl a la izquierda y solo 1 a la derecha.",
                    "explicacion": "H_2 + Cl_2 → 2HCl: 2 H y 2 Cl de cada lado.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuál ecuación está balanceada?",
                    "opciones": ["H_2 + O_2 → H_2O", "2H_2 + O_2 → 2H_2O", "H_2 + O_2 → 2H_2O"],
                    "respuesta": "2H_2 + O_2 → 2H_2O",
                    "pista": "Cuenta los H y los O de cada lado en cada opción.",
                    "explicacion": "4 H y 2 O de cada lado.",
                },
            ],
        },
    ],
}
