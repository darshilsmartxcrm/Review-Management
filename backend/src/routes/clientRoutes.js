const express = require('express');
const router = express.Router();
const {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
} = require('../controllers/clientController');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Public endpoints (used by review funnels, standee page, and list views)
router.get('/', getClients);
router.get('/:id', getClientById);

// Admin-protected endpoints (JWT Authentication required)
// optionalAuth allows seamless transition while frontend is being wired, but honors Bearer tokens
router.post('/', optionalAuth, createClient);
router.put('/:id', authenticate, updateClient);
router.delete('/:id', authenticate, deleteClient);

module.exports = router;
