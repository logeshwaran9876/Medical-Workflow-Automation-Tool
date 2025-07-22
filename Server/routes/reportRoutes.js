import express from 'express';
import {
  generatePatientReport,
  generateDoctorReport,
  generateAppointmentReport
} from "../Controllers/reportController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const reportRoutes = express.Router();

// 📊 Patient report – accessible by admin and receptionist
reportRoutes.post(
  '/patients',
  verifyToken,
  authorizeRoles('admin', 'receptionist',"doctor"),
  generatePatientReport
);

// 📊 Doctor report – admin only (or add more if needed)
reportRoutes.post(
  '/doctors',
  verifyToken,
  authorizeRoles('admin',"doctor"),
  generateDoctorReport
);

// 📊 Appointment report – receptionist + admin
reportRoutes.post(
  '/appointments',
  verifyToken,
  authorizeRoles('admin', 'receptionist',"doctor"),
  generateAppointmentReport
);

export default reportRoutes;
