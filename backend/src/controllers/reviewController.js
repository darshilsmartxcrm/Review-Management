const UsedReview = require('../models/UsedReview');

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
}

/**
 * @route   GET /api/reviews
 * @desc    Get active used reviews (within 24 hours) for a client
 * @access  Public
 */
const getUsedReviews = async (req, res, next) => {
  try {
    const { clientId } = req.query;

    const now = new Date();

    if (clientId) {
      // Find active used reviews for this client where expiresAt > now
      const activeEntries = await UsedReview.find({
        clientId,
        expiresAt: { $gt: now },
      }).sort({ createdAt: -1 });

      const usedReviews = activeEntries.map((e) => e.reviewText);

      return res.json({
        success: true,
        clientId,
        usedReviews,
        count: usedReviews.length,
      });
    }

    const allActive = await UsedReview.find({ expiresAt: { $gt: now } }).sort({ createdAt: -1 });

    return res.json({
      success: true,
      totalActive: allActive.length,
      entries: allActive,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   POST /api/reviews
 * @desc    Lock a review for 24 hours across all devices/users
 * @access  Public
 */
const markReviewUsed = async (req, res, next) => {
  try {
    const { clientId, reviewText } = req.body;

    if (!clientId || !reviewText || typeof reviewText !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'clientId and reviewText are required',
      });
    }

    const trimmed = reviewText.trim();
    const normalized = normalizeText(trimmed);
    const now = Date.now();
    const expiresAt = new Date(now + TWENTY_FOUR_HOURS_MS);

    // Upsert to refresh lock time if duplicate is submitted
    const entry = await UsedReview.findOneAndUpdate(
      { clientId, normalized },
      {
        clientId,
        reviewText: trimmed,
        normalized,
        timestamp: now,
        expiresAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.status(201).json({
      success: true,
      message: 'Review locked across all users for 24 hours',
      lockedUntil: expiresAt.getTime(),
      entry: {
        clientId: entry.clientId,
        reviewText: entry.reviewText,
        normalized: entry.normalized,
        timestamp: entry.timestamp,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsedReviews,
  markReviewUsed,
};
