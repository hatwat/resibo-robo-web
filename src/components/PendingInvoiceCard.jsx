import { useState, useRef } from 'react'

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

// Format number as Philippine peso currency
function formatPeso(value) {
  const num = parseFloat(value) || 0
  return '₱' + num.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

// Parse peso string back to number for editing
function parsePeso(str) {
  return parseFloat(String(str).replace(/[₱,]/g, '')) || 0
}

function StatusPill({ status }) {
  const map = {
    PASS: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: '✓ Valid' },
    WARN: { color: 'bg-amber-100 text-amber-700 border-amber-200', label: '⚠ Review' },
    FAIL: { color: 'bg-red-100 text-red-700 border-red-200', label: '✗ Issue' },
  }
  const style = map[status] || map['WARN']
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style.color} font-body`}>
      {style.label}
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

// Currency field — shows formatted value, edits as raw number
function CurrencyRow({ label, value, onChange, disabled = false }) {
  const [editing, setEditing] = useState(false)
  const [rawValue, setRawValue] = useState('')

  const handleFocus = () => {
    setEditing(true)
    setRawValue(String(parseFloat(value) || 0))
  }

  const handleBlur = () => {
    setEditing(false)
    onChange(parseFloat(rawValue) || 0)
  }

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

// Date field with calendar picker
function DateRow({ label, value, onChange, disabled = false }) {
  // Convert MM/DD/YYYY to YYYY-MM-DD for input[type=date]
  const toInputFormat = (val) => {
    if (!val) return ''
    const parts = val.split('/')
    if (parts.length === 3) {
      return `${parts[2]}-${parts[0].padStart(2,'0')}-${parts[1].padStart(2,'0')}`
    }
    return val
  }

  // Convert YYYY-MM-DD back to MM/DD/YYYY
  const fromInputFormat = (val) => {
    if (!val) return ''
    const parts = val.split('-')
    if (parts.length === 3) {
      return `${parts[1]}/${parts[2]}/${parts[0]}`
    }
    return val
  }

  return (
    <div>
      <label className="field-label">{label}</label>
      <input
        type="date"
        value={toInputFormat(value)}
        onChange={(e) => onChange(fromInputFormat(e.target.value))}
        disabled={disabled}
        className="field-input"
      />
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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const animateRemove = (callback) => {
    setRemoved(true)
    setTimeout(() => { callback() }, 380)
  }

  const handleSave = async () => {
    setSaving(true)
    setActionError(null)
    try {
      const token = session?.access_token
      const res = await fetch(N8N_SAVE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pending_id: invoice.id,
          invoice_data: formData,
        }),
      })
      const result = await res.json()
      if (!res.ok || !result.success) {
        throw new Error(result.error || result.message || `HTTP ${res.status}`)
      }
      setSidePanelOpen(false)
      animateRemove(() => onInvoiceRemoved(invoice.id))
    } catch (err) {
      console.error('Save error:', err)
      setActionError('Save failed: ' + err.message)
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    setCancelling(true)
    setActionError(null)
    setShowCancelConfirm(false)
    try {
      const token = session?.access_token
      const res = await fetch(N8N_CANCEL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pending_id: invoice.id,
          gdrive_file_id: invoice.gdrive_file_id || rawData.gdrive_file_id,
        }),
      })
      const result = await res.json()
      if (!res.ok || !result.success) {
        throw new Error(result.error || result.message || `HTTP ${res.status}`)
      }
      setSidePanelOpen(false)
      animateRemove(() => onInvoiceRemoved(invoice.id))
    } catch (err) {
      console.error('Cancel error:', err)
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
    if (match) {
      imgUrl = `https://drive.google.com/uc?id=${match[1]}&export=view`
    } else {
      imgUrl = driveUrl
    }
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
      <div
        ref={cardRef}
        className={`card-container transition-all duration-300 ${removed ? 'invoice-card-exit' : 'animate-slide-up'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-200 bg-ink-900">
          <div>
            <p className="font-display font-semibold text-white text-base leading-tight">
              {formData.vendor_name || 'Unknown Vendor'}
            </p>
            <p className="font-mono text-ink-200 text-xs mt-0.5 bg-ink-700 px-2 py-0.5 rounded inline-block">
              {invoice.transaction_id}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusPill status={validationStatus} />
            <span className="text-ink-300 text-xs font-body">{timeAgo}</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-5 divide-y lg:divide-y-0 lg:divide-x divide-ink-100">

          {/* LEFT: Form fields */}
          <div className="lg:col-span-3 p-6 space-y-6">
            {/* Vendor info */}
            <div>
              <h4 className="font-body text-xs font-bold uppercase tracking-widest text-ink-400 mb-4">
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
                    {EXPENSE_CATEGORIES.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Financials */}
            <div>
              <h4 className="font-body text-xs font-bold uppercase tracking-widest text-ink-400 mb-4">
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
              <div className="mt-3 px-4 py-3 bg-ink-50 border border-ink-100 rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-ink-400 uppercase tracking-wider font-body">Total Due</span>
                <span className="text-lg font-bold text-ink-800 font-mono">{formatPeso(formData.total_amount)}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Image + actions */}
          <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-ink-100 flex flex-col">
            <div className="flex-1 p-6">
              <h4 className="font-body text-xs font-bold uppercase tracking-widest text-ink-400 mb-4">
                Original Invoice
              </h4>
              <div className="rounded-xl overflow-hidden border border-ink-100 bg-ink-50 min-h-[200px] flex items-center justify-center">
                {imgUrl && !imageError ? (
                  <img
                    src={imgUrl}
                    alt="Invoice"
                    className="w-full h-auto object-contain max-h-[480px] cursor-zoom-in hover:opacity-90 transition-opacity"
                    onError={() => setImageError(true)}
                    onClick={() => setSidePanelOpen(true)}
                  />
                ) : (
                  <div className="text-center p-8 text-ink-300">
                    <div className="text-5xl mb-3">🖼️</div>
                    <p className="text-sm font-body">
                      {driveUrl
                        ? <a href={driveUrl} target="_blank" rel="noreferrer" className="text-accent-blue underline">Open in Drive ↗</a>
                        : 'No image available'
                      }
                    </p>
                  </div>
                )}
              </div>
              {imgUrl && !imageError && (
                <button
                  onClick={() => setSidePanelOpen(true)}
                  className="mt-3 w-full flex items-center justify-center gap-1.5 text-xs text-ink-400 hover:text-accent-gold transition-colors font-body"
                >
                  <span>🔍</span> Click to expand & compare
                </button>
              )}
              {driveUrl && (
                <a
                  href={driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex items-center justify-center gap-1.5 text-xs text-ink-400 hover:text-accent-blue transition-colors font-body"
                >
                  <span>↗</span> Open in Google Drive
                </a>
              )}
            </div>

            {/* Validation details */}
            {formData.validation && (
              <div className="px-6 pb-4">
                <div className={`rounded-xl p-3 text-xs font-body border ${
                  validationStatus === 'PASS' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                  validationStatus === 'FAIL' ? 'bg-red-50 border-red-200 text-red-700' :
                  'bg-amber-50 border-amber-200 text-amber-700'
                }`}>
                  <p className="font-semibold font-body mb-1">AI Validation: {validationStatus}</p>
                  {formData.validation.issues && formData.validation.issues.length > 0 && (
                    <ul className="space-y-0.5">
                      {formData.validation.issues.map((issue, i) => (
                        <li key={i}>• {issue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="p-6 border-t border-ink-100 bg-ink-50 space-y-3">
              {showCancelConfirm ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-sm text-red-700 font-body font-medium mb-3">
                    Delete invoice and remove from Drive?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      disabled={isWorking}
                      className="flex-1 py-2 px-3 bg-accent-red text-white rounded-lg text-sm font-bold font-body hover:bg-opacity-90 disabled:opacity-50 transition-all"
                    >
                      {cancelling ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Deleting…
                        </span>
                      ) : 'Yes, Delete'}
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="py-2 px-3 rounded-lg text-sm font-semibold font-body text-ink-500 hover:bg-ink-100 transition-all"
                    >
                      Keep
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isWorking}
                    className="btn-primary w-full py-3 text-base"
                  >
                    {saving ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>✓ Save to Google Sheets</>
                    )}
                  </button>
                  <button
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={isWorking}
                    className="btn-danger w-full py-2.5"
                  >
                    🗑 Cancel & Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Side Panel — narrower so it doesn't cover the form */}
      {sidePanelOpen && (
        <div className="fixed top-0 right-0 h-full w-[35vw] z-50 bg-ink-900 border-l-2 border-accent-gold shadow-2xl flex flex-col">
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-ink-700 shrink-0">
            <div>
              <p className="text-white text-sm font-display font-semibold">Invoice Image</p>
              <p className="text-ink-300 text-xs font-body">{formData.vendor_name || 'Unknown Vendor'}</p>
            </div>
            <button
              onClick={() => setSidePanelOpen(false)}
              className="w-8 h-8 bg-ink-700 text-white rounded-full flex items-center justify-center hover:bg-ink-600 transition-all text-xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="px-4 py-3 border-b border-ink-700 shrink-0 flex items-center gap-3 bg-ink-800">
            <span className="text-ink-400 text-xs shrink-0">🔍</span>
            <input
              type="range"
              min="100"
              max="300"
              step="10"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              style={{ accentColor: '#C9A84C' }}
              className="flex-1 cursor-pointer"
            />
            <span className="text-ink-300 text-xs font-mono w-10 text-right shrink-0">{zoomLevel}%</span>
            <button
              onClick={() => setZoomLevel(100)}
              className="text-xs px-2 py-1 bg-ink-700 text-ink-300 rounded hover:bg-ink-600 hover:text-white transition-all font-body shrink-0"
            >
              Reset
            </button>
          </div>

          {/* Panel Image */}
          <div className="flex-1 overflow-auto p-4">
            <div style={{
              transformOrigin: 'top left',
              transform: `scale(${zoomLevel / 100})`,
              marginBottom: `${(zoomLevel - 100) * 3}px`,
              width: '100%',
            }}>
              <img
                src={imgUrl}
                alt="Invoice fullscreen"
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>

          {/* Panel Footer */}
          <div className="px-4 py-3 border-t border-ink-700 shrink-0 space-y-1">
            {driveUrl && (
              <a
                href={driveUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs text-ink-400 hover:text-accent-gold transition-colors font-body"
              >
                <span>↗</span> Open in Google Drive
              </a>
            )}
            <p className="text-center text-ink-600 text-xs font-body">
              Panel stays open while you edit fields
            </p>
          </div>
        </div>
      )}
    </>
  )
}
