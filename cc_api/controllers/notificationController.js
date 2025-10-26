exports.getNotifications = (req, res) => {
    res.json(global.mockNotifications)
}

exports.markNotificationAsRead = (req, res) => {
    const notificationId = req.params.id;

    const notification = global.mockNotifications.find(n => n.id === notificationId);

    if (!notification) {
        return res.status(404).json({ message: 'Benachrichtigung nicht gefunden' });
    }

    notification.isRead = true;
    res.json({ message: 'Benachrichtigung als gelesen markiert', notification });
};