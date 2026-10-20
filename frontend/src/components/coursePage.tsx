import { useCallback, useEffect, useState } from 'react'
import { apiRequest, TOKEN_KEY } from '../api.ts'
import type { CourseLessons } from '../lessons.ts'
import type { CourseId } from './header.tsx'
import { LessonPath } from './lessonPath.tsx'
import { LessonView } from './lessonView.tsx'

type CoursePageProps = {
  courseTitle: string
  courseId: CourseId
  onBack: () => void
}

export function CoursePage({ courseTitle, courseId, onBack }: CoursePageProps) {
  const loggedIn = Boolean(localStorage.getItem(TOKEN_KEY))
  const [course, setCourse] = useState<CourseLessons | null>(null)
  const [error, setError] = useState('')
  const [openLesson, setOpenLesson] = useState<number | null>(null)

  const loadCourse = useCallback(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    apiRequest<CourseLessons>(`/lessons/${courseId}`)
      .then((data) => {
        setCourse(data)
        setError('')
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'No se pudo cargar el curso.')
      })
  }, [courseId])

  useEffect(() => {
    loadCourse()
  }, [loadCourse])

  if (openLesson !== null) {
    return (
      <LessonView
        key={openLesson}
        course={courseId}
        number={openLesson}
        onBack={() => {
          setOpenLesson(null)
          loadCourse()
          window.scrollTo({ top: 0 })
        }}
        onNext={(next) => {
          setOpenLesson(next)
          loadCourse()
          window.scrollTo({ top: 0 })
        }}
      />
    )
  }

  let blockedMessage: string | undefined
  if (!loggedIn) blockedMessage = 'Inicia sesión'
  else if (error) blockedMessage = 'Sin conexión'
  else if (!course) blockedMessage = 'Cargando…'

  return (
    <>
      <LessonPath
        courseTitle={course?.titulo ?? courseTitle}
        lessons={course?.lecciones ?? []}
        onOpen={(number) => {
          setOpenLesson(number)
          window.scrollTo({ top: 0 })
        }}
        blockedMessage={blockedMessage}
        onBack={onBack}
      />
      {error && <p className="-mt-6 pb-8 text-center text-sm text-rose-700" role="alert">{error}</p>}
    </>
  )
}
