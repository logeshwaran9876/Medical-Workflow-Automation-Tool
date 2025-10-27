import express from "express";
import {
  createPrescription,
  getPrescriptionByAppointmentId,
  updatePrescription,
  deletePrescription,
  getAllPrescriptions,
  getPrescriptionsByDoctorId,
} from "../Controllers/prescriptionController.js";

import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const Prescriptionrouter = express.Router();
Prescriptionrouter.post(
  "/:appointmentId",
  verifyToken,
  authorizeRoles("doctor"),
  createPrescription
);
Prescriptionrouter.get(
  "/appointment/:appointmentId",
  verifyToken,
  authorizeRoles("doctor", "receptionist", "admin"),
  getPrescriptionByAppointmentId
);
Prescriptionrouter.get(
  "/",
  verifyToken,
  authorizeRoles("doctor", "receptionist", "admin"),
  getAllPrescriptions
);
Prescriptionrouter.get(
  "/doctor/:doctorId",
  verifyToken,
  authorizeRoles("doctor", "receptionist", "admin"),
  getPrescriptionsByDoctorId
);
Prescriptionrouter.put(
  "/:id",
  verifyToken,
  authorizeRoles("doctor", "receptionist", "admin"),
  updatePrescription
);
Prescriptionrouter.delete(
  "/:id",
  verifyToken,
  authorizeRoles( "admin"),
  deletePrescription
);

export default Prescriptionrouter;
