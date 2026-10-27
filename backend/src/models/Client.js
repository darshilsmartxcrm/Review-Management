const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Business/Client name is required'],
      trim: true,
    },
    person_name: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'surgical_medical',
        'healthcare',
        'restaurant',
        'salon',
        'automobile',
        'electronics',
        'realestate',
        'fashion',
        'fitness',
        'education',
        'furniture',
        'legal_finance',
        'general',
      ],
      default: 'surgical_medical',
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    google_url: {
      type: String,
      required: [true, 'Google Review URL is required'],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    keywords: {
      type: String,
      trim: true,
      default: '',
    },
    default_lang: {
      type: String,
      enum: ['en', 'hi', 'gu'],
      default: 'gu',
    },
    start_date: {
      type: String, // Format: YYYY-MM-DD
      default: () => new Date().toISOString().split('T')[0],
    },
    expiry_date: {
      type: String, // Format: YYYY-MM-DD
      default: () => {
        const d = new Date();
        d.setFullYear(d.getFullYear() + 1);
        return d.toISOString().split('T')[0];
      },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Pre-validate hook to generate id if not provided
clientSchema.pre('validate', function (next) {
  if (!this.id) {
    this.id = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  }
  next();
});

module.exports = mongoose.model('Client', clientSchema);
