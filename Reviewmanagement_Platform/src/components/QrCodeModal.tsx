'use client';

import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Download, Copy, Check, ExternalLink, QrCode as QrIcon } from 'lucide-react';
import { Client } from '../lib/types';
import {
  isClientExpired,
  isClientUpcoming,
  getClientDaysLeft,
  getDaysUntilStart,
  formatDate,
  formatDateRange,
  buildClientReviewUrl,
  copyToClipboardSafe,
} from '../lib/data';

interface QrCodeModalProps {
  isOpen: boolean;
  client: Client | null;
  onClose: () => void;
}

export default function QrCodeModal({ isOpen, client, onClose }: QrCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);
  const [funnelUrl, setFunnelUrl] = useState('');

  useEffect(() => {
    if (!isOpen || !client) return;

    if (typeof window !== 'undefined') {
      const base = window.location.origin;
      const url = buildClientReviewUrl(base, client);
      setFunnelUrl(url);

      if (canvasRef.current) {
        QRCode.toCanvas(canvasRef.current, url, {
          width: 300,
          margin: 2,
          color: {
            dark: '#020617',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });
      }
    }
  }, [isOpen, client]);

  if (!isOpen || !client) return null;

  const handleCopy = () => {
    if (!funnelUrl) return;
    copyToClipboardSafe(funnelUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${client.name.replace(/\s+/g, '_')}_QR_Code.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-7 text-slate-100 text-center my-8 max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition absolute top-5 right-5"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-2 border border-indigo-500/20">
          <QrIcon className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white mb-0.5">
          {client.name}
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Scan with any phone camera to instantly open this client&apos;s review funnel.
        </p>

        {/* QR Code Container */}
        <div className="inline-block p-4 rounded-3xl bg-white shadow-xl shadow-indigo-500/10 mb-3 border-4 border-slate-950">
          <canvas ref={canvasRef} className="rounded-xl w-60 h-60 mx-auto" />
        </div>

        {/* Plan Validity Status Window */}
        <div className={`mb-3 inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold border ${
          isClientUpcoming(client)
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
            : isClientExpired(client)
            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        }`}>
          {isClientUpcoming(client) ? (
            <>
              <span>🟡 Scheduled:</span>
              <span>Opens {formatDate(client.start_date)} (in {getDaysUntilStart(client.start_date)}d)</span>
            </>
          ) : isClientExpired(client) ? (
            <>
              <span>🔴 Expired:</span>
              <span>Ended {formatDate(client.expiry_date)}</span>
            </>
          ) : (
            <>
              <span>🟢 Active:</span>
              <span>{formatDateRange(client.start_date, client.expiry_date)}</span>
              <span className="text-[10px] text-emerald-400 font-semibold">({getClientDaysLeft(client.expiry_date)}d left)</span>
            </>
          )}
        </div>

        {/* Display Funnel URL */}
        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left mb-4 flex items-center justify-between gap-2">
          <div className="truncate text-xs font-mono text-slate-300 select-all">
            {funnelUrl}
          </div>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition shrink-0"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <button
            onClick={handleDownload}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 active:scale-95 text-white font-bold text-xs shadow-lg shadow-indigo-500/20 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download High-Res QR (Print Ready)</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCopy}
              className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Copy Review Link'}</span>
            </button>

            <a
              href={funnelUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-3 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Live Funnel</span>
            </a>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
          🛡️ <strong>Permanent QR Code:</strong> Accessible between start & end dates. Updating details or dates will <strong>never change the printed QR code</strong>!
        </p>

      </div>
    </div>
  );
}
