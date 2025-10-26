const express = require('express');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const {
    getAllAppointments, getAppointmentById, getAppointmentLocation,
    getAppointmentParticipants, createAppointment, updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

const router = express.Router();

router.get('/', authenticate, getAllAppointments);
router.get('/:id', authenticate, getAppointmentById);
router.get('/:id/location', authenticate, getAppointmentLocation);
router.get('/:id/participants', authenticate, getAppointmentParticipants);
router.post('/', authenticate, authorize(['caregiver', 'admin']), createAppointment);
router.put('/:id', authenticate, authorize(['caregiver', 'admin']), updateAppointment);
router.delete('/:id', authenticate, authorize(['caregiver', 'admin']), deleteAppointment);

module.exports = router;