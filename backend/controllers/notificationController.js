import Notification from "../models/notification.js";

export const getUserNotifications = async (req, res) => {
  const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(notifications);
};

export const markAsSeen = async (req, res) => {
  const { id } = req.user.id;
  await Notification.findByIdAndUpdate(id, { seen: true });
  res.json({ message: 'Notification marked as seen' });
};

export const clearAllNotifications = async (req, res) => {
  await Notification.deleteMany({ user: req.user.id });
  res.json({ message: 'All notifications cleared' });
};

export const createNotification = async (data) => {
  const notification = new Notification(data);
  await notification.save();
  return notification;
};