import './App.css'
import { useAuth } from './hooks/useAuth'
import AppRoutes from './routes/AppRoutes'

function App() {
  const { completeAuthentication, isRestoringSession, signOut, user } = useAuth()

  if (isRestoringSession) {
    return (
      <main className="loading-screen" aria-live="polite">
        <span className="loading-mark">I</span>
        <p>Đang chuẩn bị không gian học tập…</p>
      </main>
    )
  }

  return (
    <AppRoutes
      onAuthenticated={completeAuthentication}
      onSignOut={signOut}
      user={user}
    />
  )
}

export default App
