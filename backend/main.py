from pathlib import Path
import sys

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ollama import ResponseError, chat
from pydantic import BaseModel, ConfigDict, Field

MODEL = "llama3.1:8b"
BASE_DIR = Path(__file__).resolve().parent.parent
if str(BASE_DIR) not in sys.path:
    sys.path.insert(0, str(BASE_DIR))

from routes_auth import router as auth_router
from routes_courses import router as courses_router
from routes_history import router as history_router
from routes_lessons import router as lessons_router


def load_prompt(*candidates: str) -> str:
    """Carga el primer archivo de prompt que exista entre los candidatos."""
    for name in candidates:
        path = BASE_DIR / name
        if not path.is_file():
            continue
        try:
            text = path.read_text(encoding="utf-8").strip()
        except OSError as error:
            raise RuntimeError(
                f"No se pudo leer el prompt del sistema: {path}"
            ) from error
        if not text:
            raise RuntimeError(f"El archivo de prompt está vacío: {path}")
        return text
    raise RuntimeError(
        f"No se encontró ningún archivo de prompt en {BASE_DIR}: {', '.join(candidates)}"
    )


# Explicación paso a paso del balanceo
SYSTEM_PROMPT = load_prompt("system_prompt.txt", "quimicasystempront.txt")
# Aplicaciones de cada elemento de la ecuación
APPLICATIONS_PROMPT = load_prompt("aplicaciones.txt")
# Explicación de la calculadora de configuración electrónica
ELECTRONIC_CONFIG_PROMPT = load_prompt("configuracion_electronica.txt")

EXPLANATION_OPTIONS = {"temperature": 0.2, "num_ctx": 4096, "num_predict": 2000}
APPLICATIONS_OPTIONS = {"temperature": 0.1, "num_ctx": 4096, "num_predict": 1800}
ELECTRONIC_CONFIG_OPTIONS = {"temperature": 0.2, "num_ctx": 4096, "num_predict": 1200}

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(auth_router)
app.include_router(courses_router)
app.include_router(history_router)
app.include_router(lessons_router)


class PromptRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    prompt: str = Field(min_length=1)


def run_chat(system_prompt: str, user_prompt: str, options: dict) -> dict:
    try:
        response = chat(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            options=options,
        )
        return {"answer": response.message.content}
    except ResponseError as error:
        if error.status_code == 404:
            raise HTTPException(
                status_code=503,
                detail="No se encontró llama3.1:8b. Descárgalo con 'ollama pull llama3.1:8b'.",
            ) from error
        raise HTTPException(
            status_code=502,
            detail=f"Error de Ollama: {error.error}",
        ) from error


@app.get("/")
def home():
    return {
        "message": "Bienvenido a la API de Llama3.1:8b. Envía un POST a /ask (explicación del balanceo), /applications (aplicaciones de los elementos) o /electronic-config (configuración electrónica) con un JSON que contenga el campo 'prompt'."
    }


@app.post("/ask")
def ask_llama(request: PromptRequest):
    return run_chat(SYSTEM_PROMPT, request.prompt, EXPLANATION_OPTIONS)


@app.post("/applications")
def element_applications(request: PromptRequest):
    return run_chat(APPLICATIONS_PROMPT, request.prompt, APPLICATIONS_OPTIONS)


@app.post("/electronic-config")
def explain_electronic_config(request: PromptRequest):
    return run_chat(
        ELECTRONIC_CONFIG_PROMPT,
        request.prompt,
        ELECTRONIC_CONFIG_OPTIONS,
    )