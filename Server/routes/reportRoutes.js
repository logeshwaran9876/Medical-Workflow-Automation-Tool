import express from 'express';
import {
  generatePatientReport,
  generateDoctorReport,
  generateAppointmentReport
} from "../Controllers/reportController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const reportRoutes = express.Router();
reportRoutes.post(
  '/patients',
  verifyToken,
  authorizeRoles('admin', 'receptionist',"doctor"),
  generatePatientReport
);
reportRoutes.post(
  '/doctors',
  verifyToken,
  authorizeRoles('admin',"doctor"),
  generateDoctorReport
);
reportRoutes.post(
  '/appointments',
  verifyToken,
  authorizeRoles('admin', 'receptionist',"doctor"),
  generateAppointmentReport
);

export default reportRoutes;
