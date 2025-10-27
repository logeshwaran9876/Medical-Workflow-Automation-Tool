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
router.post("/", verifyToken, authorizeRoles("doctor", "receptionist"), scheduleFollowUp);
router.get("/doctor/:doctorId", verifyToken, authorizeRoles("doctor"), getFollowUpsByDoctor);
router.put("/:id", verifyToken, authorizeRoles("doctor"), updateFollowUp);
router.delete("/:id", verifyToken, authorizeRoles("doctor"), deleteFollowUp);
router.patch("/:id/notify", verifyToken, authorizeRoles("doctor"), markNotified);

export default router;
