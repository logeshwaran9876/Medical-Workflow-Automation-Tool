import express from "express";
const router = express.Router();

import { generateReportData } from "../../Controllers/receptionistController/reportController.js";
import { verifyToken, authorizeRoles } from "../../middlewares/authMiddleware.js";
router.get(
  '/',
  verifyToken,
  authorizeRoles("admin", "receptionist"),
  generateReportData
);

export default router;
