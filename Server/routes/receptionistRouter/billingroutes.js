import express from 'express';
import {
  createBilling,
  getBillings,
  getBilling,
  updateBilling,
  recordPayment,
  generateInvoice,
  getFinancialSummary
} from "../../Controllers/receptionistController/billingController.js";

import { verifyToken, authorizeRoles } from "../../middlewares/authMiddleware.js";

const billingRoutes = express.Router();
billingRoutes.route('/')
  .get(verifyToken, authorizeRoles("admin", "receptionist"), getBillings)
  .post(verifyToken, authorizeRoles("admin", "receptionist"), createBilling);

billingRoutes.route('/summary')
  .get(verifyToken, authorizeRoles("admin", "receptionist"), getFinancialSummary);

billingRoutes.route('/:id')
  .get(verifyToken, authorizeRoles("admin", "receptionist"), getBilling)
  .put(verifyToken, authorizeRoles("admin", "receptionist"), updateBilling);

billingRoutes.route('/:id/payments')
  .post(verifyToken, authorizeRoles("admin", "receptionist"), recordPayment);

billingRoutes.route('/:id/invoice')
  .get(verifyToken, authorizeRoles("admin", "receptionist"), generateInvoice);

export default billingRoutes;
