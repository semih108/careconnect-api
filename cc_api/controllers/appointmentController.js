const { Appointment, User, Assignment, Relationship } = require('../models');
const { Op } = require('sequelize');

exports.getAllAppointments = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let whereClause = {};

        if (userRole === 'caregiver') {
            whereClause.caregiver_id = userId;
        } else if (userRole === 'relative') {
            const relationships = await Relationship.findAll({
                where: { relative_id: userId },
                attributes: ['patient_id']
            });
            const patientIds = relationships.map(r => r.patient_id);
            if (patientIds.length > 0) {
                whereClause.patient_id = patientIds;
            } else {
                whereClause.patient_id = -1;
            }
        }

        // Admin can see all appointments, no filtering needed
        const appointments = await Appointment.findAll({ 
            where: whereClause,
            include: [
                {
                    model: User,
                    as: 'patient',
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'caregiver',
                    attributes: ['id', 'name', 'email']
                }
            ]
        });
        res.json(appointments);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Termine' });
    }
};

// Einzelnen Termin nach ID abrufen
exports.getAppointmentById = async (req, res) => {
    try {
        const id = req.params.id;
        const appointment = await Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Termin nicht gefunden' });
        }

        res.json(appointment);
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen des Termins' });
    }
};

// Ort eines Termins abrufen
exports.getAppointmentLocation = async (req, res) => {
    try {
        const id = req.params.id;
        const appointment = await Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Termin nicht gefunden' });
        }

        res.json({ location: appointment.location });
    } catch (error) {
        console.error('Error fetching appointment location:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen des Standorts' });
    }
};

// Teilnehmer des Termins
exports.getAppointmentParticipants = async (req, res) => {
    try {
        const id = req.params.id;
        const appointment = await Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Termin nicht gefunden' });
        }

        res.json({ participants: appointment.participants || [] });
    } catch (error) {
        console.error('Error fetching appointment participants:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Teilnehmer' });
    }
};

// Termin erstellen
exports.createAppointment = async (req, res) => {
    try {
        const newAppointment = await Appointment.create(req.body);
        res.status(201).json({ message: 'Termin erstellt', appointment: newAppointment });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Fehler beim Erstellen des Termins' });
    }
};

// Termin aktualisieren
exports.updateAppointment = async (req, res) => {
    try {
        const id = req.params.id;
        const appointment = await Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Termin nicht gefunden' });
        }

        await appointment.update(req.body);
        res.json({ message: 'Termin aktualisiert', appointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Fehler beim Aktualisieren des Termins' });
    }
};

// Delete appointment
exports.deleteAppointment = async (req, res) => {
    try {
        const id = req.params.id;
        const appointment = await Appointment.findByPk(id);

        if (!appointment) {
            return res.status(404).json({ message: 'Termin nicht gefunden' });
        }

        await appointment.destroy();
        res.json({ message: 'Termin gelöscht', appointment });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Fehler beim Löschen des Termins' });
    }
};
