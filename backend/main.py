from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from ollama import ResponseError, chat
from pydantic import BaseModel, ConfigDict, Field

SYSTEM_PROMPT_PATH = Path(__file__).resolve().parent.parent / "system_prompt.txt"
try:
    SYSTEM_PROMPT = SYSTEM_PROMPT_PATH.read_text(encoding="utf-8").strip()
except OSError as error:
    raise RuntimeError(
        f"No se pudo leer el prompt del sistema: {SYSTEM_PROMPT_PATH}"
    ) from error

if not SYSTEM_PROMPT:
    raise RuntimeError(f"El archivo de prompt está vacío: {SYSTEM_PROMPT_PATH}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

class PromptRequest(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)
    prompt: str = Field(min_length=1)

@app.get("/")
def home():
    return {
        "message": "Bienvenido a la API de Llama3.1:8b. Envía un POST a /ask con un JSON que contenga el campo 'prompt' para obtener una respuesta."
    }

@app.post("/ask")
def ask_llama(request: PromptRequest):
    try:
        response = chat(
            model="llama3.1:8b",
            messages=[
                {
                    "role": "system",
                    "content": SYSTEM_PROMPT,
                },
                {
                    "role": "user",
                    "content": request.prompt,
                },
            ],
        )
        return {
            "answer": response.message.content,
        }
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