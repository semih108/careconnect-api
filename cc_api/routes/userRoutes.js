const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
    getMyProfile, updateMyProfile,
    getUserById, updateUserById, deleteUserById,
    getAllUsers, getUsersByRole,
    getMyMedications, getMyAppointments,
    getPatientsOfCaregiver, getRelativesOfPatient
} = require('../controllers/userController');

const router = express.Router();

router.get('/me', authenticate, getMyProfile);
router.put('/me', authenticate, updateMyProfile);
router.get('/me/medications', authenticate, authorize(['patient']), getMyMedications);
router.get('/me/appointments', authenticate, getMyAppointments);

router.get('/', authenticate, authorize(['admin']), getAllUsers);
router.get('/:id', authenticate, authorize(['admin']), getUserById);
router.put('/:id', authenticate, authorize(['admin']), updateUserById);
router.delete('/:id', authenticate, authorize(['admin']), deleteUserById);

router.get('/:caregiver_id/patients', authenticate, authorize(['caregiver', 'admin']), getPatientsOfCaregiver);
router.get('/:patient_id/relatives', authenticate, authorize(['caregiver', 'admin', 'relative']), getRelativesOfPatient);

module.exports = router;