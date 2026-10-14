import { useState } from 'react'
import Header from '../components/header.tsx'

const levels = [
  { id: 'novato', title: 'Novato', description: 'Empieza desde cero con los conceptos básicos.' },
  { id: 'normal', title: 'Normal', description: 'Ya conoces lo básico y quieres practicar más.' },
  { id: 'avanzado', title: 'Avanzado', description: 'Retos más difíciles para dominar el tema.' },
]

export default function Courses() {
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <main className="min-h-screen overflow-x-hidden bg-transparent text-slate-900">
      <Header />

      <section className="mx-auto flex min-h-[calc(100vh-64px)] w-full max-w-4xl flex-col justify-center px-6 pb-16 pt-10 sm:px-10">
        <div className="mb-12 text-center">
          <h1 className="font-display text-4xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-6xl">Cursos</h1>
          <p className="mt-5 text-base leading-7 text-slate-600">Elige tu nivel para comenzar.</p>
        </div>

        <div role="radiogroup" aria-label="Nivel del curso" className="grid gap-4 sm:grid-cols-3">
          {levels.map((level) => {
            const active = selected === level.id
            return (
              <button
                key={level.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setSelected(level.id)}
                className={`rounded-2xl border-2 bg-white/80 p-6 text-left transition ${
                  active ? 'border-teal-700 shadow-md' : 'border-slate-200 hover:border-teal-600'
                }`}
              >
                <span className="block font-display text-2xl font-semibold text-slate-900">{level.title}</span>
                <span className="mt-2 block text-sm leading-6 text-slate-600">{level.description}</span>
              </button>
            )
          })}
        </div>
      </section>
    </main>
  )
}