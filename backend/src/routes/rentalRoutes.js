const express = require("express");
const { getRentalItems } = require("../controllers/rentalController");

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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: The unique ID of the rental item.
 *                   owner_id:
 *                     type: integer
 *                     description: ID of the item owner.
 *                   item_name:
 *                     type: string
 *                     description: Name of the rental item.
 *                   category:
 *                     type: string
 *                     description: Category of the item.
 *                   rental_price:
 *                     type: number
 *                     format: decimal
 *                     description: Rental price of the item.
 *                   location:
 *                     type: string
 *                     description: Location of the item.
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *                     description: Timestamp when the item was listed for rent.
 *       500:
 *         description: Internal server error
 */
rentalRouter.get("/rentals", getRentalItems);

module.exports = rentalRouter;
