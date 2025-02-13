// const express = require("express");
// const { getRentalItems } = require("../controllers/rentalController");

// const rentalRouter = express.Router();

// /**
//  * @swagger
//  * /api/rental/rentals:
//  *   get:
//  *     summary: Retrieve all rental items
//  *     tags: [Rentals]
//  *     description: Fetch all items available for rent.
//  *     responses:
//  *       200:
//  *         description: List of rental items
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: integer
//  *                     description: The unique ID of the rental item.
//  *                   owner_id:
//  *                     type: integer
//  *                     description: ID of the item owner.
//  *                   item_name:
//  *                     type: string
//  *                     description: Name of the rental item.
//  *                   category:
//  *                     type: string
//  *                     description: Category of the item.
//  *                   rental_price:
//  *                     type: number
//  *                     format: decimal
//  *                     description: Rental price of the item.
//  *                   location:
//  *                     type: string
//  *                     description: Location of the item.
//  *                   created_at:
//  *                     type: string
//  *                     format: date-time
//  *                     description: Timestamp when the item was listed for rent.
//  *       500:
//  *         description: Internal server error
//  */
// rentalRouter.get("/rentals", getRentalItems);

// module.exports = rentalRouter;

// const express = require("express");
import express from 'express';
import {
    getRentalItems,
    submitRentalOffer,
    acceptRentalOffer,
    rejectRentalOffer,
    getOffersForItem,
    getUserRentalOffers,getUserRentalHistoryOffers
    
} from '../controllers/rentalController.js'

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

/**
 * @swagger
 * /api/rental/offers/history/user/{user_id}:
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

rentalRouter.get("/offers/history/user/:user_id", getUserRentalHistoryOffers
);

// module.exports = rentalRouter;
export default rentalRouter;
































































































































































































































































































