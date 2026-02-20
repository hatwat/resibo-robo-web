import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import logo from '../assets/ResiboPH_AI.jpg'

export default function LoginForm() {
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
      className="min-h-screen flex items-center justify-center p-4 grain-overlay relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #060e24 0%, #0b1d40 50%, #112b60 100%)' }}
    >
      {/* Background glow orbs */}
      <div className="absolute top-[-15%] right-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,122,200,0.15) 0%, transparent 70%)' }} />
      <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)' }} />

      <div className="relative z-10 w-full max-w-[420px] animate-slide-up">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center mb-5">
            <img
              src={logo}
              alt="ResiboPH AI"
              className="h-28 w-auto object-contain"
              style={{ filter: 'drop-shadow(0 8px 32px rgba(74,122,200,0.4))' }}
            />
          </div>
          <h1 className="font-display font-extrabold text-white tracking-tight leading-none mb-1" style={{ fontSize: '2rem' }}>
            ResiboPH <span style={{ color: '#C9A84C' }}>AI</span>
          </h1>
          <p className="text-sm font-body" style={{ color: '#7aa0db' }}>
            Invoice Approval Portal
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border"
          style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', borderColor: 'rgba(74,122,200,0.3)', boxShadow: '0 8px 48px rgba(6,14,36,0.6)' }}>
          {/* Mode toggle */}
          <div className="flex rounded-xl p-1 mb-6 gap-1" style={{ background: 'rgba(6,14,36,0.5)' }}>
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
            <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-body border ${
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
              <label className="block text-xs font-semibold uppercase tracking-widest mb-2 font-display" style={{ color: '#7aa0db' }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-navy-600 focus:outline-none transition-all duration-150 font-body"
                style={{ background: 'rgba(6,14,36,0.6)', border: '1px solid rgba(74,122,200,0.3)' }}
                onFocus={e => e.target.style.borderColor = '#C9A84C'}
                onBlur={e => e.target.style.borderColor = 'rgba(74,122,200,0.3)'}
              />
            </div>

            {mode === 'password' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2 font-display" style={{ color: '#7aa0db' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder:text-navy-600 focus:outline-none transition-all duration-150 font-body"
                  style={{ background: 'rgba(6,14,36,0.6)', border: '1px solid rgba(74,122,200,0.3)' }}
                  onFocus={e => e.target.style.borderColor = '#C9A84C'}
                  onBlur={e => e.target.style.borderColor = 'rgba(74,122,200,0.3)'}
                />
              </div>
            )}

            <button
              onClick={mode === 'password' ? handlePasswordLogin : handleMagicLink}
              disabled={loading}
              className="w-full py-3 px-6 font-bold rounded-xl active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-display mt-2 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #fbbf24)', color: '#060e24' }}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                  {mode === 'magic' ? 'Sending...' : 'Signing in...'}
                </>
              ) : mode === 'magic' ? '✉️ Send Magic Link' : '→ Sign In'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs mt-6 font-body" style={{ color: '#3660a8' }}>
          Upload invoices via Telegram · Review & approve here
        </p>
      </div>
    </div>
  )
}
