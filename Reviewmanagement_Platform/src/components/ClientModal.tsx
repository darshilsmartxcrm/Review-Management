'use client';

import React, { useState, useEffect } from 'react';
import { X, Sparkles, Building2, MapPin, Phone, Link2, User, Globe, Calendar, Clock, ShieldCheck, ShieldAlert } from 'lucide-react';
import { Client, IndustryKey, LanguageCode } from '../lib/types';
import {
  INDUSTRY_CATALOG,
  formatGoogleReviewUrl,
  formatWhatsAppPhone,
  getDefaultExpiryDate,
  getClientDaysLeft,
  getDaysUntilStart,
  formatDate,
  getClientAccessStatus,
  getTodayDateString,
  parseLocalDate
} from '../lib/data';

interface ClientModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
  onSave: (clientData: Client) => void;
}

export default function ClientModal({ isOpen, client, onClose, onSave }: ClientModalProps) {
  const [name, setName] = useState('');
  const [personName, setPersonName] = useState('');
  const [category, setCategory] = useState<IndustryKey>('surgical_medical');
  const [city, setCity] = useState('');
  const [googleUrl, setGoogleUrl] = useState('');
  const [phone, setPhone] = useState('');
  const [keywords, setKeywords] = useState('');
  const [defaultLang, setDefaultLang] = useState<LanguageCode>('gu');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  useEffect(() => {
    if (client) {
      setName(client.name || '');
      setPersonName(client.person_name || '');
      setCategory(client.category || 'surgical_medical');
      setCity(client.city || '');
      setGoogleUrl(client.google_url || '');
      setPhone(client.phone || '');
      setKeywords(client.keywords || '');
      setDefaultLang(client.default_lang || 'gu');
      setStartDate(client.start_date || (client.createdAt ? client.createdAt.split('T')[0] : getTodayDateString()));
      setEndDate(client.expiry_date || getDefaultExpiryDate(3));
    } else {
      setName('');
      setPersonName('');
      setCategory('surgical_medical');
      setCity('');
      setGoogleUrl('');
      setPhone('');
      const defaultProds = INDUSTRY_CATALOG.surgical_medical?.defaultProducts.slice(0, 5).join(', ') || '';
      setKeywords(defaultProds);
      setDefaultLang('gu');
      setStartDate(getTodayDateString());
      setEndDate(getDefaultExpiryDate(3));
    }
  }, [client, isOpen]);

  if (!isOpen) return null;

  const currentCategoryInfo = INDUSTRY_CATALOG[category] || INDUSTRY_CATALOG.general;

  const handleCategoryChange = (newCat: IndustryKey) => {
    setCategory(newCat);
    const catInfo = INDUSTRY_CATALOG[newCat];
    if (catInfo && (!keywords || keywords.trim() === '')) {
      setKeywords(catInfo.defaultProducts.slice(0, 6).join(', '));
    }
  };

  const toggleKeyword = (prod: string) => {
    const list = keywords.split(',').map(k => k.trim()).filter(Boolean);
    const idx = list.indexOf(prod);
    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(prod);
    }
    setKeywords(list.join(', '));
  };

  const handleExtendMonths = (months: number) => {
    const base = endDate && !isNaN(parseLocalDate(endDate).getTime())
      ? parseLocalDate(endDate)
      : (startDate ? parseLocalDate(startDate) : new Date());
    base.setMonth(base.getMonth() + months);
    const y = base.getFullYear();
    const m = String(base.getMonth() + 1).padStart(2, '0');
    const d = String(base.getDate()).padStart(2, '0');
    setEndDate(`${y}-${m}-${d}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const formattedGoogle = formatGoogleReviewUrl(googleUrl);

    const formattedPhone = formatWhatsAppPhone(phone.trim(), '919876543210');

    const clientToSave: Client = {
      id: client?.id || `client_${Date.now()}`,
      name: name.trim(),
      person_name: personName.trim() || undefined,
      category,
      city: city.trim(),
      google_url: formattedGoogle,
      phone: formattedPhone,
      keywords: keywords.trim(),
      default_lang: defaultLang,
      createdAt: client?.createdAt || new Date().toISOString(),
      start_date: startDate,
      expiry_date: endDate
    };

    onSave(clientToSave);
  };

  const selectedKeywordsList = keywords.split(',').map(k => k.trim()).filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 my-8 text-slate-100 max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              {client ? 'Edit Client Business' : 'Add New Client Business'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure 5-star review funnel, AI keywords, and Google Place integration.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Business Name & Person */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Business Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SmartXCRM Hospital & Healthcare"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Doctor / Owner Name (Optional)
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="e.g. Dr. Rajesh Patel (MS)"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Category & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Industry Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value as IndustryKey)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
              >
                {Object.values(INDUSTRY_CATALOG).map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-900 text-white">
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                City / Location <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Ahmedabad, Surat"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
            </div>
          </div>

          {/* Google Review URL / Place ID */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Google Review URL or Place ID <span className="text-rose-400">*</span>
              </label>
              <span className="text-[11px] text-indigo-400">
                Direct 5-star write review link auto-created
              </span>
            </div>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                required
                value={googleUrl}
                onChange={(e) => setGoogleUrl(e.target.value)}
                placeholder="Place ID (e.g. ChIJN1t_tDeuEms...) or https://g.page/r/.../review"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              />
            </div>
          </div>

          {/* WhatsApp Phone & Default Language */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Owner WhatsApp / Chat Number <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9825012345 or +91 98250 12345"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                WhatsApp chat opens directly to this number when customers share or send reviews/feedback.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Default Funnel Language
              </label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <select
                  value={defaultLang}
                  onChange={(e) => setDefaultLang(e.target.value as LanguageCode)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                >
                  <option value="gu" className="bg-slate-900 text-white">🇮🇳 ગુજરાતી (Gujarati)</option>
                  <option value="hi" className="bg-slate-900 text-white">🇮🇳 हिन्दी (Hindi)</option>
                  <option value="en" className="bg-slate-900 text-white">🇬🇧 English</option>
                </select>
              </div>
            </div>
          </div>

          {/* Plan Validity Date Range: Start Date & End Date */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>QR Access Validity Window (Start & End Date)</span>
              </label>

              {/* Status Badge */}
              {(() => {
                const status = getClientAccessStatus({ start_date: startDate, expiry_date: endDate });
                if (status === 'upcoming') {
                  return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Upcoming (Starts in {getDaysUntilStart(startDate)}d)</span>
                    </span>
                  );
                }
                if (status === 'expired') {
                  return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Expired (Access Paused)</span>
                    </span>
                  );
                }
                return (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Active ({getClientDaysLeft(endDate)} days left)</span>
                  </span>
                );
              })()}
            </div>

            <p className="text-[11px] text-slate-400">
              Customer QR code is accessible <strong>only between the Start Date and End Date</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Start Date */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <span>Start Date (Access Begins)</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setStartDate(getTodayDateString())}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold underline cursor-pointer"
                  >
                    Set Today
                  </button>
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                  />
                </div>
              </div>

              {/* End Date */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                    <span>End Date (Access Ends)</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {endDate ? formatDate(endDate) : ''}
                  </span>
                </div>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || undefined}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Quick Renewal / Extend Presets */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-slate-400">
                Quick Extend End Date:
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleExtendMonths(1)}
                  className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-slate-200 transition active:scale-95 cursor-pointer"
                  title="Extend End Date by 1 Month"
                >
                  +1 Mo
                </button>
                <button
                  type="button"
                  onClick={() => handleExtendMonths(3)}
                  className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-slate-200 transition active:scale-95 cursor-pointer"
                  title="Extend End Date by 3 Months"
                >
                  +3 Mo
                </button>
                <button
                  type="button"
                  onClick={() => handleExtendMonths(6)}
                  className="py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-bold text-slate-200 transition active:scale-95 cursor-pointer"
                  title="Extend End Date by 6 Months"
                >
                  +6 Mo
                </button>
                <button
                  type="button"
                  onClick={() => handleExtendMonths(12)}
                  className="py-1 px-2.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 text-[11px] font-bold text-indigo-300 transition active:scale-95 cursor-pointer"
                  title="Extend End Date by 1 Year"
                >
                  +1 Yr
                </button>
              </div>
            </div>

            {/* Permanent QR Guarantee Notice */}
            <p className="text-[11px] text-slate-400 flex items-start gap-1.5 pt-1">
              <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
              <span>
                <strong>Permanent QR Guarantee:</strong> Renewing or updating the start/end dates will <strong>NEVER</strong> change your printed QR code! The QR matrix is 100% permanent.
              </span>
            </p>
          </div>

          {/* AI Keywords Suggestions */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Products, Services & Keywords for AI Reviews
              </label>
              <span className="text-[11px] text-slate-400">Comma-separated</span>
            </div>

            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. Wheelchair, Oxygen Concentrator, Hospital Bed"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition mb-2"
            />

            {/* Quick suggested chips */}
            {currentCategoryInfo && (
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="text-[11px] font-medium text-slate-400 block mb-2">
                  Tap to add/remove {currentCategoryInfo.name} suggestions:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentCategoryInfo.defaultProducts.map((prod) => {
                    const isSelected = selectedKeywordsList.includes(prod);
                    return (
                      <button
                        type="button"
                        key={prod}
                        onClick={() => toggleKeyword(prod)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition font-medium ${isSelected
                          ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                          }`}
                      >
                        {isSelected ? '✓ ' : '+ '}{prod}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 active:scale-95 transition"
            >
              {client ? 'Save Changes' : 'Create Client Funnel'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
