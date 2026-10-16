import { CoursePage } from '../components/coursePage.tsx'

export function Quimica1Page({ onBack }: { onBack: () => void }) {
  return <CoursePage courseTitle="Química 1" courseIndex={0} onBack={onBack} />
}
