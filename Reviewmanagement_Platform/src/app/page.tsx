'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  Sparkles,
  QrCode,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Camera,
  CheckCircle2,
  ArrowRight,
  Printer,
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Users,
  Smartphone,
  Copy,
  ExternalLink,
  Tag,
  Building2,
  Rocket,
  Check
} from 'lucide-react';
import { IndustryKey, LanguageCode, Lead } from '../lib/types';
import { INDUSTRY_CATALOG, UI_STRINGS, generateReviews } from '../lib/data';
import { saveStoredLeads, getStoredLeads } from '../lib/storage';
import { leadsApi } from '../api/leadsApi';
import ApplyLeadModal from '../components/ApplyLeadModal';
import Toast from '../components/Toast';

export default function PublicLandingPage() {
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('success');

  // Interactive Live Demo Funnel States
  const [demoRating, setDemoRating] = useState(5);
  const [demoCategory, setDemoCategory] = useState<IndustryKey>('healthcare');
  const [demoLang, setDemoLang] = useState<LanguageCode>('gu');
  const [demoSelectedProduct, setDemoSelectedProduct] = useState<string | null>(null);
  const [copiedDemo, setCopiedDemo] = useState(false);
  const [demoReviews, setDemoReviews] = useState<string[]>([]);

  const catData = INDUSTRY_CATALOG[demoCategory] || INDUSTRY_CATALOG.healthcare;

  React.useEffect(() => {
    const revs = generateReviews(
      {
        name: 'SmartXCRM ',
        person_name: 'Dr. Darpan Patel',
        category: demoCategory,
        city: 'Ahmedabad',
      },
      demoLang,
      demoSelectedProduct
    );
    setDemoReviews(revs);
  }, [demoCategory, demoLang, demoSelectedProduct]);

  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleLeadSubmit = (lead: Lead) => {
    const existing = getStoredLeads();
    saveStoredLeads([lead, ...existing]);
    leadsApi.submitLead(lead).catch(() => {});
    showToast(`Thank you ${lead.name}! Your inquiry for "${lead.business}" has been submitted.`);
  };

  const handleCopyReview = (text: string) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(text);
      setCopiedDemo(true);
      showToast('Copied to clipboard! Ready to paste on Google Reviews.');
      setTimeout(() => setCopiedDemo(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white flex flex-col font-sans">
      <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-700 to-blue-800 text-white text-xs font-semibold py-2 px-4 text-center border-b border-indigo-500/20">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          <span>Next-Gen SmartXCRM 5-Star Review Engine • Supports English, हिन्दी & ગુજરાતી with Permanent QR Codes</span>
        </span>
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition">
              <Star className="w-5 h-5 fill-white text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-white group-hover:text-indigo-400 transition">
                  Review Growth Hub
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase tracking-widest hidden sm:inline-block">
                  SmartXCRM
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Multilingual 5-Star Reputation Engine
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
            <a href="#demo" className="hover:text-indigo-400 transition">Live Demo</a>
            <a href="#how-it-works" className="hover:text-indigo-400 transition">How It Works</a>
            <a href="#features" className="hover:text-indigo-400 transition">Features</a>
            <a href="#standee" className="hover:text-indigo-400 transition">Printed Standees</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsApplyOpen(true)}
              className="py-2.5 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition flex items-center gap-2 cursor-pointer"
            >
              <Rocket className="w-4 h-4" />
              <span>Get Free Standee</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Hero Section */}
      <section className="relative overflow-hidden pt-14 pb-20 px-4 sm:px-6">
        {/* Dynamic Glow Orbs */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-indigo-500/30 text-indigo-300 text-xs font-bold shadow-xl">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Proven 320% Increase in 5-Star Google Reviews</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Turn Every Happy Customer Into A{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent drop-shadow-sm">
              5-Star Google Review
            </span>{' '}
            In 10 Seconds.
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Eliminate customer typing friction. Customers simply scan your counter QR standee and tap a pre-crafted review in <strong className="text-white">English, हिन्दी, or ગુજરાતી</strong>. Unhappy ratings are filtered privately before touching Google.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-3">
            <a
              href="#demo"
              className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-indigo-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Try Live Interactive Demo</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <button
              onClick={() => setIsApplyOpen(true)}
              className="w-full sm:w-auto py-3.5 px-7 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Get Custom Printed Standee</span>
            </button>
          </div>

          {/* Trust Highlights Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-8 max-w-4xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">10-Sec Flow</p>
                <p className="text-[11px] text-slate-400">Zero typing required</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">3 Languages</p>
                <p className="text-[11px] text-slate-400">English, हिन्दी, ગુજરાતી</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Rating Shield</p>
                <p className="text-[11px] text-slate-400">Private negative gating</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <QrCode className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Permanent QR</p>
                <p className="text-[11px] text-slate-400">Zero reprinting ever</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* INTERACTIVE LIVE FUNNEL DEMO (Interactive Centerpiece)        */}
      {/* ============================================================== */}
      <section id="demo" className="py-16 px-4 sm:px-6 bg-slate-900/60 border-y border-slate-800/80 relative">
        <div className="max-w-5xl mx-auto space-y-8">

          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">
              Interactive Live Experience
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Try The Exact Flow Your Customers Will Experience
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Test how quick and effortless it is to leave a 5-star review. Switch languages, click ratings, or pick services below!
            </p>
          </div>

          {/* Interactive Simulator Shell */}
          <div className="max-w-2xl mx-auto bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden">

            {/* Top Simulator Header */}
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-800 gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center font-bold text-base">
                  🏥
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">SmartXCRM</h3>
                  <p className="text-[11px] text-slate-400">Dr. Darpan Patel • Ahmedabad</p>
                </div>
              </div>

              {/* Industry Selector */}
              <select
                value={demoCategory}
                onChange={(e) => {
                  setDemoCategory(e.target.value as IndustryKey);
                  setDemoSelectedProduct(null);
                }}
                className="py-1.5 px-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold cursor-pointer"
              >
                <option value="healthcare">🏥 Healthcare / Clinic</option>
                <option value="surgical_medical">🩺 Medical Equipment</option>
                <option value="restaurant">🍽️ Restaurant / Dining</option>
                <option value="salon">✂️ Salon & Spa</option>
                <option value="automobile">🚗 Car Service & Care</option>
                <option value="realestate">🏢 Real Estate / Builders</option>
              </select>
            </div>

            {/* Star Rating Selector */}
            <div className="text-center space-y-2 py-1">
              <p className="text-xs font-bold text-slate-400">How would you rate your experience with us?</p>
              <div className="flex items-center justify-center gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setDemoRating(star)}
                    className="p-1 transition-transform active:scale-90 hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-9 h-9 sm:w-11 sm:h-11 transition-colors ${demoRating >= star
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                        : 'text-slate-700 fill-slate-800 hover:text-slate-500'
                        }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {demoRating >= 4 ? '★★★★★ 5-Star Rating Selected' : '⚠️ Rating Under 4 Stars'}
              </p>
            </div>

            {/* Conditional Flow based on rating */}
            {demoRating >= 4 ? (
              <div className="space-y-4 animate-fade-in">

                {/* Language Switcher Tabs */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Choose Review Language:</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { code: 'gu', label: '🇮🇳 ગુજરાતી' },
                      { code: 'hi', label: '🇮🇳 हिन्दी' },
                      { code: 'en', label: '🇬🇧 English' },
                    ].map((item) => (
                      <button
                        key={item.code}
                        type="button"
                        onClick={() => setDemoLang(item.code as LanguageCode)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${demoLang === item.code
                          ? 'bg-gradient-to-r from-indigo-500 to-blue-600 border-indigo-400 text-white shadow-md'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Service / Keyword Chips */}
                {catData.defaultProducts.length > 0 && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Select Service or Product Received:</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setDemoSelectedProduct(null)}
                        className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition ${demoSelectedProduct === null
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                      >
                        All Services
                      </button>
                      {catData.defaultProducts.slice(0, 4).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setDemoSelectedProduct(p)}
                          className={`text-[11px] px-2.5 py-1 rounded-lg border font-medium cursor-pointer transition ${demoSelectedProduct === p
                            ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 1-Tap Ready Review Cards */}
                <div className="space-y-2.5 pt-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Tap Any Review to Copy & Post:
                  </label>
                  {demoReviews.slice(0, 2).map((rev, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCopyReview(rev)}
                      className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/80 hover:bg-slate-900/90 transition cursor-pointer group space-y-2 relative"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-amber-400">★★★★★ Option {idx + 1}</span>
                        <span className="text-indigo-400 font-bold group-hover:underline flex items-center gap-1">
                          <Copy className="w-3 h-3" />
                          <span>Tap to Copy</span>
                        </span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        &quot;{rev}&quot;
                      </p>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              /* Safe Negative Review Gate Demo */
              <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-center space-y-3 animate-fade-in">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h4 className="text-base font-bold text-white">Negative Review Shield Activated!</h4>
                <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Notice: When a customer selects 1, 2, or 3 stars, they are NOT directed to Google. Instead, their complaint is safely routed to your private agency inbox so you can resolve it offline without hurting your public 5-star rating!
                </p>
                <button
                  type="button"
                  onClick={() => setDemoRating(5)}
                  className="text-xs font-bold text-indigo-400 hover:underline"
                >
                  ← Switch back to 5-star demo
                </button>
              </div>
            )}

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* HOW IT WORKS (3 Simple Steps)                                 */}
      {/* ============================================================== */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-12">

          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">
              Simple & High-Converting
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              How Review Growth Hub Works In 3 Steps
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Zero apps to download. Zero passwords. Just a seamless 10-second web flow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-black text-lg">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Scan Standee QR</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Place your branded QR standee at your reception, billing counter, or dining tables. Customers simply open their phone camera to scan.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center font-black text-lg">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Choose Language & Tap</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Customers choose Gujarati, Hindi, or English. The AI generates personalized, SEO-rich review templates mentioning your exact products.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 hover:border-slate-700 transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-black text-lg">
                3
              </div>
              <h3 className="text-lg font-bold text-white">1-Tap Paste to Google</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                With one tap, the review is copied and the Google Maps write-review modal opens automatically. Customer pastes and hits post!
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* COUNTER STANDEE SHOWCASE                                       */}
      {/* ============================================================== */}
      <section id="standee" className="py-16 px-4 sm:px-6 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

          <div className="space-y-5">
            <span className="text-xs font-extrabold text-indigo-400 uppercase tracking-widest">
              Premium Hardware Integration
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              Ready-to-Print Counter Standees & Permanent QR Codes
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every client gets a print-ready A5 standee card formatted with trilingual call-to-actions. Best of all, our architecture uses <strong>permanent dynamic routing</strong>:
            </p>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>100% Permanent QR:</strong> Extend or renew your campaign validity anytime without ever reprinting your acrylic table tents.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Access Validity Window:</strong> Set Start Dates and End Dates so campaigns run only during active subscription periods.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Instant High-Res PNG / PDF:</strong> Download print-ready assets in 1 click ready for local print shops.</span>
              </li>
            </ul>

            <button
              onClick={() => setIsApplyOpen(true)}
              className="py-3 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:scale-95 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/25 transition inline-flex items-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Request Standee For Your Business</span>
            </button>
          </div>

          {/* Standee Preview Card Graphic */}
          <div className="flex justify-center">
            <div className="w-full max-w-sm bg-white rounded-3xl p-7 border-4 border-slate-900 text-center shadow-2xl text-slate-900 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                <span className="text-amber-400">★★★★★</span>
                <span>Google Reviews</span>
              </div>

              <h4 className="text-xl font-black text-slate-900">SmartXCRM </h4>
              <p className="text-xs font-semibold text-slate-600">Dr. Darpan Patel • Ahmedabad</p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <p className="text-xs font-black text-slate-800">Loved your experience with us?</p>
                <p className="text-[11px] font-bold text-slate-600">તમારો અનુભવ કેવો રહ્યો? રિવ્યૂ આપો!</p>
                <p className="text-[10px] text-slate-500">अपना अनुभव शेयर करें और 5-स्टार रेटिंग दें!</p>
              </div>

              {/* QR Mockup */}
              <div className="p-3 rounded-2xl border-2 border-slate-900 inline-block bg-white shadow-sm">
                <QrCode className="w-36 h-36 mx-auto text-slate-900" />
              </div>

              <div className="flex items-center justify-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-amber-400" />
                ))}
              </div>

              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Scan With Phone Camera • 10 Seconds
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================== */}
      {/* FINAL CALL TO ACTION                                          */}
      {/* ============================================================== */}
      <section className="py-20 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to 10x Your Local Google Reviews?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Get your business set up with multilingual 5-star funnels, negative review protection, and custom counter standees today.
          </p>

          <button
            onClick={() => setIsApplyOpen(true)}
            className="py-4 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-600 hover:to-teal-600 active:scale-95 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/25 transition inline-flex items-center gap-2.5 cursor-pointer"
          >
            <Rocket className="w-4 h-4" />
            <span>Apply Now & Get Your Free Review Standee</span>
          </button>

        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 py-8 px-4 sm:px-6 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 fill-indigo-400 text-indigo-400" />
            <span className="font-bold text-white">Review Growth Hub (SmartXCRM)</span>
            <span>• © 2026 All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href="#demo" className="hover:text-white transition">Live Demo</a>
            <a href="#how-it-works" className="hover:text-white transition">How It Works</a>
            <button
              onClick={() => setIsApplyOpen(true)}
              className="hover:text-white transition cursor-pointer"
            >
              Contact Agency
            </button>
          </div>
        </div>
      </footer>

      {/* Inquiry Lead Modal */}
      <ApplyLeadModal
        isOpen={isApplyOpen}
        onClose={() => setIsApplyOpen(false)}
        onSubmitLead={handleLeadSubmit}
      />
    </div>
  );
}
