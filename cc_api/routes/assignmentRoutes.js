const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
    assignPatientToCaregiver, getPatientsOfCaregiver
} = require('../controllers/assignmentController');

const router = express.Router();

router.get('/:id/patients', authenticate, authorize(['caregiver', 'admin']), getPatientsOfCaregiver);
router.post('/:id/patients/:patient_id', authenticate, authorize(['caregiver', 'admin']), assignPatientToCaregiver);

module.exports = router;