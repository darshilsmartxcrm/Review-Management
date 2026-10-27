'use client';

import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, Send } from 'lucide-react';
import { Client } from '../lib/types';
import { buildClientReviewUrl, buildClientStandeeUrl, formatWhatsAppPhone, copyToClipboardSafe } from '../lib/data';
import { getAgencyContactNumber } from '../lib/storage';

interface WhatsAppModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
}

export default function WhatsAppModal({ isOpen, client, onClose }: WhatsAppModalProps) {
  const [copied, setCopied] = useState(false);
  const [agencyPhone, setAgencyPhone] = useState(getAgencyContactNumber());

  React.useEffect(() => {
    if (isOpen) {
      setAgencyPhone(getAgencyContactNumber());
      fetch('/api/settings')
        .then((res) => res.json())
        .then((data) => {
          if (data && data.success && data.settings && data.settings.agencyPhone) {
            setAgencyPhone(data.settings.agencyPhone);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen || !client) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const funnelUrl = buildClientReviewUrl(origin, client);
  const standeeUrl = buildClientStandeeUrl(origin, client);
  const targetPhone = formatWhatsAppPhone(client.phone, agencyPhone);

  const messageText = `⭐ *5-STAR GOOGLE REVIEW FUNNEL IS READY!*\n\nHello *${client.name}* team! 👋\n\nYour customized multilingual Google Review funnel is now live. Customers can now submit 5-star authentic reviews in English, हिन्दी, or ગુજરાતી in under 10 seconds:\n\n🔗 *Customer Review Link:* ${funnelUrl}\n🖨️ *Table Tent / Counter Standee:* ${standeeUrl}\n\n🛡️ *Negative Review Protection Active:* Any 1-3 star rating will be safely sent directly to your WhatsApp (+${targetPhone}) without touching your Google rating!\n\n📞 *Agency Support & Renewals:* +${agencyPhone.replace(/\D/g, '')}\n\n_Generated via Review Growth Hub_`;

  const handleCopy = () => {
    copyToClipboardSafe(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const url = `https://wa.me/${targetPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-100">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Share with Business Owner</h3>
            <p className="text-xs text-slate-400">Pre-formatted WhatsApp message ready to send.</p>
          </div>
        </div>

        {/* Message Preview Box */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto mb-5 select-all">
          {messageText}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Message!' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handleOpenWhatsApp}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send on WhatsApp</span>
          </button>
        </div>

      </div>
    </div>
  );
}
