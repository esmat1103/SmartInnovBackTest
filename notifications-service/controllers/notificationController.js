const Notification = require('../models/notificationsModel');

// Add notification to the database
exports.addNotification = async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).send(notification);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.status(200).send(notifications);
  } catch (error) {
    res.status(500).send(error);
  }
};
