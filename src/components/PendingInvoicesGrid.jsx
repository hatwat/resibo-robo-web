import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import PendingInvoiceCard from './PendingInvoiceCard'

export default function PendingInvoicesGrid({ session }) {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastRefresh, setLastRefresh] = useState(null)

  const fetchInvoices = useCallback(async () => {
    try {
      setError(null)
      const { data, error: fetchErr } = await supabase
        .from('pending_invoices')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('awaiting_confirmation', true)
        .order('created_at', { ascending: false })

      if (fetchErr) throw fetchErr
      setInvoices(data || [])
      setLastRefresh(new Date())
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [session.user.id])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const handleInvoiceRemoved = (invoiceId) => {
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-10 h-10 border-3 border-ink-200 border-t-accent-green rounded-full animate-spin border-[3px]" />
        <p className="text-ink-400 text-sm font-body">Loading pending invoices…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="card-container p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="font-display font-bold text-ink-800 text-lg mb-2">Failed to load invoices</h3>
          <p className="text-ink-500 text-sm font-body mb-6">{error}</p>
          <button onClick={fetchInvoices} className="btn-primary">
            ↺ Retry
          </button>
        </div>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="card-container p-12 text-center">
          <div className="w-20 h-20 bg-ink-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📭</span>
          </div>
          <h3 className="font-display font-bold text-ink-800 text-xl mb-2">
            No pending invoices
          </h3>
          <p className="text-ink-400 font-body text-sm mb-6 leading-relaxed">
            Send an invoice photo to your Telegram bot.<br />
            It'll appear here for review.
          </p>
          <button
            onClick={fetchInvoices}
            className="btn-ghost text-accent-green hover:bg-emerald-50"
          >
            ↺ Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Summary bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-ink-800 text-2xl">
            Pending Review
            <span className="ml-3 inline-flex items-center justify-center w-7 h-7 bg-accent-green text-white text-xs font-bold rounded-full">
              {invoices.length}
            </span>
          </h2>
          <p className="text-ink-400 text-xs font-body mt-0.5">
            {lastRefresh && `Last updated ${lastRefresh.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}`}
          </p>
        </div>
        <button
          onClick={() => { setLoading(true); fetchInvoices() }}
          className="btn-ghost text-sm"
        >
          ↺ Refresh
        </button>
      </div>

      {/* Cards */}
      {invoices.map((invoice, index) => (
        <div
          key={invoice.id}
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <PendingInvoiceCard
            invoice={invoice}
            session={session}
            onInvoiceRemoved={handleInvoiceRemoved}
          />
        </div>
      ))}
    </div>
  )
}
