const express = require('express');
const router = express.Router();

// Chat endpoints
router.get('/chats', (req, res) => {
  res.json({ chats: [] });
});

router.post('/:id/messages', (req, res) => {
  res.json({ success: true, message: {} });
});

module.exports = router;
