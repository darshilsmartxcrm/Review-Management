import { IndustryCategory, IndustryKey, LanguageCode, Client } from './types';

export const INDUSTRY_CATALOG: Record<IndustryKey, IndustryCategory> = {
  surgical_medical: {
    id: "surgical_medical",
    name: "Surgical & Medical Equipment Store",
    icon: "🏥",
    categoryPhrase: {
      en: "medical & surgical equipment",
      hi: "सर्जिकल और मेडिकल इक्विपमेंट",
      gu: "સર્જિકલ અને મેડિકલ સાધનો"
    },
    defaultProducts: [
      "Wheelchair",
      "Hospital Bed",
      "Mobility Solutions",
      "Oxygen Concentrator",
      "Walker / Walking Stick",
      "BP Monitor",
      "Nebulizer Machine",
      "Commode Chair",
      "Orthopedic Supports & Belts",
      "Pulse Oximeter",
      "Air Mattress",
      "Surgical Gloves & Disposables"
    ]
  },
  healthcare: {
    id: "healthcare",
    name: "Dental, Clinic & Doctor",
    icon: "🦷",
    categoryPhrase: {
      en: "dental & healthcare services",
      hi: "डेंटल और चिकित्सा सेवा",
      gu: "દાંત અને આરોગ્ય સારવાર"
    },
    defaultProducts: [
      "Painless Root Canal",
      "Teeth Cleaning & Scaling",
      "Dental Implants",
      "Braces & Invisible Aligners",
      "Teeth Whitening",
      "Child Dental Care",
      "General Consultation",
      "Physiotherapy"
    ]
  },
  restaurant: {
    id: "restaurant",
    name: "Restaurant, Cafe & Food",
    icon: "🍽️",
    categoryPhrase: {
      en: "dining experience & food",
      hi: "स्वादिष्ट भोजन और डाइनिंग",
      gu: "સ્વાદિષ્ટ ભોજન અને ડાઇનિંગ"
    },
    defaultProducts: [
      "Authentic Gujarati Thali",
      "Sizzlers & Starters",
      "Paneer Tikka & Curries",
      "Fast Food & Pizza",
      "Family Dining",
      "Live Mocktails",
      "Delicious Desserts",
      "Breakfast & Snacks"
    ]
  },
  salon: {
    id: "salon",
    name: "Salon, Spa & Beauty Lounge",
    icon: "✂️",
    categoryPhrase: {
      en: "beauty & grooming services",
      hi: "सैलून और ग्रूमिंग सर्विस",
      gu: "સલૂન અને બ્યુટી સર્વિસ"
    },
    defaultProducts: [
      "Keratin Treatment",
      "Hydra Facial",
      "Bridal & Groom Makeup",
      "Hair Spa & Treatment",
      "Trendy Haircut & Styling",
      "Beard Styling",
      "Pedicure & Manicure",
      "Skin Rejuvenation"
    ]
  },
  automobile: {
    id: "automobile",
    name: "Automobile Service & Detailing",
    icon: "🚗",
    categoryPhrase: {
      en: "car servicing & care",
      hi: "गाड़ी की सर्विस और देखभाल",
      gu: "વાહનની સર્વિસ અને કેર"
    },
    defaultProducts: [
      "Ceramic Coating",
      "Complete Car Servicing",
      "Denting & Painting",
      "Genuine Spare Parts",
      "Wheel Alignment & Balancing",
      "Car AC Repair",
      "Foam Wash & Interior Cleaning",
      "Teflon Coating"
    ]
  },
  electronics: {
    id: "electronics",
    name: "Electronics & Mobile Store",
    icon: "📱",
    categoryPhrase: {
      en: "electronics & gadgets",
      hi: "इलेक्ट्रॉनिक्स और मोबाइल",
      gu: "ઈલેક્ટ્રોનિક્સ અને મોબાઈલ"
    },
    defaultProducts: [
      "Latest Smartphones",
      "Smart LED TV",
      "Laptop & Computer Repair",
      "Original Accessories",
      "Best Exchange Offers",
      "Bluetooth Speakers & Earbuds",
      "Home Appliances",
      "CCTV Installation"
    ]
  },
  realestate: {
    id: "realestate",
    name: "Real Estate & Builders",
    icon: "🏢",
    categoryPhrase: {
      en: "property & consultancy",
      hi: "प्रॉपर्टी और रियल एस्टेट",
      gu: "પ્રોપર્ટી અને રિયલ એસ્ટેટ"
    },
    defaultProducts: [
      "Luxury 3BHK Flats",
      "Residential Plots",
      "Commercial Showrooms",
      "Transparent Paperwork",
      "Prime Location Property",
      "Home Loan Assistance",
      "Budget Friendly Apartments"
    ]
  },
  fashion: {
    id: "fashion",
    name: "Clothing, Boutique & Fashion",
    icon: "👗",
    categoryPhrase: {
      en: "outfits & fashion collection",
      hi: "कपड़े और फैशन कलेक्शन",
      gu: "કપડાં અને ફેશન કલેક્શન"
    },
    defaultProducts: [
      "Bridal Lehenga",
      "Designer Sarees",
      "Custom Tailoring & Fitting",
      "Men's Kurta & Sherwani",
      "Partywear Suits",
      "Western & Casual Wear",
      "Premium Fabrics"
    ]
  },
  fitness: {
    id: "fitness",
    name: "Gym, Fitness & Yoga",
    icon: "🏋️",
    categoryPhrase: {
      en: "fitness & training",
      hi: "जिम और फिटनेस ट्रेनिंग",
      gu: "જીમ અને ફિટનેસ ટ્રેનિંગ"
    },
    defaultProducts: [
      "Personal Training",
      "Weight Loss Program",
      "Modern Gym Equipment",
      "Zumba & Cardio Classes",
      "Certified Fitness Coaches",
      "Diet & Nutrition Guidance",
      "Clean Workout Environment"
    ]
  },
  education: {
    id: "education",
    name: "Coaching Classes & Education",
    icon: "📚",
    categoryPhrase: {
      en: "coaching & education",
      hi: "कोचिंग और पढ़ाई",
      gu: "કોચિંગ અને શિક્ષણ"
    },
    defaultProducts: [
      "Concept Clarity",
      "Board Exam Preparation",
      "Small Batch Sizes",
      "Experienced Teachers",
      "Personal Attention",
      "Quality Study Material",
      "Regular Test Series"
    ]
  },
  furniture: {
    id: "furniture",
    name: "Furniture & Interior Design",
    icon: "🛋️",
    categoryPhrase: {
      en: "furniture & home decor",
      hi: "फर्नीचर और होम डेकोर",
      gu: "ફર્નિચર અને હોમ ડેકોર"
    },
    defaultProducts: [
      "Modular Kitchen",
      "Wooden Sofa Set",
      "Luxury Double Bed",
      "Office Tables & Chairs",
      "Custom Wardrobe Design",
      "Durable Wooden Polish",
      "Dining Table Set"
    ]
  },
  legal_finance: {
    id: "legal_finance",
    name: "CA, Tax & Legal Services",
    icon: "⚖️",
    categoryPhrase: {
      en: "financial & legal consultancy",
      hi: "टैक्स और कानूनी सेवाएं",
      gu: "ટેક્સ અને કાનૂની સેવાઓ"
    },
    defaultProducts: [
      "GST Registration & Returns",
      "Income Tax Filing (ITR)",
      "Company Registration",
      "Audit & Bookkeeping",
      "Business Loan Consultancy",
      "Trademark Registration",
      "Financial Advisory"
    ]
  },
  general: {
    id: "general",
    name: "General Retail & Services",
    icon: "💼",
    categoryPhrase: {
      en: "products & services",
      hi: "उत्पाद और सेवाएं",
      gu: "પ્રોડક્ટ્સ અને સેવાઓ"
    },
    defaultProducts: [
      "Quality Products",
      "Prompt Customer Support",
      "Affordable Pricing",
      "Fast Delivery & Turnaround",
      "Honest Guidance & Advice",
      "Reliable After-Sales Service"
    ]
  }
};

