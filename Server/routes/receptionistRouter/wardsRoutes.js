import express from 'express';
import { getWards, createWard } from '../../Controllers/receptionistController/wardsController.js';
import { verifyToken, authorizeRoles } from '../../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(
    verifyToken,
    authorizeRoles("admin", "receptionist"),
    getWards
  )
  .post(
    verifyToken,
    authorizeRoles("admin", "receptionist"),
    createWard
  );

export default router;
