const jwt = require('jsonwebtoken');

const getSecret = () => process.env.JWT_SECRET || 'super_secret_jwt_key_smartxcrm_2026_review_hub';
const getExpiresIn = () => process.env.JWT_EXPIRES_IN || '30d';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User document or payload object
 * @returns {String} JWT token
 */
const generateToken = (user) => {
  const payload = {
    id: user._id || user.id,
    username: user.username,
    role: user.role || 'admin',
  };

  return jwt.sign(payload, getSecret(), {
    expiresIn: getExpiresIn(),
  });
};

/**
 * Verify a JWT token
 * @param {String} token
 * @returns {Object} Decoded payload
 */
const verifyToken = (token) => {
  return jwt.verify(token, getSecret());
};

module.exports = {
  generateToken,
  verifyToken,
};
