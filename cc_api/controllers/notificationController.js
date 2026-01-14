const { Notification, Relationship, User } = require('../models');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let whereClause = {};

        // Filter basierend auf Rolle
        if (userRole === 'relative') {
            // Relatives see their own notifications (user_id = relative_id)
            whereClause.user_id = userId;
        } else if (userRole !== 'admin') {
            // Caregivers sehen ihre eigenen Benachrichtigungen
            whereClause.user_id = userId;
        }
        // Admin sieht alle Benachrichtigungen (kein Filter)

        const notifications = await Notification.findAll({ 
            where: whereClause,
            include: [{
                model: User,
                as: 'patient',
                attributes: ['id', 'name', 'phone']
            }]
        });
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Benachrichtigungen' });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findByPk(notificationId);

        if (!notification) {
            return res.status(404).json({ message: 'Benachrichtigung nicht gefunden' });
        }

        notification.isRead = true;
        await notification.save();
        res.json({ message: 'Benachrichtigung als gelesen markiert', notification });
    } catch (error) {
        console.error('Error marking notification as read:', error);
        res.status(500).json({ error: 'Fehler beim Markieren der Benachrichtigung' });
    }
};

exports.createNotification = async (req, res) => {
    try {
        const { patient_id, title, text, type, priority } = req.body;

        if (!patient_id || !title || !text) {
            return res.status(400).json({ error: 'Patient, Title und Text sind erforderlich' });
        }

        // Find all relatives of this patient
        const relationships = await Relationship.findAll({
            where: { patient_id },
            attributes: ['relative_id']
        });

        if (relationships.length === 0) {
            return res.status(404).json({ error: 'Keine Angehörigen für diesen Patienten gefunden' });
        }

        // Create notification for EVERY relative
        const notifications = [];
        for (const rel of relationships) {
            const notification = await Notification.create({
                user_id: rel.relative_id,  // Recipient
                patient_id: patient_id,     // Betreff
                title,
                text,
                type: type || 'info',
                priority: priority || 'medium',
                read: false
            });
            notifications.push(notification);
        }

        res.status(201).json({ 
            message: `Benachrichtigung an ${notifications.length} Angehörige(n) gesendet`,
            notifications 
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ error: 'Fehler beim Erstellen der Benachrichtigung' });
    }
};