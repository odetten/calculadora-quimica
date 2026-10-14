import './App.css'
import { useCallback, useState } from 'react'
import { LearningHub } from './LearningHub.tsx'
import Header from './components/header.tsx'
import Splash from './components/splash.tsx'
import MixGame from './Mixgame.tsx'
import { AuthPage, type AuthMode } from './routes/auth.tsx'
import { Balance } from './tools/balance.tsx'

function App() {
  const [screen, setScreen] = useState<'home' | 'auth' | 'mixgame'>('home')
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

  return (
    <main id="inicio" className="min-h-screen overflow-x-hidden bg-transparent text-slate-900">
      <Splash />
      <Header
        isAuthenticated={isAuthenticated}
        onLoginClick={() => openAuth('login')}
        onBasicCourseClick={() => {
          setScreen('mixgame')
          window.scrollTo({ top: 0 })
        }}
        onLogoutClick={() => {
          localStorage.removeItem('quimica-token')
          setIsAuthenticated(false)
          setScreen('home')
        }}
        onNavigate={(target) => {
          const section = target === 'courses' ? 'cursos' : 'balanceador'
          if (screen === 'home') {
            document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
            return
          }
          setScreen('home')
          window.setTimeout(() => {
            document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' })
          }, 0)
        }}
      />
      {screen === 'auth' ? (
        <AuthPage
          mode={authMode}
          onModeChange={setAuthMode}
          onSuccess={() => {
            setIsAuthenticated(true)
            setScreen('home')
          }}
          onBack={() => setScreen('home')}
        />
      ) : screen === 'mixgame' ? (
        <MixGame
          onBack={() => {
            setScreen('home')
            window.setTimeout(() => {
              document.getElementById('balanceador')?.scrollIntoView({ behavior: 'smooth' })
            }, 0)
          }}
        />
      ) : (
        <>
          <LearningHub
            key={isAuthenticated ? 'authenticated' : 'anonymous'}
            onAuthChange={handleAuthChange}
          />
          <Balance />
        </>
      )}
    </main>
  )
}

export default App
