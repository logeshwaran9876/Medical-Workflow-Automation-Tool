import express from "express";
import {
  scheduleFollowUp,
  getFollowUpsByDoctor,
  markNotified,
  updateFollowUp,
  deleteFollowUp,
} from "../controllers/followupController.js";
import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ✅ Only doctors or receptionists can schedule follow-ups
router.post("/", verifyToken, authorizeRoles("doctor", "receptionist"), scheduleFollowUp);

// ✅ Doctors can view their own follow-ups
router.get("/doctor/:doctorId", verifyToken, authorizeRoles("doctor"), getFollowUpsByDoctor);

// ✅ Only doctors can update or delete their follow-ups
router.put("/:id", verifyToken, authorizeRoles("doctor"), updateFollowUp);
router.delete("/:id", verifyToken, authorizeRoles("doctor"), deleteFollowUp);

// ✅ Doctor marks follow-up as notified
router.patch("/:id/notify", verifyToken, authorizeRoles("doctor"), markNotified);

export default router;
