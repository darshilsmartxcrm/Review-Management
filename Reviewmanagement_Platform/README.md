# ⭐ Review Growth Hub - Next.js Edition

> **Full-Stack Agency & Multilingual 5-Star Review Funnel**  
> Built with **Next.js 16 (App Router)** • **React 19** • **TypeScript** • **Tailwind CSS**  
> Supported Languages: **English (🇬🇧) • हिन्दी (🇮🇳) • ગુજરાતી (🇮🇳)**  
> **100% Free Hosting Ready on Vercel & Netlify**

---

## 🎯 Key Features

1. **3 Languages Supported (English, हिन्दी, ગુજરાતી):**
   - Customers choose their preferred language in 1 tap.
   - Dynamic AI-generated authentic reviews incorporating the business name, city, and high-impact SEO keywords.
   - **"✨ Shuffle / Fresh Variations"** button for fresh review variations.

2. **1-Tap Copy & Direct Google 5-Star Write Review Redirect:**
   - Single tap button: **`📋 Copy Review & Open Google (5★)`**.
   - Review automatically copies to clipboard.
   - Celebratory confetti animation and 3-step guide:
     - **Step 1:** Select 5 Stars ⭐⭐⭐⭐⭐
     - **Step 2:** Paste your review 📋
     - **Step 3:** Hit Post! 🚀
   - Directly launches Google's 5-Star Write Review modal.

3. **Negative Review Gating (1 to 3 Stars):**
   - Dissatisfied customers rating 1-3 stars never see the Google link.
   - Private feedback form opens that routes the grievance directly to the business owner's **WhatsApp**.
   - Protects the business's public Google rating!

4. **Agency Dashboard (`/`):**
   - Clean, secure admin authentication (credentials customizable anytime from Settings).
   - Client management (create, edit, delete, industry category filters, live search).
   - Instant high-res QR code generator with print-ready PNG download.
   - WhatsApp share messages pre-formatted for business owners.
   - Inquiries & Leads manager from "Apply Now" submissions.
   - Export & Import clients JSON for zero-backend data portability.

5. **Printable Table Tent / Counter Standee (`/standee`):**
   - Print-ready A5/A6 counter display card with dynamic QR code.
   - Clean print styling (`Ctrl + P` to print or save PDF).

---

## 📁 Project Structure

```
review-growth-hub/
├── src/
│   ├── app/
│   │   ├── page.tsx            # Agency Admin Dashboard & Login
│   │   ├── layout.tsx          # Root layout, fonts & SEO metadata
│   │   ├── globals.css         # Tailwind & print styling
│   │   ├── review/
│   │   │   └── page.tsx        # Multilingual Review Funnel (EN/HI/GU)
│   │   └── standee/
│   │       └── page.tsx        # Printable Counter Standee & Table Tent
│   ├── components/
│   │   ├── ClientModal.tsx     # Add/Edit client business modal
│   │   ├── QrCodeModal.tsx     # QR code canvas & PNG download
│   │   ├── WhatsAppModal.tsx   # Pre-typed WhatsApp client share
│   │   ├── ApplyLeadModal.tsx  # Inbound business inquiry modal
│   │   ├── SettingsModal.tsx   # Admin credentials & JSON backup/restore
│   │   └── Toast.tsx           # Floating toast alerts
│   └── lib/
│       ├── types.ts            # TypeScript interfaces
│       ├── data.ts             # Industry catalog, templates, & encoding utils
│       └── storage.ts          # Safe LocalStorage persistence & auth
├── _static_backup/             # Original vanilla HTML/JS files kept as backup
├── package.json
└── tsconfig.json
```

---

## 💻 Running Locally

```bash
# Install dependencies (if not already installed)
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Admin Login:** Default credentials are `admin` / `admin@123` (can be updated from the Dashboard Settings).

---

## 🚀 1-Click Free Deployment

### Deploy to Vercel (Recommended):
1. Push this project to GitHub.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository and click **"Deploy"**. Vercel will automatically detect Next.js.

### Deploy to Netlify:
1. Connect your GitHub repository to [Netlify](https://app.netlify.com).
2. Build command: `npm run build`
3. Publish directory: `.next`
