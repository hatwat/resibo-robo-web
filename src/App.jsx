import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import LoginForm from './components/LoginForm'
import PendingInvoicesGrid from './components/PendingInvoicesGrid'
import logo from './assets/ResiboPH_AI.png'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #060e24 0%, #112b60 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-[3px] border-navy-700 border-t-gold-500 rounded-full animate-spin" />
          <p className="text-navy-300 text-sm font-body">Loading…</p>
        </div>
      </div>
    )
  }

  if (!session) return <LoginForm />

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#eef3fb' }}>
      {/* Top nav */}
      <header className="sticky top-0 z-50 border-b" style={{ background: 'linear-gradient(90deg, #060e24 0%, #112b60 100%)', borderColor: '#1a3f85' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src={logo} alt="ResiboPH AI" className="h-9 w-auto rounded-lg object-contain" />
            <div className="hidden sm:block">
              <span className="font-display font-bold text-white text-lg tracking-tight">
                ResiboPH <span style={{ color: '#C9A84C' }}>AI</span>
              </span>
              <p className="text-xs font-body" style={{ color: '#7aa0db', marginTop: '-2px' }}>
                Invoice Approval Portal
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-body hidden sm:block" style={{ color: '#7aa0db' }}>
              {session.user.email}
            </span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 font-body border"
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: '#2a5aad', color: '#adc5eb' }}
              onMouseEnter={e => { e.target.style.borderColor = '#C9A84C'; e.target.style.color = '#C9A84C' }}
              onMouseLeave={e => { e.target.style.borderColor = '#2a5aad'; e.target.style.color = '#adc5eb' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <PendingInvoicesGrid session={session} />
      </main>

      {/* Footer */}
      <footer className="mt-16 py-6 border-t" style={{ borderColor: '#dce6f8' }}>
        <div className="flex items-center justify-center gap-2">
          <img src={logo} alt="ResiboPH AI" className="h-5 w-auto rounded opacity-60" />
          <p className="text-xs font-body" style={{ color: '#8aaae0' }}>
            ResiboPH AI · Upload invoices via Telegram · Approve here
          </p>
        </div>
      </footer>
    </div>
  )
}