export const UI_STRINGS: Record<LanguageCode, {
  langName: string;
  howWasExp: string;
  tapToRate: string;
  starsSelected: string;
  selectLanguagePrompt: string;
  selectProductPrompt: string;
  allProductsLabel: string;
  chooseReview: string;
  copyBtn: string;
  copiedToast: string;
  regenerateBtn: string;
  customEditPlaceholder: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  negHeading: string;
  negSubheading: string;
  negNamePlaceholder: string;
  negPhonePlaceholder: string;
  negMsgPlaceholder: string;
  negSubmitBtn: string;
  negSubmittedMsg: string;
  negRatingBanner: string;
  negSelectIssuePrompt: string;
  negCustomNoteLabel: string;
  negCustomNotePlaceholder: string;
  negSendWhatsAppBtn: string;
  negNoticeGating: string;
  negShuffleBtn: string;
  customEditLabel: string;
  sendWhatsAppBtn: string;
  directWhatsAppNotice: string;
}> = {
  en: {
    langName: "English",
    howWasExp: "How was your experience with",
    tapToRate: "Tap a star to rate us",
    starsSelected: "5-Star Experience!",
    selectLanguagePrompt: "Select Review Language:",
    selectProductPrompt: "What did you purchase or visit for? (Tap to customize review)",
    allProductsLabel: "All / General",
    chooseReview: "Choose your favorite review or edit:",
    copyBtn: "📋 Copy & Open Google (5★)",
    copiedToast: "✅ Copied! Opening Google Reviews... Just Paste & Submit!",
    regenerateBtn: "✨ Shuffle / Fresh Variations",
    customEditPlaceholder: "You can also type your custom review or note here...",
    customEditLabel: "Edit review or add custom note:",
    sendWhatsAppBtn: "📲 Send Review on WhatsApp",
    directWhatsAppNotice: "Delivered directly to owner's WhatsApp",
    step1Title: "Step 1",
    step1Desc: "Select 5 Stars ⭐⭐⭐⭐⭐",
    step2Title: "Step 2",
    step2Desc: "Paste your review 📋",
    step3Title: "Step 3",
    step3Desc: "Hit Post! 🚀",
    negHeading: "We are deeply sorry for your experience",
    negSubheading: "Your satisfaction is our #1 priority. Please share your direct feedback with the owner so we can resolve this immediately.",
    negNamePlaceholder: "Your Name",
    negPhonePlaceholder: "Your Phone / WhatsApp Number",
    negMsgPlaceholder: "What went wrong? How can we make it right?",
    negSubmitBtn: "📲 Send Private Feedback to Owner on WhatsApp",
    negSubmittedMsg: "Thank you! Your feedback has been sent directly to the owner. We will contact you shortly.",
    negRatingBanner: "⚠️ Private Feedback to Owner (Google Rating Protected)",
    negSelectIssuePrompt: "What went wrong? Select the issue or feedback:",
    negCustomNoteLabel: "Add Custom Note / Specific Details (Optional):",
    negCustomNotePlaceholder: "Type any specific complaints, remarks, or notes for the owner...",
    negSendWhatsAppBtn: "📲 Send Private Feedback to Owner on WhatsApp",
    negNoticeGating: "🛡️ Protected Feedback: Your rating will NOT be posted to Google. It goes directly to the owner's WhatsApp for instant resolution.",
    negShuffleBtn: "🔄 New Variations (Shuffle)"
  },
  hi: {
    langName: "हिन्दी",
    howWasExp: "आपका अनुभव कैसा रहा?",
    tapToRate: "रेटिंग देने के लिए स्टार पर टैप करें",
    starsSelected: "शानदार 5-स्टार अनुभव!",
    selectLanguagePrompt: "रिव्यू की भाषा चुनें:",
    selectProductPrompt: "आपने क्या सामान या सर्विस ली? (रिव्यू कस्टमाइज़ करने के लिए टैप करें):",
    allProductsLabel: "सभी / जनरल",
    chooseReview: "अपना पसंदीदा रिव्यू चुनें या एडिट करें:",
    copyBtn: "📋 रिव्यू कॉपी करें और Google पर 5★ दें",
    copiedToast: "✅ रिव्यू कॉपी हो गया! अब बस गूगल पर पेस्ट (Paste) करके पोस्ट करें!",
    regenerateBtn: "✨ नया रिव्यू बनाएं (Shuffle)",
    customEditPlaceholder: "आप चाहें तो यहां अपना खुद का रिव्यू या नोट भी लिख सकते हैं...",
    customEditLabel: "रिव्यू एडिट करें या कस्टम नोट जोड़ें:",
    sendWhatsAppBtn: "📲 WhatsApp पर रिव्यू भेजें",
    directWhatsAppNotice: "सीधे मालिक के WhatsApp पर भेजा जाएगा",
    step1Title: "स्टेप 1",
    step1Desc: "5 स्टार ⭐⭐⭐⭐⭐ चुनें",
    step2Title: "स्टेप 2",
    step2Desc: "रिव्यू पेस्ट (Paste) करें 📋",
    step3Title: "स्टेप 3",
    step3Desc: "Post बटन दबाएं! 🚀",
    negHeading: "हमें खेद है कि आपका अनुभव अच्छा नहीं रहा",
    negSubheading: "आपकी संतुष्टि हमारे लिए सबसे महत्वपूर्ण है। कृपया सीधे मालिक को बताएं ताकि हम इसे तुरंत ठीक कर सकें।",
    negNamePlaceholder: "आपका नाम",
    negPhonePlaceholder: "आपका फोन / व्हाट्सऐप नंबर",
    negMsgPlaceholder: "क्या कमी रह गई? हम इसे कैसे बेहतर कर सकते हैं?",
    negSubmitBtn: "📲 मालिक के व्हाट्सऐप पर सीधे फीडबैक भेजें",
    negSubmittedMsg: "धन्यवाद! आपका संदेश सीधे मालिक तक पहुंचा दिया गया है। हम जल्द आपसे संपर्क करेंगे।",
    negRatingBanner: "⚠️ मालिक को सीधा निजी फीडबैक (Google रेटिंग सुरक्षित)",
    negSelectIssuePrompt: "क्या कमी रह गई? अपनी समस्या या फीडबैक चुनें:",
    negCustomNoteLabel: "कस्टम नोट / विशेष विवरण जोड़ें (वैकल्पिक):",
    negCustomNotePlaceholder: "मालिक के लिए कोई विशेष शिकायत या सुझाव यहां लिखें...",
    negSendWhatsAppBtn: "📲 मालिक के व्हाट्सऐप पर सीधे फीडबैक भेजें",
    negNoticeGating: "🛡️ सुरक्षित फीडबैक: यह रिव्यू गूगल पर नहीं जाएगा। यह सीधे मालिक के व्हाट्सऐप पर भेजा जाएगा ताकि वे तुरंत समाधान कर सकें।",
    negShuffleBtn: "🔄 नए विकल्प बनाएं (Shuffle)"
  },
  gu: {
    langName: "ગુજરાતી",
    howWasExp: "તમારો અનુભવ કેવો રહ્યો?",
    tapToRate: "રેટિંગ આપવા માટે સ્ટાર પર ટેપ કરો",
    starsSelected: "ઉત્કૃષ્ટ 5-સ્ટાર અનુભવ!",
    selectLanguagePrompt: "રિવ્યૂની ભાષા પસંદ કરો:",
    selectProductPrompt: "તમે કઈ પ્રોડક્ટ કે સર્વિસ લીધી? (રિવ્યૂ બદલવા માટે ટેપ કરો):",
    allProductsLabel: "બધું / જનરલ",
    chooseReview: "તમારો મનપસંદ રિવ્યૂ પસંદ કરો અથવા એડિટ કરો:",
    copyBtn: "📋 રિવ્યૂ કોપી કરો અને Google પર 5★ આપો",
    copiedToast: "✅ રિવ્યૂ કોપી થઈ ગયો! હવે ગૂગલ પર ફક્ત પેસ્ટ (Paste) કરીને પોસ્ટ કરો!",
    regenerateBtn: "✨ નવો રિવ્યૂ બનાવો (Shuffle)",
    customEditPlaceholder: "તમે અહીં તમારી રીતે પણ રિવ્યૂ કે કસ્ટમ નોટ લખી શકો છો...",
    customEditLabel: "રિવ્યૂ એડિટ કરો અથવા કસ્ટમ નોટ ઉમેરો:",
    sendWhatsAppBtn: "📲 WhatsApp પર રિવ્યૂ મોકલો",
    directWhatsAppNotice: "સીધા માલિકના WhatsApp પર મોકલવામાં આવશે",
    step1Title: "પગલું 1",
    step1Desc: "5 સ્ટાર ⭐⭐⭐⭐⭐ પસંદ કરો",
    step2Title: "પગલું 2",
    step2Desc: "રિવ્યૂ પેસ્ટ (Paste) કરો 📋",
    step3Title: "પગલું 3",
    step3Desc: "Post બટન દબાવો! 🚀",
    negHeading: "અમને દિલગીરી છે કે તમારો અનુભવ સારો ન રહ્યો",
    negSubheading: "તમારો સંતોષ અમારા માટે સર્વોપરી છે. કૃપા કરીને સીધો માલિકને પ્રતિસાદ આપો જેથી અમે તેનું તાત્કાલિક નિરાકરણ લાવી શકીએ.",
    negNamePlaceholder: "તમારું નામ",
    negPhonePlaceholder: "તમારો ફોન / વ્હોટ્સએપ નંબર",
    negMsgPlaceholder: "શું ખામી રહી ગઈ? અમે તેને કેવી રીતે સુધારી શકીએ?",
    negSubmitBtn: "📲 માલિકના વ્હોટ્સએપ પર સીધો ફીડબેક મોકલો",
    negSubmittedMsg: "ખૂબ ખૂબ આભાર! તમારો સંદેશ સીધો માલિક સુધી પહોંચાડી દેવાયો છે. અમે ટૂંક સમયમાં તમારો સંપર્ક કરીશું.",
    negRatingBanner: "⚠️ માલિકને સીધો ખાનગી ફીડબેક (Google રેટિંગ સુરક્ષિત)",
    negSelectIssuePrompt: "શું મુશ્કેલી પડી? સમસ્યા અથવા ફીડબેક પસંદ કરો:",
    negCustomNoteLabel: "કસ્ટમ નોટ / વિશેષ નોંધ ઉમેરો (મરજિયાત):",
    negCustomNotePlaceholder: "માલિક માટે કોઈપણ વિશેષ ફરિયાદ કે વિગત અહીં લખો...",
    negSendWhatsAppBtn: "📲 માલિકના વ્હોટ્સએપ પર સીધો ફીડબેક મોકલો",
    negNoticeGating: "🛡️ સુરક્ષિત ફીડબેક: આ રેટિંગ ગૂગલ પર પોસ્ટ નહીં થાય. આ સીધું માલિકના વ્હોટ્સએપ પર જશે જેથી તેઓ તાત્કાલિક ઉકેલ લાવી શકે.",
    negShuffleBtn: "🔄 નવા વિકલ્પો બનાવો (Shuffle)"
  }
};

