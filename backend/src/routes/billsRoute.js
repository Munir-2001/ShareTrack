import express from 'express';
import {
  createBill,
  getBill,
  listBills,
  updateBill,
  updateContributorPayment,
  deleteBill,
} from "../controllers/billsController.js";

const billsRouter = express.Router();

/**
 * @swagger
 * /api/bills:
 *   post:
 *     summary: Create a new bill with contributors
 */
billsRouter.post("/", createBill);

/**
 * @swagger
 * /api/bills/{billId}:
 *   get:
 *     summary: Retrieve a specific bill and its contributors
 */
billsRouter.get("/:billId", getBill);

/**
 * @swagger
 * /api/bills:
 *   get:
 *     summary: List all bills (optionally filtered by creator_id)
 */
billsRouter.get("/", listBills);

/**
 * @swagger
 * /api/bills/{billId}:
 *   put:
 *     summary: Update bill details
 */
billsRouter.put("/:billId", updateBill);

/**
 * @swagger
 * /api/bills/{billId}/contributors/{contributorId}:
 *   patch:
 *     summary: Update a contributor's payment amount
 */
billsRouter.patch("/:billId/contributors/:contributorId", updateContributorPayment);

/**
 * @swagger
 * /api/bills/{billId}:
 *   delete:
 *     summary: Delete a bill and all associated records
 */
billsRouter.delete("/:billId", deleteBill);

export default billsRouter;
