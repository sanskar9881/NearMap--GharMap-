const express = require('express');
const router = express.Router();

// Payments endpoints
router.post('/create-order', (req, res) => {
  res.json({ success: true, orderId: 'order_123' });
});

router.post('/verify', (req, res) => {
  res.json({ success: true });
});

module.exports = router;
