
import express from 'express';
import {
  getAppointmentsByDoctor,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../../Controllers/DoctorsController/AppintmentByDocControl.js'; // Correct path to controller

import { verifyToken, authorizeRoles } from "../../middlewares/authMiddleware.js" // Correct path to middleware

const appdocrrouter = express.Router();

appdocrrouter.get('/doctor/:doctorId', verifyToken, authorizeRoles("doctor","admin","receptionist"), getAppointmentsByDoctor);
appdocrrouter.post('/', verifyToken, authorizeRoles("doctor","admin","receptionist"), createAppointment);
appdocrrouter.put('/:id', verifyToken, authorizeRoles("doctor","admin","receptionist"), updateAppointment);
appdocrrouter.delete('/:id', verifyToken, authorizeRoles("doctor","admin","receptionist"), deleteAppointment);

export default appdocrrouter;