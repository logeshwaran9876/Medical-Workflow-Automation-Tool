import express from "express";
import {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment
} from "../../Controllers/receptionistController/receptionistAppController.js";

import { verifyToken, authorizeRoles } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Book a new appointment
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "receptionist"),
  bookAppointment
);

// Get appointments (optionally filtered)
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "receptionist", "doctor"),
  getAppointments
);

// Update appointment status
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "receptionist"),
  updateAppointmentStatus
);

// Delete appointment
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteAppointment
);

export default router;
