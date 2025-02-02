// // src/routes/relationshipRoutes.js
// const express = require('express');

// const {
//     requestRelationship,
//     approveRelationship,
//     deleteRelationship,
//     blockRelationship,
//     getAllFriends,
//     getAllFriendRequestsReceived,
//     getAllFriendRequestsSent,
//     getBlockedRelationships,
//     sendMoney,
//     requestMoney,
//     respondToMoneyRequest,
//     getMoneyRequests,
//     getTransactionHistory,
//     getSentMoneyRequests
// } = require('../controllers/relationshipController');

// const relationshipRouter = express.Router();

// // Route to make a relationship request
// relationshipRouter.post('/request', requestRelationship);

// // Route to approve a relationship request
// relationshipRouter.put('/approve', approveRelationship);

// // Route to delete a relationship / reject a relationship request
// relationshipRouter.delete('/delete', deleteRelationship);

// // Route to block a relationship
// relationshipRouter.put('/block', blockRelationship);

// // Route to get all friends of a user
// relationshipRouter.get('/friends/:userId', getAllFriends);
// relationshipRouter.post('/getTransactionHistory', getTransactionHistory);

// // Route to get all friend requests received by a user
// relationshipRouter.get('/requests/received/:userId', getAllFriendRequestsReceived);

// // Route to get all friend requests sent by a user
// relationshipRouter.get('/requests/sent/:userId', getAllFriendRequestsSent);

// // Route to get all blocked relationships of a user
// relationshipRouter.get('/blocked/:userId', getBlockedRelationships);

// relationshipRouter.post('/sendMoney', sendMoney);

// // Route to request money
// relationshipRouter.post('/requestMoney', requestMoney);

// // Route to respond to money request
// relationshipRouter.post('/respondToRequest', respondToMoneyRequest);

// relationshipRouter.post('/getMoneyRequests', getMoneyRequests);
// relationshipRouter.post('/getSentMoneyRequests', getSentMoneyRequests);

// module.exports = relationshipRouter;

const express = require("express");
const {
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
    getUserBalance
} = require("../controllers/relationshipController");

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

/**
 * @swagger
 * /api/relationship/friends/{userId}:
 *   get:
 *     summary: Get all friends of a user
 *     tags:
 *       - Relationships
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of friends
 */
relationshipRouter.get("/friends/:userId", getAllFriends);

/**
 * @swagger
 * /api/relationship/requests/received/{userId}:
 *   get:
 *     summary: Get all friend requests received
 *     tags:
 *       - Relationships
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of friend requests received
 */
relationshipRouter.get("/requests/received/:userId", getAllFriendRequestsReceived);

/**
 * @swagger
 * /api/relationship/requests/sent/{userId}:
 *   get:
 *     summary: Get all friend requests sent
 *     tags:
 *       - Relationships
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of friend requests sent
 */
relationshipRouter.get("/requests/sent/:userId", getAllFriendRequestsSent);

/**
 * @swagger
 * /api/relationship/blocked/{userId}:
 *   get:
 *     summary: Get all blocked users
 *     tags:
 *       - Relationships
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of blocked users
 */
relationshipRouter.get("/blocked/:userId", getBlockedRelationships);

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
 *               senderId:
 *                 type: integer
 *               receiverId:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Money sent successfully
 *       400:
 *         description: Insufficient balance
 */
relationshipRouter.post("/sendMoney", sendMoney);

/**
 * @swagger
 * /api/relationship/requestMoney:
 *   post:
 *     summary: Request money from another user
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               senderId:
 *                 type: integer
 *               receiverId:
 *                 type: integer
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Money request sent successfully
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

module.exports = relationshipRouter;
