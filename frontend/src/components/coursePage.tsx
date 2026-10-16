import { useCallback, useEffect, useState } from 'react'
import { apiRequest, TOKEN_KEY } from '../api.ts'
import { CoursePractice, type Course } from './coursePractice.tsx'
import { LessonPath } from './lessonPath.tsx'

type CoursePageProps = {
  courseTitle: string
  courseIndex: number
  onBack: () => void
}

export function CoursePage({ courseTitle, courseIndex, onBack }: CoursePageProps) {
  const loggedIn = Boolean(localStorage.getItem(TOKEN_KEY))
  const [course, setCourse] = useState<Course | null>(null)
  const [loaded, setLoaded] = useState(!loggedIn)
  const [practicing, setPracticing] = useState(false)

  const loadCourse = useCallback(() => {
    if (!localStorage.getItem(TOKEN_KEY)) return
    apiRequest<Course[]>('/courses')
      .then((courses) => setCourse(courses[courseIndex] ?? null))
      .catch(() => setCourse(null))
      .finally(() => setLoaded(true))
  }, [courseIndex])

  useEffect(() => {
    loadCourse()
  }, [loadCourse])

  if (practicing && course) {
    return (
      <CoursePractice
        course={course}
        onBack={() => {
          setPracticing(false)
          loadCourse()
        }}
      />
    )
  }

  let blockedMessage: string | undefined
  if (!loggedIn) blockedMessage = 'Inicia sesión'
  else if (!loaded) blockedMessage = 'Cargando…'
  else if (!course) blockedMessage = 'Sin lección'

  return (
    <LessonPath
      courseTitle={courseTitle}
      lessonTitle="Lección 1"
      lessonTopic={course?.titulo ?? 'Primera lección'}
      done={course?.resueltos ?? 0}
      total={course?.total ?? 0}
      onStart={course ? () => setPracticing(true) : undefined}
      blockedMessage={blockedMessage}
      onBack={onBack}
    />
  )
}