// Multi-Format Review Generation Engine: Distinct Short, Medium & Detailed Formats
function buildTierTemplates(
  starts: string[],
  ends: string[],
  targetCount: number = 200
): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (let s = 0; s < starts.length; s++) {
    for (let e = 0; e < ends.length; e++) {
      const combo = `${starts[s]} ${ends[e]}`.replace(/\s+/g, ' ').trim();
      const key = combo.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(combo);
        if (result.length >= targetCount) {
          return result;
        }
      }
    }
  }

  return result;
}

// ==================== ENGLISH (3 DISTINCT FORMAT TIERS) ====================
// Format 1: Short & Punchy (1-2 sentences, ~12-25 words)
const EN_SHORT_STARTS = [
  "Best place in {city} for {product}!",
  "Top-notch quality {product} and very genuine pricing at {name}.",
  "Quick, reliable, and hassle-free service for {product} at {name}.",
  "5 stars to {name}! Got my {product} right on time.",
  "Super impressed with {name} in {city} for {product}.",
  "Outstanding quality {product} with zero compromises at {name}.",
  "Very happy with my purchase of {product} from {name}.",
  "Excellent customer service and genuine {product} at {name}.",
  "Fantastic experience getting {product} from {name} in {city}.",
  "Extremely reliable establishment in {city} for {product}.",
  "Unbeatable quality and friendly staff at {name}.",
  "Smooth process and great value for money for {product} at {name}.",
  "Got exactly what I needed at {name} in {city}.",
  "Truly a five-star experience at {name} for {product}.",
  "Wonderful visit to {name} in {city}!"
];

const EN_SHORT_ENDS = [
  "Super fast service and humble staff. 10/10!",
  "The team was very supportive and polite. Full 5 stars!",
  "Completely satisfied with the standard and pricing.",
  "Highly recommended to anyone looking for {product} in {city}!",
  "Clean, professional, and trustworthy people.",
  "Will definitely visit again. Keep it up!",
  "Great value for money and polite behavior throughout.",
  "Prompt response and great attention to detail.",
  "Honest advice with zero hidden charges. 5/5 stars!",
  "Easily the best in {city}. Strongly recommended!",
  "Punctual, cooperative, and highly professional.",
  "Delighted by their efficiency and friendly approach!"
];

// Format 2: Medium / Recommendation / Gratitude (2-3 sentences, ~25-35 words)
const EN_MED_STARTS = [
  "If you are looking for reliable {product} in {city}, {name} should be your first stop.",
  "A big thank you to {name} for handling our requirement for {product} so professionally.",
  "Anyone in {city} needing genuine {product} must visit {name} without hesitation.",
  "Worth every single rupee spent at {name} for {product}.",
  "Thank you {name} for the wonderful service and on-time delivery of {product}.",
  "Finding honest dealers for {product} in {city} is hard, but {name} proved to be a breath of fresh air.",
  "I was referred to {name} by a friend for {product}, and they lived up to the praise.",
  "The honesty, transparency, and fair pricing at {name} for {product} truly set them apart.",
  "We are very grateful to the team at {name} for guiding us so patiently regarding {product}.",
  "Whenever anyone asks me for {product} in {city}, I immediately recommend {name}.",
  "Superb customer care and authentic {product} provided by {name} in {city}.",
  "From the very first call, {name} handled our queries regarding {product} with utmost clarity.",
  "Honest dealings, zero pushy sales tactics, and authentic {product} at {name}.",
  "Deeply satisfied with how {name} in {city} managed our requirement for {product}.",
  "A shining example of how a customer-first business in {city} should be run."
];

const EN_MED_ENDS = [
  "They explained all the options transparently without rushing. 100% recommended to everyone!",
  "The staff is polite, well-trained, and genuinely dedicated to customer happiness. 5/5 stars!",
  "The quality exceeded our expectations and the pricing was very reasonable for {city}.",
  "No hidden costs, prompt delivery, and completely peaceful experience throughout.",
  "Their warm hospitality and polite guidance made everything effortless. Full 5 stars!",
  "The finishing of {product} is superb and the team is always ready to assist with a smile.",
  "They take personal interest in solving your requirements rather than just making a sale.",
  "Fast turnaround, respectful behavior, and guaranteed peace of mind. Must visit!",
  "Clear billing, timely execution, and humble conduct across all staff members.",
  "Extremely cooperative team who helped us pick the exact right option for {product}.",
  "Great punctuality, strict quality standards, and genuine care for the customer.",
  "You rarely find such humble and knowledgeable professionals under one roof in {city}.",
  "Delivered right on time with flawless standards. Thank you {name} team!",
  "Honest advice, fair rates, and dependable post-service support as well.",
  "Will definitely recommend to all my family and colleagues in {city}!"
];

// Format 3: Detailed Story & Complete Experience (3-4 sentences, ~40-60 words)
const EN_DET_STARTS = [
  "I was searching for high quality {product} across {city} and decided to visit {name} after reading great reviews.",
  "My family recently visited {name} in {city} for {product}, and the entire experience was memorable from start to finish.",
  "Having had mediocre experiences elsewhere in {city}, walking into {name} for {product} was a completely refreshing change.",
  "Visited {name} last week for {product}. The thoroughness with which they explained every single technical aspect was remarkable.",
  "After comparing multiple options in {city}, I chose {name} for {product} and it turned out to be the best decision.",
  "Had an elaborate requirement for {product} and the team at {name} in {city} managed it with absolute precision.",
  "Came to {name} for {product} on an urgent basis, and the way they prioritized our request was deeply impressive.",
  "I have visited many places in {city}, but the standard of work and hygiene maintained at {name} for {product} is truly unmatched.",
  "From our initial consultation right up to final handover of {product}, {name} provided exceptional, uninterrupted support.",
  "It was our first time dealing with {name} in {city} for {product}, and they treated us like valued lifelong customers.",
  "Decided to trust {name} for our {product} requirement, and they delivered far beyond what was originally promised.",
  "Everything from ambiance to staff professionalism at {name} in {city} reflects their dedication to top quality.",
  "The attention to detail and care that {name} puts into {product} is something you don't easily find in {city}.",
  "Booked service for {product} at {name} and was blown away by their systematic coordination and promptness."
];

const EN_DET_ENDS = [
  "The staff took time to understand our exact budget, showed multiple choices without any pressure, and delivered top-notch results. The pricing was 100% transparent. Highly, highly recommended!",
  "The team was courteous, the premises spotless, and the quality of {product} was flawless. Very rare to see such honesty and punctuality in {city}. Truly a 10/10 experience!",
  "Everything was completed well ahead of schedule with zero hidden charges. The staff is polite, patient, and knowledgeable. Will recommend to all my relatives and friends!",
  "They provided genuine advice, helped us avoid unnecessary expenses, and delivered premium quality {product}. The team's polite nature made us feel very comfortable. Full 5 stars!",
  "Clear documentation, transparent billing, and impeccable craftsmanship on {product}. The staff attended to every minor query with a smile. Definitely the best in {city}!",
  "Prompt response on WhatsApp and phone, timely delivery, and authentic grade materials. Their cooperative attitude made the entire process stress-free. 5/5 stars from my side!",
  "The guidance provided was honest and practical. No false promises—only authentic results and courteous hospitality. {city} needs more honest businesses like {name}!",
  "Every member of the staff was helpful, the billing was crystal clear, and the {product} exceeded expectations in durability and finish. Very grateful for their service!",
  "Smooth booking, zero waiting hassle, and thorough attention to detail. The team at {name} is well-trained, humble, and polite. We are extremely satisfied customers!",
  "They went above and beyond to ensure our satisfaction. Pricing was completely competitive and the {product} delivered was in mint condition. 5 stars all the way!",
  "A well-organized setup where customer comfort is always the highest priority. Genuine quality, transparent rates, and friendly staff. Keep up the phenomenal work!",
  "They took the time to answer all our questions, followed up diligently, and ensured complete peace of mind. Outstanding service and honest dealings throughout {city}!",
  "Flawless execution, fair pricing, and dependable post-delivery assistance. The entire staff treated us with great respect and warmth. Unquestionably 5 stars!",
  "From start to finish, the experience was transparent, fast, and completely genuine. We couldn't be happier with our {product} from {name}. Best in {city}!"
];

// ==================== HINDI (3 DISTINCT FORMAT TIERS) ====================
// Format 1: Short & Punchy (1-2 sentences)
const HI_SHORT_STARTS = [
  "{city} में {product} के लिए {name} सबसे बेस्ट जगह है!",
  "शानदार क्वालिटी और एकदम सही रेट! {name} से {product} लेने का अनुभव बहुत बढ़िया रहा।",
  "लाजवाब सर्विस और फ्रेंडली स्टाफ! {name} में {product} देखकर दिल खुश हो गया।",
  "5 स्टार से कम कुछ नहीं! {name} का काम वाकई में काबिले-तारीफ है।",
  "{name} में {product} की क्वालिटी देखकर मैं बहुत प्रभावित हुआ।",
  "बिना किसी झिझक के 10 में से 10 रेटिंग! {city} में {name} सचमुच नंबर 1 है।",
  "सुपर फास्ट सर्विस और असली {product}! {name} ने दिल जीत लिया।",
  "बेहद संतुष्ट ग्राहक! {name} से {product} लेकर पूरा पैसा वसूल हुआ।",
  "{city} में {product} के लिए सबसे भरोसेमंद दुकान यानी {name}।",
  "ईमानदार लोग और बेहतरीन काम! {name} का अनुभव बहुत सुखद रहा।",
  "समय की पाबंदी और उम्दा काम! {name} में {product} की सर्विस लाजवाब है।",
  "बिल्कुल सही सलाह और उचित दाम! {name} की टीम बहुत ही सहयोगी है।",
  "पहली बार में ही पूरा भरोसा जीत लिया! {name} की सर्विस बहुत अच्छी है।",
  "{city} में ऐसा बेहतरीन व्यवहार और क्वालिटी मिलना बहुत मुश्किल है।",
  "उत्कृष्ट काम और सम्मानजनक सेवा के लिए {name} को पूरे 5 स्टार!"
];

