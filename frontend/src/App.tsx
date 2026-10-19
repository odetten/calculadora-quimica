import './App.css'
import { useCallback, useState } from 'react'
import { LearningHub } from './LearningHub.tsx'
import Header, { type CourseId } from './components/header.tsx'
import Splash from './components/splash.tsx'
import { AuthPage, type AuthMode } from './routes/auth.tsx'
import { ExperimentPage } from './routes/experimentar.tsx'
import { HistoryPage } from './routes/history.tsx'
import { LandingPage } from './routes/landing.tsx'
import { Quimica1Page } from './routes/quimica1.tsx'
import { Quimica2Page } from './routes/quimica2.tsx'
import { Balance } from './tools/balance.tsx'

function App() {
  const [screen, setScreen] = useState<'home' | 'landing' | 'auth' | 'history' | 'experimentar' | CourseId>('landing')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('quimica-token')),
  )

  const handleAuthChange = useCallback((authenticated: boolean) => {
    setIsAuthenticated(authenticated)
  }, [])

  const openAuth = (mode: AuthMode) => {
    setAuthMode(mode)
    setScreen('auth')
    window.scrollTo({ top: 0 })
  }

  const openCourse = (course: CourseId) => {
    setScreen(course)
    window.scrollTo({ top: 0 })
  }

  return (
    <main id="inicio" className="min-h-screen overflow-x-hidden bg-transparent text-slate-900">
      <Splash />
      <Header
        isAuthenticated={isAuthenticated}
        onLoginClick={() => openAuth('login')}
        onLogoutClick={() => {
          localStorage.removeItem('quimica-token')
          setIsAuthenticated(false)
          setScreen('home')
        }}
        onNavigate={(target) => {
          if (screen === 'home') {
            document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
            return
          }
          setScreen('home')
          window.setTimeout(() => {
            document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
          }, 0)
        }}
        onCourseSelect={openCourse}
        onExperimentClick={() => {
          setScreen('experimentar')
          window.scrollTo({ top: 0 })
        }}
        onHomeClick={() => {
          setScreen('landing')
          window.scrollTo({ top: 0 })
        }}
      />
      {screen === 'landing' ? (
        <LandingPage
          onStart={() => {
            setScreen('home')
            window.scrollTo({ top: 0 })
          }}
        />
      ) : screen === 'auth' ? (
        <AuthPage
          mode={authMode}
          onModeChange={setAuthMode}
          onSuccess={() => {
            setIsAuthenticated(true)
            setScreen('home')
          }}
          onBack={() => setScreen('home')}
        />
      ) : screen === 'history' ? (
        <HistoryPage onBack={() => setScreen('home')} />
      ) : screen === 'experimentar' ? (
        <ExperimentPage onBack={() => setScreen('home')} />
      ) : screen === 'quimica-1' ? (
        <Quimica1Page onBack={() => setScreen('home')} />
      ) : screen === 'quimica-2' ? (
        <Quimica2Page onBack={() => setScreen('home')} />
      ) : (
        <>
          <LearningHub
            key={isAuthenticated ? 'authenticated' : 'anonymous'}
            onAuthChange={handleAuthChange}
            onOpenHistory={() => {
              setScreen('history')
              window.scrollTo({ top: 0 })
            }}
          />
          <Balance />
        </>
      )}
    </main>
  )
}

export default App
