import { useState, useEffect } from 'react'
import { supabase } from './lib/supabaseClient'
import LoginForm from './components/LoginForm'
import PendingInvoicesGrid from './components/PendingInvoicesGrid'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes (magic link callback, logout, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-[3px] border-ink-700 border-t-accent-green rounded-full animate-spin" />
          <p className="text-ink-500 text-sm font-body">Loading…</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <LoginForm />
  }

  return (
    <div className="min-h-screen bg-[#f5f4f0]">
      {/* Top nav */}
      <header className="bg-ink-900 border-b border-ink-800 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-ink-800 border border-ink-700 rounded-lg flex items-center justify-center text-lg">
              🤖
            </div>
            <span className="font-display font-bold text-white text-lg tracking-tight">
              Resibo<span className="text-accent-green">.</span>
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="text-ink-500 text-xs font-body hidden sm:block">
              {session.user.email}
            </span>
            <button
              onClick={() => supabase.auth.signOut()}
              className="px-3 py-1.5 bg-ink-800 border border-ink-700 text-ink-300 text-xs font-semibold rounded-lg
                         hover:border-ink-500 hover:text-white transition-all duration-150 font-display"
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
      <footer className="border-t border-ink-100 mt-16 py-6">
        <p className="text-center text-ink-300 text-xs font-body">
          Resibo Robo · Upload invoices via Telegram · Approve here
        </p>
      </footer>
    </div>
  )
}
