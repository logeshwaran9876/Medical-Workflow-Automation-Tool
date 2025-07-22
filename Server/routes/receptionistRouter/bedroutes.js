import express from 'express';
import {
  getBeds,
  assignBed,
  dischargeBed,
  createBed
} from '../../Controllers/receptionistController/BedController.js';

import { verifyToken, authorizeRoles } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// 🛏️ Get all beds / Create a new bed - Only admin or receptionist
router.route('/')
  .get(verifyToken, authorizeRoles('admin', 'receptionist'), getBeds)
  .post(verifyToken, authorizeRoles('admin', 'receptionist'), createBed);

// 🛏️ Assign bed to patient - receptionist only (or add doctor if needed)
router.route('/:id/assign')
  .post(verifyToken, authorizeRoles('receptionist'), assignBed);

// 🛏️ Discharge a bed - receptionist only
router.route('/:id/discharge')
  .post(verifyToken, authorizeRoles('receptionist'), dischargeBed);

export default router;
