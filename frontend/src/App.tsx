import { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router'
import './App.css'
import { apiRequest, TOKEN_KEY } from './lib/api'
import type { User } from './lib/api'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import HomePage from './pages/HomePage'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isRestoringSession, setIsRestoringSession] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
      setIsRestoringSession(false)
      return
    }

    apiRequest<{ user: User }>('/users/me', {}, token)
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setIsRestoringSession(false))
  }, [])

  const handleSignOut = () => {
    const token = localStorage.getItem(TOKEN_KEY) || undefined
    const controller = new AbortController()
    const requestTimeout = window.setTimeout(() => controller.abort(), 2000)

    void apiRequest(
      '/auth/signout',
      { method: 'POST', signal: controller.signal },
      token,
    )
      .catch(() => {
        // Local sign-out should still work if the API is temporarily unavailable.
      })
      .finally(() => window.clearTimeout(requestTimeout))

    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }

  if (isRestoringSession) {
    return (
      <main className="loading-screen" aria-live="polite">
        <span className="loading-mark">I</span>
        <p>Đang chuẩn bị không gian học tập…</p>
      </main>
    )
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} />} />
      <Route
        path="/auth"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage onAuthenticated={setUser} />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Dashboard user={user} onSignOut={handleSignOut} />
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
