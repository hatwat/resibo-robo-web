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

  useEffect(() => { fetchInvoices() }, [fetchInvoices])

  const handleInvoiceRemoved = (invoiceId) => {
    setInvoices(prev => prev.filter(inv => inv.id !== invoiceId))
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 rounded-full animate-spin border-[3px]"
          style={{ borderColor: '#dce6f8', borderTopColor: '#C9A84C' }} />
        <p className="text-sm font-body" style={{ color: '#5c82c9' }}>Loading pending invoices…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="card-container p-8 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h3 className="font-display font-bold text-lg mb-2" style={{ color: '#0b1d40' }}>Failed to load invoices</h3>
          <p className="text-sm font-body mb-6" style={{ color: '#5c82c9' }}>{error}</p>
          <button onClick={fetchInvoices} className="btn-primary">↺ Retry</button>
        </div>
      </div>
    )
  }

  if (invoices.length === 0) {
    return (
      <div className="max-w-xl mx-auto">
        <div className="card-container p-12 text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #eef3fb, #dce6f8)' }}>
            <span className="text-4xl">📭</span>
          </div>
          <h3 className="font-display font-bold text-xl mb-2" style={{ color: '#0b1d40' }}>
            No pending invoices
          </h3>
          <p className="text-sm font-body mb-6 leading-relaxed" style={{ color: '#5c82c9' }}>
            Send an invoice photo to your Telegram bot.<br />
            It'll appear here for review.
          </p>
          <button
            onClick={fetchInvoices}
            className="btn-ghost"
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
          <h2 className="font-display font-bold text-2xl flex items-center gap-3" style={{ color: '#0b1d40' }}>
            Pending Review
            <span className="inline-flex items-center justify-center w-7 h-7 text-white text-xs font-bold rounded-full"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #fbbf24)', color: '#060e24' }}>
              {invoices.length}
            </span>
          </h2>
          <p className="text-xs font-body mt-0.5" style={{ color: '#8aaae0' }}>
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
        <div key={invoice.id} style={{ animationDelay: `${index * 80}ms` }}>
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
