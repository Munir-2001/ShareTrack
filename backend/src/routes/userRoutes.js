// src/routes/userRoutes.js
const express = require('express');
const { createUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// Route to create a user
router.post('/register', createUser);

// Route to login a user
router.post('/login', loginUser);

module.exports = router;
