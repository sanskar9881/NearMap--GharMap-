const express = require('express');
const router = express.Router();

// Zones endpoints
router.get('/', (req, res) => {
  res.json({ zones: [] });
});

module.exports = router;
