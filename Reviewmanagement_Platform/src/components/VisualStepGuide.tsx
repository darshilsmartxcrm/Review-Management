'use client';

import React, { useState } from 'react';
import {
  Star,
  Copy,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  Smartphone,
  MousePointerClick,
  HandMetal,
  ShieldCheck,
  Check
} from 'lucide-react';
import { LanguageCode } from '../lib/types';
import { copyToClipboardSafe } from '../lib/data';

export interface VisualStepGuideProps {
  lang: LanguageCode;
  selectedReviewText?: string;
  businessName?: string;
  variant?: 'inline' | 'modal' | 'showcase';
  googleUrl?: string;
  onClose?: () => void;
}

export default function VisualStepGuide({
  lang,
  selectedReviewText,
  businessName = 'Business',
  variant = 'inline',
  googleUrl,
  onClose
}: VisualStepGuideProps) {
  const [activeTab, setActiveTab] = useState<'chip' | 'longpress'>('chip');
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!selectedReviewText) return;
    const ok = await copyToClipboardSafe(selectedReviewText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const previewSnippet = selectedReviewText
    ? (selectedReviewText.length > 70 ? `${selectedReviewText.slice(0, 67)}...` : selectedReviewText)
    : `Excellent service at ${businessName}! Highly recommended.`;

  // Multilingual translations for the visual step guide
  const content = {
    en: {
      industryBadge: 'Top Industry Gold Standard',
      platformsText: 'Used by Podium, Birdeye, Trustpilot & Grade.us',
      title: 'How to Submit Your Review in 10 Seconds',
      subtitle:
        'Google strictly prevents third-party apps from typing directly into review boxes. Every top review platform uses this exact 1-Click Clipboard + Instant Paste mechanism:',
      step1Title: 'Step 1: Select 5 Stars',
      step1Desc: 'Tap 5 stars ⭐⭐⭐⭐⭐ on Google’s review screen.',
      step2Title: 'Step 2: Paste Your Review',
      step2Desc: 'Choose either of the two effortless 1-tap options below:',
      tabChip: '⚡ 1-Tap Keyboard Chip (Recommended)',
      tabLongPress: '👆 1-Second Long-Press (Universal)',
      chipHeading: 'Instant Keyboard Suggestion Chip',
      chipDesc:
        'On Android (Gboard) and iPhone (iOS Keyboard), when you tap inside Google’s review box, your copied review appears as a 1-tap chip right above your keyboard. Just tap that chip once — the entire review fills in immediately!',
      chipTapAction: 'Tap this chip once 👆',
      gboardNote: 'Works automatically on Android (Gboard, Samsung) & iPhone (iOS keyboard)',
      longPressHeading: '1-Second Finger Long-Press',
      longPressDesc:
        'Hold your finger inside Google’s review box for 1 second. When the small menu pops up, tap "Paste".',
      longPressTouchAction: 'Hold for 1 sec 👆',
      pasteButton: 'Paste',
      step3Title: 'Step 3: Hit "Post" 🚀',
      step3Desc: 'Tap the blue "Post" button at the top right. You are done!',
      copiedPreviewTitle: 'Review Copied & Ready to Paste:',
      copyAgainBtn: 'Copy Again',
      copiedBadge: 'Copied!',
      openGoogleBtn: 'Open Google Reviews',
      dismissBtn: 'Got it, Close'
    },
    hi: {
      industryBadge: 'ग्लोबल इंडस्ट्री का गोल्ड स्टैंडर्ड',
      platformsText: 'Podium, Birdeye, Trustpilot और Grade.us जैसी शीर्ष तकनीक',
      title: 'Google पर 10 सेकंड में रिव्यू कैसे पोस्ट करें',
      subtitle:
        'Google सुरक्षा कारणों से किसी भी ऐप को सीधे रिव्यू टेक्स्ट भरने की अनुमति नहीं देता। दुनिया का हर प्रमुख रिव्यू प्लेटफॉर्म इसी 1-क्लिक क्लिपबोर्ड और 1-टैप पेस्ट तकनीक का उपयोग करता है:',
      step1Title: 'स्टेप 1: 5 स्टार चुनें',
      step1Desc: 'Google रिव्यू स्क्रीन पर 5 स्टार ⭐⭐⭐⭐⭐ पर टैप करें।',
      step2Title: 'स्टेप 2: रिव्यू पेस्ट (Paste) करें',
      step2Desc: 'नीचे दिए गए दोनों में से किसी भी आसान तरीके का उपयोग करें:',
      tabChip: '⚡ 1-टैप कीबोर्ड चिप (सबसे तेज)',
      tabLongPress: '👆 1-सेकंड दबाकर रखें (Long-Press)',
      chipHeading: 'तुरंत 1-टैप कीबोर्ड सुझाव (Keyboard Chip)',
      chipDesc:
        'Android (Gboard) और iPhone पर, जैसे ही आप Google के रिव्यू बॉक्स में टैप करेंगे, कीबोर्ड के ठीक ऊपर आपका कॉपी किया हुआ रिव्यू दिखेगा। बस उस चिप पर 1 बार टैप करें और पूरा रिव्यू तुरंत भर जाएगा!',
      chipTapAction: 'इस चिप पर 1 बार टैप करें 👆',
      gboardNote: 'Android (Gboard, Samsung) और iPhone दोनों कीबोर्ड पर अपने-आप काम करता है',
      longPressHeading: '1-सेकंड उंगली दबाकर रखें (Long-Press)',
      longPressDesc:
        'Google के रिव्यू बॉक्स में 1 सेकंड तक अपनी उंगली दबाकर रखें। छोटा मेनू खुलते ही "Paste" पर टैप करें।',
      longPressTouchAction: '1 सेकंड दबाएं 👆',
      pasteButton: 'पेस्ट (Paste)',
      step3Title: 'स्टेप 3: "Post" बटन दबाएं 🚀',
      step3Desc: 'ऊपर दाईं ओर दिए गए नीले "Post" बटन पर टैप करें। आपका रिव्यू सबमिट हो जाएगा!',
      copiedPreviewTitle: 'कॉपी किया गया रिव्यू (पेस्ट के लिए तैयार):',
      copyAgainBtn: 'फिर से कॉपी करें',
      copiedBadge: 'कॉपी हो गया!',
      openGoogleBtn: 'Google रिव्यू खोलें',
      dismissBtn: 'समझ गया, बंद करें'
    },
    gu: {
      industryBadge: 'વિશ્વનું અગ્રણી ગોલ્ડ સ્ટાન્ડર્ડ',
      platformsText: 'Podium, Birdeye, Trustpilot અને Grade.us જેવી સર્વશ્રેષ્ઠ ટેકનોલોજી',
      title: 'Google પર ૧૦ સેકન્ડમાં રિવ્યૂ કેવી રીતે પોસ્ટ કરવો',
      subtitle:
        'Google કોઈ પણ એપને સીધો રિવ્યૂ બોક્સમાં લખાણ લખવા દેતું નથી. વિશ્વનું દરેક મોટું પ્લેટફોર્મ આ જ ૧-ક્લિક ક્લિપબોર્ડ અને ૧-ટેપ પેસ્ટ પદ્ધતિનો ઉપયોગ કરે છે:',
      step1Title: 'પગલું 1: 5 સ્ટાર પસંદ કરો',
      step1Desc: 'Google રિવ્યૂ સ્ક્રીન પર 5 સ્ટાર ⭐⭐⭐⭐⭐ પર ટેપ કરો.',
      step2Title: 'પગલું 2: રિવ્યૂ પેસ્ટ (Paste) કરો',
      step2Desc: 'નીચે દર્શાવેલી બેમાંથી કોઈપણ સરળ પદ્ધતિ વાપરો:',
      tabChip: '⚡ ૧-ટેપ કીબોર્ડ ચિપ (સૌથી સરળ)',
      tabLongPress: '👆 ૧-સેકન્ડ દબાવી રાખો (Long-Press)',
      chipHeading: 'ત્વરિત ૧-ટેપ કીબોર્ડ સૂચન (Keyboard Chip)',
      chipDesc:
        'Android (Gboard) અને iPhone પર, જ્યારે તમે Google ના રિવ્યૂ બોક્સમાં ટેપ કરશો, ત્યારે કીબોર્ડની બરાબર ઉપર કોપી થયેલો રિવ્યૂ દેખાશે. ફક્ત તેના પર ૧ વાર ટેપ કરો — આખો રિવ્યૂ તરત જ ભરાઈ જશે!',
      chipTapAction: 'આ ચિપ પર ૧ ટેપ કરો 👆',
      gboardNote: 'Android (Gboard, Samsung) અને iPhone બંને કીબોર્ડ પર આપમેળે દેખાય છે',
      longPressHeading: '૧-સેકન્ડ આંગળી દબાવી રાખો (Long-Press)',
      longPressDesc:
        'Google ના રિવ્યૂ બોક્સમાં ૧ સેકન્ડ આંગળી દબાવી રાખો. નાનું મેનૂ આવે એટલે "Paste" પર ટેપ કરો.',
      longPressTouchAction: '૧ સેકન્ડ દબાવો 👆',
      pasteButton: 'પેસ્ટ (Paste)',
      step3Title: 'પગલું 3: "Post" બટન દબાવો 🚀',
      step3Desc: 'ઉપર જમણી બાજુ આવેલું વાદળી "Post" બટન દબાવો. તમારો રિવ્યૂ સફળતાપૂર્વક મૂકાઈ ગયો!',
      copiedPreviewTitle: 'કોપી થયેલો રિવ્યૂ (પેસ્ટ કરવા માટે તૈયાર):',
      copyAgainBtn: 'ફરીથી કોપી કરો',
      copiedBadge: 'કોપી થઈ ગયું!',
      openGoogleBtn: 'Google રિવ્યૂ ખોલો',
      dismissBtn: 'સમજી ગયા, બંધ કરો'
    }
  };

  const t = content[lang] || content.en;

  return (
    <div
      className={`w-full rounded-2xl border transition-all ${
        variant === 'modal'
          ? 'bg-slate-900 border-slate-700/80 p-5 sm:p-6 shadow-2xl'
          : variant === 'showcase'
          ? 'bg-gradient-to-b from-slate-900/95 via-slate-900/80 to-slate-950 border-slate-800 p-6 sm:p-8 shadow-2xl'
          : 'bg-slate-950/90 border-slate-800/90 p-4 sm:p-5 shadow-lg'
      }`}
    >
      {/* Industry Platforms Trust Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 mb-4 border-b border-slate-800/80">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-extrabold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.industryBadge}</span>
        </div>
        <p className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{t.platformsText}</span>
        </p>
      </div>

      {/* Guide Header */}
      <div className="space-y-1 mb-4 text-left">
        <h3 className="text-base sm:text-lg font-black text-white tracking-tight flex items-center gap-2">
          <span>{t.title}</span>
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* 3 Step Visual Progression */}
      <div className="space-y-3.5">
        
        {/* Step 1: Select 5 Stars */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 font-black text-xs flex items-center justify-center shrink-0">
              1
            </span>
            <div>
              <p className="text-xs font-bold text-white">{t.step1Title}</p>
              <p className="text-[11px] text-slate-400">{t.step1Desc}</p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 text-amber-400 shrink-0 bg-amber-500/10 py-1 px-2 rounded-lg border border-amber-500/20">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-amber-400" />
            ))}
          </div>
        </div>

        {/* Step 2: Paste Your Review (Interactive Tabbed Mockup) */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-indigo-950/40 via-slate-900/80 to-slate-900 border border-indigo-500/30 space-y-3.5 text-left">
          
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-black text-xs flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <p className="text-xs font-bold text-white">{t.step2Title}</p>
                <p className="text-[11px] text-indigo-300/80">{t.step2Desc}</p>
              </div>
            </div>

            {/* Method Tabs */}
            <div className="flex items-center p-0.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('chip')}
                className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  activeTab === 'chip'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>⚡ 1-Tap Chip</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('longpress')}
                className={`py-1 px-2.5 rounded-lg text-[11px] font-bold transition flex items-center gap-1 cursor-pointer ${
                  activeTab === 'longpress'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>👆 1-Sec Long Press</span>
              </button>
            </div>
          </div>

          {/* Tab 1 Content: Instant Keyboard Suggestion Chip */}
          {activeTab === 'chip' && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {t.chipDesc}
              </p>

              {/* Visual Mobile Keyboard Mockup */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                
                {/* Simulated Google Review Input Area */}
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Google: Share details of your experience...</span>
                  <span className="w-1.5 h-4 bg-indigo-400 animate-pulse rounded-full" />
                </div>

                {/* Simulated Mobile Keyboard Top Bar with Glowing Suggestion Chip */}
                <div className="pt-1 border-t border-slate-800">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5 font-semibold">
                    <span className="flex items-center gap-1">
                      <Smartphone className="w-3 h-3 text-indigo-400" />
                      <span>{t.gboardNote}</span>
                    </span>
                    <span className="text-amber-400 font-bold animate-pulse">
                      {t.chipTapAction}
                    </span>
                  </div>

                  {/* The Suggestion Chip on top of keyboard */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    <div className="inline-flex items-center gap-2 py-1.5 px-3 rounded-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/30 border border-indigo-400/80 animate-pulse-subtle">
                      <Copy className="w-3.5 h-3.5 text-amber-300" />
                      <span className="truncate max-w-[220px] sm:max-w-xs italic font-sans font-normal">
                        &ldquo;{previewSnippet}&rdquo;
                      </span>
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] shrink-0">
                        1-TAP
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Tab 2 Content: 1-Second Long-Press */}
          {activeTab === 'longpress' && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {t.longPressDesc}
              </p>

              {/* Visual Long-Press Simulation Mockup */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                <div className="relative p-3 rounded-lg bg-slate-900 border border-slate-700/60 min-h-[75px] flex flex-col justify-center">
                  
                  {/* Floating Paste Tooltip Menu */}
                  <div className="inline-flex items-center gap-2 self-start py-1 px-3 rounded-xl bg-white text-slate-950 font-black text-xs shadow-xl border border-slate-300 mb-1.5 animate-bounce-in">
                    <Copy className="w-3 h-3 text-indigo-600" />
                    <span>{t.pasteButton}</span>
                  </div>

                  {/* Finger Hold Indicator */}
                  <div className="flex items-center gap-2 text-indigo-300 text-[11px] font-semibold">
                    <span className="flex h-3 w-3 rounded-full bg-amber-400 animate-ping" />
                    <span>{t.longPressTouchAction}</span>
                    <span className="text-slate-400">({t.longPressHeading})</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Step 3: Hit Post */}
        <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <span className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 font-black text-xs flex items-center justify-center shrink-0">
              3
            </span>
            <div>
              <p className="text-xs font-bold text-white">{t.step3Title}</p>
              <p className="text-[11px] text-slate-400">{t.step3Desc}</p>
            </div>
          </div>
          <div className="shrink-0 py-1.5 px-3.5 rounded-xl bg-blue-600 text-white font-extrabold text-xs shadow-md border border-blue-400 flex items-center gap-1.5">
            <span>Post</span>
            <Check className="w-3.5 h-3.5" />
          </div>
        </div>

      </div>

      {/* Review Snippet Preview with Instant Re-copy */}
      {selectedReviewText && (
        <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-left space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400 font-medium">{t.copiedPreviewTitle}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 text-[11px] transition cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>{copied ? t.copiedBadge : t.copyAgainBtn}</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 italic line-clamp-2 select-all font-sans font-normal leading-relaxed">
            &ldquo;{selectedReviewText}&rdquo;
          </p>
        </div>
      )}

      {/* Action Footer if in Modal View */}
      {variant === 'modal' && (
        <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-end gap-2.5">
          {googleUrl && (
            <a
              href={googleUrl}
              target="_blank"
              rel="noreferrer"
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-xs font-bold text-white transition flex items-center gap-1.5 shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <span>{t.openGoogleBtn}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition cursor-pointer"
            >
              {t.dismissBtn}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
