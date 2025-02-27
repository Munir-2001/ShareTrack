

import express from 'express';
import {
    getRentalItems,
    submitRentalOffer,
    acceptRentalOffer,
    rejectRentalOffer,
    getOffersForItem,
    getUserRentalOffers,
    createRentalItem,
    getUserRentalHistoryOffers,
    getUserRentalItems
} from '../controllers/rentalController.js'
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() }); // Stores file in memory

const rentalRouter = express.Router();

/**
 * @swagger
 * /api/rental/rentals:
 *   get:
 *     summary: Retrieve all rental items
 *     tags: [Rentals]
 *     description: Fetch all items available for rent.
 *     responses:
 *       200:
 *         description: List of rental items
 *       500:
 *         description: Internal server error
 */
rentalRouter.get("/rentals", getRentalItems);

/**
 * @swagger
 * /api/rental/user/{user_id}:
 *   get:
 *     summary: Get rental items submitted by a user
 *     tags: [Rentals]
 *     description: Fetch all rental items created by a specific user.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user who submitted the rentals
 *     responses:
 *       200:
 *         description: List of rental items
 *       400:
 *         description: Missing user ID
 *       500:
 *         description: Internal server error
 */
rentalRouter.get("/user/:user_id", getUserRentalItems);
/**
 * @swagger
 * /api/rental/offer:
 *   post:
 *     summary: Submit a rental offer
 *     tags: [Rentals]
 *     description: Allow a user to submit a rental price offer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_id:
 *                 type: integer
 *               renter_id:
 *                 type: integer
 *               proposed_price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Rental offer submitted successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
rentalRouter.post("/offer", submitRentalOffer);

/**
 * @swagger
 * /api/rental/offer/accept:
 *   put:
 *     summary: Accept a rental offer
 *     tags: [Rentals]
 *     description: Allow the owner to accept a rental offer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               offer_id:
 *                 type: integer
 *               rental_start:
 *                 type: string
 *                 format: date-time
 *               rental_end:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Offer accepted
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
rentalRouter.put("/offer/accept", acceptRentalOffer);

/**
 * @swagger
 * /api/rental/offer/reject:
 *   put:
 *     summary: Reject a rental offer
 *     tags: [Rentals]
 *     description: Allow the owner to reject a rental offer.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               offer_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Offer rejected
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
rentalRouter.put("/offer/reject", rejectRentalOffer);

/**
 * @swagger
 * /api/rental/offers/{user_id}:
 *   get:
 *     summary: Get offers for a rental item
 *     tags: [Rentals]
 *     description: Retrieve all offers made for a specific rental item.
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the rental item
 *     responses:
 *       200:
 *         description: List of offers
 *       500:
 *         description: Internal server error
 */
rentalRouter.get("/offers/:item_id", getOffersForItem);
/**
 * @swagger
 * /api/rental/offers/user/{user_id}:
 *   get:
 *     summary: Get incoming & outgoing rental offers for a user
 *     tags: [Rentals]
 *     description: Fetch rental offers where the user is the **owner (incoming)** or **renter (outgoing)**.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of incoming & outgoing rental offers
 *       500:
 *         description: Internal server error
 */

rentalRouter.get("/offers/user/:user_id", getUserRentalOffers);
// rentalRouter.get("/offers/:user_id", getUserRentalOffers);


// /**
//  * @swagger
//  * /api/rental/createRentalItem:
//  *   post:
//  *     summary: Create a new rental item
//  *     description: Creates a new rental item in the database.
//  *     tags:
//  *       - Rentals
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               owner_id:
//  *                 type: integer
//  *                 description: ID of the user creating the rental item.
//  *               item_name:
//  *                 type: string
//  *                 description: Name of the rental item.
//  *               category:
//  *                 type: string
//  *                 description: Category of the rental item.
//  *               rental_price:
//  *                 type: number
//  *                 description: Price per day for renting the item.
//  *               location:
//  *                 type: string
//  *                 description: Location of the rental item.
//  *               status:
//  *                 type: string
//  *                 description: Status of the item, defaults to "available".
//  *     responses:
//  *       201:
//  *         description: Rental item created successfully
//  *       400:
//  *         description: Invalid input
//  *       500:
//  *         description: Server error
//  */
// rentalRouter.post("/createRentalItem", createRentalItem);
/**
 * @swagger
 * /api/rental/createRentalItem:
 *   post:
 *     summary: Create a new rental item with an image
 *     description: Creates a new rental item in the database and uploads an optional image.
 *     tags:
 *       - Rentals
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               owner_id:
 *                 type: integer
 *                 description: ID of the user creating the rental item.
 *               item_name:
 *                 type: string
 *                 description: Name of the rental item.
 *               category:
 *                 type: string
 *                 description: Category of the rental item.
 *               rental_price:
 *                 type: number
 *                 description: Price per day for renting the item.
 *               location:
 *                 type: string
 *                 description: Location of the rental item.
 *               status:
 *                 type: string
 *                 description: Status of the item, defaults to "available".
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the rental item.
 *     responses:
 *       201:
 *         description: Rental item created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */


rentalRouter.post("/createRentalItem", upload.single("photo"), createRentalItem);



// /**
//  * @swagger
//  * /api/rental/history/user/{user_id}:
//  *   get:
//  *     summary: Get incoming & outgoing rental offers for a user
//  *     tags: [Rentals]
//  *     description: Fetch rental offers where the user is the **owner (incoming)** or **renter (outgoing)**.
//  *     parameters:
//  *       - in: path
//  *         name: user_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the user
//  *     responses:
//  *       200:
//  *         description: List of incoming & outgoing rental offers
//  *       500:
//  *         description: Internal server error
//  */
// rentalRouter.get("/history/user/:user_id", getUserRentalHistoryOffers);


/**
 * @swagger
 * /api/rental/history/user/{user_id}:
 *   get:
 *     summary: Get all accepted & rejected rental offers (incoming & outgoing) for a user
 *     tags: [Rentals]
 *     description: Fetch past rental offers where the user is the **owner (incoming)** or **renter (outgoing)**.
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of accepted & rejected rental offers
 *       500:
 *         description: Internal server error
 */
rentalRouter.get("/history/user/:user_id", getUserRentalHistoryOffers);


// module.exports = rentalRouter;
export default rentalRouter;
































































































































































































































































































