// const express = require("express");
import express from 'express';
import {
    requestRelationship,
    approveRelationship,
    deleteRelationship,
    blockRelationship,
    getAllFriends,
    getAllFriendRequestsReceived,
    getAllFriendRequestsSent,
    getBlockedRelationships,
    sendMoney,
    requestMoney,
    respondToMoneyRequest,
    getMoneyRequests,
    getTransactionHistory,
    getSentMoneyRequests,
    getUserBalance} from '../controllers/relationshipController.js'
// } = require("../controllers/relationshipController");

const relationshipRouter = express.Router();

/**
 * @swagger
 * /api/relationship/request:
 *   post:
 *     summary: Send a friend request
 *     tags:
 *       - Relationships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               requesterId:
 *                 type: integer
 *               recipientUsername:
 *                 type: string
 *     responses:
 *       201:
 *         description: Friend request sent successfully
 *       400:
 *         description: User not found or request error
 */
relationshipRouter.post("/request", requestRelationship);

/**
 * @swagger
 * /api/relationship/approve:
 *   put:
 *     summary: Approve a friend request
 *     tags:
 *       - Relationships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               relationshipId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Friend request approved
 *       400:
 *         description: Relationship not found
 */
relationshipRouter.put("/approve", approveRelationship);

/**
 * @swagger
 * /api/relationship/delete:
 *   delete:
 *     summary: Delete or reject a friend request
 *     tags:
 *       - Relationships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               relationshipId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Relationship deleted
 *       400:
 *         description: Relationship not found
 */
relationshipRouter.delete("/delete", deleteRelationship);

/**
 * @swagger
 * /api/relationship/block:
 *   put:
 *     summary: Block a user
 *     tags:
 *       - Relationships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               relationshipId:
 *                 type: integer
 *               blockerId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User blocked successfully
 *       400:
 *         description: Relationship not found
 */
relationshipRouter.put("/block", blockRelationship);
// /**
//  * @swagger
//  * /api/relationship/friends:
//  *   post:
//  *     summary: Get all friends of a user
//  *     tags:
//  *       - Relationships
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               userId:
//  *                 type: integer
//  *                 description: The unique identifier of the user whose friends are being retrieved.
//  *             required:
//  *               - userId
//  *     responses:
//  *       200:
//  *         description: List of friends retrieved successfully
//  */
// relationshipRouter.post("/friends", getAllFriends);

/**
 * @swagger
 * /api/relationship/friends:
 *   post:
 *     summary: Get all friends of a user
 *     tags:
 *       - Relationships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The unique identifier of the user whose friends are being retrieved.
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: List of friends retrieved successfully
 */
relationshipRouter.post("/friends", getAllFriends);


/**
 * @swagger
 * /api/relationship/requests/received:
 *   post:
 *     summary: Get all friend requests received by a user
 *     tags:
 *       - Relationships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The unique identifier of the user whose received friend requests are being retrieved.
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: List of received friend requests retrieved successfully
 */
relationshipRouter.post("/requests/received", getAllFriendRequestsReceived);

/**
 * @swagger
 * /api/relationship/requests/sent:
 *   post:
 *     summary: Get all friend requests sent by a user
 *     tags:
 *       - Relationships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The unique identifier of the user whose sent friend requests are being retrieved.
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: List of sent friend requests retrieved successfully
 */
relationshipRouter.post("/requests/sent", getAllFriendRequestsSent);

/**
 * @swagger
 * /api/relationship/blocked:
 *   post:
 *     summary: Get all blocked users for a user
 *     tags:
 *       - Relationships
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The unique identifier of the user whose blocked relationships are being retrieved.
 *             required:
 *               - userId
 *     responses:
 *       200:
 *         description: List of blocked users retrieved successfully
 */
relationshipRouter.post("/blocked", getBlockedRelationships);


// /**
//  * @swagger
//  * /api/relationship/sendMoney:
//  *   post:
//  *     summary: Send money to another user
//  *     tags:
//  *       - Transactions
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               senderId:
//  *                 type: integer
//  *               receiverId:
//  *                 type: integer
//  *               amount:
//  *                 type: number
//  *     responses:
//  *       200:
//  *         description: Money sent successfully
//  *       400:
//  *         description: Insufficient balance
//  */
// relationshipRouter.post("/sendMoney", sendMoney);

