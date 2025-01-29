// src/routes/relationshipRoutes.js
const express = require('express');

const {
    requestRelationship,
    approveRelationship,
    deleteRelationship,
    blockRelationship,
    getAllFriends,
    getAllFriendRequestsReceived,
    getAllFriendRequestsSent,
    getBlockedRelationships,
    sendMoney
} = require('../controllers/relationshipController');

const relationshipRouter = express.Router();

// Route to make a relationship request
relationshipRouter.post('/request', requestRelationship);

// Route to approve a relationship request
relationshipRouter.put('/approve', approveRelationship);

// Route to delete a relationship / reject a relationship request
relationshipRouter.delete('/delete', deleteRelationship);

// Route to block a relationship
relationshipRouter.put('/block', blockRelationship);

// Route to get all friends of a user
relationshipRouter.get('/friends/:userId', getAllFriends);

// Route to get all friend requests received by a user
relationshipRouter.get('/requests/received/:userId', getAllFriendRequestsReceived);

// Route to get all friend requests sent by a user
relationshipRouter.get('/requests/sent/:userId', getAllFriendRequestsSent);

// Route to get all blocked relationships of a user
relationshipRouter.get('/blocked/:userId', getBlockedRelationships);

relationshipRouter.post('/sendMoney', sendMoney);



module.exports = relationshipRouter;
