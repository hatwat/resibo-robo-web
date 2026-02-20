import LoginCard from '../components/LoginCard'
import logo from '../assets/ResiboPH_AI.png'

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#eef3fb', overflowX: 'hidden' }}>

      {/* ═══════════════════ NAV ═══════════════════ */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'linear-gradient(90deg, #030812, #112b60)',
        borderBottom: '1px solid #1a3f85',
        padding: '0 2rem', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 2px 20px rgba(6,14,36,0.4)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src={logo} alt="ResiboPH AI" style={{ height: '40px', width: 'auto' }} />
          <span style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.15rem', color: 'white' }}>
            ResiboPH <span style={{ color: '#C9A84C' }}>AI</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <a href="#how" style={navLink}>How it Works</a>
          <a href="#features" style={navLink}>Features</a>
          <a href="#compliance" style={navLink}>BIR Compliance</a>
          <a href="#pricing" style={navLink}>Pricing</a>
          <a href="#hero-login" style={btnGold}>Get Started Free →</a>
        </div>
      </nav>

      {/* ═══════════════════ HERO ═══════════════════ */}
      <section id="hero" style={{
        minHeight: '92vh',
        background: 'linear-gradient(135deg, #030812 0%, #0b1d40 50%, #112b60 100%)',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        alignItems: 'center', gap: '4rem', padding: '6rem 4rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(91,200,245,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Left — copy */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={heroBadge}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#5BC8F5', display: 'inline-block' }} />
            AI-Powered · Philippine BIR-Compliant
          </div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 'clamp(2.5rem, 5vw, 3.75rem)', fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: '1.5rem' }}>
            Stop Typing.<br />
            Start <span style={{ background: 'linear-gradient(90deg, #5BC8F5, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Scanning.</span>
          </h1>
          <p style={{ color: '#adc5eb', fontSize: '1.1rem', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '500px' }}>
            ResiboPH AI extracts invoice data with cutting-edge AI precision — vendor name, TIN, VAT breakdown, totals — instantly. Built specifically for Philippine businesses and BIR requirements.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="#hero-login" style={btnGold}>Start Free Trial →</a>
            <a href="#how" style={btnOutline}>▶ See how it works</a>
          </div>
          {/* Stats */}
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { num: '99%', label: 'Extraction accuracy' },
              { num: '<5s', label: 'Per invoice' },
              { num: 'BIR ✓', label: 'Compliant fields' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.75rem', fontWeight: 800, color: 'white' }}>
                  {s.num.includes('BIR') ? <>{s.num.split(' ')[0]} <span style={{ color: '#C9A84C' }}>✓</span></> : <>{s.num.replace('%','')}<span style={{ color: '#C9A84C' }}>{s.num.includes('%') ? '%' : ''}</span></>}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#7aa0db', marginTop: '2px' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Login card */}
        <div id="hero-login" style={{ position: 'relative', zIndex: 1 }}>
          <LoginCard />
        </div>
      </section>

      {/* ═══════════════════ HOW IT WORKS ═══════════════════ */}
      <section id="how" style={{ padding: '6rem 4rem', background: 'white' }}>
        <div style={sectionTag}>How it Works</div>
        <h2 style={sectionTitle}>From photo to spreadsheet<br />in 4 simple steps</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginTop: '4rem', position: 'relative' }}>
          {/* Connector line */}
          <div style={{ position: 'absolute', top: '28px', left: '12%', right: '12%', height: '2px', background: 'linear-gradient(90deg, #5BC8F5, #C9A84C)', zIndex: 0 }} />
          {[
            { num: '1', icon: '📱', title: 'Snap & Send', desc: 'Take a photo of any invoice and send it to our Telegram bot. No app download needed.', gold: false },
            { num: '2', icon: '🤖', title: 'AI Extracts', desc: 'Our AI reads and extracts all BIR-required fields — TIN, VAT, totals — in under 5 seconds.', gold: false },
            { num: '3', icon: '✏️', title: 'Review & Edit', desc: 'Log in to your portal, compare with the original image, and correct anything if needed.', gold: true },
            { num: '4', icon: '📊', title: 'Save & Export', desc: 'One click saves to Google Sheets or pushes directly to your accounting software.', gold: true },
          ].map(step => (
            <div key={step.num} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%', margin: '0 auto 1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, fontSize: '1.1rem',
                background: step.gold ? 'linear-gradient(135deg, #C9A84C, #fbbf24)' : 'linear-gradient(135deg, #5BC8F5, #3AAEE0)',
                color: step.gold ? '#060e24' : 'white',
                boxShadow: step.gold ? '0 4px 16px rgba(201,168,76,0.4)' : '0 4px 16px rgba(91,200,245,0.4)',
              }}>{step.num}</div>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{step.icon}</div>
              <h4 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0b1d40', marginBottom: '0.5rem' }}>{step.title}</h4>
              <p style={{ fontSize: '0.875rem', color: '#5c82c9', lineHeight: 1.65 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FEATURES ═══════════════════ */}
      <section id="features" style={{ padding: '6rem 4rem', background: 'linear-gradient(135deg, #030812, #0b1d40)' }}>
        <div style={{ ...sectionTag, color: '#C9A84C' }}>Why ResiboPH AI</div>
        <h2 style={{ ...sectionTitle, color: 'white' }}>Built for Philippine<br />businesses. Period.</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '4rem' }}>
          {[
            { tag: 'AI Accuracy', tagColor: '#5BC8F5', tagBg: 'rgba(91,200,245,0.12)', icon: '🎯', title: 'Cutting-Edge Extraction', desc: 'Powered by state-of-the-art vision AI. Reads printed, handwritten, and faded receipts with near-perfect accuracy.' },
            { tag: 'PH-Specific', tagColor: '#C9A84C', tagBg: 'rgba(201,168,76,0.12)', icon: '🇵🇭', title: 'BIR-Ready Fields', desc: 'Extracts VATable sales, VAT amount, VAT-exempt, zero-rated sales, and TIN exactly as BIR requires.' },
            { tag: 'Efficiency', tagColor: '#10b981', tagBg: 'rgba(16,185,129,0.12)', icon: '⚡', title: 'Save 5 Min Per Invoice', desc: 'Manual encoding takes 5–10 minutes. ResiboPH AI does it in under 5 seconds. 100 invoices/month = 8+ hours saved.' },
            { tag: 'Flexible', tagColor: '#5BC8F5', tagBg: 'rgba(91,200,245,0.12)', icon: '🔗', title: 'Accounting Integrations', desc: 'Push data to QuickBooks, Xero, or any system via Google Sheets. Works with your existing workflow.' },
            { tag: 'Multi-User', tagColor: '#C9A84C', tagBg: 'rgba(201,168,76,0.12)', icon: '👥', title: 'Team Ready', desc: 'Multiple users, each with their own secure invoice queue. Perfect for finance teams and bookkeepers.' },
            { tag: 'Audit Trail', tagColor: '#10b981', tagBg: 'rgba(16,185,129,0.12)', icon: '🗂️', title: 'Cloud Storage', desc: 'Every invoice image stored in Google Drive, organized by month. Always accessible for BIR audit purposes.' },
          ].map(f => (
            <div key={f.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(91,200,245,0.15)', borderRadius: 16, padding: '2rem', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <div style={{ display: 'inline-block', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: 100, marginBottom: '0.75rem', background: f.tagBg, color: f.tagColor }}>{f.tag}</div>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{f.icon}</div>
              <h4 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, color: 'white', fontSize: '1.05rem', marginBottom: '0.6rem' }}>{f.title}</h4>
              <p style={{ color: '#adc5eb', fontSize: '0.875rem', lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ BIR COMPLIANCE ═══════════════════ */}
      <section id="compliance" style={{ padding: '6rem 4rem', background: '#eef3fb' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          <div>
            <div style={sectionTag}>Philippine Compliance</div>
            <h2 style={sectionTitle}>Configured for BIR.<br />VAT & Non-VAT.</h2>
            <p style={{ color: '#5c82c9', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2rem' }}>
              ResiboPH AI is the only invoice extractor built ground-up for Philippine tax requirements — not adapted from a foreign system.
            </p>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {[
                'Extracts TIN and verifies format against BIR standards',
                'Separates VATable Sales, VAT Amount, VAT-Exempt, and Zero-Rated Sales',
                'Handles both VAT-registered and Non-VAT businesses',
                'Captures official receipt vs. sales invoice distinctions',
                'Expense categorization aligned with BIR deductible categories',
                'Supports multi-currency for import transactions',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: '1rem', fontSize: '0.95rem', color: '#3a5080', lineHeight: 1.6 }}>
                  <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #C9A84C, #fbbf24)', color: '#060e24', fontWeight: 800, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* BIR Fields visual */}
          <div style={{ background: 'white', border: '1px solid #dce6f8', borderRadius: 20, padding: '2.5rem', boxShadow: '0 4px 24px rgba(10,30,80,0.08)' }}>
            <h4 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 700, fontSize: '1rem', color: '#0b1d40', marginBottom: '1.5rem' }}>📄 Extracted Invoice Fields</h4>
            {[
              { label: 'Vendor Name', val: 'ABC Trading Corp.', gold: false },
              { label: 'TIN', val: '123-456-789-000', gold: false },
              { label: 'VATable Sales', val: '₱8,928.57', gold: false },
              { label: 'VAT Amount (12%)', val: '₱1,071.43', gold: false },
              { label: 'VAT-Exempt Sales', val: '₱0.00', gold: false },
              { label: 'Zero-Rated Sales', val: '₱0.00', gold: false },
              { label: 'Total Amount Due', val: '₱10,000.00', gold: true },
            ].map((f, i, arr) => (
              <div key={f.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: i === arr.length - 1 ? 'none' : '1px solid #eef3fb', borderTop: i === arr.length - 1 ? '2px solid #eef3fb' : 'none', marginTop: i === arr.length - 1 ? '0.5rem' : 0 }}>
                <span style={{ fontSize: '0.8rem', color: '#5c82c9', fontWeight: f.gold ? 700 : 500, color: f.gold ? '#0b1d40' : '#5c82c9' }}>{f.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', fontWeight: f.gold ? 700 : 500, color: f.gold ? '#C9A84C' : '#0b1d40' }}>{f.val}</span>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'white' }}>✓</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ INTEGRATIONS ═══════════════════ */}
      <section id="integrations" style={{ padding: '6rem 4rem', background: 'white', textAlign: 'center' }}>
        <div style={{ ...sectionTag, justifyContent: 'center' }}>Integrations</div>
        <h2 style={{ ...sectionTitle, textAlign: 'center' }}>Works with your<br />existing tools</h2>
        <p style={{ color: '#5c82c9', fontSize: '1rem', lineHeight: 1.75, maxWidth: 520, margin: '0 auto 3rem' }}>
          Export to any accounting platform. ResiboPH AI plays nicely with whatever you already use.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          {[
            { icon: '📊', name: 'Google Sheets', soon: false },
            { icon: '💼', name: 'QuickBooks', soon: true },
            { icon: '📘', name: 'Xero', soon: true },
            { icon: '🧮', name: 'Accounting Plus', soon: false },
            { icon: '🔗', name: 'Custom Webhook', soon: false },
            { icon: '📁', name: 'Google Drive', soon: false },
            { icon: '📨', name: 'Telegram Bot', soon: false },
            { icon: '⚙️', name: 'REST API', soon: true },
          ].map(i => (
            <div key={i.name}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.75rem 1.5rem', borderRadius: 12, border: '1.5px solid #dce6f8', background: '#eef3fb', fontWeight: 600, fontSize: '0.875rem', color: '#112b60', cursor: 'default', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(201,168,76,0.15)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#dce6f8'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}>
              <span style={{ fontSize: '1.25rem' }}>{i.icon}</span>
              {i.name}
              {i.soon && <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#C9A84C', background: 'rgba(201,168,76,0.1)', padding: '2px 6px', borderRadius: 4 }}>Soon</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ PRICING ═══════════════════ */}
      <section id="pricing" style={{ padding: '6rem 4rem', background: '#eef3fb' }}>
        <div style={sectionTag}>Pricing</div>
        <h2 style={sectionTitle}>Simple, transparent pricing</h2>
        <p style={{ color: '#5c82c9', fontSize: '1rem', marginBottom: 0 }}>Start free. Scale as you grow. No hidden fees.</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginTop: '4rem' }}>
          {[
            {
              tier: 'Starter', price: '0', desc: 'Perfect for trying it out', featured: false,
              features: ['50 invoices/month', '1 user', 'Google Sheets export', 'Google Drive storage', 'Email support'],
            },
            {
              tier: 'Professional', price: '999', desc: 'For growing businesses', featured: true,
              features: ['500 invoices/month', '5 users', 'All integrations', 'Priority processing', 'Priority support'],
            },
            {
              tier: 'Enterprise', price: null, desc: 'For large organizations', featured: false,
              features: ['Unlimited invoices', 'Unlimited users', 'Custom integrations', 'Dedicated support', 'SLA guarantee'],
            },
          ].map(p => (
            <div key={p.tier} style={{ background: 'white', border: p.featured ? '2px solid #C9A84C' : '1.5px solid #dce6f8', borderRadius: 20, padding: '2.5rem', position: 'relative', boxShadow: p.featured ? '0 4px 24px rgba(201,168,76,0.2)' : 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(10,30,80,0.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = p.featured ? '0 4px 24px rgba(201,168,76,0.2)' : 'none' }}>
              {p.featured && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #C9A84C, #fbbf24)', color: '#060e24', fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.25rem 1rem', borderRadius: 100, whiteSpace: 'nowrap' }}>⭐ Most Popular</div>}
              <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '0.75rem' }}>{p.tier}</div>
              <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: p.price ? '2.5rem' : '1.8rem', fontWeight: 900, color: '#0b1d40' }}>
                {p.price ? <><sup style={{ fontSize: '1rem', verticalAlign: 'super' }}>₱</sup>{p.price}<sub style={{ fontSize: '0.9rem', color: '#8aaae0', fontWeight: 400 }}>/mo</sub></> : 'Custom'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#8aaae0', margin: '0.5rem 0 1.5rem' }}>{p.desc}</div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2rem' }}>
                {p.features.map(f => (
                  <li key={f} style={{ fontSize: '0.875rem', color: '#3a5080', padding: '0.5rem 0', borderBottom: '1px solid #eef3fb', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>{f}
                  </li>
                ))}
              </ul>
              <button
                style={{ width: '100%', padding: '0.8rem', borderRadius: 10, fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', border: p.featured ? 'none' : '1.5px solid #dce6f8', background: p.featured ? 'linear-gradient(135deg, #C9A84C, #fbbf24)' : 'transparent', color: p.featured ? '#060e24' : '#1a3f85', transition: 'all 0.2s' }}
                onMouseEnter={e => { if (!p.featured) { e.currentTarget.style.borderColor = '#4a7ac8'; e.currentTarget.style.color = '#0b1d40' } }}
                onMouseLeave={e => { if (!p.featured) { e.currentTarget.style.borderColor = '#dce6f8'; e.currentTarget.style.color = '#1a3f85' } }}
              >
                {p.price === '0' ? 'Get Started Free' : p.price ? 'Start Free Trial →' : 'Contact Us'}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════ FOOTER ═══════════════════ */}
      <footer style={{
        background: 'linear-gradient(90deg, #030812, #0b1d40)',
        padding: '3rem 4rem', borderTop: '1px solid #1a3f85',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '1rem',
      }}>
        <div>
          <div style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 800, color: 'white', fontSize: '1rem', marginBottom: 4 }}>
            ResiboPH <span style={{ color: '#C9A84C' }}>AI</span>
          </div>
          <p style={{ color: '#7aa0db', fontSize: '0.85rem' }}>AI-powered invoice extraction for Philippine businesses</p>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Privacy Policy', 'Terms of Service', 'Contact'].map(l => (
            <a key={l} href="#" style={{ color: '#7aa0db', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.color = '#7aa0db'}>{l}</a>
          ))}
        </div>
        <p style={{ color: '#3660a8', fontSize: '0.8rem' }}>© 2026 ResiboPH AI. All rights reserved.</p>
      </footer>

    </div>
  )
}

// ─── Shared styles ───
const navLink = { color: '#adc5eb', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500, transition: 'color 0.2s' }

const btnGold = {
  background: 'linear-gradient(135deg, #C9A84C, #fbbf24)',
  color: '#060e24', fontWeight: 700, fontSize: '0.9rem',
  padding: '0.7rem 1.5rem', borderRadius: 10, border: 'none',
  cursor: 'pointer', textDecoration: 'none', display: 'inline-flex',
  alignItems: 'center', gap: 6, fontFamily: 'Plus Jakarta Sans, sans-serif',
  transition: 'filter 0.2s',
}

const btnOutline = {
  background: 'transparent', border: '1.5px solid #4a7ac8',
  color: '#adc5eb', fontWeight: 600, fontSize: '0.9rem',
  padding: '0.7rem 1.5rem', borderRadius: 10,
  cursor: 'pointer', textDecoration: 'none', display: 'inline-flex',
  alignItems: 'center', gap: 6, fontFamily: 'Plus Jakarta Sans, sans-serif',
  transition: 'all 0.2s',
}

const heroBadge = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  background: 'rgba(91,200,245,0.1)', border: '1px solid rgba(91,200,245,0.3)',
  color: '#5BC8F5', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em',
  padding: '0.35rem 0.85rem', borderRadius: 100, marginBottom: '1.5rem',
  textTransform: 'uppercase',
}

const sectionTag = {
  display: 'inline-flex', alignItems: 'center', gap: 8,
  fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
  textTransform: 'uppercase', color: '#C9A84C', marginBottom: '1rem',
}

const sectionTitle = {
  fontFamily: 'Plus Jakarta Sans, sans-serif',
  fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
  fontWeight: 800, color: '#0b1d40', lineHeight: 1.2, marginBottom: '1rem',
}
