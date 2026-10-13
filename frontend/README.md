# Química: balanceador, cursos e IA

## Configuración

La base existente debe llamarse `quimica` y tener las tablas definidas en `quimica.sql`.
No vuelvas a ejecutar ese SQL si la base ya tiene datos: el archivo comienza borrando
y recreando la base.

En una terminal de PowerShell, configura las credenciales del backend:

```powershell
Copy-Item backend/.env.example backend/.env
```

Edita `backend/.env` con el usuario/contraseña de MySQL y reemplaza `JWT_SECRET` por
una cadena aleatoria de al menos 16 caracteres. La aplicación usa `DB_NAME=quimica`.

Instala y ejecuta la API desde `backend`:

```powershell
Set-Location backend
python -m pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Ollama debe estar iniciado y tener el modelo disponible:

```powershell
ollama pull llama3.1:8b
```

En otra terminal inicia la web:

```powershell
Set-Location frontend
npm install
npm run dev
```

La web permite balancear ecuaciones y consultar la IA sin iniciar sesión. Registro,
cursos, progreso e historial requieren que la API pueda conectarse a MySQL.
Para otra URL de API, define `VITE_API_URL` antes de iniciar Vite.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
