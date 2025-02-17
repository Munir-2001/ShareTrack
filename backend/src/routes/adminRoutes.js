import express from 'express';
const adminRoutes = express.Router();
import {getAllUsers,getReportedUsers,resolveReport,updateUserStatus,adminLogin}from '../controllers/adminController.js'
import { authenticateAdmin } from "../middleware/authMiddleware.js";


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
adminRoutes.get("/users",authenticateAdmin, getAllUsers);

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
adminRoutes.put("/users/:id/status",authenticateAdmin, updateUserStatus);

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
adminRoutes.get("/reports", authenticateAdmin,getReportedUsers);

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
adminRoutes.put("/reports/:id/resolve",authenticateAdmin, resolveReport);

// module.exports = router;
export default adminRoutes;
