import { useEffect, useState } from 'react'
import { apiRequest, TOKEN_KEY } from './api.ts'

type User = { id: number; nombre: string; email: string; nivel: string }

export function LearningHub({ onAuthChange, onOpenHistory }: { onAuthChange: (authenticated: boolean) => void; onOpenHistory: () => void }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) return
    apiRequest<User>('/auth/me')
      .then((currentUser) => {
        setUser(currentUser)
        onAuthChange(true)
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        onAuthChange(false)
      })
  }, [onAuthChange])

  return (
    <section id="cursos" className="mx-auto w-full max-w-[1440px] scroll-mt-20 px-6 pt-5 sm:px-10" aria-label="Cuenta y aprendizaje">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          {user && <p className="mt-1 text-sm text-slate-600">{user.nombre} · nivel {user.nivel}</p>}
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <button type="button" className="keyboard-toggle px-3 py-2 text-sm" onClick={onOpenHistory}>Historial</button>
          </div>
        )}
      </div>
    </section>
  )
}
