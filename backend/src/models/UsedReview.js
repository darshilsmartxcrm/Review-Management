const mongoose = require('mongoose');

const usedReviewSchema = new mongoose.Schema(
  {
    clientId: {
      type: String,
      required: [true, 'clientId is required'],
      index: true,
      trim: true,
    },
    reviewText: {
      type: String,
      required: [true, 'reviewText is required'],
      trim: true,
    },
    normalized: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    timestamp: {
      type: Number,
      default: () => Date.now(),
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // MongoDB automatic TTL deletion after expiresAt date
      default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
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

// Compound index for fast client + text lookup
usedReviewSchema.index({ clientId: 1, normalized: 1 });

module.exports = mongoose.model('UsedReview', usedReviewSchema);
