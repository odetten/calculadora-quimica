"""Lecciones del nivel prepa (formato descrito en lessons/__init__.py)."""

_TIPOS = ["Síntesis", "Descomposición", "Sustitución simple", "Doble sustitución", "Combustión"]

LECCIONES = {
    "quimica-1": [
        # --------------------------------------------------------------
        {
            "titulo": "Estructura atómica",
            "resumen": "Modelos atómicos, partículas subatómicas, número atómico y de masa, isótopos e iones.",
            "teoria": [
                {
                    "titulo": "Cómo llegamos al modelo actual",
                    "parrafos": [
                        "Nadie ha «visto» un átomo como vemos una pelota. Lo que sabemos se fue construyendo con experimentos, y cada uno mejoró el **modelo atómico** anterior.",
                        "**Thomson** descubrió el electrón con rayos catódicos. **Rutherford** disparó partículas alfa contra una lámina de oro muy delgada: casi todas pasaban, pero unas pocas rebotaban. Concluyó que el átomo es casi todo espacio vacío con un **núcleo** pequeño, denso y positivo.",
                        "**Bohr** propuso que los electrones solo pueden estar en ciertos **niveles de energía**. Hoy usamos el **modelo cuántico**, que describe zonas de probabilidad llamadas **orbitales**.",
                    ],
                    "tabla": {
                        "columnas": ["Modelo", "Año", "Idea principal"],
                        "filas": [
                            ["Dalton", "1808", "Esferas sólidas e indivisibles"],
                            ["Thomson", "1904", "Esfera positiva con electrones incrustados («pudín con pasas»)"],
                            ["Rutherford", "1911", "Núcleo pequeño y positivo; electrones alrededor"],
                            ["Bohr", "1913", "Electrones en niveles de energía fijos"],
                            ["Cuántico", "1926", "Electrones en orbitales (zonas de probabilidad)"],
                        ],
                    },
                    "tip": "Cada modelo no «borró» al anterior: lo corrigió con nueva evidencia. Así funciona la ciencia.",
                },
                {
                    "titulo": "Partículas subatómicas",
                    "parrafos": [
                        "El átomo está formado por tres partículas principales. Dos viven en el **núcleo** (protones y neutrones, llamados juntos **nucleones**) y una en la **nube electrónica** (los electrones).",
                        "El **protón** tiene carga +1 y una masa de aproximadamente 1 u. Su número define qué elemento es el átomo. Fue identificado por Rutherford en 1919.",
                        "El **neutrón** no tiene carga y su masa es casi igual a la del protón. Ayuda a mantener unido el núcleo: sin neutrones, los protones (todos positivos) se repelerían. Lo descubrió Chadwick en 1932.",
                        "El **electrón** tiene carga −1 y una masa unas **1836 veces menor** que la del protón, prácticamente despreciable. Los electrones son los que participan en las reacciones químicas y en los enlaces. Lo descubrió Thomson en 1897.",
                        "La **unidad de masa atómica (u)** es 1/12 de la masa de un átomo de carbono-12. Equivale a 1.66 × 10^-24 g, una cantidad diminuta.",
                    ],
                    "tabla": {
                        "columnas": ["Partícula", "Símbolo", "Carga", "Masa (u)", "Ubicación", "Descubridor"],
                        "filas": [
                            ["Protón", "p^+", "+1", "1.007", "Núcleo", "Rutherford (1919)"],
                            ["Neutrón", "n^0", "0", "1.009", "Núcleo", "Chadwick (1932)"],
                            ["Electrón", "e^-", "−1", "0.00055", "Nube electrónica", "Thomson (1897)"],
                        ],
                    },
                    "puntos": [
                        "El núcleo concentra más del **99.9 % de la masa** del átomo.",
                        "Pero es diminuto: su diámetro es unas **100 000 veces menor** que el del átomo completo.",
                        "Las cargas del protón y del electrón son iguales en tamaño y opuestas en signo; por eso un átomo con igual número de ambos es **neutro**.",
                    ],
                    "tip": "En química, los protones dicen QUÉ elemento es, los neutrones afectan su MASA y los electrones deciden cómo REACCIONA.",
                },
                {
                    "titulo": "Número atómico (Z) y número de masa (A)",
                    "parrafos": [
                        "El **número atómico Z** es el número de protones. El **número de masa A** es la suma de protones y neutrones (los electrones casi no pesan, así que no se cuentan).",
                        "De ahí sale una fórmula muy útil: **neutrones = A − Z**.",
                        "Se escribe así: ^A_ZX, con A arriba a la izquierda y Z abajo a la izquierda del símbolo. Por ejemplo, ^35_17Cl es un cloro con 17 protones y 35 − 17 = 18 neutrones. Muchas veces se omite Z (porque el símbolo ya lo indica) y se escribe ^35Cl o «cloro-35».",
                    ],
                    "tabla": {
                        "columnas": ["Átomo", "Z (protones)", "A", "Neutrones (A − Z)"],
                        "filas": [
                            ["^12C", "6", "12", "6"],
                            ["^16O", "8", "16", "8"],
                            ["^23Na", "11", "23", "12"],
                            ["^56Fe", "26", "56", "30"],
                        ],
                    },
                    "tip": "A es el número grande (masa) y Z el pequeño (protones). Neutrones = grande − pequeño.",
                },
                {
                    "titulo": "Isótopos",
                    "parrafos": [
                        "Los **isótopos** son átomos del mismo elemento (mismo Z) con **distinto número de neutrones** (distinto A).",
                        "Como tienen los mismos protones y electrones, los isótopos de un elemento tienen **las mismas propiedades químicas**; solo cambian su masa y su estabilidad.",
                        "La **masa atómica** que aparece en la tabla periódica es un **promedio ponderado** de los isótopos naturales, según su abundancia. Por eso el cloro tiene una masa de 35.45 y no un número entero.",
                    ],
                    "tabla": {
                        "columnas": ["Isótopo del H", "Protones", "Neutrones", "Nombre"],
                        "filas": [
                            ["^1H", "1", "0", "Protio (el más común)"],
                            ["^2H", "1", "1", "Deuterio"],
                            ["^3H", "1", "2", "Tritio (radiactivo)"],
                        ],
                    },
                    "ejemplo": "El carbono-14 (^14C) es radiactivo y se desintegra lentamente. Midiendo cuánto queda en un fósil se calcula su edad: es la datación por radiocarbono.",
                    "tip": "Isótopo = mismo elemento, diferente masa. Mismo Z, diferente A.",
                },
                {
                    "titulo": "Iones",
                    "parrafos": [
                        "Un **ion** es un átomo (o grupo de átomos) que **ganó o perdió electrones**, así que ya no es neutro.",
                        "En las reacciones químicas **solo cambian los electrones**; los protones nunca cambian (si cambiaran, sería otro elemento).",
                        "Los metales tienden a **perder** electrones y formar cationes. Los no metales tienden a **ganar** electrones y formar aniones.",
                    ],
                    "tabla": {
                        "columnas": ["Tipo", "Carga", "Qué pasó", "Ejemplos"],
                        "filas": [
                            ["Catión", "Positiva (+)", "Perdió electrones", "Na^+, Mg^2+, Al^3+"],
                            ["Anión", "Negativa (−)", "Ganó electrones", "Cl^-, O^2-, S^2-"],
                        ],
                    },
                    "puntos": ["**Electrones de un ion = Z − carga.** Para Mg^2+: 12 − 2 = 10. Para O^2-: 8 − (−2) = 10."],
                    "tip": "Parece al revés, pero es lógico: perder electrones (negativos) deja al átomo MÁS positivo.",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Partículas de un isótopo",
                    "enunciado": "¿Cuántos protones, neutrones y electrones tiene un átomo neutro de ^35Cl (Z = 17)?",
                    "datos": ["A = 35", "Z = 17", "Átomo neutro"],
                    "pasos": [
                        {"texto": "Protones = Z = 17.", "detalle": "Z siempre es el número de protones, sin importar el isótopo."},
                        {"texto": "Neutrones = A − Z = 35 − 17 = 18.", "detalle": "A cuenta protones + neutrones; al restar los protones quedan los neutrones."},
                        {"texto": "Electrones = 17, porque es neutro.", "detalle": "En un átomo neutro, electrones = protones."},
                    ],
                    "resultado": "**17 protones, 18 neutrones y 17 electrones.**",
                    "tip": "Error común: confundir A con el número de neutrones. ¡A incluye también a los protones!",
                },
                {
                    "titulo": "Electrones de un catión",
                    "enunciado": "¿Cuántos electrones tiene el ion Mg^2+ (Z = 12)?",
                    "datos": ["Z = 12", "Carga = +2"],
                    "pasos": [
                        {"texto": "El átomo neutro de Mg tiene 12 electrones.", "detalle": "Neutro: electrones = Z."},
                        {"texto": "La carga +2 indica que perdió 2 electrones.", "detalle": "Al perder 2 cargas negativas, sobran 2 positivas."},
                        {"texto": "Electrones = Z − carga = 12 − 2 = 10.", "detalle": "Los protones siguen siendo 12; solo cambian los electrones."},
                    ],
                    "resultado": "**10 electrones** (y sigue teniendo 12 protones).",
                    "tip": "Comprueba la carga: 12 protones (+12) y 10 electrones (−10) dan +2. ✔",
                },
                {
                    "titulo": "Electrones de un anión",
                    "enunciado": "¿Cuántos electrones tiene el ion O^2- (Z = 8)?",
                    "pasos": [
                        {"texto": "El átomo neutro de O tiene 8 electrones.", "detalle": "Neutro: electrones = Z = 8."},
                        {"texto": "La carga −2 indica que ganó 2 electrones.", "detalle": "Ganar cargas negativas hace al átomo negativo."},
                        {"texto": "Electrones = 8 − (−2) = 8 + 2 = 10.", "detalle": "Restar una carga negativa equivale a sumar."},
                    ],
                    "resultado": "**10 electrones.**",
                    "tip": "Mg^2+ y O^2- tienen 10 electrones, igual que el neón. ¡Ambos quedaron con la configuración de un gas noble!",
                },
                {
                    "titulo": "Masa atómica promedio",
                    "enunciado": "El cloro natural tiene 75.8 % de ^35Cl y 24.2 % de ^37Cl. ¿Cuál es su masa atómica promedio?",
                    "datos": ["^35Cl: 75.8 % (0.758)", "^37Cl: 24.2 % (0.242)"],
                    "pasos": [
                        {"texto": "Convierte los porcentajes a decimales: 0.758 y 0.242.", "detalle": "Divide cada porcentaje entre 100. Comprueba que suman 1."},
                        {"texto": "Multiplica cada masa por su abundancia: 35 × 0.758 = 26.53 y 37 × 0.242 = 8.95.", "detalle": "Cada isótopo aporta según qué tan común es."},
                        {"texto": "Suma: 26.53 + 8.95 = 35.48.", "detalle": "El resultado queda más cerca de 35 porque ese isótopo es el más abundante."},
                    ],
                    "resultado": "Masa atómica ≈ **35.5 u**, como en la tabla periódica.",
                    "tip": "Un promedio ponderado siempre queda más cerca del isótopo más abundante.",
                },
            ],
            "examen": [
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuántos neutrones tiene un átomo de ^56Fe (Z = 26)?",
                    "respuesta": 30,
                    "pista": "Neutrones = A − Z.",
                    "explicacion": "n = A − Z = 56 − 26 = 30.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuántos electrones tiene el ion Al^3+ (Z = 13)?",
                    "respuesta": 10,
                    "pista": "Una carga positiva significa que perdió electrones.",
                    "explicacion": "Perdió 3 electrones: 13 − 3 = 10.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuántos electrones tiene el ion Cl^- (Z = 17)?",
                    "respuesta": 18,
                    "pista": "Una carga negativa significa que ganó electrones.",
                    "explicacion": "Ganó 1 electrón: 17 + 1 = 18.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Los isótopos de un mismo elemento tienen distinto número de…",
                    "opciones": ["Protones", "Neutrones", "Electrones (en el átomo neutro)", "Carga nuclear"],
                    "respuesta": "Neutrones",
                    "pista": "Si cambiaran los protones, ¿seguiría siendo el mismo elemento?",
                    "explicacion": "Mismo Z (protones), distinto A: cambia el número de neutrones.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Un catión se forma cuando un átomo…",
                    "opciones": ["Gana electrones", "Gana protones", "Pierde electrones", "Pierde neutrones"],
                    "respuesta": "Pierde electrones",
                    "pista": "Un catión es positivo. ¿Qué tiene que pasar con las cargas negativas?",
                    "explicacion": "Al perder electrones (negativos) queda más carga positiva.",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "Configuración electrónica",
            "resumen": "Orbitales, niveles, el orden de llenado y los electrones de valencia.",
            "teoria": [
                {
                    "titulo": "Orbitales: dónde están los electrones",
                    "parrafos": [
                        "En el modelo cuántico no se puede saber la trayectoria exacta de un electrón. En lugar de órbitas, hablamos de **orbitales**: regiones alrededor del núcleo donde es muy probable encontrar un electrón.",
                        "Cada orbital puede tener **como máximo 2 electrones**, y deben tener espín opuesto (como dos imanes en sentidos contrarios). Esto se conoce como **principio de exclusión de Pauli**.",
                    ],
                    "tip": "Piensa en los orbitales como habitaciones con dos camas: nunca caben más de 2 electrones por orbital.",
                },
                {
                    "titulo": "Niveles y subniveles",
                    "parrafos": [
                        "Los orbitales se organizan en **niveles de energía** (n = 1, 2, 3…), como los pisos de un edificio. Cuanto más alto el nivel, más lejos del núcleo y más energía.",
                        "Cada nivel tiene **subniveles** identificados con letras: s, p, d y f. El nivel n tiene n subniveles: el nivel 1 solo tiene s; el 2 tiene s y p; el 3 tiene s, p y d; el 4 tiene s, p, d y f.",
                    ],
                    "tabla": {
                        "columnas": ["Subnivel", "Orbitales", "Máximo de electrones"],
                        "filas": [
                            ["s", "1", "2"],
                            ["p", "3", "6"],
                            ["d", "5", "10"],
                            ["f", "7", "14"],
                        ],
                    },
                    "puntos": ["Cada nivel n puede tener como máximo **2n^2** electrones: 2 en el nivel 1, 8 en el 2, 18 en el 3."],
                    "tip": "Memoriza 2-6-10-14: es la capacidad de s, p, d y f.",
                },
                {
                    "titulo": "Orden de llenado (principio de Aufbau)",
                    "parrafos": [
                        "Los electrones ocupan primero los subniveles de **menor energía**, como el agua que llena un recipiente desde abajo. El orden se obtiene con la **regla de las diagonales**:",
                        "**1s 2s 2p 3s 3p 4s 3d 4p 5s 4d 5p 6s 4f 5d 6p 7s 5f 6d 7p**",
                        "Fíjate en que **el 4s se llena antes que el 3d**: aunque el 3d pertenece a un nivel más bajo, tiene un poco más de energía.",
                    ],
                    "puntos": [
                        "Para escribir una configuración, reparte los electrones en ese orden, llenando cada subnivel hasta su máximo antes de pasar al siguiente.",
                        "Comprueba siempre que la suma de los superíndices sea igual a Z.",
                    ],
                    "tip": "Escribe la diagonal en una esquina de tu hoja antes de empezar. ¡Te ahorra muchos errores!",
                },
                {
                    "titulo": "Cómo se escribe la configuración",
                    "parrafos": [
                        "En 2p^4, el **2** es el nivel, la **p** es el subnivel y el superíndice **4** es el número de electrones en ese subnivel.",
                        "Para átomos grandes se usa la **notación abreviada**: se escribe el gas noble anterior entre corchetes y luego lo que falta. El sodio, 1s^2 2s^2 2p^6 3s^1, se escribe [Ne] 3s^1, porque 1s^2 2s^2 2p^6 es la configuración del neón.",
                    ],
                    "tabla": {
                        "columnas": ["Elemento", "Z", "Configuración", "Abreviada"],
                        "filas": [
                            ["Carbono", "6", "1s^2 2s^2 2p^2", "[He] 2s^2 2p^2"],
                            ["Sodio", "11", "1s^2 2s^2 2p^6 3s^1", "[Ne] 3s^1"],
                            ["Potasio", "19", "1s^2 2s^2 2p^6 3s^2 3p^6 4s^1", "[Ar] 4s^1"],
                        ],
                    },
                    "tip": "En la notación abreviada, lo que va después del corchete son justamente los electrones «interesantes».",
                },
                {
                    "titulo": "Electrones de valencia y la tabla periódica",
                    "parrafos": [
                        "Los **electrones de valencia** son los del **último nivel** (el n más grande). Son los que participan en los enlaces y las reacciones, así que determinan cómo se comporta el elemento.",
                        "La configuración está escondida en la tabla periódica: el **último nivel indica el periodo** y los electrones de valencia indican el grupo.",
                    ],
                    "puntos": [
                        "Grupos 1 y 2: electrones de valencia = número de grupo.",
                        "Grupos 13 a 18: grupo = electrones de valencia + 10.",
                        "La tabla se divide en **bloques**: s (grupos 1 y 2), p (grupos 13 a 18), d (metales de transición) y f (lantánidos y actínidos).",
                    ],
                    "tip": "Elementos del mismo grupo tienen los mismos electrones de valencia. ¡Por eso se parecen químicamente!",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Sodio (Z = 11)",
                    "enunciado": "Escribe la configuración electrónica del sodio y encuentra sus electrones de valencia.",
                    "datos": ["Z = 11 → hay que acomodar 11 electrones"],
                    "pasos": [
                        {"texto": "1s^2 → llevas 2 electrones.", "detalle": "El 1s es el primer subnivel y caben 2."},
                        {"texto": "2s^2 → llevas 4.", "detalle": "Sigue el 2s, con capacidad para 2."},
                        {"texto": "2p^6 → llevas 10.", "detalle": "Un subnivel p acepta 6 electrones."},
                        {"texto": "3s^1 → llevas 11. ¡Listo!", "detalle": "Solo queda 1 electrón por acomodar y va al 3s."},
                        {"texto": "Último nivel: n = 3, con 1 electrón.", "detalle": "El nivel más alto es el 3 y solo tiene 1 electrón: ese es el de valencia."},
                    ],
                    "resultado": "**1s^2 2s^2 2p^6 3s^1**: 1 electrón de valencia, periodo 3, grupo 1.",
                    "tip": "Ese único electrón de valencia es fácil de perder. ¡Por eso el sodio forma Na^+!",
                },
                {
                    "titulo": "Cloro (Z = 17)",
                    "enunciado": "Escribe la configuración del cloro y ubícalo en la tabla.",
                    "pasos": [
                        {"texto": "1s^2 2s^2 2p^6 → llevas 10.", "detalle": "Los primeros tres subniveles se llenan completos."},
                        {"texto": "3s^2 → llevas 12.", "detalle": "Sigue el 3s."},
                        {"texto": "3p^5 → llevas 17.", "detalle": "Faltaban 5 electrones; el 3p acepta hasta 6, así que caben."},
                        {"texto": "Valencia: nivel 3 → 3s^2 3p^5 = 2 + 5 = 7 electrones.", "detalle": "Se suman todos los electrones del último nivel, incluyendo s y p."},
                        {"texto": "Grupo = 7 + 10 = 17. Periodo = 3.", "detalle": "Para el bloque p, súmale 10 a los electrones de valencia."},
                    ],
                    "resultado": "**1s^2 2s^2 2p^6 3s^2 3p^5**: periodo 3, grupo 17.",
                    "tip": "Al cloro le falta 1 electrón para tener 8: por eso tiende a ganar uno y formar Cl^-.",
                },
                {
                    "titulo": "Hierro (Z = 26)",
                    "enunciado": "Escribe la configuración del hierro.",
                    "pasos": [
                        {"texto": "1s^2 2s^2 2p^6 3s^2 3p^6 → llevas 18.", "detalle": "Hasta aquí es la configuración del argón."},
                        {"texto": "Siguiente en la diagonal: 4s, no 3d. 4s^2 → llevas 20.", "detalle": "El 4s tiene menos energía que el 3d, así que se llena primero. Es el error más común."},
                        {"texto": "Los 6 electrones restantes van al 3d: 3d^6 → 26.", "detalle": "El 3d acepta hasta 10, así que caben."},
                        {"texto": "Abreviada: [Ar] 4s^2 3d^6.", "detalle": "[Ar] reemplaza los primeros 18 electrones."},
                    ],
                    "resultado": "**1s^2 2s^2 2p^6 3s^2 3p^6 4s^2 3d^6**",
                    "tip": "Comprueba sumando los superíndices: 2 + 2 + 6 + 2 + 6 + 2 + 6 = 26. ✔",
                },
            ],
            "examen": [
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuántos electrones caben como máximo en un subnivel p?",
                    "opciones": ["2", "6", "10", "14"],
                    "respuesta": "6",
                    "pista": "Un subnivel p tiene 3 orbitales y en cada orbital caben 2 electrones.",
                    "explicacion": "s = 2, p = 6, d = 10, f = 14.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuál es la configuración electrónica del oxígeno (Z = 8)?",
                    "opciones": ["1s^2 2s^2 2p^6", "1s^2 2s^2 2p^4", "1s^2 2s^4 2p^2", "1s^2 2p^6"],
                    "respuesta": "1s^2 2s^2 2p^4",
                    "pista": "Los superíndices deben sumar 8, y un subnivel s no puede tener más de 2.",
                    "explicacion": "2 + 2 + 4 = 8 electrones, llenando s antes que p.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuántos electrones de valencia tiene el fósforo (Z = 15)?",
                    "respuesta": 5,
                    "pista": "Escribe la configuración y suma los electrones del nivel 3.",
                    "explicacion": "1s^2 2s^2 2p^6 3s^2 3p^3 → en n = 3 hay 2 + 3 = 5.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Según el orden de llenado, después del 3p se llena el…",
                    "opciones": ["3d", "4p", "4s", "3f"],
                    "respuesta": "4s",
                    "pista": "Revisa la diagonal: 3s 3p … ¿qué sigue?",
                    "explicacion": "El 4s tiene menor energía que el 3d, así que se llena antes.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Un elemento termina su configuración en 3s^2 3p^1. ¿Dónde está en la tabla?",
                    "opciones": ["Periodo 3, grupo 1", "Periodo 1, grupo 3", "Periodo 3, grupo 13", "Periodo 2, grupo 13"],
                    "respuesta": "Periodo 3, grupo 13",
                    "pista": "El último nivel da el periodo. Para el bloque p, grupo = valencia + 10.",
                    "explicacion": "Último nivel 3 → periodo 3. Tiene 3 electrones de valencia → grupo 13 (es el aluminio).",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "Enlace químico",
            "resumen": "Por qué se unen los átomos: regla del octeto, electronegatividad y tipos de enlace.",
            "teoria": [
                {
                    "titulo": "¿Por qué se unen los átomos?",
                    "parrafos": [
                        "Los átomos se unen porque así quedan en un estado de **menor energía**, es decir, más estable. Una pelota rueda cuesta abajo por la misma razón.",
                        "Los gases nobles casi no reaccionan porque ya son muy estables: tienen **8 electrones de valencia** (el helio, 2). Los demás átomos tienden a ganar, perder o compartir electrones para parecerse a ellos. Esto es la **regla del octeto**.",
                        "En las **estructuras de Lewis** los electrones de valencia se dibujan como puntos alrededor del símbolo. Por ejemplo, el cloro se dibuja con 7 puntos, y el sodio con 1.",
                    ],
                    "tip": "Todos los átomos «quieren» parecerse a un gas noble: 8 electrones en su última capa (2 para el hidrógeno).",
                },
                {
                    "titulo": "Electronegatividad (EN)",
                    "parrafos": [
                        "La **electronegatividad** es la capacidad de un átomo para **atraer hacia sí los electrones** de un enlace. Es como un juego de jalar la cuerda: el más electronegativo jala más fuerte.",
                        "En la tabla periódica **aumenta hacia la derecha y hacia arriba**. El **flúor** es el más electronegativo (4.0) y los metales alcalinos de abajo, como el cesio, son los menos. Los gases nobles casi no forman enlaces, así que normalmente no se les asigna valor.",
                    ],
                    "tabla": {
                        "columnas": ["Elemento", "EN (Pauling)"],
                        "filas": [
                            ["F", "4.0"],
                            ["O", "3.5"],
                            ["Cl, N", "3.0"],
                            ["C", "2.5"],
                            ["H", "2.1"],
                            ["Na", "0.9"],
                            ["K", "0.8"],
                        ],
                    },
                    "tip": "Para clasificar un enlace, resta las electronegatividades (la mayor menos la menor): ΔEN.",
                },
                {
                    "titulo": "Enlace iónico",
                    "parrafos": [
                        "Ocurre cuando la diferencia de electronegatividad es grande (**ΔEN > 1.7**), normalmente entre un **metal y un no metal**. El no metal jala tan fuerte que el metal le **transfiere** sus electrones.",
                        "Se forman un catión y un anión, que se atraen fuertemente por tener cargas opuestas. No forman moléculas sueltas, sino una **red cristalina** de millones de iones ordenados.",
                    ],
                    "puntos": [
                        "Sólidos con puntos de fusión altos (la sal funde a 801 °C).",
                        "Duros pero frágiles: se rompen al golpearlos.",
                        "Conducen la electricidad solo si están **disueltos en agua o fundidos**, porque así sus iones pueden moverse.",
                    ],
                    "tip": "Iónico = metal + no metal y los electrones se REGALAN.",
                },
                {
                    "titulo": "Enlace covalente",
                    "parrafos": [
                        "Ocurre entre **no metales**, cuando ninguno jala lo suficiente para quitarle electrones al otro. En lugar de transferirlos, los **comparten**.",
                        "Si comparten un par de electrones es un **enlace simple** (H–H), dos pares un **enlace doble** (O=O) y tres pares un **enlace triple** (N≡N).",
                        "Si los dos átomos jalan igual o casi igual (**ΔEN < 0.4**), el enlace es **covalente no polar**. Si uno jala más (**0.4 ≤ ΔEN ≤ 1.7**), los electrones se acercan a él y el enlace es **covalente polar**: aparece una carga parcial negativa (δ−) en el más electronegativo y una positiva (δ+) en el otro.",
                    ],
                    "tabla": {
                        "columnas": ["ΔEN", "Tipo de enlace", "Ejemplo"],
                        "filas": [
                            ["Menor que 0.4", "Covalente no polar", "Cl_2, O_2, CH_4"],
                            ["Entre 0.4 y 1.7", "Covalente polar", "H_2O, HCl, NH_3"],
                            ["Mayor que 1.7", "Iónico", "NaCl, KCl, MgO"],
                        ],
                    },
                    "tip": "Covalente = los electrones se COMPARTEN. Si se reparten parejo es no polar; si uno se queda con más, es polar.",
                },
                {
                    "titulo": "Enlace metálico",
                    "parrafos": [
                        "En los metales, los átomos sueltan sus electrones de valencia, que forman un **«mar de electrones»** que se mueve libremente entre los cationes metálicos.",
                        "Este mar de electrones explica las propiedades de los metales: **conducen la electricidad** (los electrones se mueven), son **maleables** (las capas de átomos se deslizan sin romperse) y tienen **brillo**.",
                    ],
                    "tip": "Metálico = metal + metal, con los electrones libres para moverse. ¡Por eso un cable conduce!",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Cloruro de potasio (KCl)",
                    "enunciado": "¿Qué tipo de enlace hay en el KCl?",
                    "datos": ["EN(K) = 0.8", "EN(Cl) = 3.0"],
                    "pasos": [
                        {"texto": "Identifica: K es un metal (grupo 1) y Cl un no metal (grupo 17).", "detalle": "Metal + no metal ya es una fuerte pista de enlace iónico."},
                        {"texto": "Calcula ΔEN = 3.0 − 0.8 = 2.2.", "detalle": "Resta siempre el mayor menos el menor para que salga positivo."},
                        {"texto": "2.2 > 1.7 → enlace iónico.", "detalle": "La diferencia es tan grande que el Cl le arranca el electrón al K."},
                        {"texto": "Se forman K^+ y Cl^-.", "detalle": "El K pierde su único electrón de valencia y el Cl completa su octeto."},
                    ],
                    "resultado": "Enlace **iónico**: K^+ y Cl^-.",
                    "tip": "Ambos quedaron con configuración de gas noble (argón). ¡Los dos ganan estabilidad!",
                },
                {
                    "titulo": "Cloruro de hidrógeno (HCl)",
                    "enunciado": "¿Qué tipo de enlace hay en el HCl?",
                    "datos": ["EN(H) = 2.1", "EN(Cl) = 3.0"],
                    "pasos": [
                        {"texto": "H y Cl son no metales → comparten electrones (covalente).", "detalle": "Ahora hay que decidir si es polar o no polar."},
                        {"texto": "ΔEN = 3.0 − 2.1 = 0.9.", "detalle": "Cae entre 0.4 y 1.7."},
                        {"texto": "Es covalente polar: el Cl atrae más los electrones compartidos.", "detalle": "El Cl queda con carga parcial negativa (δ−) y el H con carga parcial positiva (δ+)."},
                    ],
                    "resultado": "Enlace **covalente polar**.",
                    "tip": "Los rangos de ΔEN son una guía práctica, no una frontera exacta.",
                },
                {
                    "titulo": "Oxígeno (O_2)",
                    "enunciado": "¿Qué tipo de enlace hay en el O_2 y cuántos pares comparte?",
                    "pasos": [
                        {"texto": "Los dos átomos son iguales: ΔEN = 0 → covalente no polar.", "detalle": "Si los átomos son idénticos, jalan exactamente igual."},
                        {"texto": "Cada O tiene 6 electrones de valencia y le faltan 2 para el octeto.", "detalle": "Configuración: 2s^2 2p^4 → 6 de valencia."},
                        {"texto": "Comparten 2 pares → enlace doble (O=O).", "detalle": "Con 2 pares compartidos, cada O cuenta 8 electrones a su alrededor."},
                    ],
                    "resultado": "Enlace **covalente no polar doble**.",
                    "tip": "Electrones que le faltan al octeto = número de enlaces que suele formar: O forma 2, N forma 3 y C forma 4.",
                },
            ],
            "examen": [
                {
                    "tipo": "opcion",
                    "pregunta": "¿Qué tipo de enlace hay en el NaCl?",
                    "opciones": ["Covalente no polar", "Iónico", "Metálico", "Covalente polar"],
                    "respuesta": "Iónico",
                    "pista": "Na es un metal y Cl un no metal. Calcula ΔEN con la tabla.",
                    "explicacion": "Metal + no metal con ΔEN = 3.0 − 0.9 = 2.1 > 1.7.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Qué tipo de enlace hay en la molécula de Cl_2?",
                    "opciones": ["Iónico", "Covalente polar", "Covalente no polar", "Metálico"],
                    "respuesta": "Covalente no polar",
                    "pista": "Los dos átomos son idénticos. ¿Cuánto vale ΔEN?",
                    "explicacion": "Dos átomos iguales: ΔEN = 0 y comparten los electrones por igual.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuál es el elemento más electronegativo?",
                    "opciones": ["Oxígeno", "Cloro", "Flúor", "Cesio"],
                    "respuesta": "Flúor",
                    "pista": "La electronegatividad aumenta hacia arriba y hacia la derecha.",
                    "explicacion": "El flúor (EN = 4.0) está arriba a la derecha de la tabla.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "La EN del O es 3.5 y la del H es 2.1. ¿Cuál es la ΔEN del enlace O–H?",
                    "respuesta": 1.4,
                    "pista": "Resta la mayor menos la menor.",
                    "explicacion": "3.5 − 2.1 = 1.4, por eso el enlace O–H es covalente polar.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "En un enlace iónico, los electrones…",
                    "opciones": [
                        "Se comparten por igual",
                        "Se transfieren de un átomo a otro",
                        "Forman un mar de electrones",
                        "No participan",
                    ],
                    "respuesta": "Se transfieren de un átomo a otro",
                    "pista": "En el iónico se forman cationes y aniones. ¿Cómo se forman?",
                    "explicacion": "El metal cede electrones al no metal y se forman iones de carga opuesta.",
                },
            ],
        },
    ],
    "quimica-2": [
        # --------------------------------------------------------------
        {
            "titulo": "Balanceo por tanteo",
            "resumen": "Un método ordenado para balancear ecuaciones con varios compuestos.",
            "teoria": [
                {
                    "titulo": "¿Por qué balancear?",
                    "parrafos": [
                        "La **ley de conservación de la masa** dice que en una reacción los átomos no se crean ni se destruyen. Por eso una ecuación debe tener **el mismo número de átomos de cada elemento** en reactivos y productos.",
                        "Una ecuación sin balancear no sirve para hacer cálculos: si no sabes en qué proporción reaccionan las sustancias, no puedes calcular cuánto producto obtendrás.",
                    ],
                    "tip": "Balancear no es un trámite: es lo que te permite saber cuánto de cada sustancia necesitas.",
                },
                {
                    "titulo": "La regla de oro",
                    "parrafos": [
                        "Solo se cambian los **coeficientes** (los números delante de cada fórmula). **Nunca** se cambian los subíndices, porque cambiarías la sustancia.",
                        "Por ejemplo, para tener más oxígeno en el agua no puedes escribir H_2O_2 (eso es agua oxigenada). Tienes que escribir 2H_2O.",
                    ],
                    "tip": "Coeficientes sí, subíndices jamás.",
                },
                {
                    "titulo": "El inventario de átomos",
                    "parrafos": [
                        "Antes de mover cualquier coeficiente, haz una **tabla de conteo** con cada elemento y cuántos átomos hay de cada lado. Recuerda multiplicar el subíndice por el coeficiente.",
                    ],
                    "tabla": {
                        "columnas": ["Elemento", "Reactivos (CH_4 + O_2)", "Productos (CO_2 + H_2O)", "¿Igual?"],
                        "filas": [
                            ["C", "1", "1", "✔"],
                            ["H", "4", "2", "✘"],
                            ["O", "2", "2 + 1 = 3", "✘"],
                        ],
                    },
                    "tip": "Actualiza la tabla cada vez que cambies un coeficiente. Es la forma más segura de no perderte.",
                },
                {
                    "titulo": "Orden recomendado: M-N-H-O",
                    "parrafos": [
                        "Balancear en cualquier orden funciona, pero este orden suele ser el más rápido:",
                    ],
                    "puntos": [
                        "1. **M**etales.",
                        "2. **N**o metales (distintos de H y O).",
                        "3. **H**idrógeno.",
                        "4. **O**xígeno, al final, porque suele aparecer en muchas sustancias.",
                    ],
                    "ejemplo": "Si un grupo poliatómico (como SO_4 o NO_3) aparece igual en ambos lados, puedes balancearlo como si fuera una sola pieza.",
                    "tip": "Deja para el final el elemento que aparece en más sustancias, normalmente el oxígeno.",
                },
                {
                    "titulo": "Combustiones y fracciones",
                    "parrafos": [
                        "En la combustión de un hidrocarburo (C_xH_y + O_2 → CO_2 + H_2O) balancea **C**, luego **H** y al final **O**. El O_2 está solo, así que es fácil ajustarlo.",
                        "A veces el oxígeno pide un número impar de átomos y el coeficiente del O_2 queda como fracción (por ejemplo, 7/2). Está bien usarla temporalmente: después **multiplica todos los coeficientes** por el denominador para tener enteros.",
                    ],
                    "tip": "Una fracción no es un error: es un paso intermedio. Multiplica TODO por el denominador al final.",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Combustión del metano",
                    "enunciado": "Balancea: CH_4 + O_2 → CO_2 + H_2O",
                    "pasos": [
                        {"texto": "C: 1 a la izquierda y 1 a la derecha. ✔", "detalle": "El carbono ya está balanceado; no lo toques."},
                        {"texto": "H: 4 a la izquierda y 2 a la derecha → pon 2H_2O.", "detalle": "Cada H_2O tiene 2 H; para tener 4 necesitas 2 moléculas."},
                        {"texto": "O a la derecha: 2 (en CO_2) + 2 (en 2H_2O) = 4.", "detalle": "Cuenta el oxígeno de TODOS los productos, multiplicando por sus coeficientes."},
                        {"texto": "Para tener 4 O a la izquierda: 2O_2.", "detalle": "Cada O_2 aporta 2 oxígenos."},
                        {"texto": "Comprueba: C 1 = 1, H 4 = 4, O 4 = 4. ✔", "detalle": "Todo está balanceado."},
                    ],
                    "resultado": "**CH_4 + 2O_2 → CO_2 + 2H_2O**",
                    "tip": "Esta es la reacción que ocurre en la estufa de tu casa.",
                },
                {
                    "titulo": "Óxido de hierro(III)",
                    "enunciado": "Balancea: Fe + O_2 → Fe_2O_3",
                    "pasos": [
                        {"texto": "O: 2 a la izquierda y 3 a la derecha.", "detalle": "No hay número entero que convierta 1 en 3 en una sola molécula de O_2, así que busca un múltiplo común."},
                        {"texto": "El mínimo común múltiplo de 2 y 3 es 6 → 3O_2 (6 O) y 2Fe_2O_3 (6 O).", "detalle": "Usar el MCM es el truco para igualar números que no se dividen entre sí."},
                        {"texto": "Fe: ahora hay 2 × 2 = 4 a la derecha → 4Fe.", "detalle": "Al cambiar el coeficiente del Fe_2O_3 cambió el hierro."},
                        {"texto": "Comprueba: Fe 4 = 4, O 6 = 6. ✔", "detalle": "Balanceada."},
                    ],
                    "resultado": "**4Fe + 3O_2 → 2Fe_2O_3**",
                    "tip": "Cuando un elemento tiene subíndice 2 de un lado y 3 del otro, piensa en el 6.",
                },
                {
                    "titulo": "Combustión del etano (con fracción)",
                    "enunciado": "Balancea: C_2H_6 + O_2 → CO_2 + H_2O",
                    "pasos": [
                        {"texto": "C: 2 a la izquierda → 2CO_2.", "detalle": "Primero el carbono."},
                        {"texto": "H: 6 a la izquierda → 3H_2O.", "detalle": "Cada H_2O tiene 2 H: 6 ÷ 2 = 3."},
                        {"texto": "O a la derecha: 2 × 2 + 3 × 1 = 7. Necesitas 7/2 O_2.", "detalle": "7 es impar y cada O_2 aporta 2, así que el coeficiente queda como 7/2."},
                        {"texto": "Multiplica todo por 2: 2C_2H_6 + 7O_2 → 4CO_2 + 6H_2O.", "detalle": "Todos los coeficientes se multiplican, no solo el del O_2."},
                        {"texto": "Comprueba: C 4 = 4, H 12 = 12, O 14 = 14. ✔", "detalle": "Siempre recuenta después de multiplicar."},
                    ],
                    "resultado": "**2C_2H_6 + 7O_2 → 4CO_2 + 6H_2O**",
                    "tip": "Error común: multiplicar solo el O_2 por 2. ¡Hay que multiplicar todos!",
                },
                {
                    "titulo": "Grupo poliatómico como bloque",
                    "enunciado": "Balancea: H_2SO_4 + NaOH → Na_2SO_4 + H_2O",
                    "pasos": [
                        {"texto": "El grupo SO_4 aparece igual en ambos lados: trátalo como una pieza. 1 = 1. ✔", "detalle": "Así no tienes que contar los oxígenos del sulfato por separado."},
                        {"texto": "Na: 1 a la izquierda y 2 a la derecha → 2NaOH.", "detalle": "Primero el metal (orden M-N-H-O)."},
                        {"texto": "H (sin contar el SO_4): 2 + 2 = 4 a la izquierda; a la derecha 2 → 2H_2O.", "detalle": "Hay 2 H en H_2SO_4 y 2 en 2NaOH."},
                        {"texto": "Comprueba el O fuera del sulfato: 2 (en 2NaOH) = 2 (en 2H_2O). ✔", "detalle": "Todo cuadra."},
                    ],
                    "resultado": "**H_2SO_4 + 2NaOH → Na_2SO_4 + 2H_2O**",
                    "tip": "Este truco solo vale si el grupo no cambia. Si el grupo se rompe, cuenta sus átomos por separado.",
                },
            ],
            "examen": [
                {
                    "tipo": "coeficientes",
                    "pregunta": "Balancea la ecuación.",
                    "ecuacion": "Al + O_2 -> Al_2O_3",
                    "respuesta": [4, 3, 2],
                    "pista": "Es igual que el ejemplo del hierro: oxígeno 2 contra 3, piensa en el 6.",
                    "explicacion": "MCM de O = 6 → 3O_2 y 2Al_2O_3; luego 4Al.",
                },
                {
                    "tipo": "coeficientes",
                    "pregunta": "Balancea la combustión del propano.",
                    "ecuacion": "C_3H_8 + O_2 -> CO_2 + H_2O",
                    "respuesta": [1, 5, 3, 4],
                    "pista": "Orden: carbono, después hidrógeno y al final oxígeno.",
                    "explicacion": "3CO_2 y 4H_2O → 6 + 4 = 10 O → 5O_2.",
                },
                {
                    "tipo": "coeficientes",
                    "pregunta": "Balancea la descomposición del clorato de potasio.",
                    "ecuacion": "KClO_3 -> KCl + O_2",
                    "respuesta": [2, 2, 3],
                    "pista": "El oxígeno es 3 contra 2. Busca el mínimo común múltiplo.",
                    "explicacion": "MCM de O = 6 → 2KClO_3 y 3O_2; luego 2KCl.",
                },
                {
                    "tipo": "coeficientes",
                    "pregunta": "Balancea la ecuación.",
                    "ecuacion": "Al + HCl -> AlCl_3 + H_2",
                    "respuesta": [2, 6, 2, 3],
                    "pista": "El cloro va 1 contra 3 y el hidrógeno 1 contra 2. Un número que funciona para ambos es el 6.",
                    "explicacion": "Cl: MCM(1, 3) y H: MCM(1, 2) → 6HCl, 2AlCl_3, 3H_2 y 2Al.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Si al balancear te queda un coeficiente de 1/2, ¿qué debes hacer?",
                    "opciones": [
                        "Redondearlo a 1",
                        "Cambiar un subíndice",
                        "Multiplicar todos los coeficientes por 2",
                        "Dejar la fracción",
                    ],
                    "respuesta": "Multiplicar todos los coeficientes por 2",
                    "pista": "Recuerda el ejemplo del etano.",
                    "explicacion": "Así obtienes enteros sin romper el balance.",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "Tipos de reacciones",
            "resumen": "Síntesis, descomposición, sustitución simple y doble, y combustión.",
            "teoria": [
                {
                    "titulo": "¿Para qué clasificar reacciones?",
                    "parrafos": [
                        "Hay millones de reacciones, pero la mayoría siguen unos cuantos **patrones**. Si reconoces el patrón, puedes **predecir los productos** de una reacción que nunca habías visto.",
                        "En los patrones usaremos letras: A y B para elementos, AB para un compuesto formado por ellos.",
                    ],
                    "tabla": {
                        "columnas": ["Tipo", "Patrón"],
                        "filas": [
                            ["Síntesis", "A + B → AB"],
                            ["Descomposición", "AB → A + B"],
                            ["Sustitución simple", "A + BC → AC + B"],
                            ["Doble sustitución", "AB + CD → AD + CB"],
                            ["Combustión", "Combustible + O_2 → CO_2 + H_2O"],
                        ],
                    },
                    "tip": "Fíjate en cuántas sustancias hay de cada lado: es la pista más rápida para reconocer el tipo.",
                },
                {
                    "titulo": "Síntesis y descomposición",
                    "parrafos": [
                        "En una **síntesis** (o combinación), dos o más sustancias se unen para formar **un solo producto**: N_2 + 3H_2 → 2NH_3.",
                        "La **descomposición** es lo contrario: **un solo reactivo** se separa en dos o más sustancias. Normalmente necesita energía: calor, electricidad o luz.",
                    ],
                    "puntos": [
                        "Por calor: CaCO_3 → CaO + CO_2 (así se fabrica la cal).",
                        "Por electricidad (electrólisis): 2H_2O → 2H_2 + O_2.",
                        "Por luz: el agua oxigenada se descompone, por eso se guarda en botellas oscuras.",
                    ],
                    "tip": "Muchos → uno: síntesis. Uno → muchos: descomposición.",
                },
                {
                    "titulo": "Sustitución simple",
                    "parrafos": [
                        "Un **elemento** reacciona con un **compuesto** y ocupa el lugar de uno de sus elementos, que queda libre: Zn + CuSO_4 → ZnSO_4 + Cu.",
                        "No cualquier metal puede desplazar a otro. Según la **serie de actividad**, un metal más activo desplaza a uno menos activo, pero no al revés.",
                    ],
                    "puntos": [
                        "Serie de actividad simplificada (de más a menos activo): K > Na > Mg > Al > Zn > Fe > Pb > H > Cu > Ag > Au.",
                        "El Zn desplaza al Cu, pero el Cu no desplaza al Zn: Cu + ZnSO_4 → no hay reacción.",
                    ],
                    "tip": "Es como un baile: el más fuerte le «roba» la pareja al más débil.",
                },
                {
                    "titulo": "Doble sustitución",
                    "parrafos": [
                        "Dos **compuestos** intercambian sus partes (sus iones): AgNO_3 + NaCl → AgCl + NaNO_3.",
                        "Normalmente ocurren en agua y suceden si se forma un **precipitado** (un sólido que no se disuelve), un **gas** o **agua**.",
                        "La **neutralización** es un tipo de doble sustitución: un ácido y una base forman una sal y agua. HCl + NaOH → NaCl + H_2O.",
                    ],
                    "tip": "Doble sustitución = intercambio de parejas: los positivos se cambian de compañero negativo.",
                },
                {
                    "titulo": "Combustión",
                    "parrafos": [
                        "Una sustancia (el **combustible**) reacciona rápidamente con **O_2** y libera energía en forma de calor y luz.",
                        "Si el combustible es un hidrocarburo y hay suficiente oxígeno, la combustión es **completa** y los productos son **CO_2 y H_2O**.",
                        "Si falta oxígeno, la combustión es **incompleta** y se forma **monóxido de carbono (CO)**, un gas muy tóxico, y hollín (C). Por eso nunca se debe usar un calentador de gas en un cuarto cerrado.",
                    ],
                    "tip": "Reconoce una combustión porque siempre lleva O_2 como reactivo y, si es de un hidrocarburo, CO_2 y H_2O como productos.",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Agua oxigenada",
                    "enunciado": "Clasifica: 2H_2O_2 → 2H_2O + O_2",
                    "pasos": [
                        {"texto": "Cuenta las sustancias: 1 reactivo (H_2O_2) y 2 productos.", "detalle": "El coeficiente 2 no cuenta como otra sustancia: sigue siendo solo H_2O_2."},
                        {"texto": "Un compuesto se separa en sustancias más sencillas.", "detalle": "Coincide con el patrón AB → A + B."},
                    ],
                    "resultado": "**Descomposición.**",
                    "tip": "Las burbujas que salen al poner agua oxigenada en una herida son de O_2 de esta reacción.",
                },
                {
                    "titulo": "Zinc en sulfato de cobre",
                    "enunciado": "Clasifica: Zn + CuSO_4 → ZnSO_4 + Cu",
                    "pasos": [
                        {"texto": "Reactivos: un elemento (Zn) y un compuesto (CuSO_4).", "detalle": "Un elemento solo reaccionando con un compuesto apunta a sustitución simple."},
                        {"texto": "El Zn toma el lugar del Cu y el Cu queda libre.", "detalle": "Patrón A + BC → AC + B."},
                        {"texto": "¿Es posible? Sí: el Zn es más activo que el Cu.", "detalle": "Revisa la serie de actividad: Zn está antes que Cu."},
                    ],
                    "resultado": "**Sustitución simple.**",
                    "tip": "Si metes un clavo de zinc en sulfato de cobre azul, se cubre de cobre rojizo y la solución pierde su color.",
                },
                {
                    "titulo": "Ácido y base",
                    "enunciado": "Clasifica: HCl + NaOH → NaCl + H_2O",
                    "pasos": [
                        {"texto": "Hay dos compuestos de cada lado.", "detalle": "Dos compuestos que reaccionan apuntan a doble sustitución."},
                        {"texto": "Intercambian parejas: el H^+ se une al OH^- y el Na^+ al Cl^-.", "detalle": "Patrón AB + CD → AD + CB."},
                        {"texto": "Es un ácido con una base que forman sal y agua.", "detalle": "Ese caso particular se llama neutralización."},
                    ],
                    "resultado": "**Doble sustitución** (neutralización).",
                    "tip": "Los antiácidos funcionan así: una base neutraliza el exceso de ácido del estómago.",
                },
                {
                    "titulo": "¿Ocurre o no?",
                    "enunciado": "¿Ocurre la reacción Cu + ZnSO_4 → ?",
                    "pasos": [
                        {"texto": "Sería una sustitución simple: el Cu intentaría desplazar al Zn.", "detalle": "Elemento + compuesto."},
                        {"texto": "Revisa la serie de actividad: el Cu es menos activo que el Zn.", "detalle": "Un metal menos activo no puede desplazar a uno más activo."},
                    ],
                    "resultado": "**No hay reacción.**",
                    "tip": "Conocer el tipo de reacción también te ayuda a predecir cuándo NO ocurre.",
                },
            ],
            "examen": [
                {
                    "tipo": "opcion",
                    "pregunta": "CaO + H_2O → Ca(OH)_2 es una reacción de…",
                    "opciones": _TIPOS,
                    "respuesta": "Síntesis",
                    "pista": "Cuenta cuántas sustancias hay de cada lado.",
                    "explicacion": "Dos sustancias forman un único producto.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "CaCO_3 → CaO + CO_2 es una reacción de…",
                    "opciones": _TIPOS,
                    "respuesta": "Descomposición",
                    "pista": "¿Cuántos reactivos hay?",
                    "explicacion": "Un solo reactivo se separa en dos productos.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Fe + CuSO_4 → FeSO_4 + Cu es una reacción de…",
                    "opciones": _TIPOS,
                    "respuesta": "Sustitución simple",
                    "pista": "Un elemento reacciona con un compuesto.",
                    "explicacion": "El hierro reemplaza al cobre en el compuesto.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "AgNO_3 + NaCl → AgCl + NaNO_3 es una reacción de…",
                    "opciones": _TIPOS,
                    "respuesta": "Doble sustitución",
                    "pista": "Dos compuestos intercambian sus partes.",
                    "explicacion": "Los dos compuestos intercambian sus iones.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "C_3H_8 + 5O_2 → 3CO_2 + 4H_2O es una reacción de…",
                    "opciones": _TIPOS,
                    "respuesta": "Combustión",
                    "pista": "Mira qué reactivo y qué productos aparecen.",
                    "explicacion": "Un hidrocarburo reacciona con O_2 y forma CO_2 y H_2O.",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "El mol y la masa molar",
            "resumen": "Cómo contar partículas pesando y cómo convertir entre gramos, moles y partículas.",
            "teoria": [
                {
                    "titulo": "Contar pesando",
                    "parrafos": [
                        "Cuando compras arroz no cuentas los granos: lo compras por kilo. En química pasa lo mismo, porque los átomos son demasiado pequeños para contarlos uno por uno.",
                        "Por eso los químicos usan una unidad que agrupa una cantidad enorme de partículas: el **mol**. Así como una docena son 12 cosas, un mol es una cantidad fija de partículas.",
                    ],
                    "tip": "El mol es solo un número, como «docena», pero muchísimo más grande.",
                },
                {
                    "titulo": "El número de Avogadro",
                    "parrafos": [
                        "Un **mol** contiene **6.022 × 10^23 partículas** (átomos, moléculas o iones). Este número se llama **número de Avogadro (N_A)**.",
                        "Es un número inimaginable: si contaras un átomo por segundo, sin parar, tardarías unos 19 mil billones de años en contar un mol, más de un millón de veces la edad del universo.",
                    ],
                    "puntos": [
                        "1 mol de átomos de C = 6.022 × 10^23 átomos.",
                        "1 mol de moléculas de H_2O = 6.022 × 10^23 moléculas.",
                    ],
                    "tip": "6.022 × 10^23: ese número es la conexión entre el mundo de los átomos y el de las balanzas.",
                },
                {
                    "titulo": "Masa molar (M)",
                    "parrafos": [
                        "La **masa molar** es la masa de un mol de una sustancia, en **g/mol**. La magia del mol es que coincide con la masa atómica de la tabla periódica: un átomo de C pesa 12 u y **un mol de C pesa 12 g**.",
                        "Para un compuesto, la masa molar se calcula **sumando las masas atómicas** de todos sus átomos, multiplicando cada una por su subíndice.",
                    ],
                    "tabla": {
                        "columnas": ["Elemento", "Masa atómica (g/mol)"],
                        "filas": [
                            ["H", "1"],
                            ["C", "12"],
                            ["N", "14"],
                            ["O", "16"],
                            ["Na", "23"],
                            ["Cl", "35.5"],
                            ["Ca", "40"],
                        ],
                    },
                    "ejemplo": "M(CO_2) = 12 + 2 × 16 = 44 g/mol. Es decir, 44 g de CO_2 contienen 6.022 × 10^23 moléculas.",
                    "tip": "Para la masa molar: (masa del elemento × subíndice) y suma todo.",
                },
                {
                    "titulo": "Conversiones",
                    "parrafos": [
                        "El mol es el centro de todas las conversiones. Desde los gramos llegas a los moles dividiendo entre la masa molar, y desde los moles llegas a las partículas multiplicando por N_A:",
                        "**gramos ⇄ (÷ M / × M) ⇄ moles ⇄ (× N_A / ÷ N_A) ⇄ partículas**",
                    ],
                    "tabla": {
                        "columnas": ["Quiero calcular", "Fórmula"],
                        "filas": [
                            ["Moles a partir de gramos", "n = m / M"],
                            ["Gramos a partir de moles", "m = n × M"],
                            ["Partículas a partir de moles", "partículas = n × N_A"],
                            ["Moles a partir de partículas", "n = partículas / N_A"],
                        ],
                    },
                    "tip": "Para ir de gramos a partículas (o al revés), siempre pasa por moles.",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Masa molar del agua",
                    "enunciado": "Calcula la masa molar del H_2O.",
                    "datos": ["H = 1 g/mol", "O = 16 g/mol"],
                    "pasos": [
                        {"texto": "H: 2 átomos × 1 = 2.", "detalle": "El subíndice 2 indica dos hidrógenos."},
                        {"texto": "O: 1 átomo × 16 = 16.", "detalle": "Sin subíndice: 1 oxígeno."},
                        {"texto": "Suma: 2 + 16 = 18 g/mol.", "detalle": "Un mol de agua pesa 18 g: un poco más de lo que cabe en una cucharada sopera."},
                    ],
                    "resultado": "**M = 18 g/mol.**",
                    "tip": "En 18 g de agua (poco más de una cucharada) hay 6.022 × 10^23 moléculas. ¡Un mol entero!",
                },
                {
                    "titulo": "De gramos a moles",
                    "enunciado": "¿Cuántos moles hay en 88 g de CO_2?",
                    "datos": ["m = 88 g", "C = 12, O = 16"],
                    "pasos": [
                        {"texto": "Calcula la masa molar: M(CO_2) = 12 + 2 × 16 = 44 g/mol.", "detalle": "No puedes convertir sin conocer la masa molar."},
                        {"texto": "Usa n = m / M = 88 g ÷ 44 g/mol.", "detalle": "Los gramos se cancelan y quedan moles."},
                        {"texto": "n = 2 mol.", "detalle": "Tiene sentido: 88 es el doble de 44."},
                    ],
                    "resultado": "**2 mol de CO_2.**",
                    "tip": "Revisa las unidades: g ÷ (g/mol) = mol. Si no te quedan moles, invertiste la división.",
                },
                {
                    "titulo": "De moles a partículas",
                    "enunciado": "¿Cuántas moléculas hay en 0.5 mol de agua?",
                    "pasos": [
                        {"texto": "Usa partículas = n × N_A.", "detalle": "Para pasar de moles a partículas se multiplica por el número de Avogadro."},
                        {"texto": "= 0.5 × 6.022 × 10^23.", "detalle": "Multiplica solo el 6.022 por 0.5; la potencia de 10 se queda igual."},
                        {"texto": "= 3.011 × 10^23 moléculas.", "detalle": "Medio mol tiene la mitad de partículas que un mol."},
                    ],
                    "resultado": "**3.011 × 10^23 moléculas.**",
                    "tip": "No necesitas la masa molar para pasar de moles a partículas, solo N_A.",
                },
                {
                    "titulo": "Átomos dentro de moléculas",
                    "enunciado": "¿Cuántos átomos de hidrógeno hay en 2 mol de H_2O?",
                    "pasos": [
                        {"texto": "Cada molécula de H_2O tiene 2 átomos de H.", "detalle": "Mira el subíndice del H."},
                        {"texto": "En 2 mol de H_2O hay 2 × 2 = 4 mol de átomos de H.", "detalle": "La proporción 2 H por molécula se mantiene también en moles."},
                        {"texto": "4 × 6.022 × 10^23 = 2.409 × 10^24 átomos.", "detalle": "24.088 × 10^23 se escribe como 2.409 × 10^24 en notación científica."},
                    ],
                    "resultado": "**2.409 × 10^24 átomos de H.**",
                    "tip": "Fíjate si te preguntan por moléculas o por átomos: no es lo mismo.",
                },
            ],
            "examen": [
                {
                    "tipo": "numero",
                    "pregunta": "Calcula la masa molar del NaCl (Na = 23, Cl = 35.5).",
                    "unidad": "g/mol",
                    "respuesta": 58.5,
                    "pista": "Suma las masas de un Na y un Cl.",
                    "explicacion": "23 + 35.5 = 58.5 g/mol.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "Calcula la masa molar del CaCO_3 (Ca = 40, C = 12, O = 16).",
                    "unidad": "g/mol",
                    "respuesta": 100,
                    "pista": "No olvides multiplicar la masa del O por su subíndice, 3.",
                    "explicacion": "40 + 12 + 3 × 16 = 100 g/mol.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuántos moles hay en 36 g de agua (M = 18 g/mol)?",
                    "unidad": "mol",
                    "respuesta": 2,
                    "pista": "n = m / M.",
                    "explicacion": "n = 36 ÷ 18 = 2 mol.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuántos gramos son 3 mol de O_2 (O = 16)?",
                    "unidad": "g",
                    "respuesta": 96,
                    "pista": "Primero calcula M(O_2) (son 2 oxígenos) y luego usa m = n × M.",
                    "explicacion": "M(O_2) = 32 g/mol → m = 3 × 32 = 96 g.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Cuántas partículas hay en 1 mol?",
                    "opciones": ["1000", "6.022 × 10^23", "6.022 × 10^-23", "22.4"],
                    "respuesta": "6.022 × 10^23",
                    "pista": "Es un número ENORME, no uno diminuto.",
                    "explicacion": "Es el número de Avogadro.",
                },
            ],
        },
    ],
}
