// src/routes/userRoutes.js
const express = require('express');
const multer = require("multer");

const { createUser, loginUser, updateUser, updatePhoto } = require('../controllers/userController');

const userRouter = express.Router();

const upload = multer({ storage: multer.memoryStorage() });


// Route to create a user
userRouter.post('/register', createUser);

// Route to login a user
userRouter.post('/login', loginUser);

//Route to update a user
userRouter.put('/update', updateUser);

//Route to update a user's photo
userRouter.post('/photo', upload.single("file"), updatePhoto);

module.exports = userRouter;
