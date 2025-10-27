import express from 'express';
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,getAllDoctorwithCount
} from '../Controllers/doctorsController.js';
import { verifyToken, authorizeRoles } from '../middlewares/authMiddleware.js';

const doctorRouter = express.Router();
doctorRouter.post('/', verifyToken, authorizeRoles('admin'), createDoctor);
doctorRouter.get('/', verifyToken, authorizeRoles('admin', 'receptionist', 'doctor'), getDoctors);
doctorRouter.get('/:id', verifyToken, authorizeRoles('admin', 'receptionist', 'doctor'), getDoctorById);
doctorRouter.put('/:id', verifyToken, authorizeRoles('admin'), updateDoctor);
doctorRouter.delete('/:id', verifyToken, authorizeRoles('admin'), deleteDoctor);

doctorRouter.get('/getallDoct', verifyToken, authorizeRoles('admin',"doctor"), getAllDoctorwithCount);




export default doctorRouter;
