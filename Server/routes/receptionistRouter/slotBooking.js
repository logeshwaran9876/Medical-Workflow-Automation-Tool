
import express from 'express';
import {
    getAvailableSlots,
    createAppointment,
    getAllAppointments,
    getAppointmentById,
    updateAppointment,
    deleteAppointment
} from "../../Controllers/receptionistController/BookingSlotsForDocinReption.js"

const router = express.Router();

router.get('/doctor/:doctorId/available-slots/:date', getAvailableSlots);
router.post('/', createAppointment);
router.get('/', getAllAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;