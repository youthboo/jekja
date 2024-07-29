// routes/alerts.js
const express = require('express');
const router = express.Router();
const { URLSearchParams } = require('url');
const fetch = require('node-fetch'); // Import node-fetch

// POST route for sending alerts to LINE Notify
router.post('/send-alert', async (req, res) => {
  try {
    const { message } = req.body;
    const lineNotifyToken = process.env.LINE_NOTIFY_TOKEN;
    const lineNotifyUrl = 'https://notify-api.line.me/api/notify';

    const response = await fetch(lineNotifyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${lineNotifyToken}`,
      },
      body: new URLSearchParams({ message }),
    });

    if (!response.ok) {
      throw new Error('Failed to send alert');
    }

    const result = await response.json();
    console.log('Alert sent:', result);
    res.status(200).json(result);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
