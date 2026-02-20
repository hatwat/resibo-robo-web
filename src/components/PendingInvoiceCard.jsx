import { useState, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'

const EXPENSE_CATEGORIES = [
  { value: 'PROFESSIONAL', label: 'Professional Services' },
  { value: 'TRANSPORT', label: 'Transportation' },
  { value: 'SUPPLIES', label: 'Office Supplies' },
  { value: 'UTILITIES', label: 'Utilities' },
  { value: 'FOOD', label: 'Food & Beverages' },
  { value: 'MEDICINE', label: 'Medicine' },
  { value: 'OTHERS', label: 'Others' },
]

const N8N_SAVE_URL = import.meta.env.VITE_N8N_WEBHOOK_SAVE
const N8N_CANCEL_URL = import.meta.env.VITE_N8N_WEBHOOK_CANCEL

function formatPeso(value) {
  const num = parseFloat(value) || 0
  return '₱' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function StatusPill({ status }) {
  const map = {
    PASS: { bg: '#d1fae5', color: '#065f46', border: '#6ee7b7', label: '✓ Valid' },
    WARN: { bg: '#fef3c7', color: '#92400e', border: '#fcd34d', label: '⚠ Review' },
    FAIL: { bg: '#fee2e2', color: '#991b1b', border: '#fca5a5', label: '✗ Issue' },
  }
  const s = map[status] || map['WARN']
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border font-body"
      style={{ background: s.bg, color: s.color, borderColor: s.border }}>
      {s.label}
    </span>
  )
}

function FieldRow({ label, value, onChange, type = 'text', placeholder = '', disabled = false, mono = false }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        step={type === 'number' ? '0.01' : undefined}
        className={`field-input ${mono ? 'font-mono text-xs' : ''}`}
      />
    </div>
  )
}

