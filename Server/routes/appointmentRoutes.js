
import express from "express";
import {
  bookAppointment,
  getAppointments,
  updateAppointmentStatus,deleteAppointment
} from "../controllers/appointmentController.js";

import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js"

const router = express.Router();


router.post("/", verifyToken, authorizeRoles("admin",  "doctor", "receptionist"), bookAppointment);

router.get("/", verifyToken, authorizeRoles("admin", "doctor", "receptionist"), getAppointments);

router.put("/:id", verifyToken, authorizeRoles("admin","doctor","receptionist"), updateAppointmentStatus);

router.delete("/:id", verifyToken, authorizeRoles("admin","doctor", "receptionist"), deleteAppointment);

export default router;
