import express from "express";
import {
  addPatient,
  getAllPatients,
  getPatientById,
  updatePatient,
  deletePatient
} from "../controllers/patientController.js";

import { verifyToken, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/", verifyToken, authorizeRoles("admin", "receptionist"), addPatient);
router.get("/", verifyToken, authorizeRoles("admin", "receptionist", "doctor"), getAllPatients);
router.get("/:id", verifyToken, authorizeRoles("admin", "receptionist", "doctor"), getPatientById);
router.put("/:id", verifyToken, authorizeRoles("admin", "receptionist","doctor"), updatePatient);
router.delete("/:id", verifyToken, authorizeRoles("admin"), deletePatient);

export default router;
