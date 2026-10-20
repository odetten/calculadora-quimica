"""Lecciones por curso: teoría, ejemplos y mini examen que desbloquea la siguiente."""
import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from db import get_cursor
from lessons import COURSE_TITLES, LESSONS, PASS_PERCENT
from security import get_current_user

router = APIRouter(tags=["lessons"])

_CREATE_TABLE = """
CREATE TABLE IF NOT EXISTS progreso_lecciones (
  usuario_id INT UNSIGNED NOT NULL,
  leccion VARCHAR(60) NOT NULL,
  mejor_puntaje TINYINT UNSIGNED NOT NULL DEFAULT 0,
  aprobado BOOLEAN NOT NULL DEFAULT FALSE,
  intentos SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (usuario_id, leccion),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
)
"""
_table_ready = False


class ExamIn(BaseModel):
    respuestas: list[str] = Field(max_length=20)


def _ensure_table(cursor) -> None:
    """Crea la tabla de progreso la primera vez (así no hay que reimportar quimica.sql)."""
    global _table_ready
    if not _table_ready:
        cursor.execute(_CREATE_TABLE)
        _table_ready = True


def _lessons_for(user: dict, course: str) -> list[dict]:
    lessons = LESSONS.get(user["nivel"], {}).get(course)
    if lessons is None:
        raise HTTPException(status_code=404, detail="Curso no encontrado.")
    return lessons


def _key(user: dict, course: str, number: int) -> str:
    return f"{user['nivel']}:{course}:{number}"


def _progress(cursor, user: dict, course: str) -> dict[str, dict]:
    _ensure_table(cursor)
    cursor.execute(
        "SELECT leccion, mejor_puntaje, aprobado, intentos FROM progreso_lecciones "
        "WHERE usuario_id = %s AND leccion LIKE %s",
        (user["id"], f"{user['nivel']}:{course}:%"),
    )
    return {row["leccion"]: row for row in cursor.fetchall()}


def _unlocked(progress: dict, user: dict, course: str, number: int) -> bool:
    if number == 1:
        return True
    previous = progress.get(_key(user, course, number - 1))
    return bool(previous and previous["aprobado"])


def _parse_number(text: str) -> float | None:
    match = re.search(r"[-+−]?\d+(?:[.,]\d+)?", text)
    if not match:
        return None
    return float(match.group().replace("−", "-").replace(",", "."))


def _is_correct(question: dict, answer: str) -> bool:
    kind = question["tipo"]
    if kind == "opcion":
        return answer.strip() == question["respuesta"]
    if kind == "numero":
        value = _parse_number(answer)
        expected = question["respuesta"]
        return value is not None and abs(value - expected) <= max(abs(expected) * 0.02, 0.01)
    if kind == "coeficientes":
        parts = [part.strip() for part in answer.split(",")]
        if len(parts) != len(question["respuesta"]):
            return False
        try:
            given = [int(part) if part else 1 for part in parts]  # vacío = coeficiente 1
        except ValueError:
            return False
        return given == question["respuesta"]
    return False


def _public_question(question: dict) -> dict:
    """La pregunta sin la respuesta ni la explicación."""
    hidden = {"respuesta", "explicacion"}
    return {key: value for key, value in question.items() if key not in hidden}


@router.get("/lessons/{course}")
def list_lessons(course: str, user: dict = Depends(get_current_user)):
    """Camino de lecciones del curso con su estado: aprobada, disponible o bloqueada."""
    lessons = _lessons_for(user, course)
    with get_cursor(commit=True) as cursor:
        progress = _progress(cursor, user, course)

    items = []
    for number, lesson in enumerate(lessons, start=1):
        row = progress.get(_key(user, course, number))
        if row and row["aprobado"]:
            state = "aprobada"
        elif _unlocked(progress, user, course, number):
            state = "disponible"
        else:
            state = "bloqueada"
        items.append({
            "numero": number,
            "titulo": lesson["titulo"],
            "resumen": lesson["resumen"],
            "estado": state,
            "mejor_puntaje": row["mejor_puntaje"] if row else None,
        })
    return {
        "curso": course,
        "titulo": COURSE_TITLES.get(course, course),
        "nivel": user["nivel"],
        "aprobado_minimo": PASS_PERCENT,
        "lecciones": items,
    }


@router.get("/lessons/{course}/{number}")
def get_lesson(course: str, number: int, user: dict = Depends(get_current_user)):
    lessons = _lessons_for(user, course)
    if not 1 <= number <= len(lessons):
        raise HTTPException(status_code=404, detail="Lección no encontrada.")
    with get_cursor(commit=True) as cursor:
        progress = _progress(cursor, user, course)
    if not _unlocked(progress, user, course, number):
        raise HTTPException(status_code=403, detail="Aprueba la lección anterior para desbloquear esta.")

    lesson = lessons[number - 1]
    row = progress.get(_key(user, course, number))
    return {
        "numero": number,
        "total": len(lessons),
        "nivel": user["nivel"],
        "titulo": lesson["titulo"],
        "resumen": lesson["resumen"],
        "teoria": lesson["teoria"],
        "ejemplos": lesson["ejemplos"],
        "examen": [_public_question(question) for question in lesson["examen"]],
        "aprobado_minimo": PASS_PERCENT,
        "aprobada": bool(row and row["aprobado"]),
        "mejor_puntaje": row["mejor_puntaje"] if row else None,
    }


@router.post("/lessons/{course}/{number}/exam")
def submit_exam(course: str, number: int, data: ExamIn, user: dict = Depends(get_current_user)):
    lessons = _lessons_for(user, course)
    if not 1 <= number <= len(lessons):
        raise HTTPException(status_code=404, detail="Lección no encontrada.")
    questions = lessons[number - 1]["examen"]
    if len(data.respuestas) != len(questions):
        raise HTTPException(status_code=400, detail="Responde todas las preguntas del examen.")

    results = [_is_correct(question, answer) for question, answer in zip(questions, data.respuestas)]
    score = round(100 * sum(results) / len(questions))
    passed = score >= PASS_PERCENT

    with get_cursor(commit=True) as cursor:
        progress = _progress(cursor, user, course)
        if not _unlocked(progress, user, course, number):
            raise HTTPException(status_code=403, detail="Aprueba la lección anterior para desbloquear esta.")
        cursor.execute(
            """
            INSERT INTO progreso_lecciones (usuario_id, leccion, mejor_puntaje, aprobado, intentos)
            VALUES (%s, %s, %s, %s, 1)
            ON DUPLICATE KEY UPDATE intentos = intentos + 1,
                                    mejor_puntaje = GREATEST(mejor_puntaje, VALUES(mejor_puntaje)),
                                    aprobado = (aprobado OR VALUES(aprobado))
            """,
            (user["id"], _key(user, course, number), score, passed),
        )
        cursor.execute(
            "SELECT intentos FROM progreso_lecciones WHERE usuario_id = %s AND leccion = %s",
            (user["id"], _key(user, course, number)),
        )
        attempts = cursor.fetchone()["intentos"]

    feedback = []
    for question, correct in zip(questions, results):
        item = {"correcto": correct}
        if passed:  # al reprobar no se revelan las respuestas, para que repase y lo intente otra vez
            item["respuesta"] = question["respuesta"]
            item["explicacion"] = question["explicacion"]
        feedback.append(item)

    return {
        "puntaje": score,
        "aciertos": sum(results),
        "total": len(questions),
        "aprobado": passed,
        "aprobado_minimo": PASS_PERCENT,
        "intentos": attempts,
        "siguiente_desbloqueada": passed and number < len(lessons),
        "resultados": feedback,
    }
