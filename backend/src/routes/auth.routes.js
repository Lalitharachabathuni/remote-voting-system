const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/demo-login', authController.demoLogin);
router.get('/me', requireAuth, authController.getMe);
router.post('/logout', requireAuth, authController.logout);

module.exports = router;
