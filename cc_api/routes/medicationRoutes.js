const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
    getAllMedications, getMedicationById, addMedication,
    updateMedication, deleteMedication, getMedicationsOfPatient
} = require('../controllers/medicationController');

const router = express.Router();

router.get('/', authenticate, authorize(['admin']), getAllMedications);
router.get('/:id', authenticate, authorize(['caregiver', 'admin']), getMedicationById);
router.post('/', authenticate, authorize(['caregiver', 'admin']), addMedication);
router.put('/:id', authenticate, authorize(['caregiver', 'admin']), updateMedication);
router.delete('/:id', authenticate, authorize(['admin']), deleteMedication);
router.get('/patient/:id', authenticate, authorize(['caregiver', 'admin']), getMedicationsOfPatient);

module.exports = router;