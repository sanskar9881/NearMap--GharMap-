const express = require('express');
const router = express.Router();

// Connections endpoints
router.get('/mine', (req, res) => {
  res.json({ connections: [] });
});

router.post('/request', (req, res) => {
  res.json({ success: true, connection: {} });
});

module.exports = router;
