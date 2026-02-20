import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function LoginCard() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('password')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

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
    <div
      className="rounded-2xl p-8 border"
      style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderColor: 'rgba(91,200,245,0.25)',
        boxShadow: '0 8px 48px rgba(6,14,36,0.5)',
      }}
    >
      <h3 className="font-display font-bold text-white text-xl mb-1">
        Sign in to your portal
      </h3>
      <p className="text-sm font-body mb-6" style={{ color: '#7aa0db' }}>
        Review and approve pending invoices
      </p>

      {/* Mode toggle */}
      <div className="flex rounded-xl p-1 mb-5 gap-1" style={{ background: 'rgba(6,14,36,0.5)' }}>
        {['password', 'magic'].map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setMessage(null) }}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-200 font-display"
            style={mode === m
              ? { background: 'linear-gradient(135deg, #C9A84C, #fbbf24)', color: '#060e24' }
              : { color: '#7aa0db' }
            }
          >
            {m === 'password' ? 'Password' : 'Magic Link'}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-body border ${
          message.type === 'error'
            ? 'bg-red-950 border-red-800 text-red-300'
            : 'bg-emerald-950 border-emerald-800 text-emerald-300'
        }`}>
          {message.type === 'error' ? '⚠️ ' : '✅ '}{message.text}
        </div>
      )}

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-widest mb-2 font-display"
            style={{ color: '#7aa0db' }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-all duration-150 font-body"
            style={{ background: 'rgba(6,14,36,0.6)', border: '1px solid rgba(74,122,200,0.3)' }}
            onFocus={e => e.target.style.borderColor = '#C9A84C'}
            onBlur={e => e.target.style.borderColor = 'rgba(74,122,200,0.3)'}
          />
        </div>

        {mode === 'password' && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2 font-display"
              style={{ color: '#7aa0db' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none transition-all duration-150 font-body"
              style={{ background: 'rgba(6,14,36,0.6)', border: '1px solid rgba(74,122,200,0.3)' }}
              onFocus={e => e.target.style.borderColor = '#C9A84C'}
              onBlur={e => e.target.style.borderColor = 'rgba(74,122,200,0.3)'}
            />
          </div>
        )}

        <button
          onClick={mode === 'password' ? handlePasswordLogin : handleMagicLink}
          disabled={loading}
          className="w-full py-3 px-6 font-bold rounded-xl active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-display flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #C9A84C, #fbbf24)', color: '#060e24' }}
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin"
                style={{ borderColor: '#060e24', borderTopColor: 'transparent' }} />
              {mode === 'magic' ? 'Sending...' : 'Signing in...'}
            </>
          ) : mode === 'magic' ? '✉️ Send Magic Link' : '→ Sign In'}
        </button>
      </div>

      <p className="text-center text-xs mt-4 font-body" style={{ color: '#3660a8' }}>
        Don't have an account?{' '}
        <a href="mailto:hello@resiboph.ai" style={{ color: '#7aa0db' }} className="hover:underline">
          Contact us to get set up.
        </a>
      </p>
    </div>
  )
}
