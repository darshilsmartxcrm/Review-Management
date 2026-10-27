'use client';

import React, { Suspense, useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  Star,
  Copy,
  ExternalLink,
  RotateCcw,
  CheckCircle2,
  Sparkles,
  Globe,
  Tag,
  Rocket,
  CalendarX,
  Clock,
  MessageSquare
} from 'lucide-react';
import { Client, LanguageCode, IndustryKey } from '../../lib/types';
import {
  INDUSTRY_CATALOG,
  UI_STRINGS,
  generateReviews,
  pickReviewTemplates,
  generateNegativeFeedback,
  renderReviewFromTemplate,
  formatGoogleReviewUrl,
  formatWhatsAppPhone,
  decodeClientData,
  DEFAULT_CLIENTS,
  isClientExpired,
  isClientUpcoming,
  formatDate,
  formatExpiryDate,
  getDaysUntilStart,
  copyToClipboardSafe
} from '../../lib/data';
import ApplyLeadModal from '../../components/ApplyLeadModal';
import {
  getStoredClients,
  saveStoredLeads,
  getStoredLeads,
  getAgencyContactNumber,
  getUsedReviewsLocal,
  markReviewUsed,
  fetchServerUsedReviews,
  API_BASE_URL
} from '../../lib/storage';

function ReviewFunnelContent() {
  const searchParams = useSearchParams();

  const [client, setClient] = useState<Client>(() => {
    const nameParam = searchParams.get('name') || searchParams.get('n');
    const phoneParam = searchParams.get('phone') || searchParams.get('p');
    const cityParam = searchParams.get('city') || searchParams.get('c');
    const catParam = searchParams.get('cat') || searchParams.get('category');
    const pnParam = searchParams.get('pn') || searchParams.get('person_name');
    const langParam = searchParams.get('lang') || searchParams.get('l');
    const gParam = searchParams.get('g') || searchParams.get('google_url');
    const kParam = searchParams.get('k') || searchParams.get('keywords');
    const sdParam = searchParams.get('sd') || searchParams.get('start_date');
    const edParam = searchParams.get('ed') || searchParams.get('expiry_date');
    const idParam = searchParams.get('id');
    const dParam = searchParams.get('d');

    if (nameParam) {
      return {
        id: idParam || `scanned_${Date.now()}`,
        name: nameParam.trim(),
        phone: formatWhatsAppPhone(phoneParam || ''),
        city: cityParam ? cityParam.trim() : '',
        category: (catParam as IndustryKey) || 'healthcare',
        person_name: pnParam ? pnParam.trim() : undefined,
        google_url: gParam ? gParam.trim() : DEFAULT_CLIENTS[0].google_url,
        default_lang: (langParam as LanguageCode) || 'gu',
        keywords: kParam ? kParam.trim() : '',
        start_date: sdParam || undefined,
        expiry_date: edParam || undefined,
        createdAt: new Date().toISOString(),
      };
    }
    if (dParam) {
      const decoded = decodeClientData(dParam);
      if (decoded && decoded.name) return decoded;
    }
    if (idParam) {
      const match = DEFAULT_CLIENTS.find((c) => c.id === idParam);
      if (match) return match;
    }
    return DEFAULT_CLIENTS[0];
  });

  const [lang, setLang] = useState<LanguageCode>(() => {
    const langParam = (searchParams.get('lang') || searchParams.get('l')) as LanguageCode;
    if (langParam === 'en' || langParam === 'hi' || langParam === 'gu') return langParam;
    return client?.default_lang || 'gu';
  });
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [agencyPhone, setAgencyPhone] = useState<string>(getAgencyContactNumber());
  const [usedReviews, setUsedReviews] = useState<string[]>([]);
  const [activeTemplates, setActiveTemplates] = useState<string[]>([]);

  // Reviews generated (used for all star ratings)
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
  const [selectedReviewText, setSelectedReviewText] = useState<string>('');

  // Modals & UI states
  const [showRedirectModal, setShowRedirectModal] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState<boolean>(false);

  // Initialize client from query param ?id=... or ?d=... or fallback to stored clients
  useEffect(() => {
    const dParam = searchParams.get('d');
    const idParam = searchParams.get('id');
    const nameParam = searchParams.get('name') || searchParams.get('n');
    const phoneParam = searchParams.get('phone') || searchParams.get('p');
    const cityParam = searchParams.get('city') || searchParams.get('c');
    const catParam = searchParams.get('cat') || searchParams.get('category');
    const pnParam = searchParams.get('pn') || searchParams.get('person_name');
    const langParam = searchParams.get('lang') || searchParams.get('l');
    const gParam = searchParams.get('g') || searchParams.get('google_url');
    const kParam = searchParams.get('k') || searchParams.get('keywords');

    const sdParam = searchParams.get('sd') || searchParams.get('start_date');
    const edParam = searchParams.get('ed') || searchParams.get('expiry_date');

    const storedClients = getStoredClients();
    let initialClient: Client = DEFAULT_CLIENTS[0];

    // Priority 1: When nameParam is present (scanned from QR code or shared link)
    if (nameParam) {
      initialClient = {
        id: idParam || `scanned_${Date.now()}`,
        name: nameParam.trim(),
        phone: formatWhatsAppPhone(phoneParam || ''),
        city: cityParam ? cityParam.trim() : '',
        category: (catParam as IndustryKey) || 'healthcare',
        person_name: pnParam ? pnParam.trim() : undefined,
        google_url: gParam ? gParam.trim() : DEFAULT_CLIENTS[0].google_url,
        default_lang: (langParam as LanguageCode) || 'gu',
        keywords: kParam ? kParam.trim() : '',
        start_date: sdParam || undefined,
        expiry_date: edParam || undefined,
        createdAt: new Date().toISOString(),
      };
    } else if (idParam) {
      // Priority 2: Match by client ID from device storage or defaults
      const match = storedClients.find((c) => c.id === idParam) || DEFAULT_CLIENTS.find((c) => c.id === idParam);
      if (match) initialClient = { ...match };
    } else if (dParam) {
      // Priority 3: Decoded legacy payload
      const decoded = decodeClientData(dParam);
      if (decoded && decoded.name) {
        initialClient = decoded;
      }
    } else if (storedClients.length > 0) {
      initialClient = storedClients[0];
    }

    setClient(initialClient);
    if (initialClient.default_lang) {
      setLang(initialClient.default_lang);
    }

    // Live sync with /api/clients for lock reviews and dates
    const targetId = idParam || initialClient.id;
    if (targetId) {
      // Fetch 24-hour locked reviews for this client across all users & phones
      fetchServerUsedReviews(targetId).then((lockedRevs) => {
        if (Array.isArray(lockedRevs)) {
          setUsedReviews(lockedRevs);
        }
      });

      fetch(`${API_BASE_URL}/api/clients?id=${encodeURIComponent(targetId)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.client) {
            setClient((prev) => {
              if (nameParam) {
                return {
                  ...data.client,
                  name: nameParam.trim(),
                  phone: phoneParam ? formatWhatsAppPhone(phoneParam) : prev.phone,
                  city: cityParam ? cityParam.trim() : prev.city,
                  category: (catParam as IndustryKey) || prev.category,
                  person_name: pnParam ? pnParam.trim() : prev.person_name,
                  keywords: kParam ? kParam.trim() : prev.keywords,
                  google_url: gParam ? gParam.trim() : prev.google_url,
                  start_date: sdParam || prev.start_date,
                  expiry_date: edParam || prev.expiry_date,
                  default_lang: (langParam as LanguageCode) || prev.default_lang,
                };
              }
              return data.client;
            });
            if (data.client.default_lang && !langParam) {
              setLang(data.client.default_lang);
            }
          }
        })
        .catch(() => {});
    }

    // Unconditionally fetch latest agency support contact number from /api/settings
    fetch(`${API_BASE_URL}/api/settings`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && data.settings && data.settings.agencyPhone) {
          setAgencyPhone(data.settings.agencyPhone);
        }
      })
      .catch(() => {});
  }, [searchParams]);

  const prevLangRef = useRef(lang);

  // Initialize / update active templates whenever client, lang, rating, or usedReviews changes
  useEffect(() => {
    if (!client) return;
    if (rating < 4) {
      const negativeOpts = generateNegativeFeedback(client, lang, selectedProduct);
      setGeneratedOptions(negativeOpts);
      setSelectedReviewText(negativeOpts[0] || '');
    } else {
      const templates = pickReviewTemplates(lang, client, selectedProduct, usedReviews);
      setActiveTemplates(templates);
    }
  }, [client?.id, client?.name, client?.category, lang, rating, selectedProduct]);

  // Render generatedOptions whenever templates, selectedProduct, client, or lang changes
  // When user selects a product chip/point, the same templates stay steady and only the keyword updates (no unwanted shuffle!)
  useEffect(() => {
    if (!client || rating < 4 || activeTemplates.length === 0) return;
    const revs = activeTemplates.map((t) => renderReviewFromTemplate(t, client, lang, selectedProduct));
    setGeneratedOptions(revs);
    setSelectedReviewText((prev) => {
      if (prevLangRef.current !== lang) {
        prevLangRef.current = lang;
        return revs[0] || '';
      }
      if (!prev || revs.length === 0) return revs[0] || '';
      const matchedIdx = generatedOptions.indexOf(prev);
      if (matchedIdx >= 0 && revs[matchedIdx]) {
        return revs[matchedIdx];
      }
      return revs[0] || prev;
    });
  }, [activeTemplates, selectedProduct, client, lang, rating]);

  const ui = UI_STRINGS[lang] || UI_STRINGS.en;
  const catInfo = client.category ? INDUSTRY_CATALOG[client.category] || INDUSTRY_CATALOG.general : INDUSTRY_CATALOG.general;

  // Available product pills: from client's keywords or default catalog products
  const availableProducts = client.keywords
    ? client.keywords.split(',').map((k) => k.trim()).filter(Boolean)
    : catInfo.defaultProducts.slice(0, 8);

  const handleShuffle = () => {
    if (rating < 4) {
      const freshNeg = generateNegativeFeedback(client, lang, selectedProduct);
      setGeneratedOptions(freshNeg);
      setSelectedReviewText(freshNeg[0] || '');
    } else {
      const freshTemplates = pickReviewTemplates(lang, client, selectedProduct, usedReviews);
      setActiveTemplates(freshTemplates);
    }
  };

  const handleCopyAndRedirect = () => {
    if (!selectedReviewText) return;

    // Trigger celebratory confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Copy to clipboard with universal mobile fallback
    copyToClipboardSafe(selectedReviewText);
    setCopiedToast(true);
    setShowRedirectModal(true);

    const targetUrl = formatGoogleReviewUrl(client.google_url);

    // Open Google in new tab after 1.2 seconds so user reads step guide
    setTimeout(() => {
      window.open(targetUrl, '_blank');
    }, 1200);

    setTimeout(() => {
      setCopiedToast(false);
    }, 5000);

    // Lock review for 24 hours across all devices
    if (client?.id) {
      markReviewUsed(client.id, selectedReviewText);
      setUsedReviews((prev) => [...prev, selectedReviewText]);
    }

    // After user clicks review, shuffle to fresh variations for next time
    const freshTemplates = pickReviewTemplates(lang, client, selectedProduct, [...usedReviews, selectedReviewText]);
    setActiveTemplates(freshTemplates);
  };

  const handleSendToWhatsApp = () => {
    const targetPhone = formatWhatsAppPhone(client?.phone, agencyPhone);
    const cleanNote = selectedReviewText.trim() || 'No custom note provided';
    const starIcons = '⭐'.repeat(rating);

    const whatsappMsg = rating >= 4
      ? `⭐ *CUSTOMER REVIEW & FEEDBACK - ${client.name.toUpperCase()}*\n\n⭐ *Rating Given:* ${rating} / 5 Stars (${starIcons})\n📍 *City:* ${client.city}\n🏷️ *Service:* ${selectedProduct || 'General'}\n\n📝 *Review / Feedback:*\n"${cleanNote}"\n\n--------------------------------------------\n_Sent directly on WhatsApp via Review Growth Hub_`
      : `⚠️ *PRIVATE CUSTOMER FEEDBACK & ALERT - ${client.name.toUpperCase()}*\n\n⭐ *Rating Given:* ${rating} / 5 Stars (${starIcons})\n📍 *City:* ${client.city}\n🏷️ *Service:* ${selectedProduct || 'General'}\n\n📝 *Customer Issue / Concern:*\n"${cleanNote}"\n\n--------------------------------------------\n_Private feedback sent directly to owner. Not posted on Google._`;

    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(whatsappMsg)}`, '_blank');

    // Lock review for 24 hours across all devices
    if (client?.id && selectedReviewText) {
      markReviewUsed(client.id, selectedReviewText);
      setUsedReviews((prev) => [...prev, selectedReviewText]);
    }

    // After user clicks review, shuffle to fresh variations for next time
    if (rating < 4) {
      const freshNeg = generateNegativeFeedback(client, lang, selectedProduct);
      setGeneratedOptions(freshNeg);
    } else {
      const freshTemplates = pickReviewTemplates(lang, client, selectedProduct, [...usedReviews, selectedReviewText]);
      setActiveTemplates(freshTemplates);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 py-8 px-4 flex flex-col items-center justify-center">
      
      {/* Toast Alert */}
      {copiedToast && (
        <div className="fixed top-6 z-50 animate-bounce-in max-w-sm px-4 py-3 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-100 shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{ui.copiedToast}</span>
        </div>
      )}

      {/* Main Review Funnel Card */}
      <div className="w-full max-w-xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl text-slate-100 space-y-6">
        
        {/* Business Header */}
        <div className="text-center space-y-2 pb-4 border-b border-slate-800">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
            <span>{catInfo.icon}</span>
            <span>{catInfo.name.split(',')[0]}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
            {client.name}
          </h1>

          {client.person_name && (
            <p className="text-sm font-semibold text-slate-300">
              {client.category === 'healthcare' || /dr\b|doctor/i.test(client.person_name) ? '👨‍⚕️ ' : '👤 '}
              {client.person_name}
            </p>
          )}

          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
            📍 {client.city}
          </p>

          <p className="text-sm font-semibold text-slate-400 pt-2">
            {ui.howWasExp} <span className="text-white font-bold">{client.name}</span>?
          </p>
        </div>

        {/* If Upcoming: Campaign access has not started yet */}
        {isClientUpcoming(client) ? (
          <div className="py-6 px-4 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/10">
              <Clock className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider mb-2">
                Review Funnel Scheduled
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Campaign Starts Soon
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                This Google Review Funnel for <strong className="text-white">{client.name}</strong> is scheduled to begin on <strong className="text-amber-300">{formatDate(client.start_date)}</strong> ({getDaysUntilStart(client.start_date)} days remaining).
              </p>
            </div>

            {/* Permanent QR Guarantee Notice */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Notice for Business Owner:</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your printed counter standees and QR codes are <strong>ready and permanent</strong>. Customers scanning this QR will automatically be able to leave reviews once the start date arrives.
              </p>
            </div>

            {/* Direct WhatsApp Query Button to Agency */}
            <a
              href={`https://wa.me/${agencyPhone.replace(/\D/g, '') || '919876543210'}?text=${encodeURIComponent(`👋 INQUIRY / SCHEDULE QUERY - REVIEW GROWTH HUB\n\n🏥 Business: ${client.name}\n📍 City: ${client.city}\n📅 Scheduled Start: ${formatDate(client.start_date)}\n\nHello, I have a question regarding our review funnel schedule and standee setup.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>Have Questions? WhatsApp Agency Support</span>
            </a>
          </div>
        ) : isClientExpired(client) ? (
          /* If Expired: Show Subscription Renewal Screen */
          <div className="py-6 px-4 text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/10">
              <CalendarX className="w-8 h-8" />
            </div>

            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider mb-2">
                Review Access Paused
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Subscription Plan Expired
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
                This Google Review Funnel for <strong className="text-white">{client.name}</strong> was accessible between <strong className="text-slate-200">{formatDate(client.start_date)}</strong> and <strong className="text-rose-300">{formatExpiryDate(client.expiry_date)}</strong>. Customer reviews are temporarily paused pending plan renewal.
              </p>
            </div>

            {/* Permanent QR Guarantee Notice */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-indigo-400">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Notice for Business Owner:</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Your printed counter standees and QR codes are <strong>100% permanent</strong> and will never need reprinting. Once the administrator extends your validity date, this review funnel reactivates automatically!
              </p>
            </div>

            {/* Direct WhatsApp button to Agency */}
            <a
              href={`https://wa.me/${agencyPhone.replace(/\D/g, '') || '919876543210'}?text=${encodeURIComponent(`🚀 RENEWAL REQUEST - REVIEW GROWTH HUB\n\n🏥 Business: ${client.name}\n📍 City: ${client.city}\n📅 Validity Ended: ${formatExpiryDate(client.expiry_date)}\n\nPlease extend our 5-star review funnel subscription and reactivate our live QR code.`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Contact Agency to Reactivate / Renew</span>
            </a>
          </div>
        ) : (
          <>
            {/* 5-Star Rating Selector */}
        <div className="flex flex-col items-center justify-center space-y-2 py-2">
          <div className="flex items-center gap-2 sm:gap-3">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = hoverRating ? hoverRating >= star : rating >= star;
              return (
                <button
                  type="button"
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => {
                    setRating(star);
                    if (star >= 4) {
                      confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.7 },
                      });
                    }
                  }}
                  className="p-1 transition-transform active:scale-90 hover:scale-110 focus:outline-none cursor-pointer"
                  aria-label={`${star} star rating`}
                >
                  <Star
                    className={`w-10 h-10 sm:w-12 sm:h-12 transition-colors ${
                      active
                        ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.6)]'
                        : 'text-slate-700 fill-slate-800 hover:text-slate-500'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="text-xs font-bold tracking-wide uppercase">
            {rating >= 4 ? (
              <span className="text-amber-400">{ui.starsSelected}</span>
            ) : (
              <span className="text-emerald-400">
                ⭐ {rating} Star Rating • {ui.directWhatsAppNotice}
              </span>
            )}
          </p>
        </div>

        {/* Language Selector Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{ui.selectLanguagePrompt}</span>
          </label>

          <div className="grid grid-cols-3 gap-2">
            {(['gu', 'hi', 'en'] as LanguageCode[]).map((code) => {
              const isSelected = lang === code;
              const label = code === 'gu' ? '🇮🇳 ગુજરાતી' : code === 'hi' ? '🇮🇳 हिन्दी' : '🇬🇧 English';
              return (
                <button
                  type="button"
                  key={code}
                  onClick={() => setLang(code)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-600 border-indigo-400 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product / Service Customization Chips */}
        {availableProducts.length > 0 && (
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>{ui.selectProductPrompt}</span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                  selectedProduct === null
                    ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                    : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                {ui.allProductsLabel}
              </button>
              {availableProducts.map((prod) => {
                const isSelected = selectedProduct === prod;
                return (
                  <button
                    type="button"
                    key={prod}
                    onClick={() => setSelectedProduct(prod)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                        : 'bg-slate-800/70 border-slate-700 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {prod}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Review Variations Picker (Same for all ratings) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{rating >= 4 ? ui.chooseReview : (lang === 'gu' ? 'તમારી મુશ્કેલી અથવા કારણ પસંદ કરો:' : lang === 'hi' ? 'अपनी समस्या या कारण चुनें:' : 'Select your concern or reason:')}</span>
            </label>
            <button
              type="button"
              onClick={handleShuffle}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{ui.regenerateBtn}</span>
            </button>
          </div>

          {/* 3 Variation Cards */}
          <div className="space-y-2 mb-3">
            {generatedOptions.map((optText, idx) => {
              const isSelected = selectedReviewText === optText;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedReviewText(optText)}
                  className={`p-3 rounded-2xl border transition cursor-pointer text-xs sm:text-sm leading-relaxed ${
                    isSelected
                      ? 'bg-indigo-950/60 border-indigo-500 text-white shadow-md shadow-indigo-500/10'
                      : 'bg-slate-800/50 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-[10px] ${
                      isSelected ? 'bg-indigo-600 border-indigo-400 text-white font-bold' : 'border-slate-600 text-transparent'
                    }`}>
                      ✓
                    </span>
                    <span>{optText}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Editable Review Text Box / Custom Note Option */}
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">
              {ui.customEditLabel}
            </label>
            <textarea
              rows={3}
              value={selectedReviewText}
              onChange={(e) => setSelectedReviewText(e.target.value)}
              placeholder={ui.customEditPlaceholder}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition leading-relaxed resize-none"
            />
          </div>
        </div>

        {/* Action Button: 4-5 Stars -> Google Review & Direct WhatsApp | 1-3 Stars -> Direct WhatsApp */}
        {rating >= 4 ? (
          <div className="space-y-3 pt-1">
            {/* Primary Action Button: 1-Tap Copy & Open Google (5★) */}
            <button
              type="button"
              onClick={handleCopyAndRedirect}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-indigo-600 to-blue-600 hover:from-amber-600 hover:via-indigo-700 hover:to-blue-700 active:scale-95 text-white font-black text-sm sm:text-base shadow-xl shadow-indigo-500/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer animate-pulse-subtle"
            >
              <Copy className="w-5 h-5" />
              <span>{ui.copyBtn}</span>
              <ExternalLink className="w-4 h-4" />
            </button>

            {/* Also Send / Share Review Directly on WhatsApp to Business Owner */}
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-950/40 hover:bg-emerald-900/50 active:scale-95 text-emerald-300 hover:text-emerald-200 font-bold text-xs sm:text-sm border border-emerald-500/40 transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              <span>
                {lang === 'gu'
                  ? `📲 WhatsApp પર પણ માલિકને મોકલો (+${formatWhatsAppPhone(client.phone, agencyPhone)})`
                  : lang === 'hi'
                  ? `📲 WhatsApp पर भी मालिक को भेजें (+${formatWhatsAppPhone(client.phone, agencyPhone)})`
                  : `📲 Also Send on WhatsApp to Owner (+${formatWhatsAppPhone(client.phone, agencyPhone)})`}
              </span>
            </button>

            {/* 3 Step Quick Instructions Box */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="space-y-1">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs inline-flex items-center justify-center">1</span>
                <p className="font-bold text-white">{ui.step1Title}</p>
                <p className="text-[11px] text-slate-400">{ui.step1Desc}</p>
              </div>
              <div className="space-y-1">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs inline-flex items-center justify-center">2</span>
                <p className="font-bold text-white">{ui.step2Title}</p>
                <p className="text-[11px] text-slate-400">{ui.step2Desc}</p>
              </div>
              <div className="space-y-1">
                <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 font-bold text-xs inline-flex items-center justify-center">3</span>
                <p className="font-bold text-white">{ui.step3Title}</p>
                <p className="text-[11px] text-slate-400">{ui.step3Desc}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-1 animate-fade-in">
            {/* Primary Action Button: Send Directly to Client's WhatsApp Number */}
            <button
              type="button"
              onClick={handleSendToWhatsApp}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 active:scale-95 text-white font-black text-sm sm:text-base shadow-xl shadow-emerald-600/30 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{ui.sendWhatsAppBtn}</span>
            </button>

            {/* Direct WhatsApp Notice Card */}
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-center space-y-1 text-xs">
              <div className="flex items-center justify-center gap-1.5 font-bold text-emerald-400">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <span>{ui.directWhatsAppNotice}: {client.name} (+{formatWhatsAppPhone(client.phone, agencyPhone)})</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {lang === 'gu'
                  ? `તમારો રિવ્યૂ અને કસ્ટમ નોટ સીધા ${client.name} ના WhatsApp નંબર (+${formatWhatsAppPhone(client.phone, agencyPhone)}) પર મોકલવામાં આવશે.`
                  : lang === 'hi'
                  ? `आपका रिव्यू और कस्टम नोट सीधे ${client.name} के WhatsApp नंबर (+${formatWhatsAppPhone(client.phone, agencyPhone)}) पर भेजा जाएगा।`
                  : `Your review and custom note will be sent directly to ${client.name}'s WhatsApp (+${formatWhatsAppPhone(client.phone, agencyPhone)}).`}
              </p>
            </div>
          </div>
        )}
        </>
      )}

      </div>

      {/* Footer Branding & Apply Now */}
      <div className="w-full max-w-xl mt-6 text-center space-y-2">
        <div>
          <button
            type="button"
            onClick={() => setIsApplyModalOpen(true)}
            className="text-xs text-slate-400 hover:text-indigo-300 font-medium transition inline-flex items-center gap-1.5 cursor-pointer py-1.5 px-3 rounded-full hover:bg-slate-900 border border-transparent hover:border-slate-800"
          >
            <Rocket className="w-3.5 h-3.5 text-indigo-400" />
            <span>Want this 5-star review funnel for your business? Click here</span>
          </button>
        </div>
        <div>
          <a
            href={`https://wa.me/${agencyPhone.replace(/\D/g, '') || '919876543210'}?text=${encodeURIComponent(`👋 CLIENT SUPPORT & QUERY - REVIEW GROWTH HUB\n\n🏥 Business: ${client.name}\n📍 City: ${client.city}\n\nHello Agency Support, I have a query regarding our review funnel setup.`)}`}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] text-slate-500 hover:text-emerald-400 transition inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full hover:bg-slate-900"
          >
            <MessageSquare className="w-3 h-3 text-emerald-400" />
            <span>Need Help or Have a Query? Contact Agency Support</span>
          </a>
        </div>
      </div>

      {/* Redirect Instruction Modal */}
      {showRedirectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-100 text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-white">Review Copied to Clipboard!</h3>
            
            <p className="text-xs text-slate-300">
              Opening Google Reviews write modal now... When the page opens:
            </p>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 text-left text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-bold text-amber-400">Step 1:</span> Tap 5 Stars ⭐⭐⭐⭐⭐
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-bold text-indigo-400">Step 2:</span> Paste the copied review 📋
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <span className="font-bold text-emerald-400">Step 3:</span> Click Post! 🚀
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRedirectModal(false)}
                className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition"
              >
                Close Window
              </button>
              <a
                href={formatGoogleReviewUrl(client.google_url)}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-xs font-bold text-white transition flex items-center gap-1.5"
              >
                <span>Open Google</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Apply Lead Modal */}
      <ApplyLeadModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmitLead={(lead) => {
          const currentLeads = getStoredLeads();
          saveStoredLeads([lead, ...currentLeads]);
        }}
      />

    </div>
  );
}

export default function ReviewFunnelPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-400">
          <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ReviewFunnelContent />
    </Suspense>
  );
}
