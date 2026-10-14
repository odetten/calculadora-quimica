import { useState, type FormEvent } from 'react'

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8000').replace(/\/$/, '')
const TOKEN_KEY = 'quimica-token'

export type AuthMode = 'login' | 'register'

interface AuthPageProps {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onSuccess: () => void
  onBack: () => void
}

export function AuthPage({ mode, onModeChange, onSuccess, onBack }: AuthPageProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [level, setLevel] = useState('prepa')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setBusy(true)
    setError('')

    try {
      const payload = mode === 'login'
        ? { email, password }
        : { nombre: name, email, password, nivel: level }
      const response = await fetch(`${API_URL}/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = await response.json().catch(() => null) as {
        token?: unknown
        detail?: unknown
      } | null

      if (!response.ok) {
        throw new Error(
          typeof result?.detail === 'string'
            ? result.detail
            : `No se pudo completar la solicitud (HTTP ${response.status}).`,
        )
      }
      if (typeof result?.token !== 'string' || !result.token) {
        throw new Error('El servidor no devolvió un token de sesión válido.')
      }

      localStorage.setItem(TOKEN_KEY, result.token)
      onSuccess()
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo conectar con el servidor.',
      )
    } finally {
      setBusy(false)
    }
  }

  const changeMode = (nextMode: AuthMode) => {
    setError('')
    onModeChange(nextMode)
  }

  return (
    <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-md flex-col justify-center px-6 py-12">
      <button type="button" className="mb-6 w-fit text-sm text-slate-600 hover:text-teal-800" onClick={onBack}>
        ← Volver
      </button>
      <h1 className="font-display text-3xl font-semibold text-slate-950">
        {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {mode === 'login'
          ? 'Inicia sesión para acceder a tus cursos e historial.'
          : 'Regístrate para guardar tu avance y tus ecuaciones.'}
      </p>

      <form className="mt-6 grid gap-3" onSubmit={submit}>
        {mode === 'register' && (
          <input
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nombre"
            minLength={2}
            maxLength={80}
            required
          />
        )}
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Correo electrónico"
          maxLength={120}
          required
        />
        <input
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Contraseña (mínimo 8 caracteres)"
          minLength={mode === 'register' ? 8 : 1}
          maxLength={72}
          required
        />
        {mode === 'register' && (
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option value="basico">Básico</option>
            <option value="prepa">Prepa</option>
            <option value="universidad">Universidad</option>
          </select>
        )}
        <button type="submit" className="button-primary w-fit disabled:opacity-60" disabled={busy}>
          {busy ? 'Conectando…' : mode === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>

      {error && <p className="mt-4 text-sm text-rose-700" role="alert">{error}</p>}
      <p className="mt-6 text-sm text-slate-600">
        {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
        <button
          type="button"
          className="font-semibold text-teal-800 underline"
          onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}
        >
          {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
        </button>
      </p>
    </section>
  )
}
