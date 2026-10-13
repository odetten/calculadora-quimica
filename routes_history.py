"""Historial tipo chat: ecuaciones balanceadas + explicaciones de la IA."""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel, Field

from db import get_cursor
from security import get_current_user

router = APIRouter(prefix="/history", tags=["history"])


class HistoryIn(BaseModel):
    ecuacion: str = Field(min_length=1, max_length=300)
    resultado: str = Field(min_length=1, max_length=400)
    explicacion: str | None = Field(default=None, max_length=50000)
    aplicaciones: str | None = Field(default=None, max_length=50000)


@router.post("", status_code=201)
def save_conversation(data: HistoryIn, user: dict = Depends(get_current_user)):
    messages = [
        (tipo, text.strip())
        for tipo, text in (("explicacion", data.explicacion), ("aplicaciones", data.aplicaciones))
        if text and text.strip()
    ]
    with get_cursor(commit=True) as cursor:
        cursor.execute(
            "INSERT INTO conversaciones (usuario_id, ecuacion, resultado) VALUES (%s, %s, %s)",
            (user["id"], data.ecuacion.strip(), data.resultado.strip()),
        )
        conversation_id = cursor.lastrowid
        if messages:
            cursor.executemany(
                "INSERT INTO mensajes (conversacion_id, tipo, contenido) VALUES (%s, %s, %s)",
                [(conversation_id, tipo, text) for tipo, text in messages],
            )
    return {"id": conversation_id}


@router.get("")
def list_conversations(limit: int = Query(default=50, ge=1, le=100), user: dict = Depends(get_current_user)):
    with get_cursor() as cursor:
        cursor.execute(
            "SELECT id, ecuacion, resultado, fecha FROM conversaciones "
            "WHERE usuario_id = %s ORDER BY fecha DESC, id DESC LIMIT %s",
            (user["id"], limit),
        )
        return cursor.fetchall()


@router.get("/{conversation_id}")
def get_conversation(conversation_id: int, user: dict = Depends(get_current_user)):
    with get_cursor() as cursor:
        cursor.execute(
            "SELECT id, ecuacion, resultado, fecha FROM conversaciones WHERE id = %s AND usuario_id = %s",
            (conversation_id, user["id"]),
        )
        conversation = cursor.fetchone()
        if conversation is None:
            raise HTTPException(status_code=404, detail="Conversación no encontrada.")

        cursor.execute(
            "SELECT tipo, contenido FROM mensajes WHERE conversacion_id = %s ORDER BY id",
            (conversation_id,),
        )
        texts = {row["tipo"]: row["contenido"] for row in cursor.fetchall()}

    conversation["explicacion"] = texts.get("explicacion")
    conversation["aplicaciones"] = texts.get("aplicaciones")
    return conversation


@router.delete("/{conversation_id}", status_code=204)
def delete_conversation(conversation_id: int, user: dict = Depends(get_current_user)):
    with get_cursor(commit=True) as cursor:
        cursor.execute(
            "DELETE FROM conversaciones WHERE id = %s AND usuario_id = %s",
            (conversation_id, user["id"]),
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Conversación no encontrada.")
