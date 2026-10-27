const Category = require('../models/Category');
const Client = require('../models/Client');

// Initial default categories for seamless bootstrap
const DEFAULT_CATEGORIES = [
  {
    id: 'surgical_medical',
    name: 'Surgical & Medical Equipment Store',
    icon: '🏥',
    categoryPhrase: {
      en: 'medical & surgical equipment',
      hi: 'सर्जिकल और मेडिकल इक्विपमेंट',
      gu: 'સર્જિકલ અને મેડિકલ સાધનો',
    },
    defaultProducts: [
      'Wheelchair',
      'Hospital Bed',
      'Mobility Solutions',
      'Oxygen Concentrator',
      'Walker / Walking Stick',
      'BP Monitor',
      'Nebulizer Machine',
      'Commode Chair',
      'Orthopedic Supports & Belts',
      'Pulse Oximeter',
      'Air Mattress',
      'Surgical Gloves & Disposables',
    ],
    isSystem: true,
  },
  {
    id: 'healthcare',
    name: 'Dental, Clinic & Doctor',
    icon: '🦷',
    categoryPhrase: {
      en: 'dental & healthcare services',
      hi: 'डेंटल और चिकित्सा सेवा',
      gu: 'દાંત અને આરોગ્ય સારવાર',
    },
    defaultProducts: [
      'Painless Root Canal',
      'Teeth Cleaning & Scaling',
      'Dental Implants',
      'Braces & Invisible Aligners',
      'Teeth Whitening',
      'Child Dental Care',
      'General Consultation',
      'Physiotherapy',
    ],
    isSystem: true,
  },
  {
    id: 'restaurant',
    name: 'Restaurant, Cafe & Food',
    icon: '🍽️',
    categoryPhrase: {
      en: 'dining experience & food',
      hi: 'स्वादिष्ट भोजन और डाइनिंग',
      gu: 'સ્વાદિષ્ટ ભોજન અને ડાઇનિંગ',
    },
    defaultProducts: [
      'Authentic Gujarati Thali',
      'Sizzlers & Starters',
      'Paneer Tikka & Curries',
      'Wood-fired Pizza',
      'Mocktails & Shakes',
      'Cold Coffee & Desserts',
      'Live Chaat & Snacks',
      'Buffet Dinner',
    ],
    isSystem: true,
  },
  {
    id: 'fitness',
    name: 'Gym, Yoga & Fitness Studio',
    icon: '🏋️',
    categoryPhrase: {
      en: 'fitness training & workout environment',
      hi: 'फिटनेस ट्रेनिंग और वर्कआउट माहौल',
      gu: 'ફિટનેસ ટ્રેનિંગ અને કસરત વાતાવરણ',
    },
    defaultProducts: [
      'Personal Training Program',
      'Strength & Cardio Equipment',
      'Weight Loss Program',
      'Yoga & Flexibility Sessions',
      'CrossFit & HIIT',
      'Zumba & Aerobics',
      'Diet & Nutrition Guidance',
      'Locker & Steam Facility',
    ],
    isSystem: true,
  },
  {
    id: 'salon_spa',
    name: 'Salon, Spa & Beauty Parlour',
    icon: '💇',
    categoryPhrase: {
      en: 'salon grooming & spa pampering',
      hi: 'सैलून ग्रूमिंग और स्पा अनुभव',
      gu: 'સલૂન ગ્રીમિંગ અને સ્પા અનુભવ',
    },
    defaultProducts: [
      'Hair Styling & Keratin Treatment',
      'Bridal & Groom Makeup',
      'Hydra Facial & Skin Glow',
      'Beard Styling & Shave',
      'Pedicure & Manicure',
      'Hair Spa & Scalp Therapy',
      'Body Polishing & Massage',
    ],
    isSystem: true,
  },
  {
    id: 'automotive',
    name: 'Car / Bike Showroom & Service Garage',
    icon: '🚗',
    categoryPhrase: {
      en: 'vehicle servicing & automotive support',
      hi: 'गाड़ी सर्विसिंग और ऑटोमोबाइल सपोर्ट',
      gu: 'વાહન સર્વિસિંગ અને ઓટોમોબાઇલ સપોર્ટ',
    },
    defaultProducts: [
      'Periodic Car Maintenance',
      'Wheel Alignment & Balancing',
      'AC Servicing & Gas Refill',
      'Dent Removal & Paint Polish',
      'Engine Diagnostic & Oil Change',
      'Teflon / Ceramic Coating',
      'Emergency Breakdown Support',
    ],
    isSystem: true,
  },
  {
    id: 'real_estate',
    name: 'Real Estate Agent & Builder',
    icon: '🏢',
    categoryPhrase: {
      en: 'property guidance & real estate dealing',
      hi: 'प्रॉपर्टी गाइडेंस और रियल एस्टेट डीलिंग',
      gu: 'પ્રોપર્ટી માર્ગદર્શન અને રિયલ એસ્ટેટ ડીલિંગ',
    },
    defaultProducts: [
      '2BHK / 3BHK Luxury Flats',
      'Commercial Shops & Showrooms',
      'Industrial Plots & Sheds',
      'Weekend Villas & Farmhouses',
      'Rental & Leasing Services',
      'Home Loan & Legal Documentation',
      'Investment Advisory',
    ],
    isSystem: true,
  },
  {
    id: 'retail_jewellery',
    name: 'Jewellery, Clothing & Retail Showroom',
    icon: '💎',
    categoryPhrase: {
      en: 'shopping collection & customer service',
      hi: 'शॉपिंग कलेक्शन और कस्टमर सर्विस',
      gu: 'શોપિંગ કલેક્શન અને ગ્રાહક સેવા',
    },
    defaultProducts: [
      'Hallmarked Gold Jewellery',
      'Real Diamond Rings & Necklaces',
      'Bridal Sarees & Lehengas',
      'Designer Kurta & Sherwani',
      'Silver Gift Articles',
      'Custom Design Making',
    ],
    isSystem: true,
  },
  {
    id: 'legal_ca',
    name: 'CA, Lawyer & Financial Consultant',
    icon: '⚖️',
    categoryPhrase: {
      en: 'financial advisory & legal consultancy',
      hi: 'वित्तीय सलाह और कानूनी परामर्श',
      gu: 'નાણાકીય સલાહ અને કાનૂની માર્ગદર્શન',
    },
    defaultProducts: [
      'Income Tax & GST Filing',
      'Company & LLP Registration',
      'Auditing & Balance Sheet',
      'Trademark & Patent Filing',
      'Civil & Commercial Litigation',
      'Mutual Funds & Wealth Advisory',
    ],
    isSystem: true,
  },
  {
    id: 'education',
    name: 'Coaching Classes, School & Academy',
    icon: '🎓',
    categoryPhrase: {
      en: 'teaching quality & academic mentoring',
      hi: 'शिक्षा की गुणवत्ता और मार्गदर्शन',
      gu: 'શિક્ષણ ગુણવત્તા અને માર્ગદર્શન',
    },
    defaultProducts: [
      'Class 10 & 12 Board Coaching',
      'JEE / NEET Entrance Prep',
      'IELTS / PTE / Spoken English',
      'Coding & Computer Courses',
      'Experienced Faculty',
      'Weekly Doubt Sessions & Tests',
    ],
    isSystem: true,
  },
  {
    id: 'hospitality',
    name: 'Hotel, Resort & Banquet Hall',
    icon: '🏨',
    categoryPhrase: {
      en: 'stay hospitality & banquet amenities',
      hi: 'हॉस्पिटैलिटी और बैंक्वेट सुविधाएं',
      gu: 'હોસ્પિટાલીટી અને બેન્ક્વેટ સુવિધાઓ',
    },
    defaultProducts: [
      'Deluxe & Executive AC Rooms',
      'Grand AC Banquet Hall',
      'Wedding Lawn & Catering',
      '24/7 Room Service & Dining',
      'Free High-Speed Wi-Fi',
      'Ample Car Parking & Valet',
    ],
    isSystem: true,
  },
  {
    id: 'technology',
    name: 'IT Services, Software & Web Agency',
    icon: '💻',
    categoryPhrase: {
      en: 'software development & digital delivery',
      hi: 'सॉफ्टवेयर डेवलपमेंट और डिजिटल डिलीवरी',
      gu: 'સોફ્ટવેર ડેવલપમેન્ટ અને ડિજિટલ ડિલિવરી',
    },
    defaultProducts: [
      'Responsive Website Development',
      'Custom ERP & CRM Solutions',
      'Android & iOS Mobile Apps',
      'SEO & Google Maps Ranking',
      'Social Media Marketing',
      'Fast Cloud Hosting & Support',
    ],
    isSystem: true,
  },
  {
    id: 'general',
    name: 'General Business / Professional Store',
    icon: '⭐',
    categoryPhrase: {
      en: 'customer service & premium quality',
      hi: 'कस्टमर सर्विस और बेहतरीन क्वालिटी',
      gu: 'ગ્રાહક સેવા અને શ્રેષ્ઠ ગુણવત્તા',
    },
    defaultProducts: [
      'Prompt Customer Support',
      'Affordable & Transparent Pricing',
      'Fast Turnaround Time',
      'Honest & Professional Approach',
      'Wide Variety of Options',
    ],
    isSystem: true,
  },
];

