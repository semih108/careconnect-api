const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
    assignPatientToCaregiver,
    getPatientsOfCaregiver,
    getAllPatients,
    removeAssignment,
    getMyAssignedPatients
} = require('../controllers/assignmentController');

const router = express.Router();

// Own assigned patients (for logged-in caregiver)
router.get('/me/patients', authenticate, authorize(['caregiver']), getMyAssignedPatients);

// Get all patients (for dropdown)
router.get('/patients', authenticate, authorize(['admin', 'caregiver']), getAllPatients);

// Patients that are assigned to a specific caregiver
router.get('/:id/patients', authenticate, authorize(['caregiver', 'admin']), getPatientsOfCaregiver);

// Assign patient
router.post('/:id/patients/:patient_id', authenticate, authorize(['admin']), assignPatientToCaregiver);

// Delete assignment
router.delete('/:id/patients/:patient_id', authenticate, authorize(['admin']), removeAssignment);

module.exports = router;