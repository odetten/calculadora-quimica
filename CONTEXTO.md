# Contexto de conexión y puesta en marcha

## Cómo se conecta la aplicación

1. El frontend React/Vite envía las solicitudes a la API FastAPI. Por defecto usa `http://localhost:8000`; se puede cambiar con `VITE_API_URL`.
2. La API está en `backend/main.py`. Ahí se publican las rutas de IA (`/ask`, `/applications`) y se registran las rutas de autenticación, cursos y progreso, e historial.
3. `db.py` crea un pool de conexiones a MySQL. Lee la configuración local desde `backend/.env`, devuelve cursores como diccionarios y usa el conector en modo Python puro (`use_pure=True`) para evitar el fallo de la extensión nativa en el entorno usado para probar el proyecto.
4. `security.py` usa bcrypt para las contraseñas y JWT para las sesiones. El token se envía desde el frontend en el encabezado `Authorization: Bearer ...`.
5. Ollama es un servicio local separado. La API lo usa con el modelo `llama3.1:8b` para generar explicaciones y aplicaciones de elementos.

## Requisitos para cada compañero

- Git.
- Python 3.10 o posterior.
- MySQL 8, iniciado y accesible desde la computadora del compañero.
- Node.js compatible con Vite 8 (Node 20.19 o posterior, o Node 22.12 o posterior) y npm.
- Ollama instalado y el modelo `llama3.1:8b` descargado.

El `.env` no se sube a la rama porque contiene contraseñas y claves. Cada compañero debe crearlo en su propia computadora. `backend/.gitignore` ya excluye ese archivo.

## Configuración local

Desde la raíz del repositorio, en PowerShell:

```powershell
Copy-Item backend/.env.example backend/.env
notepad backend/.env
```

Editar `backend/.env` con los datos del MySQL de esa computadora:

```dotenv
DB_HOST=127.0.0.1
DB_PORT=3306
DB_CONNECT_TIMEOUT=5
DB_USER=root
DB_PASSWORD=CONTRASENA_LOCAL_DE_MYSQL
DB_NAME=quimica
DB_POOL_SIZE=5
JWT_SECRET=CLAVE_ALEATORIA_LOCAL_DE_32_CARACTERES_O_MAS
JWT_EXPIRE_MINUTES=720
```

Cada compañero debe reemplazar `DB_PASSWORD` y `JWT_SECRET`; no debe enviar esos valores por Git, chat ni capturas. Puede generar una clave JWT localmente con:

```powershell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

La clave JWT debe tener al menos 16 caracteres. Todos los procesos backend de una misma instalación deben usar la misma clave para mantener válidas sus sesiones.

## Base de datos

La aplicación espera que exista una base MySQL llamada `quimica`, con las tablas `usuarios`, `cursos`, `problemas`, `progreso`, `conversaciones` y `mensajes`. El esquema y los datos iniciales están descritos en `quimica.sql`.

**No ejecutar `quimica.sql` sobre una base existente con información:** el script empieza con `DROP DATABASE IF EXISTS quimica` y borra esa base antes de recrearla. Si un compañero necesita una base local nueva, debe ejecutarlo solo en su instalación de desarrollo vacía; después puede configurar su usuario y contraseña en su propio `.env`.

## Instalación y arranque

### Backend

Desde la raíz del repositorio:

```powershell
Set-Location backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

La documentación interactiva de la API queda en `http://127.0.0.1:8000/docs`.

### Ollama

Ollama debe estar iniciado. Si no se ejecuta automáticamente como servicio, abrir otra terminal y ejecutar:

```powershell
ollama serve
ollama pull llama3.1:8b
ollama list
```

`ollama list` debe mostrar `llama3.1:8b`. El modelo ocupa varios GB y se descarga una vez por computadora.

### Frontend

Abrir otra terminal desde la raíz:

```powershell
Set-Location frontend
npm ci
npm run dev
```

Vite muestra la URL local, normalmente `http://localhost:5173`. El archivo `frontend/package-lock.json` permite que `npm ci` instale versiones reproducibles.

## Comprobaciones rápidas

- Abrir `http://127.0.0.1:8000/` o `http://127.0.0.1:8000/docs` para comprobar FastAPI.
- Abrir la página indicada por Vite para comprobar el frontend.
- Iniciar sesión o crear una cuenta para probar cursos e historial; estas funciones necesitan que MySQL esté accesible y que su esquema tenga las tablas esperadas.
- Balancear una ecuación para probar la IA; además de la API, Ollama debe estar activo y tener `llama3.1:8b` instalado.
- Si la API informa que no puede conectarse a MySQL, revisar `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` y que el servidor MySQL esté iniciado.