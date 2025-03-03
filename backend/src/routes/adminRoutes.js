// import express from 'express';
// const adminRoutes = express.Router();
// import {getAllUsers,getReportedUsers,resolveReport,updateUserStatus,adminLogin,rejectRental,approveRental,
//     getPendingRentals}from '../controllers/adminController.js'
// import { authenticateAdmin } from "../middleware/authMiddleware.js";


// /**
//  * @swagger
//  * /api/admin/login:
//  *   post:
//  *     summary: Admin login
//  *     tags: [Admin]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 description: Admin email
//  *                  value:admin@gmail.com
//  *               password:
//  *                 type: string
//  *                 description: Admin password
//  *                  value:9
//  *     responses:
//  *       200:
//  *         description: Admin logged in successfully
//  *       401:
//  *         description: Invalid credentials
//  *       403:
//  *         description: User is not an admin
//  */
// adminRoutes.post("/login", adminLogin);
// /**
//  * @swagger
//  * tags:
//  *   name: Admin
//  *   description: Admin management API
//  */

// /**
//  * @swagger
//  * /api/admin/users:
//  *   get:
//  *     summary: Get all users
//  *     tags: [Admin]
//  *     responses:
//  *       200:
//  *         description: List of all users
//  *       403:
//  *         description: Forbidden - Admin access required
//  */
// adminRoutes.get("/users",getAllUsers);

// /**
//  * @swagger
//  * /api/admin/users/{id}/status:
//  *   put:
//  *     summary: Update user account status (Activate/Deactivate)
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: User ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               isActive:
//  *                 type: boolean
//  *                 description: Set true to activate, false to deactivate
//  *     responses:
//  *       200:
//  *         description: User status updated successfully
//  *       400:
//  *         description: Invalid request
//  *       403:
//  *         description: Forbidden - Admin access required
//  */
// adminRoutes.put("/users/:id/status", updateUserStatus);

// /**
//  * @swagger
//  * /api/admin/reports:
//  *   get:
//  *     summary: Get reported users
//  *     tags: [Admin]
//  *     responses:
//  *       200:
//  *         description: List of reported users
//  *       403:
//  *         description: Forbidden - Admin access required
//  */
// adminRoutes.get("/reports", getReportedUsers);

// /**
//  * @swagger
//  * /api/admin/reports/{id}/resolve:
//  *   put:
//  *     summary: Resolve a user report
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: Report ID
//  *     responses:
//  *       200:
//  *         description: Report resolved successfully
//  *       400:
//  *         description: Invalid request
//  *       403:
//  *         description: Forbidden - Admin access required
//  */
// adminRoutes.put("/reports/:id/resolve",resolveReport);

// /**
//  * @swagger
//  * tags:
//  *   name: Admin
//  *   description: Admin Rental Management API
//  */

// /**
//  * @swagger
//  * /api/admin/rentals/pending:
//  *   get:
//  *     summary: Get all rental items pending approval
//  *     tags: [Admin]
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved list of rental items pending approval
//  *       403:
//  *         description: Forbidden - Admin access required
//  */
// adminRoutes.get("/rentals/pending", getPendingRentals);

// /**
//  * @swagger
//  * /api/admin/rentals/{id}/approve:
//  *   put:
//  *     summary: Approve a rental item
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Rental Item ID
//  *     responses:
//  *       200:
//  *         description: Rental item approved successfully
//  *       400:
//  *         description: Invalid request
//  *       403:
//  *         description: Forbidden - Admin access required
//  */
// adminRoutes.put("/rentals/:id/approve", approveRental);

// /**
//  * @swagger
//  * /api/admin/rentals/{id}/reject:
//  *   put:
//  *     summary: Reject a rental item with a reason
//  *     tags: [Admin]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: Rental Item ID
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               reason:
//  *                 type: string
//  *                 description: Reason for rejection
//  *     responses:
//  *       200:
//  *         description: Rental item rejected successfully
//  *       400:
//  *         description: Invalid request
//  *       403:
//  *         description: Forbidden - Admin access required
//  */
// adminRoutes.put("/rentals/:id/reject", rejectRental);

// // module.exports = router;
// export default adminRoutes;

import express from "express";
const adminRoutes = express.Router();
import {
  getAllUsers,
  getReportedUsers,
  resolveReport,
  updateUserStatus,
  admingetPendingRentals,
  adminapproveRental,
  adminrejectRental,
  adminLogin,
  getUserDetails,
  getTransactions
} from "../controllers/adminController.js";

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin management API
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Forbidden - Admin access required
 */
adminRoutes.get("/users", getAllUsers);
/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Admin email
 *                  value:admin@gmail.com
 *               password:
 *                 type: string
 *                 description: Admin password
 *                  value:9
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: User is not an admin
 */
adminRoutes.post("/login", adminLogin);
/**
 * @swagger
 * /api/admin/users/{id}/status:
 *   put:
 *     summary: Update user account status (Activate/Deactivate)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 description: Set true to activate, false to deactivate
 *     responses:
 *       200:
 *         description: User status updated successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden - Admin access required
 */
adminRoutes.put("/users/:id/status", updateUserStatus);

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Get reported users
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of reported users
 *       403:
 *         description: Forbidden - Admin access required
 */
adminRoutes.get("/reports", getReportedUsers);
/**
 * @swagger
 * /api/admin/reports/{id}/resolve:
 *   put:
 *     summary: Resolve a user report
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report resolved successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden - Admin access required
 */
adminRoutes.put("/reports/:id/resolve", resolveReport);

/**
 * @swagger
 * /api/admin/rentals/pending:
 *   get:
 *     summary: Get pending rental items
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of rental items pending approval
 *       403:
 *         description: Forbidden - Admin access required
 */
adminRoutes.get("/rentals/pending", admingetPendingRentals);

/**
 * @swagger
 * /api/admin/rentals/{id}/approve:
 *   put:
 *     summary: Approve a rental item
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental Item ID
 *     responses:
 *       200:
 *         description: Rental item approved successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden - Admin access required
 */
adminRoutes.put("/rentals/:id/approve", adminapproveRental);

/**
 * @swagger
 * /api/admin/rentals/{id}/reject:
 *   put:
 *     summary: Reject a rental item with a reason
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rental Item ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for rejecting the rental
 *     responses:
 *       200:
 *         description: Rental item rejected successfully
 *       400:
 *         description: Invalid request
 *       403:
 *         description: Forbidden - Admin access required
 */
adminRoutes.put("/rentals/:id/reject", adminrejectRental);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Get user details
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
adminRoutes.get("/users/:id", getUserDetails);

/**
 * @swagger
 * /api/admin/transactions:
 *   get:
 *     summary: Get all transactions
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Successfully retrieved all transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transactions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       amount:
 *                         type: number
 *                       status:
 *                         type: string
 *                       transaction_type:
 *                         type: string
 *                         nullable: true
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       sender_id:
 *                         type: string
 *                       sender_username:
 *                         type: string
 *                       receiver_id:
 *                         type: string
 *                       receiver_username:
 *                         type: string
 *       500:
 *         description: Internal Server Error
 */

adminRoutes.get("/transactions", getTransactions);
export default adminRoutes;
