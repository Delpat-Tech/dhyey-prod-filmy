const express = require('express');
const authController = require('./../controllers/authController');

const router = express.Router();

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

// Email verification
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/resend-verification', authController.protect, authController.resendVerification);

// Password reset
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
router.patch('/update-password', authController.protect, authController.updatePassword);
router.patch('/change-password', authController.protect, authController.updatePassword);

// OAuth routes (to be implemented)
router.get('/google', (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'Google OAuth not implemented yet'
  });
});

router.get('/facebook', (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'Facebook OAuth not implemented yet'
  });
});

router.get('/twitter', (req, res) => {
  res.status(501).json({
    status: 'error',
    message: 'Twitter OAuth not implemented yet'
  });
});

module.exports = router;
