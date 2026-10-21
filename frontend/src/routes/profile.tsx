import { useEffect, useState } from 'react'
import { ApiRequestError, apiRequest, TOKEN_KEY } from '../api.ts'
import type { CourseLessons } from '../lessons.ts'

type User = { id: number; nombre: string; email: string; nivel: 'basico' | 'prepa' | 'universidad' }
type PracticeCourse = { id: number; titulo: string; total: number; resueltos: number }

type ProfileData = {
  user: User
  lessonCourses: CourseLessons[]
  practiceCourses: PracticeCourse[]
  progressErrors: string[]
}

const LEVEL_LABELS: Record<User['nivel'], string> = {
  basico: 'Básico',
  prepa: 'Prepa',
  universidad: 'Universidad',
}

const LESSON_COURSES = ['quimica-1', 'quimica-2'] as const

export function ProfilePage({
  onBack,
  onLogout,
  onSessionExpired,
}: {
  onBack: () => void
  onLogout: () => void
  onSessionExpired: () => void
}) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [confirmLogout, setConfirmLogout] = useState(false)

  useEffect(() => {
    let cancelled = false

    const loadProfile = async () => {
      if (!localStorage.getItem(TOKEN_KEY)) {
        onSessionExpired()
        return
      }

      try {
        const user = await apiRequest<User>('/auth/me')
        const [practiceResult, ...lessonResults] = await Promise.allSettled([
          apiRequest<PracticeCourse[]>('/courses'),
          ...LESSON_COURSES.map((course) => apiRequest<CourseLessons>(`/lessons/${course}`)),
        ])
        if (cancelled) return
        const rejectedProgress = [practiceResult, ...lessonResults].filter(
          (result) => result.status === 'rejected',
        )
        if (rejectedProgress.some((result) => result.status === 'rejected' && result.reason instanceof ApiRequestError && result.reason.status === 401)) {
          onSessionExpired()
          return
        }

        const practiceCourses = practiceResult.status === 'fulfilled' ? practiceResult.value : []
        const progressErrors: string[] = []
        if (practiceResult.status === 'rejected') {
          progressErrors.push('No se pudo cargar el avance de ejercicios.')
        }

        const lessonCourses: CourseLessons[] = []
        lessonResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            lessonCourses.push(result.value)
          } else {
            progressErrors.push(`No se pudo cargar el avance de ${index === 0 ? 'Química 1' : 'Química 2'}.`)
          }
        })

        setProfile({ user, lessonCourses, practiceCourses, progressErrors })
      } catch (requestError) {
        if (cancelled) return
        if (requestError instanceof ApiRequestError && requestError.status === 401) {
          onSessionExpired()
          return
        }
        setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el perfil.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadProfile()
    return () => {
      cancelled = true
    }
  }, [onSessionExpired])

  const totalExercises = profile?.practiceCourses.reduce((sum, course) => sum + course.total, 0) ?? 0
  const completedExercises = profile?.practiceCourses.reduce((sum, course) => sum + course.resueltos, 0) ?? 0

  return (
    <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-4xl flex-col px-6 py-10 sm:px-10">
      <button type="button" className="mb-6 w-fit text-sm text-slate-600 hover:text-teal-700" onClick={onBack}>
        ← Volver
      </button>
      <h1 className="font-display text-3xl font-semibold text-slate-950">Mi perfil</h1>

      {loading && <p className="mt-6 text-sm text-slate-600" role="status">Cargando tu información…</p>}
      {error && <p className="mt-6 text-sm text-rose-700" role="alert">{error}</p>}

      {profile && (
        <>
          <section className="mt-6 rounded-xl border border-slate-200 bg-white/80 p-5" aria-label="Información de la cuenta">
            <h2 className="text-lg font-semibold text-slate-900">Información de la cuenta</h2>
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre</dt>
                <dd className="mt-1 text-sm text-slate-900">{profile.user.nombre}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Correo electrónico</dt>
                <dd className="mt-1 break-all text-sm text-slate-900">{profile.user.email}</dd>
              </div>
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nivel de formación</dt>
                <dd className="mt-1 text-sm text-slate-900">{LEVEL_LABELS[profile.user.nivel]}</dd>
              </div>
            </dl>
          </section>

          <section className="mt-8" aria-labelledby="profile-progress-title">
            <h2 id="profile-progress-title" className="text-lg font-semibold text-slate-900">Progreso en tus cursos</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {profile.lessonCourses.map((course) => {
                const approved = course.lecciones.filter((lesson) => lesson.estado === 'aprobada').length
                const total = course.lecciones.length
                const percentage = total > 0 ? Math.round((approved / total) * 100) : 0

                return (
                  <article key={course.curso} className="rounded-xl border border-slate-200 bg-white/80 p-5">
                    <h3 className="font-semibold text-slate-900">{course.titulo}</h3>
                    <p className="mt-2 text-sm text-slate-600">{approved} de {total} lecciones aprobadas · {percentage}%</p>
                    <div
                      className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200"
                      role="progressbar"
                      aria-label={`Progreso de ${course.titulo}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={percentage}
                    >
                      <div className="h-full rounded-full bg-teal-600" style={{ width: `${percentage}%` }} />
                    </div>
                  </article>
                )
              })}
            </div>
            {profile.practiceCourses.length > 0 && (
              <p className="mt-4 text-sm text-slate-600">
                Ejercicios completados: {completedExercises} de {totalExercises}
              </p>
            )}
            {profile.progressErrors.map((progressError) => (
              <p key={progressError} className="mt-3 text-sm text-amber-800" role="status">{progressError}</p>
            ))}
          </section>

          <div className="mt-auto flex flex-col items-start gap-3 border-t border-slate-200 pt-6">
            {confirmLogout ? (
              <>
                <p className="text-sm text-slate-700">¿De verdad quieres cerrar la sesión?</p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    onClick={() => setConfirmLogout(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-rose-700 px-3 py-2 text-sm text-white hover:bg-rose-800"
                    onClick={onLogout}
                  >
                    Sí, cerrar sesión
                  </button>
                </div>
              </>
            ) : (
              <button
                type="button"
                className="rounded-lg bg-rose-700 px-4 py-2 text-sm font-medium text-white hover:bg-rose-800"
                onClick={() => setConfirmLogout(true)}
              >
                Cerrar sesión
              </button>
            )}
          </div>
        </>
      )}
    </section>
  )
}
