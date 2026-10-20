"""Lecciones del nivel universidad (formato descrito en lessons/__init__.py)."""

LECCIONES = {
    "quimica-1": [
        # --------------------------------------------------------------
        {
            "titulo": "Estequiometría",
            "resumen": "Relaciones molares, cálculos de gramos a gramos y volúmenes de gases.",
            "teoria": [
                {
                    "titulo": "¿Qué es la estequiometría?",
                    "parrafos": [
                        "La **estequiometría** es el cálculo de las cantidades de reactivos y productos que participan en una reacción. Responde preguntas como «¿cuánto CO_2 se libera al quemar 1 kg de gasolina?» o «¿cuánto reactivo necesito para producir 10 g de medicamento?».",
                        "Todo cálculo estequiométrico empieza con una **ecuación balanceada**. Si la ecuación no está balanceada, todos los resultados estarán mal.",
                    ],
                    "tip": "Paso cero de cualquier problema: verifica que la ecuación esté balanceada.",
                },
                {
                    "titulo": "Relaciones molares",
                    "parrafos": [
                        "Los coeficientes de una ecuación balanceada indican la **proporción en moles** en que reaccionan y se forman las sustancias.",
                        "En N_2 + 3H_2 → 2NH_3: 1 mol de N_2 reacciona con 3 mol de H_2 y se forman 2 mol de NH_3. Esa proporción se mantiene a cualquier escala: 10 mol de N_2 reaccionan con 30 mol de H_2 y dan 20 mol de NH_3.",
                        "Con los coeficientes se arman **factores de conversión**. Para pasar de moles de H_2 a moles de NH_3 se multiplica por (2 mol NH_3 / 3 mol H_2).",
                    ],
                    "puntos": [
                        "El factor siempre lleva **arriba la sustancia que quieres** y **abajo la que tienes**, para que las unidades se cancelen.",
                        "Los coeficientes relacionan **moles**, nunca gramos directamente.",
                    ],
                    "tip": "Factor molar = (coeficiente de lo que buscas) / (coeficiente de lo que tienes).",
                },
                {
                    "titulo": "La ruta de gramos a gramos",
                    "parrafos": [
                        "En el laboratorio medimos gramos, pero la ecuación habla de moles. Por eso los problemas de gramos a gramos tienen siempre **tres pasos**:",
                        "**g de A → (÷ M_A) → mol de A → (× coef. B / coef. A) → mol de B → (× M_B) → g de B**",
                    ],
                    "puntos": [
                        "1. Convierte los gramos del dato a moles con su masa molar.",
                        "2. Usa la relación molar de la ecuación balanceada.",
                        "3. Convierte los moles del resultado a gramos con su masa molar.",
                    ],
                    "tip": "Nunca saltes directo de gramos de A a gramos de B. El puente siempre son los moles.",
                },
                {
                    "titulo": "Gases: volumen molar",
                    "parrafos": [
                        "Para gases es más práctico medir volumen que masa. A **temperatura y presión estándar** (TPE: 0 °C y 1 atm), **1 mol de cualquier gas ideal ocupa 22.4 L**.",
                        "En otras condiciones se usa la **ley de los gases ideales**: PV = nRT, con R = 0.0821 L·atm/(mol·K) y la temperatura en kelvin.",
                    ],
                    "puntos": ["En TPE: **V = n × 22.4 L** y **n = V / 22.4 L**."],
                    "tip": "22.4 L/mol solo vale a 0 °C y 1 atm. A otras condiciones usa PV = nRT.",
                },
                {
                    "titulo": "Errores comunes",
                    "puntos": [
                        "Usar una ecuación **sin balancear**.",
                        "Usar la relación molar con **gramos** en vez de moles.",
                        "Invertir el factor molar (poner arriba lo que tienes).",
                        "Usar la masa molar de una sustancia distinta en el último paso.",
                        "Olvidar que O_2, H_2, N_2 y Cl_2 son diatómicos al calcular su masa molar (O_2 = 32 g/mol, no 16).",
                    ],
                    "tip": "Escribe las unidades en cada paso. Si no se cancelan como deben, el planteamiento está mal.",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Agua a partir de hidrógeno",
                    "enunciado": "2H_2 + O_2 → 2H_2O. ¿Cuántos gramos de agua se forman con 8 g de H_2 (y O_2 en exceso)?",
                    "datos": ["m(H_2) = 8 g", "M(H_2) = 2 g/mol", "M(H_2O) = 18 g/mol"],
                    "pasos": [
                        {"texto": "Gramos a moles: n(H_2) = 8 g ÷ 2 g/mol = 4 mol.", "detalle": "El H_2 tiene 2 átomos de H, así que su masa molar es 2, no 1."},
                        {"texto": "Relación molar: 4 mol H_2 × (2 mol H_2O / 2 mol H_2) = 4 mol H_2O.", "detalle": "Los coeficientes son 2 y 2: la proporción es 1 a 1."},
                        {"texto": "Moles a gramos: 4 mol × 18 g/mol = 72 g.", "detalle": "Ahora usa la masa molar del agua, no la del hidrógeno."},
                    ],
                    "resultado": "**72 g de H_2O.**",
                    "tip": "Comprueba con la conservación de la masa: 8 g de H_2 + 64 g de O_2 que reaccionan = 72 g de agua. ✔",
                },
                {
                    "titulo": "Oxígeno para quemar metano",
                    "enunciado": "CH_4 + 2O_2 → CO_2 + 2H_2O. ¿Cuántos gramos de O_2 se necesitan para quemar 16 g de CH_4?",
                    "datos": ["m(CH_4) = 16 g", "M(CH_4) = 16 g/mol", "M(O_2) = 32 g/mol"],
                    "pasos": [
                        {"texto": "n(CH_4) = 16 g ÷ 16 g/mol = 1 mol.", "detalle": "M(CH_4) = 12 + 4 × 1 = 16 g/mol."},
                        {"texto": "1 mol CH_4 × (2 mol O_2 / 1 mol CH_4) = 2 mol O_2.", "detalle": "Arriba lo que buscas (O_2) y abajo lo que tienes (CH_4)."},
                        {"texto": "2 mol × 32 g/mol = 64 g de O_2.", "detalle": "M(O_2) = 2 × 16 = 32 g/mol."},
                    ],
                    "resultado": "**64 g de O_2.**",
                    "tip": "Se necesitan 4 g de oxígeno por cada gramo de metano. ¡Por eso las estufas necesitan buena ventilación!",
                },
                {
                    "titulo": "Volumen de un gas producido",
                    "enunciado": "C_3H_8 + 5O_2 → 3CO_2 + 4H_2O. ¿Qué volumen de CO_2 (a TPE) se produce al quemar 1 mol de propano?",
                    "pasos": [
                        {"texto": "Relación molar: 1 mol C_3H_8 × (3 mol CO_2 / 1 mol C_3H_8) = 3 mol CO_2.", "detalle": "Los coeficientes son 1 y 3."},
                        {"texto": "Volumen a TPE: 3 mol × 22.4 L/mol = 67.2 L.", "detalle": "A TPE cada mol de gas ocupa 22.4 L."},
                    ],
                    "resultado": "**67.2 L de CO_2.**",
                    "tip": "Cuando el dato o la respuesta es un volumen de gas a TPE, el factor 22.4 L/mol reemplaza a la masa molar.",
                },
            ],
            "examen": [
                {
                    "tipo": "numero",
                    "pregunta": "N_2 + 3H_2 → 2NH_3. ¿Cuántos moles de NH_3 se forman con 6 mol de H_2 (y N_2 en exceso)?",
                    "unidad": "mol",
                    "respuesta": 4,
                    "pista": "Usa el factor (2 mol NH_3 / 3 mol H_2).",
                    "explicacion": "6 mol H_2 × (2 mol NH_3 / 3 mol H_2) = 4 mol.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "2H_2 + O_2 → 2H_2O. ¿Cuántos gramos de agua se obtienen a partir de 64 g de O_2 (con H_2 en exceso)? (H = 1, O = 16)",
                    "unidad": "g",
                    "respuesta": 72,
                    "pista": "Gramos de O_2 → moles (M = 32) → moles de H_2O (relación 1 : 2) → gramos.",
                    "explicacion": "64 ÷ 32 = 2 mol O_2 → 4 mol H_2O → 4 × 18 = 72 g.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "CaCO_3 → CaO + CO_2. ¿Cuántos gramos de CO_2 se obtienen de 50 g de CaCO_3? (M: CaCO_3 = 100, CO_2 = 44 g/mol)",
                    "unidad": "g",
                    "respuesta": 22,
                    "pista": "La relación molar entre CaCO_3 y CO_2 es 1 : 1.",
                    "explicacion": "50 ÷ 100 = 0.5 mol → 0.5 mol CO_2 → 0.5 × 44 = 22 g.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "¿Qué volumen ocupan 2 mol de un gas ideal a TPE?",
                    "unidad": "L",
                    "respuesta": 44.8,
                    "pista": "A TPE, cada mol de gas ocupa 22.4 L.",
                    "explicacion": "2 × 22.4 L = 44.8 L.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "En una ecuación balanceada, los coeficientes representan…",
                    "opciones": ["Masas en gramos", "Proporciones en moles", "Volúmenes de líquidos", "Subíndices"],
                    "respuesta": "Proporciones en moles",
                    "pista": "¿Por qué hay que convertir los gramos antes de usar la ecuación?",
                    "explicacion": "Los coeficientes relacionan moles (o moléculas), no gramos.",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "Reactivo limitante y rendimiento",
            "resumen": "Qué reactivo se acaba primero, cuánto sobra y cuánto producto se obtiene en realidad.",
            "teoria": [
                {
                    "titulo": "La analogía de los sándwiches",
                    "parrafos": [
                        "Para hacer un sándwich necesitas 2 panes y 1 rebanada de queso: 2 Pan + 1 Queso → 1 Sándwich.",
                        "Si tienes 10 panes y 3 rebanadas de queso, solo puedes hacer **3 sándwiches**: el queso se acaba primero y sobran 4 panes. Aunque tengas más panes, el queso **limita** lo que puedes producir.",
                        "En una reacción pasa exactamente lo mismo, pero con moles.",
                    ],
                    "tip": "El limitante no es el que hay menos en cantidad, sino el que se acaba primero según la receta.",
                },
                {
                    "titulo": "Reactivo limitante y en exceso",
                    "parrafos": [
                        "El **reactivo limitante** es el que se consume por completo primero. Cuando se acaba, la reacción se detiene, así que **determina la cantidad máxima de producto**.",
                        "Los demás reactivos están **en exceso**: una parte queda sin reaccionar al final.",
                        "En la industria, se suele poner en exceso el reactivo más barato para asegurar que el más caro se aproveche por completo.",
                    ],
                    "tip": "Todo el producto se calcula a partir del limitante, nunca del reactivo en exceso.",
                },
                {
                    "titulo": "Cómo identificar el limitante",
                    "puntos": [
                        "1. Convierte la cantidad de **cada reactivo a moles**.",
                        "2. Divide los moles de cada reactivo **entre su coeficiente** en la ecuación.",
                        "3. El **cociente más pequeño** corresponde al reactivo limitante.",
                        "4. Calcula el producto a partir de los moles del limitante.",
                    ],
                    "ejemplo": "Otra forma equivalente: calcula cuánto producto daría cada reactivo por separado. El que dé menos producto es el limitante.",
                    "tip": "Error típico: comparar gramos directamente. Siempre compara moles divididos entre su coeficiente.",
                },
                {
                    "titulo": "¿Cuánto sobra del reactivo en exceso?",
                    "puntos": [
                        "1. Con los moles del limitante y la relación molar, calcula cuántos moles del reactivo en exceso **reaccionan**.",
                        "2. Sobrante = moles iniciales − moles que reaccionan.",
                        "3. Si lo piden en gramos, multiplica por la masa molar.",
                    ],
                    "tip": "Comprueba tu resultado: el sobrante nunca puede ser negativo. Si lo es, elegiste mal el limitante.",
                },
                {
                    "titulo": "Rendimiento",
                    "parrafos": [
                        "En la práctica casi nunca se obtiene todo el producto calculado: hay reacciones secundarias, pérdidas al filtrar o reacciones que no terminan.",
                    ],
                    "tabla": {
                        "columnas": ["Concepto", "Significado"],
                        "filas": [
                            ["Rendimiento teórico", "Máximo calculado con estequiometría (a partir del limitante)"],
                            ["Rendimiento real", "Lo que se obtiene realmente en el laboratorio"],
                            ["% de rendimiento", "(real / teórico) × 100"],
                        ],
                    },
                    "tip": "Un rendimiento mayor que 100 % indica un error: producto húmedo, impuro o un cálculo equivocado.",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Encuentra el limitante",
                    "enunciado": "2H_2 + O_2 → 2H_2O. Se mezclan 4 g de H_2 y 16 g de O_2. ¿Cuál es el limitante, cuánta agua se forma y cuánto sobra?",
                    "datos": ["4 g de H_2 (M = 2 g/mol)", "16 g de O_2 (M = 32 g/mol)"],
                    "pasos": [
                        {"texto": "H_2: 4 g ÷ 2 g/mol = 2 mol → 2 ÷ 2 (coeficiente) = 1.", "detalle": "Dividir entre el coeficiente pone a los dos reactivos en la misma escala."},
                        {"texto": "O_2: 16 g ÷ 32 g/mol = 0.5 mol → 0.5 ÷ 1 = 0.5.", "detalle": "El coeficiente del O_2 es 1."},
                        {"texto": "El menor cociente es el del O_2 → es el limitante.", "detalle": "Aunque hay más gramos de O_2 (16 g) que de H_2 (4 g), el O_2 se acaba primero."},
                        {"texto": "Agua: 0.5 mol O_2 × (2 mol H_2O / 1 mol O_2) = 1 mol → 1 × 18 = 18 g.", "detalle": "El producto se calcula siempre a partir del limitante."},
                        {"texto": "H_2 que reacciona: 0.5 mol O_2 × (2 mol H_2 / 1 mol O_2) = 1 mol. Sobra 2 − 1 = 1 mol = 2 g.", "detalle": "Sobrante = inicial − lo que reaccionó."},
                    ],
                    "resultado": "Limitante: **O_2**. Se forman **18 g de H_2O** y sobran **2 g de H_2**.",
                    "tip": "Comprueba con la conservación de la masa: 4 g + 16 g = 18 g de agua + 2 g de H_2 sobrante. ✔",
                },
                {
                    "titulo": "Limitante en la síntesis del amoníaco",
                    "enunciado": "N_2 + 3H_2 → 2NH_3. Se mezclan 28 g de N_2 y 9 g de H_2. ¿Cuántos gramos de NH_3 se forman?",
                    "datos": ["M(N_2) = 28 g/mol", "M(H_2) = 2 g/mol", "M(NH_3) = 17 g/mol"],
                    "pasos": [
                        {"texto": "N_2: 28 ÷ 28 = 1 mol → 1 ÷ 1 = 1.", "detalle": "Coeficiente del N_2: 1."},
                        {"texto": "H_2: 9 ÷ 2 = 4.5 mol → 4.5 ÷ 3 = 1.5.", "detalle": "Coeficiente del H_2: 3."},
                        {"texto": "El menor cociente es 1 → el N_2 es el limitante.", "detalle": "Hay más H_2 del necesario: para 1 mol de N_2 solo se requieren 3 mol de H_2 y hay 4.5."},
                        {"texto": "NH_3: 1 mol N_2 × (2 / 1) = 2 mol → 2 × 17 = 34 g.", "detalle": "M(NH_3) = 14 + 3 × 1 = 17 g/mol."},
                    ],
                    "resultado": "Se forman **34 g de NH_3** (limitante: N_2).",
                    "tip": "Aquí el limitante es el que tiene más gramos. ¡Por eso nunca hay que comparar gramos!",
                },
                {
                    "titulo": "Rendimiento porcentual",
                    "enunciado": "En el primer ejemplo se esperaban 18 g de agua, pero se obtuvieron 15.3 g. ¿Cuál fue el rendimiento?",
                    "datos": ["Teórico = 18 g", "Real = 15.3 g"],
                    "pasos": [
                        {"texto": "Usa % = (real / teórico) × 100.", "detalle": "El real siempre va arriba."},
                        {"texto": "(15.3 ÷ 18) × 100 = 0.85 × 100 = 85 %.", "detalle": "Se obtuvo el 85 % de lo máximo posible."},
                    ],
                    "resultado": "**85 % de rendimiento.**",
                    "tip": "Si te dan el rendimiento y te piden el real: real = teórico × (% / 100).",
                },
            ],
            "examen": [
                {
                    "tipo": "opcion",
                    "pregunta": "N_2 + 3H_2 → 2NH_3. Se mezclan 2 mol de N_2 y 3 mol de H_2. ¿Cuál es el reactivo limitante?",
                    "opciones": ["N_2", "H_2", "Ninguno", "Ambos"],
                    "respuesta": "H_2",
                    "pista": "Divide los moles de cada reactivo entre su coeficiente y compara.",
                    "explicacion": "N_2: 2 ÷ 1 = 2; H_2: 3 ÷ 3 = 1. El menor es el H_2.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "Con esas mismas cantidades, ¿cuántos moles de NH_3 se forman como máximo?",
                    "unidad": "mol",
                    "respuesta": 2,
                    "pista": "Calcula el producto a partir del limitante.",
                    "explicacion": "3 mol H_2 × (2 / 3) = 2 mol de NH_3.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "2Na + Cl_2 → 2NaCl. Si reaccionan 46 g de Na (23 g/mol) con Cl_2 en exceso, ¿cuántos gramos de NaCl (58.5 g/mol) se forman?",
                    "unidad": "g",
                    "respuesta": 117,
                    "pista": "El Na es el limitante. Gramos → moles → relación 2 : 2 → gramos.",
                    "explicacion": "46 ÷ 23 = 2 mol Na → 2 mol NaCl → 2 × 58.5 = 117 g.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "El rendimiento teórico es 50 g y se obtienen 40 g. ¿Cuál es el rendimiento porcentual?",
                    "unidad": "%",
                    "respuesta": 80,
                    "pista": "(real / teórico) × 100.",
                    "explicacion": "(40 ÷ 50) × 100 = 80 %.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "El reactivo en exceso es el que…",
                    "opciones": [
                        "Se consume primero",
                        "Determina la cantidad de producto",
                        "Sobra cuando termina la reacción",
                        "Siempre tiene mayor masa",
                    ],
                    "respuesta": "Sobra cuando termina la reacción",
                    "pista": "Recuerda los panes que sobraban en la analogía de los sándwiches.",
                    "explicacion": "El limitante se acaba y el que está en exceso queda sin reaccionar.",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "Reacciones redox",
            "resumen": "Oxidación, reducción, números de oxidación y balanceo por ion-electrón.",
            "teoria": [
                {
                    "titulo": "Oxidación y reducción",
                    "parrafos": [
                        "Originalmente, «oxidarse» significaba combinarse con oxígeno, como el hierro que se oxida. Hoy la definición es más general y se basa en **electrones**:",
                        "La **oxidación** es la **pérdida de electrones** y la **reducción** es la **ganancia de electrones**. Ambas ocurren siempre juntas: los electrones que pierde una especie los gana otra. Por eso se habla de reacciones **redox** (reducción + oxidación).",
                    ],
                    "tabla": {
                        "columnas": ["Proceso", "Electrones", "Número de oxidación", "La especie es el…"],
                        "filas": [
                            ["Oxidación", "Pierde", "Aumenta", "Agente reductor"],
                            ["Reducción", "Gana", "Disminuye", "Agente oxidante"],
                        ],
                    },
                    "tip": "Regla mnemotécnica: «el que se oxida pierde; el que se reduce gana». Y el agente oxidante es el que SE reduce.",
                },
                {
                    "titulo": "Número de oxidación",
                    "parrafos": [
                        "El **número de oxidación** es la carga que tendría un átomo si todos sus enlaces fueran iónicos. Sirve para seguir la pista de los electrones en una reacción.",
                        "Se asigna con estas reglas, en orden de prioridad:",
                    ],
                    "tabla": {
                        "columnas": ["Caso", "Número de oxidación"],
                        "filas": [
                            ["Elemento libre (Fe, O_2, Cl_2)", "0"],
                            ["Ion monoatómico (Na^+, Cl^-)", "Igual a su carga"],
                            ["Metales del grupo 1 / grupo 2", "+1 / +2"],
                            ["Flúor", "−1"],
                            ["Hidrógeno", "+1 (−1 en hidruros metálicos como NaH)"],
                            ["Oxígeno", "−2 (−1 en peróxidos como H_2O_2)"],
                        ],
                    },
                    "puntos": [
                        "La suma de los números de oxidación es **0 en un compuesto neutro**.",
                        "En un ion poliatómico, la suma es **igual a la carga del ion** (en SO_4^2-, suma = −2).",
                    ],
                    "tip": "Para encontrar un número de oxidación desconocido, llámalo x y plantea la suma igual a la carga total.",
                },
                {
                    "titulo": "Identificar agentes oxidantes y reductores",
                    "parrafos": [
                        "Para analizar una reacción redox, asigna números de oxidación a cada átomo en reactivos y productos, y busca cuáles **cambian**.",
                        "El que **aumenta** se oxidó (es el agente reductor). El que **disminuye** se redujo (es el agente oxidante). Los electrones perdidos deben ser iguales a los ganados.",
                    ],
                    "ejemplo": "En 2Na + Cl_2 → 2NaCl: el Na pasa de 0 a +1 (se oxida) y el Cl pasa de 0 a −1 (se reduce).",
                    "tip": "Los agentes se nombran por lo que le HACEN a la otra especie: el oxidante oxida al otro y por eso él se reduce.",
                },
                {
                    "titulo": "Método del ion-electrón (medio ácido)",
                    "parrafos": [
                        "Muchas reacciones redox no se pueden balancear por tanteo. El método del ion-electrón separa la reacción en dos **semirreacciones** y las balancea por separado:",
                    ],
                    "puntos": [
                        "1. Separa la oxidación y la reducción.",
                        "2. Balancea los átomos distintos de O y H.",
                        "3. Balancea el **O** agregando **H_2O**.",
                        "4. Balancea el **H** agregando **H^+**.",
                        "5. Balancea la **carga** agregando **electrones (e^-)** del lado más positivo.",
                        "6. Multiplica las semirreacciones para que los electrones sean iguales.",
                        "7. Suma, cancela lo que se repite y comprueba átomos y cargas.",
                    ],
                    "tip": "Los electrones siempre van del lado con más carga positiva, para emparejar las cargas.",
                },
                {
                    "titulo": "Medio básico",
                    "parrafos": [
                        "Si la reacción ocurre en **medio básico**, primero se balancea como si fuera ácido. Después se agregan tantos **OH^-** como H^+ haya, **en ambos lados** de la ecuación.",
                        "Cada H^+ + OH^- se combina en H_2O. Al final se simplifican las moléculas de agua que aparecen en ambos lados.",
                    ],
                    "tip": "En medio básico no puede quedar H^+ en la ecuación final: hay que neutralizarlo con OH^-.",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Número de oxidación del Mn",
                    "enunciado": "¿Cuál es el número de oxidación del Mn en KMnO_4?",
                    "pasos": [
                        {"texto": "Asigna lo conocido: K = +1 (grupo 1) y O = −2.", "detalle": "Empieza por los átomos con reglas fijas."},
                        {"texto": "Plantea la suma: (+1) + x + 4(−2) = 0.", "detalle": "El KMnO_4 es neutro, así que la suma vale 0. Hay 4 oxígenos."},
                        {"texto": "Despeja: 1 + x − 8 = 0 → x = +7.", "detalle": "+7 es el máximo número de oxidación del manganeso: por eso el permanganato es un oxidante tan fuerte."},
                    ],
                    "resultado": "**Mn = +7.**",
                    "tip": "Los átomos en su número de oxidación máximo solo pueden reducirse, así que suelen ser buenos oxidantes.",
                },
                {
                    "titulo": "¿Quién se oxida?",
                    "enunciado": "Zn + Cu^2+ → Zn^2+ + Cu. Identifica la especie oxidada, la reducida y los agentes.",
                    "pasos": [
                        {"texto": "Zn: 0 → +2. Aumenta → se oxida (pierde 2 e^-).", "detalle": "El Zn metálico es elemento libre (0) y termina como ion Zn^2+."},
                        {"texto": "Cu: +2 → 0. Disminuye → se reduce (gana 2 e^-).", "detalle": "El ion Cu^2+ termina como cobre metálico."},
                        {"texto": "Agente reductor: Zn. Agente oxidante: Cu^2+.", "detalle": "El Zn le da electrones al Cu^2+ (lo reduce); el Cu^2+ le quita electrones al Zn (lo oxida)."},
                    ],
                    "resultado": "**Se oxida el Zn (reductor); se reduce el Cu^2+ (oxidante).**",
                    "tip": "Electrones perdidos (2) = electrones ganados (2). Si no coinciden, la ecuación está mal balanceada.",
                },
                {
                    "titulo": "Balanceo ion-electrón",
                    "enunciado": "Balancea en medio ácido: Fe^2+ + MnO_4^- → Fe^3+ + Mn^2+",
                    "pasos": [
                        {"texto": "Oxidación: Fe^2+ → Fe^3+ + e^-.", "detalle": "El Fe pasa de +2 a +3: pierde 1 electrón."},
                        {"texto": "Reducción: MnO_4^- → Mn^2+. Balancea O con agua: MnO_4^- → Mn^2+ + 4H_2O.", "detalle": "Hay 4 O a la izquierda, así que se agregan 4 H_2O a la derecha."},
                        {"texto": "Balancea H con H^+: MnO_4^- + 8H^+ → Mn^2+ + 4H_2O.", "detalle": "Las 4 moléculas de agua tienen 8 H."},
                        {"texto": "Carga: izquierda −1 + 8 = +7; derecha +2. Agrega 5e^-: MnO_4^- + 8H^+ + 5e^- → Mn^2+ + 4H_2O.", "detalle": "Los 5 electrones van a la izquierda (el lado más positivo) para bajar de +7 a +2."},
                        {"texto": "Iguala electrones: multiplica la oxidación por 5 → 5Fe^2+ → 5Fe^3+ + 5e^-.", "detalle": "Así se pierden 5 y se ganan 5."},
                        {"texto": "Suma y cancela los 5e^-. Comprueba la carga: izquierda 10 − 1 + 8 = +17; derecha 15 + 2 = +17. ✔", "detalle": "Comprobar la carga es tan importante como comprobar los átomos."},
                    ],
                    "resultado": "**5Fe^2+ + MnO_4^- + 8H^+ → 5Fe^3+ + Mn^2+ + 4H_2O**",
                    "tip": "Esta reacción se usa en el laboratorio para medir cuánto hierro hay en una muestra.",
                },
            ],
            "examen": [
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuál es el número de oxidación del S en H_2SO_4?",
                    "respuesta": 6,
                    "pista": "H = +1, O = −2 y la suma total es 0.",
                    "explicacion": "2(+1) + x + 4(−2) = 0 → x = +6.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuál es el número de oxidación del Cr en K_2Cr_2O_7?",
                    "respuesta": 6,
                    "pista": "Hay 2 átomos de Cr: plantea 2(+1) + 2x + 7(−2) = 0.",
                    "explicacion": "2(+1) + 2x + 7(−2) = 0 → 2x = 12 → x = +6.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "En 2Na + Cl_2 → 2NaCl, ¿qué especie se oxida?",
                    "opciones": ["Cl_2", "Na", "NaCl", "Ninguna"],
                    "respuesta": "Na",
                    "pista": "Busca la especie cuyo número de oxidación aumenta.",
                    "explicacion": "Na pasa de 0 a +1: pierde un electrón.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "El agente oxidante es la especie que…",
                    "opciones": [
                        "Se oxida (pierde electrones)",
                        "Se reduce (gana electrones)",
                        "No cambia su número de oxidación",
                        "Siempre es el oxígeno",
                    ],
                    "respuesta": "Se reduce (gana electrones)",
                    "pista": "El agente oxidante le quita electrones a la otra especie. ¿Qué le pasa a él?",
                    "explicacion": "Oxida a la otra especie quitándole electrones, así que ella se reduce.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "En la semirreacción MnO_4^- → Mn^2+, ¿cuántos electrones gana el manganeso?",
                    "unidad": "e^-",
                    "respuesta": 5,
                    "pista": "Calcula el número de oxidación del Mn antes y después.",
                    "explicacion": "El Mn pasa de +7 a +2: gana 5 electrones.",
                },
            ],
        },
    ],
    "quimica-2": [
        # --------------------------------------------------------------
        {
            "titulo": "Termoquímica",
            "resumen": "Energía en las reacciones: entalpía, ley de Hess, entalpías de formación y calorimetría.",
            "teoria": [
                {
                    "titulo": "Sistema, entorno y energía",
                    "parrafos": [
                        "En termodinámica, el **sistema** es la parte que estudiamos (por ejemplo, la reacción dentro de un vaso) y el **entorno** es todo lo demás.",
                        "El sistema intercambia energía con el entorno en forma de **calor (q)** o de **trabajo (w)**. La **primera ley de la termodinámica** dice que la energía se conserva: **ΔU = q + w**.",
                        "Convención de signos: si el sistema **recibe** calor, q > 0; si lo **libera**, q < 0.",
                    ],
                    "tip": "Todos los signos se ven desde el punto de vista del sistema: lo que entra es positivo y lo que sale es negativo.",
                },
                {
                    "titulo": "Entalpía (ΔH)",
                    "parrafos": [
                        "La **entalpía (H)** es una función de estado cuyo cambio, ΔH, es igual al **calor intercambiado a presión constante**, que es como ocurren la mayoría de las reacciones en un laboratorio abierto.",
                        "Una **ecuación termoquímica** incluye el valor de ΔH y los **estados de agregación**, que importan: formar H_2O(l) libera más energía que formar H_2O(g).",
                    ],
                    "tabla": {
                        "columnas": ["Tipo", "Signo de ΔH", "Qué pasa", "Ejemplo"],
                        "filas": [
                            ["Exotérmica", "ΔH < 0", "Libera calor; el entorno se calienta", "Combustión, neutralización"],
                            ["Endotérmica", "ΔH > 0", "Absorbe calor; el entorno se enfría", "Fundir hielo, compresas frías"],
                        ],
                    },
                    "tip": "Exo = hacia afuera (sale calor, ΔH negativo). Endo = hacia adentro (entra calor, ΔH positivo).",
                },
                {
                    "titulo": "Cómo manipular ecuaciones termoquímicas",
                    "puntos": [
                        "Si **multiplicas** una ecuación por n, ΔH también se multiplica por n.",
                        "Si **inviertes** la ecuación, ΔH cambia de signo.",
                        "Si **sumas** ecuaciones, sus ΔH también se suman.",
                    ],
                    "ejemplo": "Si H_2 + ½O_2 → H_2O(l) tiene ΔH = −285.8 kJ, entonces 2H_2 + O_2 → 2H_2O(l) tiene ΔH = −571.6 kJ, y 2H_2O(l) → 2H_2 + O_2 tiene ΔH = +571.6 kJ.",
                    "tip": "ΔH es una propiedad extensiva: si duplicas la cantidad de sustancia, duplicas la energía.",
                },
                {
                    "titulo": "Ley de Hess",
                    "parrafos": [
                        "Como la entalpía es una **función de estado**, ΔH solo depende del estado inicial y del final, no del camino.",
                        "La **ley de Hess** dice que si una reacción puede escribirse como la suma de varios pasos, **su ΔH es la suma de los ΔH de esos pasos**.",
                        "Sirve para calcular ΔH de reacciones difíciles de medir directamente: se combinan ecuaciones conocidas (invirtiéndolas o multiplicándolas) hasta obtener la reacción deseada.",
                    ],
                    "tip": "En Hess, acomoda primero las ecuaciones para que las sustancias que quieres queden del lado correcto y con el coeficiente correcto.",
                },
                {
                    "titulo": "Entalpías de formación",
                    "parrafos": [
                        "La **entalpía estándar de formación (ΔH°f)** es el cambio de entalpía al formar 1 mol de un compuesto a partir de sus elementos en estado estándar (25 °C y 1 atm).",
                        "La ΔH°f de un **elemento en su forma estándar** (O_2(g), H_2(g), C(grafito), Fe(s)…) es **cero**.",
                        "Con las tablas de ΔH°f se calcula ΔH° de cualquier reacción:",
                        "**ΔH°r = Σ n·ΔH°f(productos) − Σ n·ΔH°f(reactivos)**",
                    ],
                    "tip": "«Productos menos reactivos», y multiplica cada ΔH°f por su coeficiente.",
                },
                {
                    "titulo": "Calorimetría",
                    "parrafos": [
                        "La **calorimetría** mide el calor absorbido o liberado a partir de un cambio de temperatura.",
                        "El calor necesario para cambiar la temperatura de una sustancia es **q = m·c·ΔT**, donde c es el **calor específico**: la energía para subir 1 °C a 1 g de sustancia.",
                    ],
                    "tabla": {
                        "columnas": ["Sustancia", "c (J/g·°C)"],
                        "filas": [
                            ["Agua líquida", "4.18"],
                            ["Aluminio", "0.90"],
                            ["Hierro", "0.45"],
                            ["Cobre", "0.39"],
                        ],
                    },
                    "tip": "El agua tiene un calor específico muy alto: se calienta y se enfría lentamente. ¡Por eso los océanos regulan el clima!",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Combustión del metano",
                    "enunciado": "CH_4 + 2O_2 → CO_2 + 2H_2O(l). Con ΔH°f (kJ/mol): CH_4 = −74.8; CO_2 = −393.5; H_2O(l) = −285.8, calcula ΔH°.",
                    "datos": ["ΔH°f(CH_4) = −74.8", "ΔH°f(CO_2) = −393.5", "ΔH°f(H_2O) = −285.8", "ΔH°f(O_2) = 0"],
                    "pasos": [
                        {"texto": "Productos: 1(−393.5) + 2(−285.8) = −965.1 kJ.", "detalle": "Multiplica cada ΔH°f por su coeficiente: hay 2 moles de agua."},
                        {"texto": "Reactivos: 1(−74.8) + 2(0) = −74.8 kJ.", "detalle": "El O_2 es un elemento en estado estándar: su ΔH°f es 0."},
                        {"texto": "ΔH° = productos − reactivos = −965.1 − (−74.8) = −890.3 kJ.", "detalle": "Cuidado con el doble signo: restar un negativo es sumar."},
                    ],
                    "resultado": "**ΔH° = −890.3 kJ** por mol de CH_4 (exotérmica).",
                    "tip": "Las combustiones siempre son exotérmicas: por eso las usamos para obtener energía.",
                },
                {
                    "titulo": "Ley de Hess",
                    "enunciado": "Con (1) C + O_2 → CO_2, ΔH = −393.5 kJ y (2) CO + ½O_2 → CO_2, ΔH = −283.0 kJ, calcula ΔH de C + ½O_2 → CO.",
                    "pasos": [
                        {"texto": "En la reacción objetivo, el C es reactivo: la ecuación (1) se deja igual.", "detalle": "C + O_2 → CO_2, ΔH = −393.5 kJ."},
                        {"texto": "En la reacción objetivo, el CO es producto, pero en (2) es reactivo: invierte (2).", "detalle": "CO_2 → CO + ½O_2, ΔH = +283.0 kJ (al invertir cambia el signo)."},
                        {"texto": "Suma: C + O_2 + CO_2 → CO_2 + CO + ½O_2.", "detalle": "Se cancela el CO_2 de ambos lados y del O_2 queda O_2 − ½O_2 = ½O_2 a la izquierda."},
                        {"texto": "Queda C + ½O_2 → CO y ΔH = −393.5 + 283.0 = −110.5 kJ.", "detalle": "Los ΔH se suman igual que las ecuaciones."},
                    ],
                    "resultado": "**ΔH = −110.5 kJ.**",
                    "tip": "Esta reacción no se puede medir directamente (siempre se forma algo de CO_2). ¡Para eso sirve la ley de Hess!",
                },
                {
                    "titulo": "Calentar agua",
                    "enunciado": "¿Cuánto calor se necesita para calentar 100 g de agua de 20 °C a 30 °C?",
                    "datos": ["m = 100 g", "c = 4.18 J/g·°C", "ΔT = 30 − 20 = 10 °C"],
                    "pasos": [
                        {"texto": "Calcula ΔT = T final − T inicial = 30 − 20 = 10 °C.", "detalle": "Siempre final menos inicial; si sale negativo, el sistema perdió calor."},
                        {"texto": "q = m·c·ΔT = 100 × 4.18 × 10.", "detalle": "Las unidades g y °C se cancelan y quedan J."},
                        {"texto": "q = 4180 J = 4.18 kJ.", "detalle": "Divide entre 1000 para pasar a kJ."},
                    ],
                    "resultado": "**4180 J** (4.18 kJ).",
                    "tip": "Un cambio de 1 °C equivale a un cambio de 1 K, así que ΔT es igual en ambas escalas.",
                },
            ],
            "examen": [
                {
                    "tipo": "opcion",
                    "pregunta": "Una reacción con ΔH = −50 kJ es…",
                    "opciones": ["Endotérmica", "Exotérmica", "Isotérmica", "Imposible"],
                    "respuesta": "Exotérmica",
                    "pista": "ΔH negativo: ¿el calor sale o entra al sistema?",
                    "explicacion": "ΔH negativo: el sistema libera calor.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "Si A → B tiene ΔH = +40 kJ, ¿cuánto vale ΔH para 2B → 2A?",
                    "unidad": "kJ",
                    "respuesta": -80,
                    "pista": "La ecuación se invirtió y se multiplicó por 2.",
                    "explicacion": "Invertir cambia el signo (−40) y multiplicar por 2 lo duplica: −80 kJ.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "Calcula ΔH° de CaCO_3 → CaO + CO_2. ΔH°f (kJ/mol): CaCO_3 = −1206.9; CaO = −635.1; CO_2 = −393.5.",
                    "unidad": "kJ",
                    "respuesta": 178.3,
                    "pista": "Productos menos reactivos. Cuidado con los signos negativos.",
                    "explicacion": "(−635.1 − 393.5) − (−1206.9) = +178.3 kJ (endotérmica).",
                },
                {
                    "tipo": "numero",
                    "pregunta": "¿Cuántos joules se necesitan para calentar 50 g de agua de 25 °C a 45 °C? (c = 4.18 J/g·°C)",
                    "unidad": "J",
                    "respuesta": 4180,
                    "pista": "q = m·c·ΔT, con ΔT = 45 − 25.",
                    "explicacion": "q = 50 × 4.18 × 20 = 4180 J.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "La entalpía de formación estándar del O_2(g) es…",
                    "opciones": ["−393.5 kJ/mol", "1 kJ/mol", "0 kJ/mol", "Depende de la reacción"],
                    "respuesta": "0 kJ/mol",
                    "pista": "El O_2(g) es un elemento en su forma estándar.",
                    "explicacion": "Es un elemento en su forma estándar.",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "Entropía y energía libre",
            "resumen": "Cuándo una reacción ocurre por sí sola: entropía, segunda ley y ΔG = ΔH − TΔS.",
            "teoria": [
                {
                    "titulo": "¿Qué es un proceso espontáneo?",
                    "parrafos": [
                        "Un proceso **espontáneo** ocurre por sí solo, sin ayuda externa continua: el hielo se derrite a 25 °C, el hierro se oxida al aire o el café se enfría.",
                        "**Espontáneo no significa rápido.** La conversión de diamante en grafito es espontánea, pero tan lenta que tus diamantes durarán millones de años. La termodinámica dice si algo puede pasar; la cinética dice qué tan rápido.",
                        "Muchas reacciones espontáneas son exotérmicas, pero no todas: el hielo se derrite espontáneamente a temperatura ambiente aunque absorbe calor. Hace falta otro factor: la **entropía**.",
                    ],
                    "tip": "Espontáneo = que puede ocurrir solo. No dice nada de la velocidad.",
                },
                {
                    "titulo": "Entropía (S)",
                    "parrafos": [
                        "La **entropía** mide qué tan dispersa está la energía de un sistema, es decir, de cuántas formas distintas se pueden acomodar sus partículas. Coloquialmente se le asocia con el «desorden».",
                        "Se calcula el cambio en una reacción con entropías estándar: **ΔS° = Σ n·S°(productos) − Σ n·S°(reactivos)**. Se mide en J/K (o J/mol·K).",
                    ],
                    "tabla": {
                        "columnas": ["La entropía aumenta (ΔS > 0) cuando…", "Ejemplo"],
                        "filas": [
                            ["Se pasa de sólido → líquido → gas", "Hielo que se derrite, agua que se evapora"],
                            ["Aumentan los moles de gas", "CaCO_3(s) → CaO(s) + CO_2(g)"],
                            ["Se disuelve un sólido", "Sal en agua"],
                            ["Sube la temperatura", "Las partículas se mueven más"],
                        ],
                    },
                    "tip": "El atajo más útil: cuenta los moles de gas a cada lado. Si aumentan, ΔS > 0.",
                },
                {
                    "titulo": "Segunda y tercera ley",
                    "parrafos": [
                        "**Segunda ley de la termodinámica**: en todo proceso espontáneo, la entropía **del universo** (sistema + entorno) aumenta.",
                        "Por eso un sistema puede ordenarse (disminuir su entropía, como el agua al congelarse) si libera suficiente calor para desordenar todavía más al entorno.",
                        "**Tercera ley**: la entropía de un cristal perfecto a 0 K (el cero absoluto) es cero. Esto permite tener valores absolutos de S°, a diferencia de la entalpía.",
                    ],
                    "tip": "La entropía del sistema puede bajar; la del universo, en un proceso espontáneo, nunca.",
                },
                {
                    "titulo": "Energía libre de Gibbs",
                    "parrafos": [
                        "Calcular la entropía del universo es incómodo. Gibbs combinó entalpía y entropía del sistema en una sola función: la **energía libre**.",
                        "**ΔG = ΔH − T·ΔS**, con la temperatura en **kelvin**.",
                        "**Cuidado con las unidades**: ΔH suele darse en kJ y ΔS en J/K. Convierte ΔS a kJ/K dividiendo entre 1000 antes de sustituir.",
                    ],
                    "tabla": {
                        "columnas": ["Valor de ΔG", "Significado"],
                        "filas": [
                            ["ΔG < 0", "Espontáneo"],
                            ["ΔG > 0", "No espontáneo (el proceso inverso sí lo es)"],
                            ["ΔG = 0", "Equilibrio"],
                        ],
                    },
                    "tip": "El error número uno: mezclar kJ con J. Pasa todo a kJ antes de calcular.",
                },
                {
                    "titulo": "El efecto de la temperatura",
                    "parrafos": [
                        "En ΔG = ΔH − TΔS, el término TΔS crece con la temperatura. Así que dependiendo de los signos de ΔH y ΔS, la temperatura puede decidir si una reacción es espontánea:",
                    ],
                    "tabla": {
                        "columnas": ["ΔH", "ΔS", "¿Espontánea?"],
                        "filas": [
                            ["−", "+", "Siempre"],
                            ["+", "−", "Nunca"],
                            ["−", "−", "Solo a temperatura baja"],
                            ["+", "+", "Solo a temperatura alta"],
                        ],
                    },
                    "puntos": ["La temperatura de cambio se obtiene igualando ΔG a cero: **T = ΔH / ΔS**."],
                    "tip": "Cuando ΔH y ΔS tienen el mismo signo, la temperatura decide. Calcula T = ΔH / ΔS.",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Predice el signo de ΔS",
                    "enunciado": "Predice el signo de ΔS para 2H_2(g) + O_2(g) → 2H_2O(l).",
                    "pasos": [
                        {"texto": "Cuenta los moles de gas: 2 + 1 = 3 a la izquierda.", "detalle": "Los gases son los que más contribuyen a la entropía."},
                        {"texto": "A la derecha hay 0 moles de gas (el agua es líquida).", "detalle": "Se pasa de gas a líquido: las partículas quedan mucho más ordenadas."},
                        {"texto": "Los moles de gas disminuyen → ΔS < 0.", "detalle": "Menos formas de acomodar las partículas."},
                    ],
                    "resultado": "**ΔS es negativo.**",
                    "tip": "Aun así, esta reacción es espontánea porque es muy exotérmica (ΔH muy negativo).",
                },
                {
                    "titulo": "Síntesis del amoníaco",
                    "enunciado": "N_2 + 3H_2 → 2NH_3 tiene ΔH = −92 kJ y ΔS = −199 J/K. ¿Es espontánea a 298 K?",
                    "datos": ["ΔH = −92 kJ", "ΔS = −199 J/K", "T = 298 K"],
                    "pasos": [
                        {"texto": "Convierte ΔS a kJ/K: −199 ÷ 1000 = −0.199 kJ/K.", "detalle": "Así ΔH y TΔS quedan en kJ."},
                        {"texto": "Calcula TΔS = 298 × (−0.199) = −59.3 kJ.", "detalle": "Resolver este término aparte evita errores de signo."},
                        {"texto": "ΔG = ΔH − TΔS = −92 − (−59.3) = −32.7 kJ.", "detalle": "Restar un negativo es sumar: −92 + 59.3."},
                        {"texto": "ΔG < 0 → espontánea.", "detalle": "Como ΔH < 0 y ΔS < 0, es espontánea solo a temperatura baja; a 298 K todavía lo es."},
                    ],
                    "resultado": "**ΔG = −32.7 kJ**: espontánea a 298 K.",
                    "tip": "Si subes mucho la temperatura, TΔS se vuelve más positivo y la reacción deja de ser espontánea.",
                },
                {
                    "titulo": "Temperatura de descomposición",
                    "enunciado": "CaCO_3 → CaO + CO_2 tiene ΔH = +178 kJ y ΔS = +161 J/K. ¿A partir de qué temperatura es espontánea?",
                    "pasos": [
                        {"texto": "ΔH > 0 y ΔS > 0 → espontánea solo a temperatura alta.", "detalle": "Revisa la tabla de signos."},
                        {"texto": "Convierte ΔS: 161 J/K = 0.161 kJ/K.", "detalle": "Siempre en las mismas unidades que ΔH."},
                        {"texto": "Iguala ΔG = 0: T = ΔH / ΔS = 178 / 0.161 ≈ 1106 K.", "detalle": "A esa temperatura el sistema está en el límite; por encima, ΔG se vuelve negativo."},
                        {"texto": "En grados Celsius: 1106 − 273 ≈ 832 °C.", "detalle": "Por eso los hornos de cal trabajan a temperaturas muy altas."},
                    ],
                    "resultado": "Es espontánea **por encima de ~1106 K (≈ 832 °C)**.",
                    "tip": "T = ΔH / ΔS siempre da el resultado en kelvin.",
                },
            ],
            "examen": [
                {
                    "tipo": "opcion",
                    "pregunta": "¿En cuál de estos procesos aumenta la entropía del sistema?",
                    "opciones": ["El vapor se condensa", "El hielo se derrite", "El agua se congela", "Un gas se comprime"],
                    "respuesta": "El hielo se derrite",
                    "pista": "Busca el proceso en el que las partículas ganan libertad de movimiento.",
                    "explicacion": "Al pasar de sólido a líquido, las partículas tienen más libertad de movimiento.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "ΔH = −100 kJ y ΔS = +0.2 kJ/K. Calcula ΔG a 300 K.",
                    "unidad": "kJ",
                    "respuesta": -160,
                    "pista": "ΔG = ΔH − TΔS; aquí ΔS ya está en kJ/K.",
                    "explicacion": "ΔG = −100 − 300 × 0.2 = −160 kJ.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "ΔH = +50 kJ y ΔS = +0.1 kJ/K. ¿A partir de qué temperatura es espontánea la reacción?",
                    "unidad": "K",
                    "respuesta": 500,
                    "pista": "Iguala ΔG a cero y despeja T.",
                    "explicacion": "T = ΔH / ΔS = 50 / 0.1 = 500 K.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Si ΔH > 0 y ΔS < 0, la reacción es…",
                    "opciones": [
                        "Espontánea a cualquier temperatura",
                        "Espontánea solo a temperatura alta",
                        "Espontánea solo a temperatura baja",
                        "No espontánea a ninguna temperatura",
                    ],
                    "respuesta": "No espontánea a ninguna temperatura",
                    "pista": "Revisa el signo de cada término de ΔG = ΔH − TΔS.",
                    "explicacion": "Ambos términos hacen ΔG positivo: ΔH > 0 y −TΔS > 0.",
                },
                {
                    "tipo": "numero",
                    "pregunta": "ΔH = −20 kJ y ΔS = −50 J/K. Calcula ΔG a 300 K. (Cuidado con las unidades)",
                    "unidad": "kJ",
                    "respuesta": -5,
                    "pista": "Primero convierte ΔS a kJ/K dividiendo entre 1000.",
                    "explicacion": "ΔS = −0.05 kJ/K → ΔG = −20 − 300 × (−0.05) = −20 + 15 = −5 kJ.",
                },
            ],
        },
        # --------------------------------------------------------------
        {
            "titulo": "Equilibrio químico",
            "resumen": "La constante de equilibrio, el cociente Q, el principio de Le Châtelier y tablas ICE.",
            "teoria": [
                {
                    "titulo": "Reacciones reversibles y equilibrio dinámico",
                    "parrafos": [
                        "Muchas reacciones no llegan hasta el final: a medida que se forman productos, estos reaccionan entre sí para regresar a reactivos. Son **reacciones reversibles** y se escriben con una doble flecha: ⇌.",
                        "Al principio la reacción directa es rápida y la inversa lenta. Con el tiempo, la directa se hace más lenta y la inversa más rápida, hasta que **las dos velocidades se igualan**. Ese es el **equilibrio químico**.",
                        "Es un equilibrio **dinámico**: las reacciones no se detienen, pero como ocurren al mismo ritmo, las concentraciones ya no cambian. **Constantes no significa iguales**: puede haber muchos más productos que reactivos, o al revés.",
                    ],
                    "tip": "Imagina una escalera eléctrica en la que subes al mismo ritmo que baja: te mueves, pero te quedas en el mismo lugar.",
                },
                {
                    "titulo": "La constante de equilibrio (Kc)",
                    "parrafos": [
                        "Para aA + bB ⇌ cC + dD, en el equilibrio se cumple:",
                        "**Kc = [C]^c[D]^d / ([A]^a[B]^b)**",
                        "Los corchetes indican concentraciones molares (mol/L) **en el equilibrio**. Los coeficientes se vuelven exponentes.",
                        "Los **sólidos y líquidos puros no aparecen** en la expresión, porque su concentración no cambia. Para gases también se puede usar Kp, con presiones parciales: Kp = Kc·(RT) elevado a Δn, donde Δn es el cambio en moles de gas.",
                    ],
                    "tip": "Productos arriba, reactivos abajo, coeficientes como exponentes, y sin sólidos ni líquidos puros.",
                },
                {
                    "titulo": "Qué te dice el valor de K",
                    "tabla": {
                        "columnas": ["Valor de K", "En el equilibrio…"],
                        "filas": [
                            ["K ≫ 1 (por ejemplo, 10^5)", "Predominan los productos: la reacción «casi termina»"],
                            ["K ≈ 1", "Hay cantidades comparables de reactivos y productos"],
                            ["K ≪ 1 (por ejemplo, 10^-5)", "Predominan los reactivos: la reacción apenas avanza"],
                        ],
                    },
                    "puntos": [
                        "K solo cambia con la **temperatura**. No cambia al agregar reactivos, al cambiar la presión ni al usar un catalizador.",
                        "Si inviertes la reacción, la nueva constante es 1/K.",
                    ],
                    "tip": "K grande = muchos productos. K pequeña = muchos reactivos.",
                },
                {
                    "titulo": "El cociente de reacción (Q)",
                    "parrafos": [
                        "**Q** se calcula exactamente igual que K, pero con las concentraciones de **cualquier momento**, no necesariamente del equilibrio. Comparar Q con K dice hacia dónde avanzará la reacción:",
                    ],
                    "tabla": {
                        "columnas": ["Comparación", "La reacción avanza…"],
                        "filas": [
                            ["Q < K", "Hacia los productos (faltan productos)"],
                            ["Q > K", "Hacia los reactivos (sobran productos)"],
                            ["Q = K", "No avanza: está en equilibrio"],
                        ],
                    },
                    "tip": "Q siempre «persigue» a K. Si Q es menor, tiene que crecer formando productos.",
                },
                {
                    "titulo": "Principio de Le Châtelier",
                    "parrafos": [
                        "Si un sistema en equilibrio se perturba, el sistema se desplaza en la dirección que **contrarresta la perturbación** hasta alcanzar un nuevo equilibrio.",
                    ],
                    "tabla": {
                        "columnas": ["Perturbación", "El equilibrio se desplaza…"],
                        "filas": [
                            ["Agregar reactivo / quitar producto", "Hacia los productos"],
                            ["Quitar reactivo / agregar producto", "Hacia los reactivos"],
                            ["Aumentar la presión (reducir volumen)", "Hacia el lado con menos moles de gas"],
                            ["Aumentar la temperatura", "En el sentido endotérmico (K cambia)"],
                            ["Agregar un catalizador", "No se desplaza; solo se llega más rápido"],
                        ],
                    },
                    "tip": "El sistema siempre «lleva la contraria»: si le agregas algo, lo consume; si le quitas algo, lo produce.",
                },
                {
                    "titulo": "Tablas ICE",
                    "parrafos": [
                        "Para calcular concentraciones en el equilibrio se usa una **tabla ICE**: **I**nicial, **C**ambio y **E**quilibrio.",
                    ],
                    "puntos": [
                        "1. Escribe las concentraciones **iniciales**.",
                        "2. Escribe el **cambio** en función de x, usando los coeficientes (si se consume x de A, se forman 2x de un producto con coeficiente 2).",
                        "3. **Equilibrio** = inicial + cambio.",
                        "4. Sustituye en la expresión de K y despeja x.",
                    ],
                    "tip": "Los cambios en la tabla ICE siempre siguen la proporción de los coeficientes.",
                },
            ],
            "ejemplos": [
                {
                    "titulo": "Escribe Kc",
                    "enunciado": "Escribe la expresión de Kc para N_2 + 3H_2 ⇌ 2NH_3.",
                    "pasos": [
                        {"texto": "Numerador: el producto elevado a su coeficiente → [NH_3]^2.", "detalle": "El coeficiente 2 se vuelve exponente."},
                        {"texto": "Denominador: los reactivos con sus coeficientes → [N_2][H_2]^3.", "detalle": "El exponente 1 no se escribe."},
                    ],
                    "resultado": "**Kc = [NH_3]^2 / ([N_2][H_2]^3)**",
                    "tip": "Los coeficientes se vuelven exponentes, nunca multiplicadores.",
                },
                {
                    "titulo": "Calcula Kc",
                    "enunciado": "H_2 + I_2 ⇌ 2HI. En el equilibrio: [H_2] = 0.1 M, [I_2] = 0.1 M, [HI] = 0.8 M. Calcula Kc.",
                    "pasos": [
                        {"texto": "Escribe la expresión: Kc = [HI]^2 / ([H_2][I_2]).", "detalle": "Primero la expresión y después los números."},
                        {"texto": "Sustituye: Kc = 0.8^2 / (0.1 × 0.1) = 0.64 / 0.01.", "detalle": "No olvides elevar 0.8 al cuadrado."},
                        {"texto": "Kc = 64.", "detalle": "Kc > 1: en el equilibrio predominan los productos."},
                    ],
                    "resultado": "**Kc = 64.**",
                    "tip": "Kc no lleva unidades en este curso.",
                },
                {
                    "titulo": "Aplica Le Châtelier",
                    "enunciado": "N_2 + 3H_2 ⇌ 2NH_3, con ΔH < 0. ¿Qué pasa si aumentas la presión? ¿Y si aumentas la temperatura?",
                    "pasos": [
                        {"texto": "Cuenta moles de gas: 1 + 3 = 4 a la izquierda y 2 a la derecha.", "detalle": "La presión solo afecta a los gases."},
                        {"texto": "Más presión → hacia el lado con menos moles de gas → hacia el NH_3.", "detalle": "Menos moléculas de gas ocupan menos espacio y bajan la presión."},
                        {"texto": "La reacción directa es exotérmica: el calor actúa como un «producto».", "detalle": "N_2 + 3H_2 ⇌ 2NH_3 + calor."},
                        {"texto": "Más temperatura (agregar calor) → hacia los reactivos, y K disminuye.", "detalle": "El sistema consume el calor agregado favoreciendo la reacción endotérmica (la inversa)."},
                    ],
                    "resultado": "Presión ↑ → **más NH_3**. Temperatura ↑ → **menos NH_3**.",
                    "tip": "En la industria (proceso Haber) se usa alta presión y una temperatura intermedia con catalizador para producir amoníaco a buena velocidad.",
                },
                {
                    "titulo": "Tabla ICE",
                    "enunciado": "H_2 + I_2 ⇌ 2HI con Kc = 64. Si se empieza con [H_2] = [I_2] = 1 M y nada de HI, ¿cuáles son las concentraciones en el equilibrio?",
                    "pasos": [
                        {"texto": "Inicial: H_2 = 1, I_2 = 1, HI = 0.", "detalle": "Como no hay HI, la reacción avanza hacia los productos."},
                        {"texto": "Cambio: H_2 = −x, I_2 = −x, HI = +2x.", "detalle": "Por cada x de H_2 que se consume se forman 2x de HI (coeficiente 2)."},
                        {"texto": "Equilibrio: H_2 = 1 − x, I_2 = 1 − x, HI = 2x.", "detalle": "Inicial + cambio."},
                        {"texto": "Sustituye: 64 = (2x)^2 / (1 − x)^2. Saca raíz: 8 = 2x / (1 − x).", "detalle": "Como numerador y denominador son cuadrados perfectos, la raíz simplifica el álgebra."},
                        {"texto": "8 − 8x = 2x → x = 0.8.", "detalle": "Despeja x."},
                        {"texto": "[H_2] = [I_2] = 0.2 M y [HI] = 1.6 M.", "detalle": "Comprueba: 1.6^2 / (0.2 × 0.2) = 2.56 / 0.04 = 64. ✔"},
                    ],
                    "resultado": "**[H_2] = [I_2] = 0.2 M; [HI] = 1.6 M.**",
                    "tip": "Comprueba siempre sustituyendo tus resultados en K.",
                },
            ],
            "examen": [
                {
                    "tipo": "numero",
                    "pregunta": "2SO_2 + O_2 ⇌ 2SO_3. En el equilibrio: [SO_2] = 0.2 M, [O_2] = 0.1 M y [SO_3] = 0.4 M. Calcula Kc.",
                    "respuesta": 40,
                    "pista": "Kc = [SO_3]^2 / ([SO_2]^2[O_2]). No olvides los cuadrados.",
                    "explicacion": "Kc = 0.4^2 / (0.2^2 × 0.1) = 0.16 / 0.004 = 40.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Si Q < K, la reacción…",
                    "opciones": ["Avanza hacia los reactivos", "Está en equilibrio", "Avanza hacia los productos", "Se detiene"],
                    "respuesta": "Avanza hacia los productos",
                    "pista": "Q tiene que crecer hasta alcanzar a K. ¿Qué tiene que aumentar?",
                    "explicacion": "Faltan productos para llegar a K, así que se forman más.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "En N_2 + 3H_2 ⇌ 2NH_3, si se retira NH_3, el equilibrio…",
                    "opciones": [
                        "Se desplaza hacia los reactivos",
                        "No cambia",
                        "Se desplaza hacia los productos",
                        "Se detiene",
                    ],
                    "respuesta": "Se desplaza hacia los productos",
                    "pista": "El sistema «lleva la contraria»: si le quitas algo, lo produce.",
                    "explicacion": "El sistema repone el producto retirado.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "¿Qué efecto tiene un catalizador sobre un sistema en equilibrio?",
                    "opciones": [
                        "Lo desplaza hacia los productos",
                        "Aumenta el valor de K",
                        "Hace que se alcance más rápido, sin desplazarlo",
                        "Lo desplaza hacia los reactivos",
                    ],
                    "respuesta": "Hace que se alcance más rápido, sin desplazarlo",
                    "pista": "Un catalizador acelera por igual la reacción directa y la inversa.",
                    "explicacion": "Acelera por igual la reacción directa y la inversa.",
                },
                {
                    "tipo": "opcion",
                    "pregunta": "Para CaCO_3(s) ⇌ CaO(s) + CO_2(g), la expresión de Kc es…",
                    "opciones": ["Kc = [CaO][CO_2] / [CaCO_3]", "Kc = [CO_2]", "Kc = 1 / [CO_2]", "Kc = [CaCO_3] / [CaO]"],
                    "respuesta": "Kc = [CO_2]",
                    "pista": "¿Qué sustancias no aparecen en la expresión de K?",
                    "explicacion": "Los sólidos puros no aparecen; solo queda el gas.",
                },
            ],
        },
    ],
}
