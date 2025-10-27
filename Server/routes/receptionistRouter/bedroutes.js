import express from 'express';
import {
  getBeds,
  assignBed,
  dischargeBed,
  createBed
} from '../../Controllers/receptionistController/BedController.js';

import { verifyToken, authorizeRoles } from '../../middlewares/authMiddleware.js';

const router = express.Router();
router.route('/')
  .get(verifyToken, authorizeRoles('admin', 'receptionist'), getBeds)
  .post(verifyToken, authorizeRoles('admin', 'receptionist'), createBed);
router.route('/:id/assign')
  .post(verifyToken, authorizeRoles('receptionist'), assignBed);
router.route('/:id/discharge')
  .post(verifyToken, authorizeRoles('receptionist'), dischargeBed);

export default router;
