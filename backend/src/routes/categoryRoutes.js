const express = require('express');
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { authenticate, optionalAuth } = require('../middleware/auth');

// Public endpoints (used by ClientModal, Review Funnel, Admin Filter)
router.get('/', getCategories);
router.get('/:id', getCategoryById);

// Admin endpoints
router.post('/', optionalAuth, createCategory);
router.put('/:id', optionalAuth, updateCategory);
router.delete('/:id', optionalAuth, deleteCategory);

module.exports = router;
