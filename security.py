"""Contraseñas (bcrypt) y sesiones (JWT)."""
import os
from datetime import datetime, timedelta, timezone
from pathlib import Path

import bcrypt
import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from db import get_cursor

load_dotenv(Path(__file__).resolve().parent / "backend" / ".env")

JWT_SECRET = os.getenv("JWT_SECRET")
if not JWT_SECRET or len(JWT_SECRET) < 16:
    raise RuntimeError("Falta JWT_SECRET (mínimo 16 caracteres) en backend/.env")

JWT_ALGORITHM = "HS256"
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "720"))

_bearer = HTTPBearer(auto_error=False)


def _prepare(password: str) -> bytes:
    # bcrypt solo usa los primeros 72 bytes
    return password.encode("utf-8")[:72]


def hash_password(password: str) -> str:
    return bcrypt.hashpw(_prepare(password), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    try:
        return bcrypt.checkpw(_prepare(password), password_hash.encode("utf-8"))
    except ValueError:
        return False


def create_token(user_id: int) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": str(user_id), "iat": now, "exp": now + timedelta(minutes=JWT_EXPIRE_MINUTES)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def _unauthorized(detail: str = "Tu sesión no es válida. Inicia sesión de nuevo.") -> HTTPException:
    return HTTPException(status_code=401, detail=detail, headers={"WWW-Authenticate": "Bearer"})


def get_current_user(credentials: HTTPAuthorizationCredentials | None = Depends(_bearer)) -> dict:
    """Dependencia: devuelve {id, nombre, email, nivel} del usuario del token."""
    if credentials is None:
        raise _unauthorized("Necesitas iniciar sesión.")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = int(payload["sub"])
    except (jwt.PyJWTError, KeyError, ValueError):
        raise _unauthorized()

    with get_cursor() as cursor:
        cursor.execute("SELECT id, nombre, email, nivel FROM usuarios WHERE id = %s", (user_id,))
        user = cursor.fetchone()
    if user is None:
        raise _unauthorized()
    return user
