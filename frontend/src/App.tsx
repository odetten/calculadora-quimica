import './App.css'
import { LearningHub } from './LearningHub.tsx'
import Header from './components/header.tsx'
import Splash from './components/splash.tsx'
import { Balance } from './tools/balance.tsx'

function App() {
  return (
    <main id="inicio" className="min-h-screen overflow-x-hidden bg-transparent text-slate-900">
      <Splash />
      <Header />
      <LearningHub />
      <Balance />
    </main>
  )
}

export default App