// Helper to auto-seed default categories if database has none
async function ensureDefaultCategories() {
  const count = await Category.countDocuments();
  if (count === 0) {
    await Category.insertMany(DEFAULT_CATEGORIES);
    console.log('🌱 Seeded default categories into MongoDB.');
  }
}

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    await ensureDefaultCategories();
    const categories = await Category.find().sort({ createdAt: 1 });
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single category by id
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({
        success: false,
        error: `Category with ID "${req.params.id}" not found`,
      });
    }
    res.json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new category in Category Master
// @route   POST /api/categories
// @access  Private (Admin)
exports.createCategory = async (req, res, next) => {
  try {
    let { id, name, icon, categoryPhrase, defaultProducts } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Category name is required',
      });
    }

    if (!id || !id.trim()) {
      id = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '');
    } else {
      id = id
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9_]+/g, '_');
    }

    // Check duplicate
    const existing = await Category.findOne({ id });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: `Category ID "${id}" or name already exists`,
      });
    }

    // Format products
    if (typeof defaultProducts === 'string') {
      defaultProducts = defaultProducts
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
    } else if (!Array.isArray(defaultProducts)) {
      defaultProducts = [];
    }

    // Format category phrases
    const phrases = {
      en: (categoryPhrase && categoryPhrase.en) || `${name.toLowerCase()} services`,
      hi: (categoryPhrase && categoryPhrase.hi) || `${name} सेवाएं`,
      gu: (categoryPhrase && categoryPhrase.gu) || `${name} સેવાઓ`,
    };

    const newCategory = await Category.create({
      id,
      name: name.trim(),
      icon: (icon && icon.trim()) || '🏷️',
      categoryPhrase: phrases,
      defaultProducts,
      isSystem: false,
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully in Master',
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update category in Category Master
// @route   PUT /api/categories/:id
// @access  Private (Admin)
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, icon, categoryPhrase, defaultProducts } = req.body;
    const category = await Category.findOne({ id: req.params.id });

    if (!category) {
      return res.status(404).json({
        success: false,
        error: `Category with ID "${req.params.id}" not found`,
      });
    }

    if (name) category.name = name.trim();
    if (icon) category.icon = icon.trim();
    if (categoryPhrase) {
      category.categoryPhrase = {
        en: categoryPhrase.en || category.categoryPhrase.en,
        hi: categoryPhrase.hi || category.categoryPhrase.hi,
        gu: categoryPhrase.gu || category.categoryPhrase.gu,
      };
    }
    if (defaultProducts !== undefined) {
      if (typeof defaultProducts === 'string') {
        category.defaultProducts = defaultProducts
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean);
      } else if (Array.isArray(defaultProducts)) {
        category.defaultProducts = defaultProducts;
      }
    }

    await category.save();

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete category from Category Master
// @route   DELETE /api/categories/:id
// @access  Private (Admin)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({
        success: false,
        error: `Category with ID "${req.params.id}" not found`,
      });
    }

    // If any clients are using this category, safely fallback their category to 'general'
    const clientCount = await Client.countDocuments({ category: category.id });
    if (clientCount > 0) {
      await Client.updateMany(
        { category: category.id },
        { $set: { category: 'general' } }
      );
    }

    await Category.deleteOne({ id: req.params.id });

    res.json({
      success: true,
      message: `Category "${category.name}" removed successfully${clientCount > 0 ? ` (${clientCount} client(s) updated to General)` : ''}`,
      reassignedClientsCount: clientCount,
    });
  } catch (error) {
    next(error);
  }
};

exports.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;
