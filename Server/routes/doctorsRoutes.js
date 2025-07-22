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

// 👤 Only admin can create new doctors
doctorRouter.post('/', verifyToken, authorizeRoles('admin'), createDoctor);

// 📋 View all doctors — allow admin, receptionist, or doctor
doctorRouter.get('/', verifyToken, authorizeRoles('admin', 'receptionist', 'doctor'), getDoctors);

// 🔍 Get single doctor by ID — allow admin, receptionist, doctor
doctorRouter.get('/:id', verifyToken, authorizeRoles('admin', 'receptionist', 'doctor'), getDoctorById);

// 🛠️ Update doctor — only admin
doctorRouter.put('/:id', verifyToken, authorizeRoles('admin'), updateDoctor);

// ❌ Delete doctor — only admin
doctorRouter.delete('/:id', verifyToken, authorizeRoles('admin'), deleteDoctor);

doctorRouter.get('/getallDoct', verifyToken, authorizeRoles('admin',"doctor"), getAllDoctorwithCount);




export default doctorRouter;
