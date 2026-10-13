"""Cursos, problemas y progreso del usuario."""
import json
import re

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from db import get_cursor
from security import get_current_user

router = APIRouter(tags=["courses"])


class AnswerIn(BaseModel):
    answer: str = Field(min_length=1, max_length=300)


def _normalize_equation(text: str) -> str:
    """'2H_2 + O_2 → 2H_2O' y '2H2+O2->2H2O' se consideran iguales; '1Fe' = 'Fe'."""
    text = text.replace("→", "->")
    text = re.sub(r"[\s_]", "", text)
    return re.sub(r"(^|\+|->)1(?=[A-Z])", r"\1", text)


def _is_correct(answer: str, solution: str, options) -> bool:
    if options is not None:  # opción múltiple: texto exacto
        return answer.strip() == solution.strip()
    return _normalize_equation(answer) == _normalize_equation(solution)


def _load_options(value):
    if value is None:
        return None
    if isinstance(value, (bytes, bytearray)):
        value = value.decode("utf-8")
    return json.loads(value) if isinstance(value, str) else value


def _course_for_user(cursor, course_id: int, user: dict) -> dict:
    cursor.execute("SELECT id, nivel, tipo, titulo, descripcion FROM cursos WHERE id = %s", (course_id,))
    course = cursor.fetchone()
    if course is None or course["nivel"] != user["nivel"]:
        raise HTTPException(status_code=404, detail="Curso no encontrado.")
    return course


@router.get("/courses")
def list_courses(user: dict = Depends(get_current_user)):
    """Cursos del nivel del usuario, con su avance."""
    with get_cursor() as cursor:
        cursor.execute(
            """
            SELECT c.id, c.tipo, c.titulo, c.descripcion,
                   COUNT(p.id) AS total,
                   COALESCE(SUM(pr.correcto), 0) AS resueltos
            FROM cursos c
            LEFT JOIN problemas p ON p.curso_id = c.id
            LEFT JOIN progreso pr ON pr.problema_id = p.id AND pr.usuario_id = %s
            WHERE c.nivel = %s
            GROUP BY c.id, c.tipo, c.titulo, c.descripcion
            ORDER BY c.id
            """,
            (user["id"], user["nivel"]),
        )
        courses = cursor.fetchall()
    for course in courses:
        course["total"] = int(course["total"])
        course["resueltos"] = int(course["resueltos"])
    return courses


@router.get("/courses/{course_id}/problems")
def course_problems(course_id: int, user: dict = Depends(get_current_user)):
    with get_cursor() as cursor:
        course = _course_for_user(cursor, course_id, user)
        cursor.execute(
            """
            SELECT p.id, p.enunciado, p.solucion, p.opciones,
                   COALESCE(pr.correcto, 0) AS correcto
            FROM problemas p
            LEFT JOIN progreso pr ON pr.problema_id = p.id AND pr.usuario_id = %s
            WHERE p.curso_id = %s
            ORDER BY p.orden, p.id
            """,
            (user["id"], course_id),
        )
        rows = cursor.fetchall()

    problems = []
    for row in rows:
        item = {
            "id": row["id"],
            "enunciado": row["enunciado"],
            "opciones": _load_options(row["opciones"]),
            "correcto": bool(row["correcto"]),
        }
        if course["tipo"] == "memorama":  # las cartas necesitan ambos lados
            item["solucion"] = row["solucion"]
        problems.append(item)
    return {"course": course, "problems": problems}


@router.post("/problems/{problem_id}/answer")
def answer_problem(problem_id: int, data: AnswerIn, user: dict = Depends(get_current_user)):
    with get_cursor(commit=True) as cursor:
        cursor.execute(
            """
            SELECT p.solucion, p.opciones, c.nivel, c.tipo
            FROM problemas p JOIN cursos c ON c.id = p.curso_id
            WHERE p.id = %s
            """,
            (problem_id,),
        )
        problem = cursor.fetchone()
        if problem is None or problem["nivel"] != user["nivel"]:
            raise HTTPException(status_code=404, detail="Problema no encontrado.")
        if problem["tipo"] == "memorama":
            raise HTTPException(status_code=400, detail="Este problema es parte de un memorama.")

        correct = _is_correct(data.answer, problem["solucion"], _load_options(problem["opciones"]))
        cursor.execute(
            """
            INSERT INTO progreso (usuario_id, problema_id, correcto, intentos)
            VALUES (%s, %s, %s, 1)
            ON DUPLICATE KEY UPDATE intentos = intentos + 1, correcto = (correcto OR %s)
            """,
            (user["id"], problem_id, correct, correct),
        )
        cursor.execute(
            "SELECT intentos FROM progreso WHERE usuario_id = %s AND problema_id = %s",
            (user["id"], problem_id),
        )
        attempts = cursor.fetchone()["intentos"]

    result = {"correcto": correct, "intentos": attempts}
    if correct:
        result["solucion"] = problem["solucion"]
    return result


@router.post("/courses/{course_id}/complete")
def complete_memorama(course_id: int, user: dict = Depends(get_current_user)):
    """Marca como resueltas todas las cartas de un memorama terminado."""
    with get_cursor(commit=True) as cursor:
        course = _course_for_user(cursor, course_id, user)
        if course["tipo"] != "memorama":
            raise HTTPException(status_code=400, detail="Este curso no es un memorama.")
        cursor.execute("SELECT id FROM problemas WHERE curso_id = %s", (course_id,))
        ids = [row["id"] for row in cursor.fetchall()]
        if ids:
            cursor.executemany(
                """
                INSERT INTO progreso (usuario_id, problema_id, correcto, intentos)
                VALUES (%s, %s, TRUE, 1)
                ON DUPLICATE KEY UPDATE correcto = TRUE
                """,
                [(user["id"], problem_id) for problem_id in ids],
            )
    return {"completado": True, "total": len(ids)}
