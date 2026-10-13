"""Conexión a MySQL con un pool de conexiones."""
import logging
import os
from contextlib import contextmanager
from pathlib import Path

import mysql.connector
from dotenv import load_dotenv
from fastapi import HTTPException
from mysql.connector import pooling

load_dotenv(Path(__file__).resolve().parent / "backend" / ".env")

logger = logging.getLogger("quimica.db")
_pool: pooling.MySQLConnectionPool | None = None


def _get_pool() -> pooling.MySQLConnectionPool:
    global _pool
    if _pool is None:
        _pool = pooling.MySQLConnectionPool(
            pool_name="quimica_pool",
            pool_size=int(os.getenv("DB_POOL_SIZE", "5")),
            pool_reset_session=True,
            host=os.getenv("DB_HOST", "localhost"),
            port=int(os.getenv("DB_PORT", "3306")),
            connection_timeout=int(os.getenv("DB_CONNECT_TIMEOUT", "5")),
            user=os.getenv("DB_USER", "root"),
            password=os.getenv("DB_PASSWORD", ""),
            database=os.getenv("DB_NAME", "quimica"),
            charset="utf8mb4",
            collation="utf8mb4_unicode_ci",
            autocommit=False,
            use_pure=True,
        )
    return _pool


@contextmanager
def get_cursor(commit: bool = False):
    """Entrega un cursor que devuelve diccionarios.

    - commit=True guarda los cambios al terminar el bloque.
    - Si algo falla se hace rollback.
    - Los errores de conexión se convierten en un 503 legible.
    - IntegrityError (ej. correo repetido) se deja pasar para manejarlo en la ruta.
    """
    try:
        conn = _get_pool().get_connection()
    except mysql.connector.Error as exc:
        logger.error("No se pudo conectar a MySQL: %s", exc)
        raise HTTPException(status_code=503, detail="No se pudo conectar con la base de datos.")

    cursor = conn.cursor(dictionary=True)
    try:
        yield cursor
        if commit:
            conn.commit()
    except mysql.connector.errors.IntegrityError:
        conn.rollback()
        raise
    except mysql.connector.Error as exc:
        conn.rollback()
        logger.error("Error de MySQL: %s", exc)
        raise HTTPException(status_code=500, detail="Error en la base de datos.")
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        conn.close()
