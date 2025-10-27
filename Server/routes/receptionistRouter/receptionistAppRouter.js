import express from "express";
import {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,
  deleteAppointment
} from "../../Controllers/receptionistController/receptionistAppController.js";

import { verifyToken, authorizeRoles } from "../../middlewares/authMiddleware.js";

const router = express.Router();
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "receptionist"),
  bookAppointment
);
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "receptionist", "doctor"),
  getAppointments
);
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "receptionist"),
  updateAppointmentStatus
);
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteAppointment
);

export default router;
