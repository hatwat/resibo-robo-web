# Resibo Robo — Web Interface

Invoice approval portal for the Resibo Robo system. Upload invoices via Telegram, review AI-extracted data, and approve or cancel via this web interface.

---

## Stack

- **React + Vite** — frontend framework
- **Tailwind CSS** — styling
- **Supabase** — auth + database (pending_invoices via RLS)
- **n8n** — backend webhooks (save/cancel actions)
- **Vercel** — deployment

---

## Prerequisites

- Phase 1 (Database) ✅ complete
- Phase 2 (Telegram Workflow) ✅ complete  
- Phase 3 (n8n Webhooks) complete — you need the production webhook URLs

---

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```bash
# From Supabase Dashboard → Settings → API
VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key-here

# From n8n → Webhook node → Production URL (must activate workflows first!)
VITE_N8N_WEBHOOK_SAVE=https://your-n8n-instance.com/webhook/save-invoice
VITE_N8N_WEBHOOK_CANCEL=https://your-n8n-instance.com/webhook/cancel-invoice
```

### 3. Activate n8n webhooks

Before the web app works, you must activate both webhook workflows in n8n:
1. Open n8n → go to **"Resibo Robo - Save Invoice Webhook"** → toggle Active ON
2. Open n8n → go to **"Resibo Robo - Cancel Invoice Webhook"** → toggle Active ON
3. Click on the Webhook node in each → copy the **Production URL** → paste into `.env.local`

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:5173

---

## Deploying to Vercel

### Option A: Vercel CLI (recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy (from project root)
vercel

# Follow the prompts:
# - Link to your Vercel account
# - Set project name: resibo-robo
# - Framework preset: Vite
# - Build command: npm run build
# - Output directory: dist
```

### Option B: Vercel Dashboard (drag & drop)

1. Run `npm run build` → produces `dist/` folder
2. Go to [vercel.com](https://vercel.com)
3. Drag and drop the `dist/` folder
4. Set environment variables in Vercel Dashboard → Settings → Environment Variables

### Set Environment Variables in Vercel

After deploying, go to:
**Vercel Dashboard → Your Project → Settings → Environment Variables**

Add all 4 variables from your `.env.local`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_N8N_WEBHOOK_SAVE`
- `VITE_N8N_WEBHOOK_CANCEL`

Then **redeploy** for the variables to take effect.

### Update Supabase Auth Redirect URL

After deploying, go to:
**Supabase Dashboard → Authentication → URL Configuration**

Add your Vercel URL to **Redirect URLs**:
```
https://resibo-robo.vercel.app/**
```

(Replace with your actual Vercel URL)

---

## Project Structure

```
resibo-robo-web/
├── src/
│   ├── components/
│   │   ├── LoginForm.jsx          # Auth page (password + magic link)
│   │   ├── PendingInvoicesGrid.jsx  # Fetches & lists invoices
│   │   └── PendingInvoiceCard.jsx   # Individual invoice card with edit + actions
│   ├── lib/
│   │   └── supabaseClient.js      # Supabase client singleton
│   ├── App.jsx                    # Root component, auth gate
│   ├── main.jsx                   # React entry point
│   └── index.css                  # Tailwind + custom styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── vercel.json                    # SPA routing fix
└── .env.local.example             # Environment variable template
```

---

## How It Works

1. **User uploads invoice photo to Telegram bot**
2. **n8n extracts data, stores in `pending_invoices`** (with user_id + gdrive_file_id)
3. **Telegram sends link** → `https://resibo-robo.vercel.app`
4. **User opens web app, logs in** (Supabase auth)
5. **Pending invoices appear** (RLS enforces user isolation)
6. **User reviews extracted data**, edits if needed
7. **User clicks Save** → POST to n8n save webhook → appends to Google Sheets → deletes pending record
8. **OR User clicks Cancel** → POST to n8n cancel webhook → deletes from Google Drive → deletes pending record
9. **Card disappears from list** — done!

---

## Troubleshooting

### Invoices not appearing
- Check user is logged in with the correct email
- Verify Telegram chat_id is mapped in `user_telegram_mapping`
- Check `pending_invoices` table has `user_id` populated (not null)

### Save/Cancel not working
- Ensure n8n webhook workflows are **Active** (not just created)
- Check `VITE_N8N_WEBHOOK_SAVE` and `VITE_N8N_WEBHOOK_CANCEL` are production URLs (not test URLs)
- Check browser console for errors

### Images not loading
- Google Drive direct image embed may require files to be publicly shared
- Alternatively, open the Drive link directly via the "Open in Google Drive" link

---

## Feature Notes

- **Editable fields**: All extracted data is editable before saving
- **Validation indicators**: AI validation status shown per invoice (PASS/WARN/FAIL)
- **Confirmation dialog**: Cancel action requires confirmation to prevent accidental deletion
- **Loading states**: Save and Cancel buttons show spinners during processing
- **Auto-removal**: Cards animate out after successful save or cancel
- **Error display**: API errors shown inline without losing form data
