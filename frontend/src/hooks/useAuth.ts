import { useCallback, useEffect, useState } from 'react'
import { getCurrentUser, signOut as requestSignOut } from '../services/authService'
import { TOKEN_KEY } from '../services/api'
import type { User } from '../services/api'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isRestoringSession, setIsRestoringSession] = useState(true)

  useEffect(() => {
    let isMounted = true
    const token = localStorage.getItem(TOKEN_KEY)

    if (!token) {
      setIsRestoringSession(false)
      return () => {
        isMounted = false
      }
    }

    getCurrentUser(token)
      .then((currentUser) => {
        if (isMounted) {
          setUser(currentUser)
        }
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
      })
      .finally(() => {
        if (isMounted) {
          setIsRestoringSession(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const completeAuthentication = useCallback((nextUser: User) => {
    setUser(nextUser)
  }, [])

  const signOut = useCallback(() => {
    const token = localStorage.getItem(TOKEN_KEY) || undefined
    const controller = new AbortController()
    const requestTimeout = window.setTimeout(() => controller.abort(), 2000)

    void requestSignOut(token, controller.signal)
      .catch(() => {
        // Local sign-out should still work if the API is temporarily unavailable.
      })
      .finally(() => window.clearTimeout(requestTimeout))

    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  return {
    completeAuthentication,
    isAuthenticated: Boolean(user),
    isRestoringSession,
    signOut,
    user,
  }
}
