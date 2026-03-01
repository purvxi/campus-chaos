import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Card3D from '../components/Card3D'

export default function SignUpPage() {
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)

  useState(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      await signUp(email, password)
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success/10 rounded-full blur-3xl pointer-events-none" />
        
        <Card3D>
          <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-txt/10 text-center relative z-10">
            <div className="text-6xl mb-4 animate-bounce-in">✅</div>
            <h2 className="text-3xl font-bold text-txt mb-4">Check Your Email!</h2>
            <p className="text-muted mb-6 leading-relaxed">
              We sent a confirmation link to <strong className="text-txt">{email}</strong>
              <br />
              <br />
              Click the link to activate your account, then come back to sign in.
            </p>
            <div className="bg-warning/20 border border-warning/30 p-4 rounded-lg mb-6 text-left">
              <p className="text-sm text-txt">
                <strong>📌 Note:</strong> Check your spam folder if you don't see it in your inbox.
              </p>
            </div>
            <Link
              to="/login"
              className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent/90 transition-all hover:scale-105 shadow-lg"
            >
              Go to Login →
            </Link>
          </div>
        </Card3D>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent2/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className={`max-w-md w-full relative z-10 transition-all duration-700 ${
        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-3">
            <span className="text-accent">Campus</span>
            <span className="text-accent2">Chaos</span>
          </h1>
          <p className="text-muted text-sm">Start tracking your academic survival today</p>
        </div>

        {/* Sign Up Card */}
        <Card3D>
          <div className="bg-card p-8 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-txt/10">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-txt mb-2">Create Account</h2>
              <p className="text-muted text-sm">Join Campus Chaos and take control</p>
            </div>

            {error && (
              <div className="bg-danger/10 border border-danger/30 text-danger p-3 rounded-lg mb-4 text-sm animate-fade-in">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-txt text-sm font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-txt text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-txt text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-txt/20 bg-bg focus:outline-none focus:ring-2 focus:ring-accent transition-all text-sm"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-white py-3 rounded-lg font-semibold hover:bg-accent/90 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span> Creating account...
                  </span>
                ) : (
                  'Create Account →'
                )}
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-txt/10 text-center">
              <p className="text-sm text-muted">
                Already have an account?{' '}
                <Link to="/login" className="text-accent hover:text-accent/80 font-semibold hover:underline transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </Card3D>

        {/* Back to home */}
        <div className="text-center mt-6">
          <Link to="/" className="text-sm text-muted hover:text-txt transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}