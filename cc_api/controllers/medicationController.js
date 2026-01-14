const { Medication, Assignment, Relationship } = require('../models');

exports.getAllMedications = async (req, res) => {
    try {
        const userId = req.user.id;
        const userRole = req.user.role;

        let whereClause = {};

        // Filter based on role
        if (userRole === 'caregiver') {
            // Caregivers see medications of their assigned patients
            const assignments = await Assignment.findAll({
                where: { caregiver_id: userId },
                attributes: ['patient_id']
            });
            const patientIds = assignments.map(a => a.patient_id);
            if (patientIds.length > 0) {
                whereClause.patient_id = patientIds;
            } else {
                whereClause.patient_id = -1; // No patients assigned
            }
        } else if (userRole === 'relative') {
            // Relatives see medications of their associated patients (READ-ONLY)
            const relationships = await Relationship.findAll({
                where: { relative_id: userId },
                attributes: ['patient_id']
            });
            const patientIds = relationships.map(r => r.patient_id);
            if (patientIds.length > 0) {
                whereClause.patient_id = patientIds;
            } else {
                whereClause.patient_id = -1; // No patients associated
            }
        }
        // Admin sees all medications (no filter)
        // Patient role no longer exists with login

        const medications = await Medication.findAll({ where: whereClause });
        res.json(medications);
    } catch (error) {
        console.error('Error fetching medications:', error);
        res.status(500).json({ error: 'Error fetching medications' });
    }
};

exports.getMedicationById = async (req, res) => {
    try {
        const id = req.params.id;
        const med = await Medication.findByPk(id);

        if (!med) {
            return res.status(404).json({message: 'Medication not found'})
        }

        res.status(200).json(med);
    } catch (error) {
        console.error('Error fetching medication:', error);
        res.status(500).json({ error: 'Error fetching medication' });
    }
};

exports.addMedication = async (req, res) => {
    try {
        const { name, dosage, patient_id, description } = req.body;

        if (!name || !dosage || !patient_id) {
            return res.status(400).json({ message: 'Name, dosage and patient_id required' });
        }

        const newMed = await Medication.create({
            name,
            dosage,
            patient_id,
            description,
        });

        res.status(201).json(newMed);
    } catch (error) {
        console.error('Error creating medication:', error);
        res.status(500).json({ error: 'Error creating medication' });
    }
};

exports.updateMedication = async (req, res) => {
    try {
        const id = req.params.id;
        const med = await Medication.findByPk(id);

        if (!med) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        const { name, dosage, patient_id, description } = req.body;
        if (name) med.name = name;
        if (dosage) med.dosage = dosage;
        if (patient_id) med.patient_id = patient_id;
        if (description) med.description = description;

        await med.save();
        res.json(med);
    } catch (error) {
        console.error('Error updating medication:', error);
        res.status(500).json({ error: 'Error updating medication' });
    }
};

exports.deleteMedication = async (req, res) => {
    try {
        const id = req.params.id;
        const med = await Medication.findByPk(id);

        if (!med) {
            return res.status(404).json({ message: 'Medication not found' });
        }

        await med.destroy();
        res.json({ message: 'Medication deleted', deleted: med });
    } catch (error) {
        console.error('Error deleting medication:', error);
        res.status(500).json({ error: 'Error deleting medication' });
    }
};

exports.getMedicationsOfPatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const meds = await Medication.findAll({ where: { patient_id: patientId } });

        res.status(200).json(meds);
    } catch (error) {
        console.error('Error fetching patient medications:', error);
        res.status(500).json({ error: 'Error fetching medications' });
    }
};
