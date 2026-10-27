const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'master_agency_settings',
      unique: true,
    },
    agencyPhone: {
      type: String,
      trim: true,
      default: '919876543210',
    },
    agencyName: {
      type: String,
      trim: true,
      default: 'SmartXCRM Review Hub',
    },
    supportEmail: {
      type: String,
      trim: true,
      default: '',
    },
    reviewLockHours: {
      type: Number,
      default: 24,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

settingSchema.statics.getSingleton = async function () {
  let doc = await this.findOne({ key: 'master_agency_settings' });
  if (!doc) {
    doc = await this.create({ key: 'master_agency_settings' });
  }
  return doc;
};

module.exports = mongoose.model('Setting', settingSchema);
