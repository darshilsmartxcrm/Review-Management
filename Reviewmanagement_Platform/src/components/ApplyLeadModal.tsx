'use client';

import React, { useState, useEffect } from 'react';
import { X, Rocket, CheckCircle2, Building2, User, MapPin, Phone } from 'lucide-react';
import { Lead } from '../lib/types';
import { INDUSTRY_CATALOG } from '../lib/data';
import { getAgencyContactNumber } from '../lib/storage';
import { settingsApi } from '../api/settingsApi';
import { leadsApi } from '../api/leadsApi';

interface ApplyLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitLead: (lead: Lead) => void;
}

export default function ApplyLeadModal({ isOpen, onClose, onSubmitLead }: ApplyLeadModalProps) {
  const [name, setName] = useState('');
  const [business, setBusiness] = useState('');
  const [city, setCity] = useState('');
  const [industry, setIndustry] = useState('Surgical & Medical Equipment');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [agencyPhone, setAgencyPhone] = useState(getAgencyContactNumber());

  useEffect(() => {
    if (isOpen) {
      setAgencyPhone(getAgencyContactNumber());
      settingsApi.fetchSettings().then((data) => {
        if (data && data.agencyPhone) {
          setAgencyPhone(data.agencyPhone);
        }
      }).catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !business || !phone) return;

    const newLead: Lead = {
      id: `lead_${Date.now()}`,
      name: name.trim(),
      business: business.trim(),
      city: city.trim(),
      industry,
      phone: phone.trim(),
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    onSubmitLead(newLead);
    leadsApi.submitLead(newLead).catch(() => {});
    setSubmitted(true);

    // Also compose inquiry WhatsApp link for agency using master configured number
    const targetAgencyPhone = agencyPhone.replace(/\D/g, '') || '919876543210';
    const msg = `🚀 *NEW CLIENT INQUIRY - REVIEW GROWTH HUB*\n\n👤 *Client Name:* ${name}\n🏥 *Business Name:* ${business}\n🏢 *Industry:* ${industry}\n📍 *City:* ${city}\n📞 *WhatsApp:* ${phone}\n\n_I want to get the 5-Star Review Funnel system for my business. Please send me setup details & demo._`;
    window.open(`https://wa.me/${targetAgencyPhone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setBusiness('');
    setCity('');
    setPhone('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 text-emerald-400 border border-emerald-500/30">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Get Review Funnel for Your Business</h3>
                <p className="text-xs text-slate-400">Boost real 5-star Google ratings with automated AI templates.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Your Full Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Bhai Patel"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Business / Clinic / Store Name <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    placeholder="e.g. Shubh Orthopedic Hospital"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    City <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Ahmedabad"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                    Industry Type
                  </label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition cursor-pointer"
                  >
                    {Object.values(INDUSTRY_CATALOG).map((cat) => (
                      <option key={cat.id} value={cat.name} className="bg-slate-900 text-white">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  WhatsApp Phone Number <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 9876543210"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition flex items-center justify-center gap-2"
              >
                <Rocket className="w-4 h-4" />
                <span>Submit & Connect on WhatsApp</span>
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Inquiry Submitted!</h3>
            <p className="text-sm text-slate-300 mb-6 max-w-sm mx-auto">
              Thank you, <strong className="text-white">{name}</strong>! We have received your inquiry for <strong className="text-white">{business}</strong> and forwarded it to our agency team.
            </p>
            <button
              onClick={handleResetAndClose}
              className="py-2.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs transition"
            >
              Done
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
