// const express = require("express");
// const { getUserLoans, repayLoan } = require("../controllers/LoanController");

// const loanRoutes = express.Router();

// /**
//  * @swagger
//  * /api/loan/user-loans:
//  *   post:
//  *     summary: Get all loans related to a user (both received and given)
//  *     tags:
//  *       - Loans
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               userId:
//  *                 type: integer
//  *                 description: The ID of the user fetching their loans
//  *     responses:
//  *       200:
//  *         description: List of loans related to the user
//  *       400:
//  *         description: Missing required user ID
//  *       500:
//  *         description: Internal server error
//  */
// loanRoutes.post("/user-loans", getUserLoans);

// /**
//  * @swagger
//  * /api/loan/repay:
//  *   post:
//  *     summary: Repay a loan by marking the transaction as completed
//  *     tags:
//  *       - Loans
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               transactionId:
//  *                 type: integer
//  *                 description: The ID of the loan transaction being repaid
//  *     responses:
//  *       200:
//  *         description: Loan repaid successfully
//  *       400:
//  *         description: Missing required transaction ID
//  *       500:
//  *         description: Internal server error
//  */
// loanRoutes.post("/repay", repayLoan);

// module.exports = loanRoutes;

const express = require("express");
const { getUserLoans, repayLoan } = require("../controllers/LoanController");

const loanRoutes = express.Router();
loanRoutes.post("/user-loans", (req, res, next) => {
    console.log("Incoming request to /user-loans:", req.body);
    next(); // Pass control to the actual controller
  }, getUserLoans);

// /**
//  * @swagger
//  * /api/loans/user-loans:
//  *   post:
//  *     summary: Get all loans related to a user (both received and given)
//  *     tags:
//  *       - Loans
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               userId:
//  *                 type: integer
//  *                 description: The ID of the user fetching their loans
//  *     responses:
//  *       200:
//  *         description: List of loans related to the user
//  *       400:
//  *         description: Missing required user ID
//  *       500:
//  *         description: Internal server error
//  */
// loanRoutes.post("/user-loans", getUserLoans);

/**
 * @swagger
 * /api/loans/repay:
 *   post:
 *     summary: Repay a loan by marking the transaction as completed
 *     tags:
 *       - Loans
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: integer
 *                 description: The ID of the loan transaction being repaid
 *     responses:
 *       200:
 *         description: Loan repaid successfully
 *       400:
 *         description: Missing required transaction ID
 *       500:
 *         description: Internal server error
 */
loanRoutes.post("/repay", repayLoan);

module.exports = loanRoutes;
