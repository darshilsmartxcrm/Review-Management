const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
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
      required: [true, 'Contact person name is required'],
      trim: true,
    },
    business: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: '',
    },
    industry: {
      type: String,
      trim: true,
      default: 'General',
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    date: {
      type: String,
      default: () =>
        new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'converted', 'closed'],
      default: 'new',
    },
    notes: {
      type: String,
      default: '',
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

leadSchema.pre('validate', function (next) {
  if (!this.id) {
    this.id = `lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  }
  next();
});

module.exports = mongoose.model('Lead', leadSchema);