function CurrencyRow({ label, value, onChange, disabled = false }) {
  const [editing, setEditing] = useState(false)
  const [rawValue, setRawValue] = useState('')

  const handleFocus = () => { setEditing(true); setRawValue(String(parseFloat(value) || 0)) }
  const handleBlur  = () => { setEditing(false); onChange(parseFloat(rawValue) || 0) }

  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        type={editing ? 'number' : 'text'}
        value={editing ? rawValue : formatPeso(value)}
        onChange={(e) => setRawValue(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        step="0.01"
        className="field-input font-mono text-sm"
      />
    </div>
  )
}

function DateRow({ label, value, onChange, disabled = false }) {
  const toInput = (val) => {
    if (!val) return ''
    const p = val.split('/')
    if (p.length === 3) return `${p[2]}-${p[0].padStart(2,'0')}-${p[1].padStart(2,'0')}`
    return val
  }
  const fromInput = (val) => {
    if (!val) return ''
    const p = val.split('-')
    if (p.length === 3) return `${p[1]}/${p[2]}/${p[0]}`
    return val
  }
  return (
    <div>
      <label className="field-label">{label}</label>
      <input type="date" value={toInput(value)} onChange={(e) => onChange(fromInput(e.target.value))} disabled={disabled} className="field-input" />
    </div>
  )
}

export default function PendingInvoiceCard({ invoice, session, onInvoiceRemoved }) {
  const rawData = typeof invoice.extracted_data === 'string'
    ? (() => { try { return JSON.parse(invoice.extracted_data) } catch { return {} } })()
    : (invoice.extracted_data || {})

  const [formData, setFormData] = useState({
    vendor_name: rawData.vendor_name || '',
    tin: rawData.tin || '',
    address: rawData.address || '',
    city: rawData.city || '',
    invoice_number: rawData.invoice_number || '',
    date: rawData.date || '',
    vatable_sales: rawData.vatable_sales || 0,
    vat_amount: rawData.vat_amount || 0,
    vat_exempt_sales: rawData.vat_exempt_sales || 0,
    zero_rated_sales: rawData.zero_rated_sales || 0,
    service_charge: rawData.service_charge || 0,
    total_amount: rawData.total_amount || 0,
    expense_category: rawData.expense_category || 'OTHERS',
    vat_status: rawData.vat_status || 'VAT_REGISTERED',
    vendor_source: rawData.vendor_source,
    vendor_id: rawData.vendor_id,
    invoice_count: rawData.invoice_count,
    transaction_id: invoice.transaction_id,
    drive_url: rawData.drive_url || rawData.gdrive_url || invoice.gdrive_url,
    validation: rawData.validation || rawData.validation_summary || null,
  })

  const [saving, setSaving] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [removed, setRemoved] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [sidePanelOpen, setSidePanelOpen] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(100)
  const cardRef = useRef(null)

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }))
  const animateRemove = (cb) => { setRemoved(true); setTimeout(cb, 380) }

  const handleSave = async () => {
  setSaving(true); setActionError(null)
  try {
    // Force refresh the token
    const { data: { session: freshSession } } = await supabase.auth.refreshSession()
    const token = freshSession?.access_token || session?.access_token
    
    const res = await fetch(N8N_SAVE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ pending_id: invoice.id, invoice_data: formData }),
    })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.error || result.message || `HTTP ${res.status}`)
      setSidePanelOpen(false)
      animateRemove(() => onInvoiceRemoved(invoice.id))
    } catch (err) {
      setActionError('Save failed: ' + err.message)
      setSaving(false)
    }
  }

  const handleCancel = async () => {
  setCancelling(true); setActionError(null); setShowCancelConfirm(false)
  try {
    const { data: { session: freshSession } } = await supabase.auth.refreshSession()
    const token = freshSession?.access_token || session?.access_token

    const res = await fetch(N8N_CANCEL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ pending_id: invoice.id, gdrive_file_id: invoice.gdrive_file_id || rawData.gdrive_file_id }),
    })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.error || result.message || `HTTP ${res.status}`)
      setSidePanelOpen(false)
      animateRemove(() => onInvoiceRemoved(invoice.id))
    } catch (err) {
      setActionError('Cancel failed: ' + err.message)
      setCancelling(false)
    }
  }

  const validationStatus = formData.validation?.overall || 'WARN'
  const driveUrl = formData.drive_url
  const isWorking = saving || cancelling

  let imgUrl = rawData.cloudinary_url || null
  if (!imgUrl && driveUrl) {
    const match = driveUrl.match(/\/d\/([a-zA-Z0-9_-]+)/)
    imgUrl = match ? `https://drive.google.com/uc?id=${match[1]}&export=view` : driveUrl
  }

  const createdAt = new Date(invoice.created_at)
  const timeAgo = (() => {
    const diff = Date.now() - createdAt.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return createdAt.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
  })()

  return (
    <>
      <div ref={cardRef} className={`card-container transition-all duration-300 ${removed ? 'invoice-card-exit' : 'animate-slide-up'}`}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ background: 'linear-gradient(90deg, #5BC8F5 0%, #3AAEE0 100%)', borderColor: '#2d9fd0' }}>
          <div>
            <p className="font-display font-bold text-navy-900 text-base leading-tight" style={{ color: "#0b1d40" }}>
              {formData.vendor_name || 'Unknown Vendor'}
            </p>
            <span className="font-mono text-xs px-2 py-0.5 rounded mt-1 inline-block"
              style={{ background: 'rgba(11,29,64,0.15)', color: '#0b1d40', border: '1px solid rgba(11,29,64,0.25)' }}>
              {invoice.transaction_id}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={validationStatus} />
            <span className="text-xs font-body" style={{ color: '#0b3060' }}>{timeAgo}</span>
          </div>
        </div>

        {/* Error banner */}
        {actionError && (
          <div className="mx-6 mt-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-body flex items-start gap-2">
            <span className="shrink-0 mt-0.5">⚠️</span>
            <span>{actionError}</span>
          </div>
        )}

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: '#dce6f8' }}>

          {/* LEFT: Form */}
          <div className="lg:col-span-3 p-6 space-y-6">
            {/* Vendor info */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 font-body flex items-center gap-2"
                style={{ color: '#4a7ac8' }}>
                <span className="w-1 h-4 rounded-full inline-block" style={{ background: 'linear-gradient(#C9A84C, #fbbf24)' }} />
                Vendor Information
              </h4>
              <div className="space-y-3">
                <FieldRow label="Vendor Name" value={formData.vendor_name} onChange={(v) => handleChange('vendor_name', v)} disabled={isWorking} />
                <FieldRow label="TIN" value={formData.tin} onChange={(v) => handleChange('tin', v)} mono disabled={isWorking} />
                <FieldRow label="Address" value={formData.address} onChange={(v) => handleChange('address', v)} disabled={isWorking} />
                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="City" value={formData.city} onChange={(v) => handleChange('city', v)} disabled={isWorking} />
                  <div>
                    <label className="field-label">VAT Status</label>
                    <select value={formData.vat_status} onChange={(e) => handleChange('vat_status', e.target.value)} disabled={isWorking} className="field-input">
                      <option value="VAT_REGISTERED">VAT Registered</option>
                      <option value="VAT_EXEMPT">VAT Exempt</option>
                      <option value="NON_VAT">Non-VAT</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FieldRow label="Invoice Number" value={formData.invoice_number} onChange={(v) => handleChange('invoice_number', v)} disabled={isWorking} mono />
                  <DateRow label="Date" value={formData.date} onChange={(v) => handleChange('date', v)} disabled={isWorking} />
                </div>
                <div>
                  <label className="field-label">Expense Category</label>
                  <select value={formData.expense_category} onChange={(e) => handleChange('expense_category', e.target.value)} disabled={isWorking} className="field-input">
                    {EXPENSE_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Financials */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 font-body flex items-center gap-2"
                style={{ color: '#4a7ac8' }}>
                <span className="w-1 h-4 rounded-full inline-block" style={{ background: 'linear-gradient(#10b981, #34d399)' }} />
                Financial Breakdown
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <CurrencyRow label="Vatable Sales" value={formData.vatable_sales} onChange={(v) => handleChange('vatable_sales', v)} disabled={isWorking} />
                <CurrencyRow label="VAT Amount" value={formData.vat_amount} onChange={(v) => handleChange('vat_amount', v)} disabled={isWorking} />
                <CurrencyRow label="VAT Exempt Sales" value={formData.vat_exempt_sales} onChange={(v) => handleChange('vat_exempt_sales', v)} disabled={isWorking} />
                <CurrencyRow label="Zero Rated Sales" value={formData.zero_rated_sales} onChange={(v) => handleChange('zero_rated_sales', v)} disabled={isWorking} />
                <CurrencyRow label="Service Charge" value={formData.service_charge} onChange={(v) => handleChange('service_charge', v)} disabled={isWorking} />
                <CurrencyRow label="Total Amount" value={formData.total_amount} onChange={(v) => handleChange('total_amount', v)} disabled={isWorking} />
              </div>
              {/* Total highlight */}
              <div className="mt-3 px-4 py-3 rounded-xl flex items-center justify-between border"
                style={{ background: 'linear-gradient(135deg, #eef3fb, #dce6f8)', borderColor: '#adc5eb' }}>
                <span className="text-xs font-semibold uppercase tracking-wider font-body" style={{ color: '#4a7ac8' }}>Total Due</span>
                <span className="text-xl font-bold font-mono" style={{ color: '#0b1d40' }}>{formatPeso(formData.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Image + actions */}
          <div className="lg:col-span-2 flex flex-col" style={{ borderColor: '#dce6f8' }}>
            <div className="flex-1 p-6">
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4 font-body flex items-center gap-2"
                style={{ color: '#4a7ac8' }}>
                <span className="w-1 h-4 rounded-full inline-block" style={{ background: 'linear-gradient(#4a7ac8, #7aa0db)' }} />
                Original Invoice
              </h4>
              <div className="rounded-xl overflow-hidden border min-h-[200px] flex items-center justify-center"
                style={{ background: '#f8faff', borderColor: '#dce6f8' }}>
                {imgUrl && !imageError ? (
                  <img
                    src={imgUrl}
                    alt="Invoice"
                    className="w-full h-auto object-contain max-h-[420px] cursor-zoom-in hover:opacity-90 transition-opacity"
                    onError={() => setImageError(true)}
                    onClick={() => setSidePanelOpen(true)}
                  />
                ) : (
                  <div className="text-center p-8" style={{ color: '#8aaae0' }}>
                    <div className="text-5xl mb-3">🖼️</div>
                    <p className="text-sm font-body">
                      {driveUrl
                        ? <a href={driveUrl} target="_blank" rel="noreferrer" style={{ color: '#4a7ac8' }} className="underline">Open in Drive ↗</a>
                        : 'No image available'}
                    </p>
                  </div>
                )}
              </div>
              {imgUrl && !imageError && (
                <button onClick={() => setSidePanelOpen(true)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs font-body transition-colors"
                  style={{ color: '#8aaae0' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                  onMouseLeave={e => e.currentTarget.style.color = '#8aaae0'}>
                  <span>🔍</span> Click to expand & compare
                </button>
              )}
              {driveUrl && (
                <a href={driveUrl} target="_blank" rel="noreferrer"
                  className="mt-2 flex items-center justify-center gap-1.5 text-xs font-body transition-colors"
                  style={{ color: '#8aaae0' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#4a7ac8'}
                  onMouseLeave={e => e.currentTarget.style.color = '#8aaae0'}>
                  <span>↗</span> Open in Google Drive
                </a>
              )}
            </div>

            {/* Validation */}
            {formData.validation && (
              <div className="px-6 pb-4">
                <div className={`rounded-xl p-3 text-xs font-body border ${
                  validationStatus === 'PASS' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                  validationStatus === 'FAIL' ? 'bg-red-50 border-red-200 text-red-700' :
                  'bg-amber-50 border-amber-200 text-amber-700'}`}>
                  <p className="font-semibold mb-1">AI Validation: {validationStatus}</p>
                  {formData.validation.issues?.length > 0 && (
                    <ul className="space-y-0.5">
                      {formData.validation.issues.map((issue, i) => <li key={i}>• {issue}</li>)}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-6 border-t space-y-3" style={{ background: '#f8faff', borderColor: '#dce6f8' }}>
              {showCancelConfirm ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-700 font-body font-medium mb-3">Delete invoice and remove from Drive?</p>
                  <div className="flex gap-2">
                    <button onClick={handleCancel} disabled={isWorking}
                      className="flex-1 py-2 px-3 bg-red-500 text-white rounded-lg text-sm font-bold hover:bg-red-600 disabled:opacity-50 transition-all">
                      {cancelling ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Deleting…
                        </span>
                      ) : 'Yes, Delete'}
                    </button>
                    <button onClick={() => setShowCancelConfirm(false)}
                      className="py-2 px-3 rounded-lg text-sm font-semibold font-body hover:bg-navy-50 transition-all"
                      style={{ color: '#5c82c9' }}>
                      Keep
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button onClick={handleSave} disabled={isWorking} className="btn-primary w-full py-3 text-sm">
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-navy-900 border-t-transparent rounded-full animate-spin" />
                        Saving…
                      </>
                    ) : '✓ Save to Google Sheets'}
                  </button>
                  <button onClick={() => setShowCancelConfirm(true)} disabled={isWorking} className="btn-danger w-full py-2.5">
                    🗑 Cancel & Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      {sidePanelOpen && (
        <div className="fixed top-0 right-0 h-full w-[36vw] z-50 flex flex-col border-l-2"
          style={{ background: 'linear-gradient(180deg, #060e24 0%, #0b1d40 100%)', borderColor: '#C9A84C', boxShadow: '-8px 0 40px rgba(6,14,36,0.5)' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b shrink-0" style={{ borderColor: '#1a3f85' }}>
            <div>
              <p className="text-white text-sm font-display font-bold">Invoice Image</p>
              <p className="text-xs font-body" style={{ color: '#7aa0db' }}>{formData.vendor_name || 'Unknown Vendor'}</p>
            </div>
            <button onClick={() => setSidePanelOpen(false)}
              className="w-8 h-8 text-white rounded-full flex items-center justify-center text-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.1)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.3)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}>
              ×
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="px-4 py-3 border-b shrink-0 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', borderColor: '#1a3f85' }}>
            <span className="text-xs shrink-0" style={{ color: '#7aa0db' }}>🔍</span>
            <input
              type="range" min="100" max="300" step="10" value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              style={{ accentColor: '#C9A84C' }}
              className="flex-1 cursor-pointer"
            />
            <span className="text-xs font-mono w-10 text-right shrink-0" style={{ color: '#adc5eb' }}>{zoomLevel}%</span>
            <button onClick={() => setZoomLevel(100)}
              className="text-xs px-2 py-1 rounded transition-all font-body shrink-0"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#adc5eb' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(201,168,76,0.2)'; e.currentTarget.style.color = '#fbbf24' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#adc5eb' }}>
              Reset
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 overflow-auto p-4">
            <div style={{ transformOrigin: 'top left', transform: `scale(${zoomLevel / 100})`, marginBottom: `${(zoomLevel - 100) * 3}px`, width: '100%' }}>
              <img src={imgUrl} alt="Invoice fullscreen" className="w-full h-auto rounded-lg" />
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t shrink-0" style={{ borderColor: '#1a3f85' }}>
            {driveUrl && (
              <a href={driveUrl} target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs font-body transition-colors"
                style={{ color: '#5c82c9' }}
                onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
                onMouseLeave={e => e.currentTarget.style.color = '#5c82c9'}>
                <span>↗</span> Open in Google Drive
              </a>
            )}
            <p className="text-center text-xs font-body mt-1" style={{ color: '#2a5aad' }}>
              Panel stays open while you edit fields
            </p>
          </div>
        </div>
      )}
    </>
  )
}