const HI_SHORT_ENDS = [
  "स्टाफ का व्यवहार बहुत ही विनम्र और मददगार है। 10/10!",
  "काम पूरी ईमानदारी और सफाई से किया गया। दिल से 5 स्टार!",
  "सभी को यहां आने की पुरजोर सिफारिश करता हूँ!",
  "पैसे की पूरी कीमत वसूल! बहुत-बहुत धन्यवाद {name} टीम।",
  "भविष्य में भी मैं यहीं आऊंगा। शानदार काम!",
  "पारदर्शी बिलिंग और कोई छिपा हुआ चार्ज नहीं। 5/5 स्टार!",
  "कम समय में बेहतरीन परिणाम। कीप इट अप!",
  "हर किसी को {city} में {name} जरूर विजिट करना चाहिए।",
  "सच्ची सलाह और उच्च स्तर की सेवा के लिए आभार।",
  "बिना किसी संकोच के 100% रिकमेंडेड!",
  "ग्राहक की संतुष्टि ही इनकी पहली प्राथमिकता है।",
  "शानदार अनुभव, पांच सितारा रेटिंग पूरी तरह हकदार!"
];

// Format 2: Medium / Recommendation / Gratitude (2-3 sentences)
const HI_MED_STARTS = [
  "अगर आप {city} में असली और भरोसेमंद {product} खोज रहे हैं, तो {name} सबसे उत्तम विकल्प है।",
  "{name} की पूरी टीम का बहुत-बहुत धन्यवाद! {product} को लेकर इन्होंने जिस धैर्य से मार्गदर्शन किया, वह सराहनीय है।",
  "काफी रिसर्च के बाद मैंने {city} में {name} को चुना और इन्होंने बिल्कुल निराश नहीं किया।",
  "एक दोस्त की सिफारिश पर {name} गया था और {product} की सर्विस देखकर बहुत खुशी हुई।",
  "ईमानदार व्यवहार और सही दाम के लिए {city} में {name} की एक अलग ही पहचान है।",
  "परिवार के साथ {name} विजिट किया था, {product} के लिए इन्होंने बहुत ही अच्छा सपोर्ट दिया।",
  "मार्केट में बहुत से लोग हैं, लेकिन {name} जैसी पारदर्शिता और सफाई कहीं देखने को नहीं मिलती।",
  "{product} से जुड़ी हर छोटी-बड़ी जानकारी {name} की टीम ने बहुत स्पष्टता से समझाई।",
  "शानदार सर्विस और अपनेपन के लिए आभार {name}! {product} की क्वालिटी एकदम परफेक्ट है।",
  "बिना किसी दबाव के सही सलाह देना और असली प्रोडक्ट उपलब्ध कराना इनकी सबसे बड़ी ताकत है।",
  "जितनी तारीफ की जाए कम है! {city} में {name} का काम सचमुच गर्व करने लायक है।",
  "जब भी {city} में किसी को {product} की जरूरत होती है, मैं सिर्फ {name} का ही नाम लेता हूँ।",
  "समय पर काम और ग्राहक के सम्मान का बेहतरीन संतुलन {name} में देखने को मिलता है।",
  "आधुनिक सुविधाएं और बहुत ही शालीन स्टाफ! {name} का अनुभव हमेशा याद रहेगा।",
  "एक संतुष्ट ग्राहक के रूप में मैं {name} की सेवाओं से 100% प्रसन्न हूँ।"
];

const HI_MED_ENDS = [
  "इन्होंने मेरी जरूरत को समझा और बजट में सबसे बढ़िया विकल्प दिया। 5 स्टार दिल से!",
  "स्टाफ बहुत ही अनुशासित और नम्र है। किसी भी काम के लिए बार-बार नहीं कहना पड़ा।",
  "डिलीवरी बिल्कुल समय पर मिली और फिनिशिंग उम्मीद से बेहतर रही। बहुत-बहुत आभार!",
  "क्वालिटी में कोई समझौता नहीं और बिलिंग भी पूरी तरह पारदर्शी। जरूर पधारें!",
  "इनकी विनम्रता और सेवा भाव देखकर दिल खुश हो जाता है। 10/10 अनुभव!",
  "पूरा स्टाफ बहुत ही कोऑपरेटिव है और हर सवाल का तसल्ली से जवाब देता है।",
  "{city} में ऐसा सच्चा और विश्वसनीय प्रतिष्ठान मिलना वाकई सुकून देता है।",
  "काम की बारीकियों पर इनका ध्यान देना ही इन्हें बाकी सबसे अलग और श्रेष्ठ बनाता है।",
  "आफ्टर-सेल्स सर्विस भी उतनी ही त्वरित और मददगार है। बहुत-बहुत धन्यवाद!",
  "हर किसी को मेरी तरफ से {name} की पुरजोर सिफारिश है। 5/5 स्टार्स!",
  "ग्राहकों के प्रति इनका आदर भाव वाकई दिल को छू लेने वाला है।",
  "बिल्कुल झंझट-मुक्त प्रक्रिया और उच्च गुणवत्ता की गारंटी। शानदार टीम!",
  "मूल्यवान मार्गदर्शन और तुरंत सेवा के लिए {name} की पूरी टीम का आभार।",
  "अगर आप शांति और सर्वोत्तम क्वालिटी चाहते हैं, तो {name} ही आपका सही ठिकाना है।",
  "उत्कृष्ट सेवा स्तर बनाए रखने के लिए पूरी टीम को बहुत-बहुत बधाई!"
];

// Format 3: Detailed Story & Complete Experience (3-4 sentences)
const HI_DET_STARTS = [
  "मैं काफी दिनों से {city} में अच्छी क्वालिटी वाले {product} की तलाश में था और आखिरकार {name} पर आकर मेरी तलाश पूरी हुई।",
  "हाल ही में {name} में {product} के सिलसिले में जाना हुआ, और शुरुआत से लेकर अंत तक का अनुभव बहुत ही व्यवस्थित रहा।",
  "अन्य दुकानों के कड़वे अनुभवों के बाद जब मैं {city} में {name} पहुँचा, तो इनका सकारात्मक माहौल देखकर मन को बहुत राहत मिली।",
  "हमने अपने पूरे परिवार के लिए {name} से {product} का काम करवाया और इनका काम देखकर सभी बहुत खुश हुए।",
  "पहली बार {name} की सर्विस ली थी, लेकिन जिस तत्परता से इन्होंने हमारा काम संभाला वह वाकई काबिले-तारीफ है।",
  "इमरजेंसी में हमें {product} की सख्त आवश्यकता थी और {name} ने बिना किसी देरी के तुरंत समाधान उपलब्ध कराया।",
  "मार्केट में कई जगह रेट और क्वालिटी कंपेयर करने के बाद मैंने {name} को चुना और मेरा यह फैसला बिल्कुल सटीक साबित हुआ।",
  "{city} में {name} का नाम काफी सुना था और आज खुद जाकर देखा तो पाया कि इनकी ख्याति 100% सच्ची है।",
  "तकनीकी रूप से {product} के बारे में मुझे ज्यादा जानकारी नहीं थी, पर {name} की टीम ने एक-एक बात बहुत आसान भाषा में समझाई।",
  "{name} में हाइजीन, सिस्टेमेटिक वर्किंग और प्रोफेशनल व्यवहार का स्तर किसी भी बड़े मेट्रो शहर के बराबर है।",
  "जब आप {name} में कदम रखते हैं, तो आपको महसूस होता है कि आप बिल्कुल सही और सुरक्षित हाथों में हैं।",
  "{product} की बुकिंग से लेकर फाइनल डिलीवरी तक हर स्टेप पर इनका फॉलो-अप बहुत ही प्रशंसनीय रहा।",
  "स्थानीय स्तर पर {city} में इतने उच्च मानकों के साथ काम करने वाला संस्थान देखना बहुत सुखद लगता है।",
  "{name} केवल सामान नहीं बेचते, बल्कि ग्राहक के साथ एक मजबूत और सच्चा रिश्ता बनाते हैं।"
];

