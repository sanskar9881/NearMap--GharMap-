const express = require('express');
const router = express.Router();

// Listings endpoints
router.get('/', (req, res) => {
  res.json({ listings: [] });
});

router.post('/', (req, res) => {
  res.json({ success: true, listing: {} });
});

module.exports = router;
