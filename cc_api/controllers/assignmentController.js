const { Assignment, User } = require('../models');

// Patient einem Pfleger zuweisen
exports.assignPatientToCaregiver = async (req, res) => {
    try {
        const caregiverId = req.params.id;
        const patientId = req.params.patient_id;

        // Check if caregiver and patient exist
        const caregiver = await User.findByPk(caregiverId);
        const patient = await User.findByPk(patientId);

        if (!caregiver || caregiver.role !== 'caregiver') {
            return res.status(404).json({ error: 'Pfleger nicht gefunden' });
        }

        if (!patient || patient.role !== 'patient') {
            return res.status(404).json({ error: 'Patient nicht gefunden' });
        }

        // Check if assignment already exists
        const existing = await Assignment.findOne({
            where: { caregiver_id: caregiverId, patient_id: patientId }
        });

        if (existing) {
            return res.status(409).json({ error: 'Zuweisung existiert bereits' });
        }

        const assignment = await Assignment.create({
            caregiver_id: caregiverId,
            patient_id: patientId
        });

        res.status(201).json({
            message: 'Patient erfolgreich zugewiesen',
            assignment
        });
    } catch (error) {
        console.error('Error assigning patient:', error);
        res.status(500).json({ error: 'Fehler beim Zuweisen des Patienten' });
    }
};

exports.getPatientsOfCaregiver = async (req, res) => {
    try {
        const caregiverId = req.params.id;

        const assignments = await Assignment.findAll({
            where: { caregiver_id: caregiverId },
            include: [{
                model: User,
                as: 'patient',
                attributes: ['id', 'name', 'email', 'phone', 'address']
            }]
        });

        const patients = assignments.map(a => a.patient);
        res.json(patients);
    } catch (error) {
        console.error('Error fetching assigned patients:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der zugewiesenen Patienten' });
    }
};

// Get all patients (for dropdown when assigning)
exports.getAllPatients = async (req, res) => {
    try {
        const patients = await User.findAll({
            where: { role: 'patient' },
            attributes: ['id', 'name', 'email', 'phone']
        });
        res.json(patients);
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der Patienten' });
    }
};

// Delete assignment
exports.removeAssignment = async (req, res) => {
    try {
        const caregiverId = req.params.id;
        const patientId = req.params.patient_id;

        const assignment = await Assignment.findOne({
            where: { caregiver_id: caregiverId, patient_id: patientId }
        });

        if (!assignment) {
            return res.status(404).json({ error: 'Zuweisung nicht gefunden' });
        }

        await assignment.destroy();
        res.json({ message: 'Zuweisung erfolgreich gelöscht' });
    } catch (error) {
        console.error('Error removing assignment:', error);
        res.status(500).json({ error: 'Fehler beim Löschen der Zuweisung' });
    }
};

// Get assignments for a user (for current caregiver)
exports.getMyAssignedPatients = async (req, res) => {
    try {
        const caregiverId = req.user.id;

        const assignments = await Assignment.findAll({
            where: { caregiver_id: caregiverId },
            include: [{
                model: User,
                as: 'patient',
                attributes: ['id', 'name', 'email', 'phone', 'address']
            }]
        });

        const patients = assignments.map(a => a.patient);
        res.json(patients);
    } catch (error) {
        console.error('Error fetching my assigned patients:', error);
        res.status(500).json({ error: 'Fehler beim Abrufen der zugewiesenen Patienten' });
    }
};