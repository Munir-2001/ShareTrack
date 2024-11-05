// src/routes/userRoutes.js
const express = require('express');
const { createUser, loginUser } = require('../controllers/userController');

const userRouter = express.Router();

// Route to create a user
userRouter.post('/register', createUser);

// Route to login a user
userRouter.post('/login', loginUser);

module.exports = userRouter;
