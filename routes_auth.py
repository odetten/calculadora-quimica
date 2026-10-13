"""Registro, inicio de sesión y perfil."""
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from mysql.connector.errors import IntegrityError
from pydantic import BaseModel, Field

from db import get_cursor
from security import create_token, get_current_user, hash_password, verify_password

router = APIRouter(prefix="/auth", tags=["auth"])

Nivel = Literal["basico", "prepa", "universidad"]
EMAIL_PATTERN = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class RegisterIn(BaseModel):
    nombre: str = Field(min_length=2, max_length=80)
    email: str = Field(max_length=120, pattern=EMAIL_PATTERN)
    password: str = Field(min_length=8, max_length=72)
    nivel: Nivel


class LoginIn(BaseModel):
    email: str = Field(max_length=120)
    password: str = Field(min_length=1, max_length=72)


class NivelIn(BaseModel):
    nivel: Nivel


def _session(user: dict) -> dict:
    return {"token": create_token(user["id"]), "user": user}


@router.post("/register", status_code=201)
def register(data: RegisterIn):
    nombre = data.nombre.strip()
    email = data.email.strip().lower()
    if len(nombre) < 2:
        raise HTTPException(status_code=422, detail="Escribe tu nombre.")

    try:
        with get_cursor(commit=True) as cursor:
            cursor.execute(
                "INSERT INTO usuarios (nombre, email, password_hash, nivel) VALUES (%s, %s, %s, %s)",
                (nombre, email, hash_password(data.password), data.nivel),
            )
            user_id = cursor.lastrowid
    except IntegrityError:
        raise HTTPException(status_code=409, detail="Ya existe una cuenta con ese correo.")

    return _session({"id": user_id, "nombre": nombre, "email": email, "nivel": data.nivel})


@router.post("/login")
def login(data: LoginIn):
    email = data.email.strip().lower()
    with get_cursor() as cursor:
        cursor.execute(
            "SELECT id, nombre, email, nivel, password_hash FROM usuarios WHERE email = %s",
            (email,),
        )
        row = cursor.fetchone()

    if row is None or not verify_password(data.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos.")

    row.pop("password_hash")
    return _session(row)


@router.get("/me")
def me(user: dict = Depends(get_current_user)):
    return user


@router.put("/me")
def update_level(data: NivelIn, user: dict = Depends(get_current_user)):
    with get_cursor(commit=True) as cursor:
        cursor.execute("UPDATE usuarios SET nivel = %s WHERE id = %s", (data.nivel, user["id"]))
    return {**user, "nivel": data.nivel}
