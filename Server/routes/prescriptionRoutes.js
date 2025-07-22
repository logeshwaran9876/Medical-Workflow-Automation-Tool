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

// ✅ Create prescription (Only doctors can do this)
Prescriptionrouter.post(
  "/:appointmentId",
  verifyToken,
  authorizeRoles("doctor"),
  createPrescription
);

// ✅ Get prescription by appointment ID (Doctor + Receptionist + Admin can view)
Prescriptionrouter.get(
  "/appointment/:appointmentId",
  verifyToken,
  authorizeRoles("doctor", "receptionist", "admin"),
  getPrescriptionByAppointmentId
);

// ✅ Get all prescriptions (only admin should ideally have full access)
Prescriptionrouter.get(
  "/",
  verifyToken,
  authorizeRoles("doctor", "receptionist", "admin"),
  getAllPrescriptions
);

// ✅ Get prescriptions by doctor ID (Only doctor themself can view)
Prescriptionrouter.get(
  "/doctor/:doctorId",
  verifyToken,
  authorizeRoles("doctor", "receptionist", "admin"),
  getPrescriptionsByDoctorId
);

// ✅ Update prescription (Only doctor allowed)
Prescriptionrouter.put(
  "/:id",
  verifyToken,
  authorizeRoles("doctor", "receptionist", "admin"),
  updatePrescription
);

// ✅ Delete prescription (Maybe only admin or doctor)
Prescriptionrouter.delete(
  "/:id",
  verifyToken,
  authorizeRoles( "admin"),
  deletePrescription
);

export default Prescriptionrouter;
