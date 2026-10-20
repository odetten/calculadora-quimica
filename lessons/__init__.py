"""Contenido de las lecciones: teoría, ejemplos resueltos y mini examen.

Un archivo por nivel (basico.py, prepa.py, universidad.py); cada uno define
LECCIONES = {"quimica-1": [...], "quimica-2": [...]}.

Formato del texto (lo interpreta el frontend):
  H_2O   -> subíndice      Mg^2+  -> superíndice      **texto** -> negritas

Cada lección:
  titulo, resumen
  teoria:   [{titulo, parrafos?, puntos?, tabla?: {columnas, filas}, ejemplo?, tip, emoji?, actividad?}]
            Se muestra un tema a la vez; 'tip' lo dice la mascota.
            'actividad' (nivel básico) es un juego: clasificar, verdadero_falso,
            descubre, construye o balanza. Hay que completarlo para avanzar.
  ejemplos: [{titulo, enunciado, datos?, pasos: [{texto, detalle}], resultado, tip}]
            'detalle' explica el porqué de cada paso.
  examen:   [{tipo, pregunta, pista, explicacion, ...}]
            opcion        opciones = lista de textos, respuesta = texto de la correcta
            numero        respuesta = número (se acepta un 2 % de error), unidad opcional
            coeficientes  ecuacion = 'A + B -> C', respuesta = coeficientes en orden
            La pista se envía al alumno; respuesta y explicacion solo tras aprobar.
"""
from . import basico, prepa, universidad

PASS_PERCENT = 70

LESSONS = {
    "basico": basico.LECCIONES,
    "prepa": prepa.LECCIONES,
    "universidad": universidad.LECCIONES,
}

COURSE_TITLES = {"quimica-1": "Química 1", "quimica-2": "Química 2"}