const HI_DET_ENDS = [
  "स्टाफ ने बिना किसी जल्दबाजी के सभी विकल्पों की तुलना कराई, सही सलाह दी और उचित दाम पर सर्वश्रेष्ठ काम करके दिया। किसी भी प्रकार का कोई छिपा हुआ चार्ज नहीं था। मेरी तरफ से दिल से 5 स्टार रेटिंग!",
  "पूरी टीम बहुत ही विनम्र, प्रशिक्षित और अपने काम में माहिर है। परिसर एकदम साफ-सुथरा है और समय का पालन शत-प्रतिशत किया जाता है। मैं अपने सभी परिचितों को {name} आने की सलाह दूंगा!",
  "समय सीमा से पहले काम पूरा हुआ और {product} की फिनिशिंग इतनी शानदार है कि हर कोई तारीफ कर रहा है। स्टाफ की मीठी बोली ने दिन बना दिया। निश्चित रूप से 10 में से 10 अनुभव!",
  "बिलिंग पूरी तरह से कंप्यूटर आधारित और पारदर्शी रही। इन्होंने हमारा बजट ध्यान में रखते हुए कोई गैर-जरूरी खर्च नहीं होने दिया। ऐसा सच्चा व्यवहार आज बहुत दुर्लभ है। फुल 5 स्टार्स!",
  "व्हाट्सएप और फोन पर तुरंत रिस्पांस मिला और हमारी हर छोटी आवश्यकता का पूरा ख्याल रखा गया। इनका सहयोग सचमुच बहुत सराहनीय है। {city} के सभी निवासियों को अवश्य यहां आना चाहिए!",
  "काम की शुद्धता और मजबूती देखकर साफ पता चलता है कि यह केवल असली क्वालिटी में ही डील करते हैं। स्टाफ का सम्मानजनक दृष्टिकोण बहुत पसंद आया। धन्यवाद {name}!",
  "बिना किसी मोलभाव के एकदम वाजिब दाम और अव्वल दर्जे की सर्विस! किसी भी सवाल का जवाब देने में इन्होंने कभी झल्लाहट नहीं दिखाई। बहुत ही सुखद और संतुष्टिदायक अनुभव!",
  "हर एक कर्मचारी ने बहुत ही जिम्मेदारी से काम किया। डिलीवरी के बाद भी इन्होंने फोन करके संतुष्टि की पुष्टि की। ऐसी आफ्टर-सेल्स सर्विस देखकर बहुत अच्छा लगा!",
  "इन्होंने उम्मीद से कहीं बढ़कर परिणाम दिया। इनके काम में ईमानदारी और लगन साफ झलकती है। {name} को भविष्य के लिए ढेर सारी शुभकामनाएं और पूरे 5 सितारे!",
  "ग्राहक की सहूलियत को सर्वोपरि रखना इनकी सबसे बड़ी विशेषता है। बेहतरीन मार्गदर्शन, सही समय और उच्चतम स्तर की संतुष्टि। कीप अप द एक्सीलेंट वर्क!",
  "आधुनिक उपकरण, पेशेवर माहौल और बहुत ही शालीन टीम। {city} में {product} के लिए इनसे बेहतर कोई और विकल्प हो ही नहीं सकता। फाइव स्टार्स!",
  "शुरुआत से लेकर डिलीवरी तक सब कुछ पारदर्शी और सहज रहा। हमें एक मूल्यवान ग्राहक की तरह महसूस कराया गया। {name} की टीम को बहुत-बहुत साधुवाद!",
  "काम में सफाई, बात में सच्चाई और दाम में पूरी ईमानदारी। आज के दौर में ऐसा अनुभव मिलना किसी वरदान से कम नहीं। 100% रिकमेंडेड!",
  "उत्कृष्ट कार्यप्रणाली, विनम्र स्वभाव और दीर्घकालिक विश्वसनीयता। जब भी जरूरत होगी, हम केवल {name} ही आएंगे। 5/5 स्टार्स!"
];

// ==================== GUJARATI (3 DISTINCT FORMAT TIERS) ====================
// Format 1: Short & Punchy (1-2 sentences)
const GU_SHORT_STARTS = [
  "{city} માં {product} માટે {name} સૌથી ઉત્તમ જગ્યા છે!",
  "અદ્ભુત ક્વોલિટી અને વાજબી ભાવ! {name} ખાતે {product} નો અનુભવ ખૂબ સરસ રહ્યો.",
  "ઝડપી સર્વિસ અને એકદમ નમ્ર સ્ટાફ! {name} નું કામ ખરેખર દિલ જીતી લે તેવું છે.",
  "દિલથી 5 સ્ટાર્સ! {name} ખાતે {product} જોઈને મન પ્રસન્ન થઈ ગયું.",
  "{name} માં {product} ની ક્વોલિટી જોઈને હું ખૂબ પ્રભાવિત થયો છું.",
  "કોઈપણ સંકોચ વગર 10 માંથી 10 રેટીંગ! {city} માં {name} સાચે જ નંબર 1 છે.",
  "સુપર ફાસ્ટ સર્વિસ અને 100% અસલ {product}! ખૂબ ખૂબ આભાર.",
  "સંપૂર્ણ સંતોષકારક ખરીદી! {name} ખાતેથી {product} લઈને પૂરો પૈસા વસૂલ થયો.",
  "{city} માં {product} માટે સૌથી વિશ્વસનીય સરનામું એટલે {name}.",
  "પ્રમાણિક માણસો અને ઉત્તમ પરિણામ! {name} નો અનુભવ અવિસ્મરણીય રહ્યો.",
  "સમયની પાબંદી અને ચોખ્ખું કામ! {name} ની કામગીરી ખૂબ સરાહનીય છે.",
  "સાચું માર્ગદર્શન અને વાજબી દર! {name} ની ટીમ ખરેખર મદદરૂપ છે.",
  "પહેલી જ મુલાકાતમાં પૂરો વિશ્વાસ જીતી લીધો! બહુ જ સરસ સર્વિસ.",
  "{city} માં આટલો સારો વ્યવહાર અને ગુણવત્તા મળવી મુશ્કેલ છે.",
  "ઉમદા સેવા અને આદરપૂર્વક વર્તન માટે {name} ને પૂરેપૂરા 5 સ્ટાર!"
];

const GU_SHORT_ENDS = [
  "સ્ટાફનું વર્તન ખૂબ જ મીઠું, નમ્ર અને મદદરૂપ છે. 10/10!",
  "કામ સંપૂર્ણ પ્રમાણિકતા અને સફાઈ સાથે પૂરું કર્યું. 5 સ્ટાર્સ!",
  "દરેક મિત્રો અને સ્નેહીઓને અહીં આવવાની નમ્ર ભલામણ કરું છું!",
  "એક એક રૂપિયાનું પૂરેપૂરું વળતર! ખૂબ ખૂબ આભાર {name} ટીમ.",
  "ભવિષ્યમાં પણ હું અહીં જ આવીશ. કીપ ઈટ અપ!",
  "પારદર્શક બિલિંગ અને કોઈ છુપા ચાર્જ વગર ચોખ્ખો વ્યવહાર. 5/5!",
  "ઓછા સમયમાં ઉત્કૃષ્ટ પરિણામ આપવા બદલ ધન્યવાદ.",
  "{city} માં દરેક ગ્રાહકે {name} ની અચૂક મુલાકાત લેવી જોઈએ.",
  "સાચી સલાહ અને શ્રેષ્ઠ ગુણવત્તાની ખાતરી. દિલથી આભાર!",
  "જરાય સંકોચ વગર 100% રેકોમેન્ડેડ!",
  "ગ્રાહકનો સંતોષ જ એમની પ્રથમ પ્રાથમિકતા છે.",
  "અદ્ભુત અનુભવ, 5 સ્ટાર રેટીંગને સંપૂર્ણ હકદાર!"
];

// Format 2: Medium / Recommendation / Gratitude (2-3 sentences)
const GU_MED_STARTS = [
  "જો તમે {city} માં સાચું અને ટકાઉ {product} શોધી રહ્યા હોવ, તો {name} સૌથી શ્રેષ્ઠ વિકલ્પ છે.",
  "{name} ની સમગ્ર ટીમનો ખૂબ ખૂબ આભાર! {product} બાબતે એમણે જે ધીરજથી સમજાવ્યું તે પ્રશંસનીય છે.",
  "ઘણી તપાસ કર્યા પછી અમે {name} ની પસંદગી કરી અને એમણે અમને જરાય નિરાશ ન કર્યા.",
  "મારા મિત્રની ભલામણથી હું {name} ગયો હતો અને {product} ની ક્વોલિટી જોઈને ખૂબ આનંદ થયો.",
  "પ્રમાણિક વ્યવહાર અને વ્યાજબી કિંમત માટે {city} માં {name} ની આગવી પ્રતિષ્ઠા છે.",
  "પરિવાર સાથે {name} ની મુલાકાત લીધી હતી, {product} માટે એમણે ખૂબ સુંદર સપોર્ટ આપ્યો.",
  "બજારમાં ઘણા વિકલ્પો છે, પણ {name} જેવી ચોખ્ખાઈ અને પારદર્શિતા ક્યાંય જોવા નથી મળતી.",
  "{product} ને લગતી દરેક નાની-મોટી બાબત {name} ની ટીમે ખૂબ સરળતાથી સ્પષ્ટ કરી.",
  "ઉત્તમ સેવા અને પારિવારિક વાતાવરણ માટે આભાર {name}! {product} ની ક્વોલિટી પરફેક્ટ છે.",
  "ગ્રાહક પર દબાણ કર્યા વિના સાચો માર્ગ બતાવવો એ એમની સૌથી મોટી ખૂબી છે.",
  "જેટલા વખાણ કરીએ તેટલા ઓછા છે! {city} માં {name} નું કામ ખરેખર ગૌરવ લેવા જેવું છે.",
  "જ્યારે પણ કોઈ {city} માં {product} વિશે પૂછે છે, ત્યારે હું ફક્ત {name} નું જ નામ આપું છું.",
  "સમયસર કામ અને ગ્રાહકના સન્માનનો અનોખો સમન્વય {name} માં જોવા મળે છે.",
  "આધુનિક સુવિધા અને સંસ્કારી સ્ટાફ! {name} નો અનુભવ હંમેશા યાદ રહેશે.",
  "એક સંતુષ્ટ ગ્રાહક તરીકે હું {name} ની તમામ સેવાઓથી 100% ખુશ છું."
];

