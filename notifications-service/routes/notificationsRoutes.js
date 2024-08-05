// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { sendNotificationToRole } = require('../websocket');

// Endpoint to send notifications based on role
router.post('/notify', async (req, res) => {
  try {
    const { role, message } = req.body;

    if (!role || !message) {
      return res.status(400).send('Role and message must be provided.');
    }

    await sendNotificationToRole(role, message);

    res.status(200).send('Notifications sent successfully.');
  } catch (error) {
    res.status(500).send('Error sending notifications.');
  }
});

// routes/notificationRoutes.js
router.post('/notifySuperadmins', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received notification request with message:', message);
        await sendNotificationToRole('superadmin', message);
        console.log('Notification sent to Superadmins');
        res.status(200).json({ success: true, message: 'Notification sent' });
      } catch (error) {
        console.error('Error in /api/notifySuperadmins:', error);
        res.status(500).json({ success: false, error: 'Error sending notification' });
      }
    });

module.exports = router;
