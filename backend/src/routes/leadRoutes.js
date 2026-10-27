const express = require('express');
const router = express.Router();
const {
  createLead,
  getLeads,
  deleteLead,
  updateLeadStatus,
} = require('../controllers/leadController');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Public endpoint for submitting inquiry form
router.post('/', createLead);

// Protected endpoints for admin dashboard (Requires JWT token)
// optionalAuth allows both authenticated dashboard calls and initial transition
router.get('/', optionalAuth, getLeads);
router.delete('/:id', authenticate, deleteLead);
router.put('/:id/status', authenticate, updateLeadStatus);

module.exports = router;