const GU_MED_ENDS = [
  "તેમણે મારી જરૂરિયાત સમજીને બજેટમાં શ્રેષ્ઠ વિકલ્પ આપ્યો. દિલથી 5 સ્ટાર્સ!",
  "સ્ટાફ ખૂબ જ તાલીમબદ્ધ અને વિવેકી છે. કોઈ વાત માટે વારંવાર કહેવું ન પડ્યું.",
  "સમયસર ડિલિવરી મળી અને ફિનિશિંગ અપેક્ષા કરતાં પણ સરસ રહી. ખૂબ આભાર!",
  "ગુણવત્તામાં કોઈ સમાધાન નહીં અને બિલિંગ પણ સંપૂર્ણ ચોખ્ખું. જરૂર મુલાકાત લો!",
  "એમનો મિલનસાર સ્વભાવ જોઈને મન પ્રફુલ્લિત થઈ ગયું. 10/10 અનુભવ!",
  "આખી ટીમ ખૂબ સહકારી છે અને દરેક સવાલનો શાંતિથી સંતોષકારક જવાબ આપે છે.",
  "{city} માં આવો ભરોસાપાત્ર અને સાચો વેપારી મળવો એ સાચે જ રાહતરૂપ છે.",
  "કામની નાની વિગતો પર એમનું લક્ષ્ય જ એમને અન્યો કરતાં આગળ રાખે છે.",
  "વેચાણ પછીની સર્વિસ પણ એટલી જ ત્વરિત અને ઉપયોગી રહી. થેન્ક યુ!",
  "દરેક વ્યક્તિને મારી તરફથી {name} ની દિલથી ભલામણ છે. 5/5 સ્ટાર્સ!",
  "ગ્રાહકો પ્રત્યેનો એમનો આદરભાવ સાચે જ હૃદયસ્પર્શી છે.",
  "જરાય મુશ્કેલી વગર સરળ પ્રક્રિયા અને ઉત્તમ પરિણામ. શાનદાર ટીમ!",
  "સાચું માર્ગદર્શન અને ઝડપી સેવા આપવા બદલ {name} નો ખૂબ ખૂબ આભાર.",
  "જો તમારે શાંતિ અને શ્રેષ્ઠ ગુણવત્તા જોઈતી હોય, તો {name} જ સાચું સ્થળ છે.",
  "આવો ઉત્તમ સેવા દરજ્જો જાળવી રાખવા બદલ સમગ્ર ટીમને અભિનંદન!"
];

// Format 3: Detailed Story & Complete Experience (3-4 sentences)
const GU_DET_STARTS = [
  "હું ઘણા સમયથી {city} માં સારા અને ટકાઉ {product} ની શોધમાં હતો અને અંતે {name} ખાતે મારી શોધ પૂરી થઈ.",
  "તાજેતરમાં {name} ખાતે {product} ના કામે જવાનું થયું, અને શરૂઆતથી અંત સુધીનો અનુભવ ખૂબ વ્યવસ્થિત રહ્યો.",
  "બીજી જગ્યાઓના કડવા અનુભવો પછી જ્યારે હું {name} પહોંચ્યો, ત્યારે એમનું વાતાવરણ જોઈને ઘણી શાંતિ થઈ.",
  "અમે અમારા સમગ્ર પરિવાર માટે {name} ખાતેથી {product} નું કામ કરાવ્યું અને પરિણામ જોઈને બધા ખુશ થઈ ગયા.",
  "પ્રથમ વખત {name} ની સેવા લીધી હતી, પણ જે ઝડપથી એમણે અમારું કામ સંભાળ્યું તે ખરેખર પ્રશંસનીય છે.",
  "અમારે તાત્કાલિક જરૂરિયાતમાં {product} જોઈતું હતું અને {name} એ કોઈપણ વિલંબ વગર ત્વરિત ઉકેલ કરી આપ્યો.",
  "બજારમાં ભાવ અને ક્વોલિટી સરખાવ્યા પછી મેં {name} પસંદ કર્યું અને મારો આ નિર્ણય 100% સાચો સાબિત થયો.",
  "{city} માં {name} ની ઘણી નામના સાંભળી હતી અને રૂબરૂ ગયા પછી ખ્યાલ આવ્યો કે એમની શાખ સાચી છે.",
  "{product} વિશે મને ખાસ ટેકનિકલ જાણકારી નહોતી, પણ {name} ની ટીમે દરેક વિગત સરળ ભાષામાં સમજાવી.",
  "{name} માં સ્વચ્છતા, કામ કરવાની પદ્ધતિ અને પ્રોફેશનલ અભિગમ ખૂબ જ આદર્શ કક્ષાનો છે.",
  "જ્યારે તમે {name} માં પ્રવેશો છો ત્યારે જ તમને અનુભવાય છે કે તમે એકદમ સુરક્ષિત અને સાચા હાથમાં છો.",
  "{product} ના બુકિંગથી લઈને ડિલિવરી સુધી દરેક પગલે એમનો ફોલો-અપ અદ્ભુત રહ્યો.",
  "સ્થાનિક સ્તરે {city} માં આવા ઉચ્ચ ધોરણો સાથે કામ કરતી સંસ્થા જોવી એ ખૂબ ગર્વની વાત છે.",
  "{name} ફક્ત માલસામાન નથી વેચતા, પરંતુ ગ્રાહક સાથે એક કાયમી અને વિશ્વાસપાત્ર સંબંધ બાંધે છે."
];

const GU_DET_ENDS = [
  "સ્ટાફે ઉતાવળ કર્યા વિના તમામ વિકલ્પો સરખાવ્યા, સાચી સલાહ આપી અને વ્યાજબી ભાવે શ્રેષ્ઠ કામ આપ્યું. કોઈ છૂપા ખર્ચા નહોતા. મારી તરફથી પૂરા 5 સ્ટાર!",
  "સમગ્ર ટીમ ખૂબ વિવેકી, સુશિક્ષિત અને પોતાના કામમાં નિષ્ણાત છે. પરિસર સ્વચ્છ છે અને સમયપાલન પૂરેપૂરું છે. હું મારા તમામ સ્નેહીઓને {name} ની ભલામણ કરીશ!",
  "આપેલા સમય પહેલા કામ પૂરું થયું અને {product} નું ફિનિશિંગ એટલું સુંદર છે કે દરેક જણ વખાણ કરે છે. સ્ટાફના મીઠા બોલે દિવસ બનાવી દીધો. 10/10 અનુભવ!",
  "બિલિંગ સંપૂર્ણ કોમ્પ્યુટરાઈઝ્ડ અને પારદર્શક રહ્યું. તેમણે અમારું બજેટ ધ્યાનમાં રાખીને વધારાનો ખર્ચ ન થવા દીધો. આવો સાચો વ્યવહાર આજના યુગમાં દુર્લભ છે!",
  "વોટ્સએપ અને ફોન પર તુરંત રિસ્પોન્સ મળ્યો અને અમારી દરેક નાની પસંદગીનું પૂરું ધ્યાન રખાયું. એમનો સહયોગ સાચે જ પ્રશંસનીય રહ્યો. દરેકને મુલાકાત લેવા વિનંતી!",
  "કામની મજબૂતી જોઈને સાફ ખ્યાલ આવે છે કે તેઓ ફક્ત ઓરિજિનલ ક્વોલિટીમાં જ કામ કરે છે. સ્ટાફનો આદરપૂર્વક દ્રષ્ટિકોણ ખૂબ ગમ્યો. ધન્યવાદ {name}!",
  "કોઈ રકઝક વગર વાજબી ભાવ અને પ્રથમ વર્ગની સર્વિસ! કોઈ પ્રશ્નનો જવાબ આપવામાં એમણે ક્યારેય અણગમો ન દાખવ્યો. ખૂબ જ સંતોષકારક અનુભવ!",
  "દરેક કર્મચારીએ પોતાની પૂરી જવાબદારી નિભાવી. ડિલિવરી પછી પણ એમણે ફોન કરીને સંતોષની ખાતરી કરી. આવી આફ્ટર-સેલ્સ સર્વિસ જોઈને ઘણો આનંદ થયો!",
  "તેમણે ધારેલા કરતાં ઘણું ઉત્કૃષ્ટ પરિણામ આપ્યું. એમના કામમાં પ્રામાણિકતા સાફ દેખાય છે. {name} ને ભવિષ્ય માટે ખૂબ શુભેચ્છાઓ અને પૂરા 5 સિતારા!",
  "ગ્રાહકની સુવિધાને સર્વોપરી રાખવી એ એમની મુખ્ય વિશેષતા છે. સાચું માર્ગદર્શન, નિયત સમય અને ઉત્તમ સંતોષ. કીપ અપ ધ વન્ડરફુલ વર્ક!",
  "આધુનિક સાધનો, વ્યવસાયિક માહોલ અને નમ્ર ટીમ. {city} માં {product} માટે આનાથી સારો બીજો કોઈ વિકલ્પ હોઈ જ ન શકે. ફાઈવ સ્ટાર્સ!",
  "શરૂઆતથી ડિલિવરી સુધી બધું જ પારદર્શક અને સરળ રહ્યું. અમને એક માનવંતા ગ્રાહક તરીકે આવકારવામાં આવ્યા. {name} ની ટીમને ખૂબ ખૂબ અભિનંદન!",
  "કામમાં સફાઈ, વાતમાં સચ્ચાઈ અને ભાવમાં પૂરી પ્રામાણિકતા. આજના સમયમાં આવો અનુભવ મળવો એ મોટી ઉપલબ્ધિ છે. 100% રેકોમેન્ડેડ!",
  "ઉત્કૃષ્ટ કાર્યપદ્ધતિ, વિવેકી સ્વભાવ અને લાંબાગાળાની વિશ્વસનીયતા. જ્યારે પણ જરૂર પડશે, અમે ફક્ત {name} જ આવીશું. 5/5 સ્ટાર્સ!"
];

// Pre-built Tier Pools (Short, Medium, Detailed)
export interface ReviewTierPool {
  short: string[];
  medium: string[];
  detailed: string[];
}

