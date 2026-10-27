const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
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
      required: [true, 'Category name is required'],
      trim: true,
    },
    icon: {
      type: String,
      default: '🏷️',
      trim: true,
    },
    categoryPhrase: {
      en: { type: String, default: 'services & quality' },
      hi: { type: String, default: 'सेवाएं और गुणवत्ता' },
      gu: { type: String, default: 'સેવાઓ અને ગુણવત્તા' },
    },
    defaultProducts: {
      type: [String],
      default: [],
    },
    isSystem: {
      type: Boolean,
      default: false,
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

// Pre-validate hook to generate id/slug from name if not provided
categorySchema.pre('validate', function (next) {
  if (!this.id && this.name) {
    this.id = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '') || `cat_${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
