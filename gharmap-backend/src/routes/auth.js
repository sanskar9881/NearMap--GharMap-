const express = require('express');
const router = express.Router();

// OTP endpoints
router.post('/send-otp', (req, res) => {
  res.json({ success: true, message: 'OTP sent' });
});

router.post('/verify-otp', (req, res) => {
  res.json({ token: 'sample_token', user: { id: '1', name: 'User' }, isNewUser: false });
});

module.exports = router;
