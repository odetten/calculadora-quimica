import { useState, type FormEvent } from 'react'

function App() {
  const [prompt, setPrompt] = useState('')
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!prompt.trim() || isLoading) return

    setIsLoading(true)
    setAnswer('')
    setError('')

    try {
      const response = await fetch('http://localhost:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data: { answer?: unknown; detail?: unknown } = await response.json()

      if (!response.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : 'No se pudo obtener una respuesta del modelo.',
        )
      }
      if (typeof data.answer !== 'string') {
        throw new Error('La API devolvió una respuesta no válida.')
      }

      setAnswer(data.answer)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No se pudo conectar con la API. Comprueba que el backend esté en ejecución.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <label htmlFor="prompt">Pregunta:</label>
        <input
          id="prompt"
          type="text"
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          placeholder="Escribe tu pregunta"
          required
        />
        <button type="submit" disabled={isLoading || !prompt.trim()}>
          {isLoading ? 'Consultando...' : 'Enviar'}
        </button>
      </form>
      {error && <p role="alert">{error}</p>}
      {answer && <p aria-live="polite">{answer}</p>}
    </main>
  )
}

export default App
