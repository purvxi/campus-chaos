import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

// Security: Logging function for auth events
const logAuthEvent = (event, details = {}) => {
  const timestamp = new Date().toISOString()
  const logData = {
    timestamp,
    event,
    ...details,
    userAgent: navigator.userAgent,
    // Don't log sensitive data like passwords
  }
  
  // In production, send to a logging service
  console.log('[AUTH EVENT]', logData)
  
  // TODO: Send to backend logging service
  // Example: fetch('/api/log', { method: 'POST', body: JSON.stringify(logData) })
}

// Security: Rate limiting for failed login attempts
class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts
    this.windowMs = windowMs
    this.attempts = new Map()
  }

  isBlocked(identifier) {
    const record = this.attempts.get(identifier)
    if (!record) return false

    const now = Date.now()
    if (now - record.firstAttempt > this.windowMs) {
      this.attempts.delete(identifier)
      return false
    }

    return record.count >= this.maxAttempts
  }

  recordAttempt(identifier) {
    const now = Date.now()
    const record = this.attempts.get(identifier)

    if (!record) {
      this.attempts.set(identifier, { count: 1, firstAttempt: now })
    } else {
      if (now - record.firstAttempt > this.windowMs) {
        this.attempts.set(identifier, { count: 1, firstAttempt: now })
      } else {
        record.count++
      }
    }
  }

  reset(identifier) {
    this.attempts.delete(identifier)
  }
}

const loginRateLimiter = new RateLimiter()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions and subscribe to auth changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
      
      if (session?.user) {
        logAuthEvent('session_restored', { userId: session.user.id })
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      
      if (_event === 'SIGNED_IN') {
        logAuthEvent('sign_in_success', { userId: session?.user?.id })
      } else if (_event === 'SIGNED_OUT') {
        logAuthEvent('sign_out', { userId: user?.id })
      } else if (_event === 'TOKEN_REFRESHED') {
        logAuthEvent('token_refreshed', { userId: session?.user?.id })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email, password) => {
    try {
      // Security: Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        throw new Error('Invalid email format')
      }

      // Security: Validate password strength
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters')
      }

      logAuthEvent('signup_attempt', { email })

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          // Security: Email confirmation required
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      if (error) {
        logAuthEvent('signup_failed', { email, error: error.message })
        throw error
      }

      logAuthEvent('signup_success', { email, userId: data.user?.id })
      return data
    } catch (error) {
      logAuthEvent('signup_error', { email, error: error.message })
      throw error
    }
  }

  const signIn = async (email, password) => {
    try {
      // Security: Rate limiting check
      if (loginRateLimiter.isBlocked(email)) {
        const error = new Error('Too many failed login attempts. Please try again in 15 minutes.')
        logAuthEvent('login_blocked_rate_limit', { email })
        throw error
      }

      logAuthEvent('login_attempt', { email })

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        // Security: Record failed attempt
        loginRateLimiter.recordAttempt(email)
        logAuthEvent('login_failed', { 
          email, 
          error: error.message,
          attemptCount: loginRateLimiter.attempts.get(email)?.count || 1
        })
        throw error
      }

      // Security: Reset rate limiter on successful login
      loginRateLimiter.reset(email)
      logAuthEvent('login_success', { email, userId: data.user?.id })
      
      return data
    } catch (error) {
      logAuthEvent('login_error', { email, error: error.message })
      throw error
    }
  }

  const signOut = async () => {
    try {
      const userId = user?.id
      logAuthEvent('logout_attempt', { userId })

      const { error } = await supabase.auth.signOut()
      
      if (error) {
        logAuthEvent('logout_failed', { userId, error: error.message })
        throw error
      }

      logAuthEvent('logout_success', { userId })
    } catch (error) {
      logAuthEvent('logout_error', { error: error.message })
      throw error
    }
  }

  const value = {
    user,
    signUp,
    signIn,
    signOut,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
