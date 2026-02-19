import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('password') // 'password' | 'magic'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null) // { type: 'error'|'success', text: '' }

  const handlePasswordLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  const handleMagicLink = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: window.location.origin },
      })
      if (error) throw error
      setMessage({ type: 'success', text: 'Magic link sent! Check your email.' })
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center p-4 grain-overlay relative overflow-hidden">
      {/* Background accent circles */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-accent-green opacity-[0.03] blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent-blue opacity-[0.04] blur-3xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-[440px] animate-slide-up">
        {/* Logo mark */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-ink-800 border border-ink-700 mb-6 shadow-lg">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white tracking-tight leading-none mb-2">
            Resibo<span className="text-accent-green">.</span>
          </h1>
          <p className="text-ink-400 text-sm font-body">
            Invoice approval portal
          </p>
        </div>

        {/* Card */}
        <div className="bg-ink-800 border border-ink-700 rounded-2xl p-8 shadow-2xl">
          {/* Mode toggle */}
          <div className="flex bg-ink-900 rounded-xl p-1 mb-8 gap-1">
            <button
              onClick={() => { setMode('password'); setMessage(null) }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 font-display ${
                mode === 'password'
                  ? 'bg-white text-ink-900 shadow-sm'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => { setMode('magic'); setMessage(null) }}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 font-display ${
                mode === 'magic'
                  ? 'bg-white text-ink-900 shadow-sm'
                  : 'text-ink-400 hover:text-ink-200'
              }`}
            >
              Magic Link
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-body ${
              message.type === 'error'
                ? 'bg-red-950 border border-red-800 text-red-300'
                : 'bg-emerald-950 border border-emerald-800 text-emerald-300'
            }`}>
              {message.type === 'error' ? '⚠️ ' : '✅ '}
              {message.text}
            </div>
          )}

          {/* Form */}
          <form onSubmit={mode === 'password' ? handlePasswordLogin : handleMagicLink} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-ink-400 mb-2 font-display">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-ink-900 border border-ink-600 rounded-xl text-white text-sm
                           placeholder:text-ink-600 focus:outline-none focus:ring-2 focus:ring-accent-green
                           focus:border-transparent transition-all duration-150 font-body"
              />
            </div>

            {mode === 'password' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-ink-400 mb-2 font-display">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-ink-900 border border-ink-600 rounded-xl text-white text-sm
                             placeholder:text-ink-600 focus:outline-none focus:ring-2 focus:ring-accent-green
                             focus:border-transparent transition-all duration-150 font-body"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-accent-green text-ink-900 font-bold rounded-xl
                         hover:bg-opacity-90 active:scale-[0.98] transition-all duration-150
                         disabled:opacity-50 disabled:cursor-not-allowed text-sm font-display
                         mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-ink-900 border-t-transparent rounded-full animate-spin" />
                  {mode === 'magic' ? 'Sending...' : 'Signing in...'}
                </>
              ) : mode === 'magic' ? (
                '✉️ Send Magic Link'
              ) : (
                '→ Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="text-center text-ink-600 text-xs mt-6 font-body">
          Upload invoices via Telegram · Review & approve here
        </p>
      </div>
    </div>
  )
}
