import { CoursePage } from '../components/coursePage.tsx'

export function Quimica2Page({ onBack }: { onBack: () => void }) {
  return <CoursePage courseTitle="Química 2" courseIndex={1} onBack={onBack} />
}