export const REVIEW_TIER_POOLS: Record<LanguageCode, ReviewTierPool> = {
  en: {
    short: buildTierTemplates(EN_SHORT_STARTS, EN_SHORT_ENDS, 180),
    medium: buildTierTemplates(EN_MED_STARTS, EN_MED_ENDS, 225),
    detailed: buildTierTemplates(EN_DET_STARTS, EN_DET_ENDS, 196)
  },
  hi: {
    short: buildTierTemplates(HI_SHORT_STARTS, HI_SHORT_ENDS, 180),
    medium: buildTierTemplates(HI_MED_STARTS, HI_MED_ENDS, 225),
    detailed: buildTierTemplates(HI_DET_STARTS, HI_DET_ENDS, 196)
  },
  gu: {
    short: buildTierTemplates(GU_SHORT_STARTS, GU_SHORT_ENDS, 180),
    medium: buildTierTemplates(GU_MED_STARTS, GU_MED_ENDS, 225),
    detailed: buildTierTemplates(GU_DET_STARTS, GU_DET_ENDS, 196)
  }
};

// Flattened total pool (> 600 templates per language)
export const REVIEW_STRUCTURES: Record<LanguageCode, string[]> = {
  en: [...REVIEW_TIER_POOLS.en.short, ...REVIEW_TIER_POOLS.en.medium, ...REVIEW_TIER_POOLS.en.detailed],
  hi: [...REVIEW_TIER_POOLS.hi.short, ...REVIEW_TIER_POOLS.hi.medium, ...REVIEW_TIER_POOLS.hi.detailed],
  gu: [...REVIEW_TIER_POOLS.gu.short, ...REVIEW_TIER_POOLS.gu.medium, ...REVIEW_TIER_POOLS.gu.detailed]
};

export function pickReviewTemplates(
  lang: LanguageCode = 'en',
  client: Partial<Client> = {},
  selectedProduct: string | null = null,
  excludedReviews: string[] = []
): string[] {
  const catKey = (client.category && INDUSTRY_CATALOG[client.category]) ? client.category : 'general';
  const categoryInfo = INDUSTRY_CATALOG[catKey] || INDUSTRY_CATALOG.general;
  const name = client.name || "Business";
  const city = client.city || "City";

  let productWording = selectedProduct;
  if (!productWording) {
    const rawKeywords = client.keywords ? client.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
    if (rawKeywords.length > 0) {
      productWording = rawKeywords[0];
    } else {
      productWording = categoryInfo.categoryPhrase[lang] || categoryInfo.categoryPhrase.en;
    }
  }

  const pool = REVIEW_TIER_POOLS[lang] || REVIEW_TIER_POOLS.en;
  const normalizeForMatch = (str: string) => str.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  const excludedSet = new Set(excludedReviews.map(normalizeForMatch));

  const filterPool = (templates: string[]) => {
    return templates.filter((t) => {
      if (excludedSet.size === 0) return true;
      const preview = t
        .replace(/{name}/g, name)
        .replace(/{city}/g, city)
        .replace(/{product}/g, productWording || '')
        .replace(/\s+/g, ' ')
        .trim();
      return !excludedSet.has(normalizeForMatch(preview));
    });
  };

  const availableShort = filterPool(pool.short);
  const availableMed = filterPool(pool.medium);
  const availableDet = filterPool(pool.detailed);

  const pickRandom = (arr: string[], fallbackArr: string[]) => {
    const source = arr.length > 0 ? arr : fallbackArr;
    return source[Math.floor(Math.random() * source.length)];
  };

  // Select 3 completely different format archetypes (Short, Medium, Detailed)
  return [
    pickRandom(availableShort, pool.short),
    pickRandom(availableMed, pool.medium),
    pickRandom(availableDet, pool.detailed)
  ];
}

export function renderReviewFromTemplate(
  template: string,
  client: Partial<Client>,
  lang: LanguageCode = 'en',
  selectedProduct: string | null = null
): string {
  const catKey = (client.category && INDUSTRY_CATALOG[client.category]) ? client.category : 'general';
  const categoryInfo = INDUSTRY_CATALOG[catKey] || INDUSTRY_CATALOG.general;
  const name = client.name || "Business";
  const city = client.city || "City";
  const person = client.person_name ? client.person_name.trim() : "";

  let productWording = selectedProduct;
  if (!productWording) {
    const rawKeywords = client.keywords ? client.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
    if (rawKeywords.length > 0) {
      productWording = rawKeywords[0];
    } else {
      productWording = categoryInfo.categoryPhrase[lang] || categoryInfo.categoryPhrase.en;
    }
  }

  let text = template
    .replace(/{name}/g, name)
    .replace(/{city}/g, city)
    .replace(/{product}/g, productWording || '')
    .replace(/\s+/g, ' ')
    .trim();

  if (person) {
    if (lang === 'en' && !text.includes(person)) {
      text = text.replace(/The staff is|The team is|Staff guided me/g, `${person} and the staff were`);
    } else if (lang === 'hi' && !text.includes(person)) {
      text = text.replace(/यहां का स्टाफ|पूरी टीम/g, `${person} और पूरा स्टाफ`);
    } else if (lang === 'gu' && !text.includes(person)) {
      text = text.replace(/સ્ટાફનું|અહીંનો સ્ટાફ/g, `${person} અને સ્ટાફનું`);
    }
  }

  return text;
}

export function generateReviews(
  client: Partial<Client>,
  lang: LanguageCode = 'en',
  selectedProduct: string | null = null,
  excludedReviews: string[] = []
): string[] {
  const templates = pickReviewTemplates(lang, client, selectedProduct, excludedReviews);
  return templates.map((t) => renderReviewFromTemplate(t, client, lang, selectedProduct));
}

export const NEGATIVE_FEEDBACK_STRUCTURES: Record<LanguageCode, string[]> = {
  en: [
    "Experienced excessively long waiting time and delay regarding {product}. Better queue and appointment management is urgently needed.",
    "The guidance and assistance for {product} was not up to expectations. Staff communication and responsiveness need improvement.",
    "Faced confusion regarding billing, pricing, or documentation for {product}. Would appreciate much more transparency and clarity.",
    "Service quality and responsiveness for {product} at {name} was disappointing. Customer concerns should be addressed promptly.",
    "Expected better coordination, cleanliness, and attention to detail during our visit for {product}."
  ],
  hi: [
    "{product} के लिए बहुत लंबा इंतज़ार करना पड़ा और सर्विस में काफी देरी हुई। कृपया वेटिंग टाइम मैनेजमेंट में सुधार करें।",
    "{product} को लेकर स्टाफ का सहयोग और मार्गदर्शन संतोषजनक नहीं रहा। बातचीत और रिस्पांस में सुधार की आवश्यकता है।",
    "{product} के बिलिंग और प्रोसेस में स्पष्टता की कमी महसूस हुई। जैसी उम्मीद थी वैसा अनुभव नहीं मिला।",
    "{name} में {product} की सर्विस क्वालिटी अपेक्षा से कम रही। मैनेजमेंट को कस्टमर केयर पर तुरंत ध्यान देना चाहिए।",
    "{product} को लेकर हमारा अनुभव अच्छा नहीं रहा। कृपया इस शिकायत का संज्ञान लेकर जल्द समाधान करें।"
  ],
  gu: [
    "{product} માટે વેઇટિંગ ટાઈમ ઘણો લાંબો રહ્યો અને સર્વિસમાં વિલંબ થયો. કૃપા કરીને સમય વ્યવસ્થાપન અને સ્ટાફિંગમાં સુધારો કરો.",
    "{product} બાબતે સ્ટાફનો સહયોગ અને સંવાદ સંતોષકારક ન હતો. અમને યોગ્ય માર્ગદર્શન અને ઝડપી રિસ્પોન્સ ન મળ્યો.",
    "{product} ના બિલિંગ અને કિંમત બાબતે પારદર્શિતાનો અભાવ જોવા મળ્યો. જેવી અપેક્ષા હતી તેવો સારો અનુભવ ન રહ્યો.",
    "{name} ખાતે {product} ની સર્વિસ ક્વોલિટી ધાર્યા કરતાં નબળી રહી. ગ્રાહકની મુશ્કેલીઓ પર તાત્કાલિક ધ્યાન આપવું જરૂરી છે.",
    "{product} ને લઈને અમારો અનુભવ સંતોષકારક ન રહ્યો. કૃપા કરીને આ બાબતે યોગ્ય સુધારો કરી તાત્કાલિક નિરાકરણ લાવો."
  ]
};

export function generateNegativeFeedback(
  client: Partial<Client>,
  lang: LanguageCode = 'en',
  selectedProduct: string | null = null
): string[] {
  const catKey = (client.category && INDUSTRY_CATALOG[client.category]) ? client.category : 'general';
  const categoryInfo = INDUSTRY_CATALOG[catKey] || INDUSTRY_CATALOG.general;

  const name = client.name || "Business";
  const city = client.city || "City";

  let productWording = selectedProduct;
  if (!productWording) {
    const rawKeywords = client.keywords ? client.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];
    if (rawKeywords.length > 0) {
      productWording = rawKeywords[0];
    } else {
      productWording = categoryInfo.categoryPhrase[lang] || categoryInfo.categoryPhrase.en;
    }
  }

  const templates = NEGATIVE_FEEDBACK_STRUCTURES[lang] || NEGATIVE_FEEDBACK_STRUCTURES.en;
  const shuffled = [...templates].sort(() => 0.5 - Math.random());

  return shuffled.slice(0, 3).map(template => {
    let text = template
      .replace(/{name}/g, name)
      .replace(/{city}/g, city)
      .replace(/{product}/g, productWording || '')
      .replace(/\s+/g, ' ')
      .trim();

    return text;
  });
}

