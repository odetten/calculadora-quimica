import './App.css'
import { useCallback, useState } from 'react'
import { LearningHub } from './LearningHub.tsx'
import Header, { type CourseId } from './components/header.tsx'
import Splash from './components/splash.tsx'
import { AuthPage, type AuthMode } from './routes/auth.tsx'
import { ExperimentPage, type TabId as LabTab } from './routes/experimentar.tsx'
import { HistoryPage } from './routes/history.tsx'
import { LandingPage, type LandingDestination } from './routes/landing.tsx'
import { ProfilePage } from './routes/profile.tsx'
import { Quimica1Page } from './routes/quimica1.tsx'
import { Quimica2Page } from './routes/quimica2.tsx'
import { Balance } from './tools/balance.tsx'
import { ElectronicConfig } from './tools/electronic-config.tsx'

function App() {
  const [screen, setScreen] = useState<'home' | 'landing' | 'auth' | 'history' | 'profile' | 'experimentar' | CourseId>('landing')
  const [authMode, setAuthMode] = useState<AuthMode>('login')
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => Boolean(localStorage.getItem('quimica-token')),
  )
  const [activeCalculator, setActiveCalculator] = useState<'balance' | 'electronic'>('balance')
  const [labTab, setLabTab] = useState<LabTab>('lab')

  const handleAuthChange = useCallback((authenticated: boolean) => {
    setIsAuthenticated(authenticated)
  }, [])

  const handleSessionExpired = useCallback(() => {
    localStorage.removeItem('quimica-token')
    setIsAuthenticated(false)
    setScreen('landing')
  }, [])

  const handleLogout = useCallback(() => {
    localStorage.removeItem('quimica-token')
    setIsAuthenticated(false)
    setScreen('home')
    window.scrollTo({ top: 0 })
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

  const openFromLanding = (destination: LandingDestination) => {
    if (destination === 'balance' || destination === 'electronic') {
      setActiveCalculator(destination)
      setScreen('home')
    } else if (destination === 'lab' || destination === 'tabla') {
      setLabTab(destination)
      setScreen('experimentar')
    } else if (destination === 'history') {
      if (!isAuthenticated) {
        openAuth('login')
        return
      }
      setScreen('history')
    } else {
      setScreen(destination)
    }
    window.scrollTo({ top: 0 })
  }

  return (
    <main id="inicio" className="min-h-screen overflow-x-hidden bg-transparent text-slate-900">
      <Splash />
      <Header
        isAuthenticated={isAuthenticated}
        transparent={screen === 'landing'}
        onLoginClick={() => openAuth('login')}
        onProfileClick={() => {
          if (!isAuthenticated) {
            openAuth('login')
            return
          }
          setScreen('profile')
          window.scrollTo({ top: 0 })
        }}
        onCalculatorSelect={(calculator) => {
          setActiveCalculator(calculator)
          setScreen('home')
          window.scrollTo({ top: 0 })
        }}
        onCourseSelect={openCourse}
        onExperimentClick={() => {
          setLabTab('lab')
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
          onNavigate={openFromLanding}
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
      ) : screen === 'profile' ? (
        isAuthenticated ? (
          <ProfilePage
            onBack={() => setScreen('home')}
            onSessionExpired={handleSessionExpired}
            onLogout={handleLogout}
          />
        ) : (
          <LandingPage onStart={() => openAuth('login')} onNavigate={openFromLanding} />
        )
      ) : screen === 'experimentar' ? (
        <ExperimentPage onBack={() => setScreen('home')} initialTab={labTab} />
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
          {activeCalculator === 'balance' && <Balance />}
          {activeCalculator === 'electronic' && <ElectronicConfig />}
        </>
      )}
    </main>
  )
}

export default App
