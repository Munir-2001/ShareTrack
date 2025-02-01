// // src/routes/userRoutes.js
// const express = require('express');
// const multer = require("multer");

// const { createUser, loginUser, updateUser, updatePhoto, updateUserDetails } = require('../controllers/userController');

// const userRouter = express.Router();

// const upload = multer({ storage: multer.memoryStorage() });


// // Route to create a user
// userRouter.post('/register', createUser);

// // Route to login a user
// userRouter.post('/login', loginUser);

// //Route to update a user
// userRouter.put('/update', updateUser);

// //Route to update a user's photo
// userRouter.post('/photo', upload.single("file"), updatePhoto);

// // Route to update user details
// userRouter.put('/updateDetails', updateUserDetails);

// module.exports = userRouter;


const express = require("express");
const multer = require("multer");
const { createUser, loginUser, updateUser, updatePhoto, updateUserDetails } = require("../controllers/userController");

const userRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
userRouter.post("/register", createUser);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
userRouter.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/update:
 *   put:
 *     summary: Update user details
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details updated
 *       400:
 *         description: Bad request
 */
userRouter.put("/update", updateUser);

/**
 * @swagger
 * /api/auth/photo:
 *   post:
 *     summary: Upload user profile picture
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Profile photo uploaded
 *       400:
 *         description: No file uploaded
 */
userRouter.post("/photo", upload.single("file"), updatePhoto);

/**
 * @swagger
 * /api/auth/updateDetails:
 *   put:
 *     summary: Update user details
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User details updated
 *       400:
 *         description: Bad request
 */
userRouter.put("/updateDetails", updateUserDetails);

module.exports = userRouter;