/**
 * @swagger
 * /api/relationship/sendMoney:
 *   post:
 *     summary: Send money to another user
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderUsername:
 *                 type: string
 *                 description: Username of the sender
 *               receiverUsername:
 *                 type: string
 *                 description: Username of the receiver
 *               amount:
 *                 type: number
 *                 description: Amount to send
 *     responses:
 *       200:
 *         description: Money sent successfully
 *       400:
 *         description: Insufficient balance or missing fields
 *       404:
 *         description: Sender or receiver not found
 */
relationshipRouter.post("/sendMoney", sendMoney);

// /**
//  * @swagger
//  * /api/relationship/requestMoney:
//  *   post:
//  *     summary: Request money from another user
//  *     tags:
//  *       - Transactions
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               senderId:
//  *                 type: integer
//  *               receiverId:
//  *                 type: integer
//  *               amount:
//  *                 type: number
//  *     responses:
//  *       201:
//  *         description: Money request sent successfully
//  */
// relationshipRouter.post("/requestMoney", requestMoney);

/**
 * @swagger
 * /api/relationship/requestMoney:
 *   post:
 *     summary: Request money from another user with a repayment date
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - senderUsername
 *               - receiverUsername
 *               - amount
 *               - repaymentDate
 *             properties:
 *               senderUsername:
 *                 type: string
 *                 description: The username of the sender requesting money
 *               receiverUsername:
 *                 type: string
 *                 description: The username of the receiver
 *               amount:
 *                 type: number
 *                 description: Amount of money requested
 *               repaymentDate:
 *                 type: string
 *                 format: date-time
 *                 description: The agreed date when the amount must be repaid
 *     responses:
 *       201:
 *         description: Money request sent successfully
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Sender or Receiver not found
 *       500:
 *         description: Internal server error
 */
relationshipRouter.post("/requestMoney", requestMoney);


/**
 * @swagger
 * /api/relationship/respondToRequest:
 *   post:
 *     summary: Respond to a money request
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: integer
 *               response:
 *                 type: string
 *                 enum: ["approved", "declined"]
 *     responses:
 *       200:
 *         description: Money request response recorded
 */
relationshipRouter.post("/respondToRequest", respondToMoneyRequest);

/**
 * @swagger
 * /api/relationship/getMoneyRequests:
 *   post:
 *     summary: Get money requests received
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: List of money requests received
 */
relationshipRouter.post("/getMoneyRequests", getMoneyRequests);

relationshipRouter.post("/getSentMoneyRequests", getSentMoneyRequests);


/**
 * @swagger
 * /api/relationship/getTransactionHistory:
 *   post:
 *     summary: Retrieve the transaction history for a user
 *     description: Fetches the list of all transactions related to a specific user, including sent and received money requests.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The unique identifier of the user whose transaction history is being requested.
 *             required:
 *               - userId
 *     responses:
 *       "200":
 *         description: Successfully retrieved transaction history
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
 *                       transactionId:
 *                         type: string
 *                         description: Unique identifier for the transaction
 *                       senderUsername:
 *                         type: string
 *                         description: The username of the person who sent the money
 *                       receiverUsername:
 *                         type: string
 *                         description: The username of the person who received the money
 *                       amount:
 *                         type: number
 *                         format: float
 *                         description: The amount of money involved in the transaction
 *                       status:
 *                         type: string
 *                         enum: [pending, completed, failed]
 *                         description: The current status of the transaction
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the transaction was created
 *       "400":
 *         description: Bad request, missing or invalid userId
 *       "500":
 *         description: Internal server error
 */
 relationshipRouter.post('/getTransactionHistory', getTransactionHistory);

/**
 * @swagger
 * /api/relationship/getUserBalance:
 *   post:
 *     summary: Retrieve the balance of a user
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *                 description: The unique identifier of the user whose balance is being requested.
 *             required:
 *               - userId
 *     responses:
 *       "200":
 *         description: Successfully retrieved user balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *                   description: The current balance of the user
 *       "400":
 *         description: Bad request, missing or invalid userId
 *       "500":
 *         description: Internal server error
 */
relationshipRouter.post('/getUserBalance', getUserBalance);

// module.exports = relationshipRouter;
export default relationshipRouter;