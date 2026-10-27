const express = require('express');
const router = express.Router();
const { getUsedReviews, markReviewUsed } = require('../controllers/reviewController');

router.get('/', getUsedReviews);
router.post('/', markReviewUsed);

module.exports = router;
