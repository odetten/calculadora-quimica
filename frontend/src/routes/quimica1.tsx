import { CoursePage } from '../components/coursePage.tsx'

export function Quimica1Page({ onBack }: { onBack: () => void }) {
  return <CoursePage courseTitle="Química 1" courseId="quimica-1" onBack={onBack} />
}