export function formatGoogleReviewUrl(inputUrlOrPlaceId: string): string {
  if (!inputUrlOrPlaceId) return "https://search.google.com";

  const cleanInput = inputUrlOrPlaceId.trim();

  if (/^ChIJ[A-Za-z0-9_-]+$/.test(cleanInput)) {
    return `https://search.google.com/local/writereview?placeid=${cleanInput}`;
  }

  if (cleanInput.includes("placeid=")) {
    return cleanInput;
  }

  if (cleanInput.includes("/review") || cleanInput.includes("writereview")) {
    return cleanInput;
  }

  if (cleanInput.includes("g.page/") && !cleanInput.endsWith("/review")) {
    return cleanInput.endsWith("/") ? `${cleanInput}review` : `${cleanInput}/review`;
  }

  return cleanInput;
}

export async function copyToClipboardSafe(text: string): Promise<boolean> {
  if (!text || typeof window === 'undefined') return false;

  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback below
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.opacity = '0';
    textArea.setAttribute('readonly', '');
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.warn('Fallback copy failed', err);
    return false;
  }
}

export function formatWhatsAppPhone(phone?: string, fallback: string = '919876543210'): string {
  if (!phone || !phone.trim()) {
    return fallback.replace(/\D/g, '') || '919876543210';
  }
  let cleaned = phone.trim().replace(/\D/g, '');
  if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = cleaned.substring(1);
  }
  // Standard 10-digit mobile number in India: prefix with 91
  if (cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  return cleaned || fallback.replace(/\D/g, '') || '919876543210';
}

export function buildClientReviewUrl(baseUrl: string, client?: Partial<Client> | null): string {
  if (!client) return `${baseUrl.replace(/\/$/, '')}/review`;
  const cleanBase = baseUrl.replace(/\/$/, '');
  const params = new URLSearchParams();
  if (client.id) params.set('id', client.id);
  if (client.name && client.name.trim()) params.set('name', client.name.trim());
  if (client.phone && client.phone.trim()) params.set('phone', formatWhatsAppPhone(client.phone));
  if (client.city && client.city.trim()) params.set('city', client.city.trim());
  if (client.category) params.set('cat', client.category);
  if (client.person_name && client.person_name.trim()) params.set('pn', client.person_name.trim());
  if (client.default_lang) params.set('lang', client.default_lang);
  if (client.google_url && client.google_url.trim()) params.set('g', client.google_url.trim());
  if (client.keywords && client.keywords.trim()) params.set('k', client.keywords.trim());
  if (client.start_date) params.set('sd', client.start_date);
  if (client.expiry_date) params.set('ed', client.expiry_date);
  return `${cleanBase}/review?${params.toString()}`;
}

export function buildClientStandeeUrl(baseUrl: string, client?: Partial<Client> | null): string {
  if (!client) return `${baseUrl.replace(/\/$/, '')}/standee`;
  const cleanBase = baseUrl.replace(/\/$/, '');
  const params = new URLSearchParams();
  if (client.id) params.set('id', client.id);
  if (client.name && client.name.trim()) params.set('name', client.name.trim());
  if (client.phone && client.phone.trim()) params.set('phone', formatWhatsAppPhone(client.phone));
  if (client.city && client.city.trim()) params.set('city', client.city.trim());
  if (client.category) params.set('cat', client.category);
  if (client.person_name && client.person_name.trim()) params.set('pn', client.person_name.trim());
  if (client.default_lang) params.set('lang', client.default_lang);
  if (client.google_url && client.google_url.trim()) params.set('g', client.google_url.trim());
  if (client.keywords && client.keywords.trim()) params.set('k', client.keywords.trim());
  if (client.start_date) params.set('sd', client.start_date);
  if (client.expiry_date) params.set('ed', client.expiry_date);
  return `${cleanBase}/standee?${params.toString()}`;
}

export function encodeClientData(client: Partial<Client>): string {
  try {
    const jsonStr = JSON.stringify(client);
    if (typeof window !== 'undefined') {
      return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    }
    return Buffer.from(jsonStr).toString('base64');
  } catch (e) {
    console.error("Encoding failed", e);
    return "";
  }
}

export function decodeClientData(hashOrParam: string): Client | null {
  try {
    if (typeof window !== 'undefined') {
      const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(hashOrParam))));
      return JSON.parse(jsonStr);
    }
    const jsonStr = Buffer.from(decodeURIComponent(hashOrParam), 'base64').toString('utf-8');
    return JSON.parse(jsonStr);
  } catch (e) {
    console.error("Decoding failed", e);
    return null;
  }
}

export function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    return new Date(y, m, d);
  }
  return new Date(dateStr);
}

export function getTodayLocalDate(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getTodayDateString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isClientUpcoming(client?: Partial<Client> | null): boolean {
  if (!client || !client.start_date) return false;
  const today = getTodayLocalDate();
  const start = parseLocalDate(client.start_date);
  return today.getTime() < start.getTime();
}

export function isClientExpired(client?: Partial<Client> | null): boolean {
  if (!client || !client.expiry_date) return false;
  const today = getTodayLocalDate();
  const exp = parseLocalDate(client.expiry_date);
  return today.getTime() > exp.getTime();
}

export function isClientActive(client?: Partial<Client> | null): boolean {
  if (!client) return false;
  return !isClientUpcoming(client) && !isClientExpired(client);
}

export function getClientAccessStatus(client?: Partial<Client> | null): 'active' | 'upcoming' | 'expired' {
  if (isClientUpcoming(client)) return 'upcoming';
  if (isClientExpired(client)) return 'expired';
  return 'active';
}

export function getClientDaysLeft(expiryDate?: string): number {
  if (!expiryDate) return 365;
  const today = getTodayLocalDate();
  const exp = parseLocalDate(expiryDate);
  const diffTime = exp.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDaysUntilStart(startDate?: string): number {
  if (!startDate) return 0;
  const today = getTodayLocalDate();
  const start = parseLocalDate(startDate);
  const diffTime = start.getTime() - today.getTime();
  return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "Not set";
  const d = parseLocalDate(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function formatExpiryDate(expiryDate?: string): string {
  if (!expiryDate) return "Lifetime / Unlimited";
  return formatDate(expiryDate);
}

export function formatDateRange(startDate?: string, endDate?: string): string {
  if (startDate && endDate) {
    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  }
  if (startDate) return `From ${formatDate(startDate)}`;
  if (endDate) return `Till ${formatDate(endDate)}`;
  return "Unlimited / Ongoing";
}

export function getDefaultExpiryDate(monthsToAdd: number = 3): string {
  const d = new Date();
  d.setMonth(d.getMonth() + monthsToAdd);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'client_1',
    name: 'SmartXCRM Surgical & Hospital Equipment',
    person_name: 'Mr. Darpan Patel (Director)',
    category: 'surgical_medical',
    city: 'Ahmedabad',
    google_url: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    phone: '919876543210',
    keywords: 'Hospital Bed, Mobility Solutions, Oxygen Concentrator, Walker, Walker / Walking Stick',
    default_lang: 'gu',
    createdAt: new Date().toISOString(),
    start_date: '2026-10-01',
    expiry_date: '2027-10-26'
  },
  {
    id: 'client_2',
    name: 'Lifeline Multi-Speciality Hospital & Trauma Care',
    person_name: 'Dr. Keyur Patel (MS Orthopedic)',
    category: 'healthcare',
    city: 'Surat',
    google_url: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    phone: '919876543211',
    keywords: 'Emergency Care, Orthopedic Surgery, ICU Facility, Cashless Mediclaim',
    default_lang: 'gu',
    createdAt: new Date().toISOString(),
    start_date: '2026-10-15',
    expiry_date: '2027-04-26'
  },
  {
    id: 'client_3',
    name: 'Smile Craft Dental & Implant Clinic',
    person_name: 'Dr. Sneha Sharma (BDS, Implantologist)',
    category: 'healthcare',
    city: 'Vadodara',
    google_url: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    phone: '919876543212',
    keywords: 'Painless Root Canal, Teeth Cleaning, Dental Implants, Invisible Aligners',
    default_lang: 'hi',
    createdAt: new Date().toISOString(),
    start_date: '2026-10-20',
    expiry_date: '2027-01-26'
  },
  {
    id: 'client_4',
    name: 'Royal Rajwadi Thali & Family Dining',
    person_name: 'Chef Harshvardhan Singh',
    category: 'restaurant',
    city: 'Rajkot',
    google_url: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    phone: '919876543213',
    keywords: 'Authentic Gujarati Thali, Family Dining, Fast Service, Delicious Desserts',
    default_lang: 'gu',
    createdAt: new Date().toISOString(),
    start_date: '2026-10-01',
    expiry_date: '2027-06-26'
  },
  {
    id: 'client_5',
    name: 'Shivam Ayurvedic & Panchakarma Clinic',
    person_name: 'Vaidya Hitesh Dave (BAMS)',
    category: 'healthcare',
    city: 'Ahmedabad',
    google_url: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    phone: '919876543214',
    keywords: 'Panchakarma Therapy, Joint Pain Relief, Herbal Medicine, Stress Relief',
    default_lang: 'gu',
    createdAt: new Date().toISOString(),
    start_date: '2026-05-01',
    expiry_date: '2026-09-15'
  },
  {
    id: 'client_6',
    name: 'Elite Fitness & Crossfit Studio',
    person_name: 'Coach Vikram Rathod',
    category: 'fitness',
    city: 'Ahmedabad',
    google_url: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    phone: '919876543215',
    keywords: 'Personal Training, Crossfit, Weight Loss, Modern Equipment',
    default_lang: 'en',
    createdAt: new Date().toISOString(),
    start_date: '2026-12-01',
    expiry_date: '2027-12-01'
  }
];
