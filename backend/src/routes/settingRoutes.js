const express = require('express');
const router = express.Router();
const { getSettings, updateSettings } = require('../controllers/settingController');
const { optionalAuth } = require('../middleware/auth');

// Public settings read endpoint
router.get('/', getSettings);

// Settings update endpoint
router.post('/', optionalAuth, updateSettings);
router.put('/', optionalAuth, updateSettings);

module.exports = router;
