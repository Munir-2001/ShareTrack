import express from 'express';
import {
    createItem,
    getAllItems,
    getItemById,
    getItemByOwner,
    updateItem,
    deleteItem,
    updateItemStatus,
    getItemOwnerPhoneNumber
// } = require('../controllers/itemController.js');

} from '../controllers/itemController.js'
const itemRouter = express.Router();

/**
 * @swagger
 * /api/item/updateStatus:
 *   put:
 *     summary: Update the availability status of an item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: integer
 *                 description: The ID of the item to be updated.
 *                 example: 3
 *               is_available:
 *                 type: boolean
 *                 description: The new availability status of the item (true for available, false for inactive).
 *                 example: false
 *             required:
 *               - itemId
 *               - is_available
 *     responses:
 *       "200":
 *         description: Successfully updated item status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     is_available:
 *                       type: boolean
 *       "400":
 *         description: Bad request, missing item ID or status
 *       "404":
 *         description: Item not found
 *       "500":
 *         description: Internal server error
 */
itemRouter.put('/updateStatus', updateItemStatus);


/**
 * @swagger
 * /api/item/create:
 *   post:
 *     summary: Create a new rental item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - owner_id
 *               - city
 *               - state
 *               - country
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the item
 *               description:
 *                 type: string
 *                 description: Detailed description of the item
 *               price:
 *                 type: number
 *                 description: Rental price
 *               category:
 *                 type: string
 *                 description: Category of the item
 *               owner_id:
 *                 type: integer
 *                 description: Owner's user ID
 *               city:
 *                 type: string
 *                 description: City where the item is available
 *               state:
 *                 type: string
 *                 description: State where the item is available
 *               country:
 *                 type: string
 *                 description: Country where the item is available
 *               is_available:
 *                 type: boolean
 *                 description: Availability status of the item
 *     responses:
 *       201:
 *         description: Item created successfully
 */
itemRouter.post('/create', createItem);

/**
 * @swagger
 * /api/item/get-all:
 *   get:
 *     summary: Retrieve all rental items
 *     tags: [Items]
 *     responses:
 *       200:
 *         description: List of all items
 */
itemRouter.get('/get-all', getAllItems);

/**
 * @swagger
 * /api/item/owner/{owner_id}:
 *   get:
 *     summary: Retrieve all items owned by a user
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: owner_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Owner ID
 *     responses:
 *       200:
 *         description: List of user's items
 */
itemRouter.get('/owner/:owner_id', getItemByOwner);

/**
 * @swagger
 * /api/item/{id}:
 *   get:
 *     summary: Get an item by ID
 *     tags: [Items]
 */
itemRouter.get('/:id', getItemById);

/**
 * @swagger
 * /api/item/{id}:
 *   put:
 *     summary: Update an existing rental item
 *     tags: [Items]
 */
itemRouter.put('/:id', updateItem);

/**
 * @swagger
 * /api/item/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Items]
 */
itemRouter.delete('/:id', deleteItem);



// // ✅ Route to get the phone number of an item owner
// itemRouter.post("/getItemOwnerPhone", getItemOwnerPhoneNumber);


/**
 * @swagger
 * /api/item/getItemOwnerPhone:
 *   post:
 *     summary: Get phone number of the item's owner
 *     tags:
 *       - Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemName:
 *                 type: string
 *                 description: The name of the item whose owner’s phone number is required.
 *             required:
 *               - itemName
 *     responses:
 *       "200":
 *         description: Successfully retrieved owner phone number
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 owner_id:
 *                   type: integer
 *                 owner_username:
 *                   type: string
 *                 owner_phone:
 *                   type: string
 *       "400":
 *         description: Bad request, missing item name
 *       "404":
 *         description: Item or owner not found
 *       "500":
 *         description: Internal server error
 */
itemRouter.post("/getItemOwnerPhone", getItemOwnerPhoneNumber);


// module.exports = itemRouter;
export default itemRouter;
