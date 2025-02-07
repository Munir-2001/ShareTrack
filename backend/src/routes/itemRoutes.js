// const express = require('express');
// const {
//     createItem,
//     getAllItems,
//     getItemById,
//     getItemByOwner,
//     updateItem,
//     deleteItem
// } = require('../controllers/itemController');

// const itemRouter = express.Router();

// /**
//  * @swagger
//  * tags:
//  *   - name: Items
//  *     description: API for managing rental items
//  */

// /**
//  * @swagger
//  * /api/item/create:
//  *   post:
//  *     summary: Create a new rental item
//  *     tags: [Items]
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - item_name
//  *               - category
//  *               - rental_price
//  *               - location
//  *               - owner_id
//  *             properties:
//  *               item_name:
//  *                 type: string
//  *                 description: Name of the item
//  *               category:
//  *                 type: string
//  *                 description: Category of the item
//  *               rental_price:
//  *                 type: number
//  *                 description: Price to rent the item
//  *               location:
//  *                 type: string
//  *                 description: Location where the item is available
//  *               owner_id:
//  *                 type: integer
//  *                 description: ID of the item owner
//  *     responses:
//  *       201:
//  *         description: Item created successfully
//  *       400:
//  *         description: Bad request, validation error
//  */
// itemRouter.post('/create', createItem);

// /**
//  * @swagger
//  * /api/item/get-all:
//  *   get:
//  *     summary: Retrieve all rental items
//  *     tags: [Items]
//  *     responses:
//  *       200:
//  *         description: List of all items
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 type: object
//  *                 properties:
//  *                   id:
//  *                     type: integer
//  *                   item_name:
//  *                     type: string
//  *                   category:
//  *                     type: string
//  *                   rental_price:
//  *                     type: number
//  *                   location:
//  *                     type: string
//  *                   owner_id:
//  *                     type: integer
//  */
// itemRouter.get('/get-all', getAllItems);

// /**
//  * @swagger
//  * /api/item/owner/{owner_id}:
//  *   get:
//  *     summary: Retrieve all items owned by a specific user
//  *     tags: [Items]
//  *     parameters:
//  *       - in: path
//  *         name: owner_id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the owner whose items are being retrieved
//  *     responses:
//  *       200:
//  *         description: List of items owned by the user
//  *       404:
//  *         description: Items not found
//  */
// itemRouter.get('/owner/:owner_id', getItemByOwner);

// /**
//  * @swagger
//  * /api/item/{id}:
//  *   get:
//  *     summary: Retrieve a single item by ID
//  *     tags: [Items]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the item to retrieve
//  *     responses:
//  *       200:
//  *         description: Item retrieved successfully
//  *       404:
//  *         description: Item not found
//  */
// itemRouter.get('/:id', getItemById);

// /**
//  * @swagger
//  * /api/item/{id}:
//  *   put:
//  *     summary: Update an existing rental item
//  *     tags: [Items]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the item to update
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               item_name:
//  *                 type: string
//  *                 description: Name of the item
//  *               category:
//  *                 type: string
//  *                 description: Category of the item
//  *               rental_price:
//  *                 type: number
//  *                 description: Price to rent the item
//  *               location:
//  *                 type: string
//  *                 description: Location where the item is available
//  *     responses:
//  *       200:
//  *         description: Item updated successfully
//  *       400:
//  *         description: Bad request, validation error
//  *       404:
//  *         description: Item not found
//  */
// itemRouter.put('/:id', updateItem);

// /**
//  * @swagger
//  * /api/item/{id}:
//  *   delete:
//  *     summary: Delete an item by ID
//  *     tags: [Items]
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the item to delete
//  *     responses:
//  *       200:
//  *         description: Item deleted successfully
//  *       404:
//  *         description: Item not found
//  */
// itemRouter.delete('/:id', deleteItem);

// module.exports = itemRouter;


const express = require('express');
const {
    createItem,
    getAllItems,
    getItemById,
    getItemByOwner,
    updateItem,
    deleteItem,
    getItemOwnerPhoneNumber
} = require('../controllers/itemController');

const itemRouter = express.Router();

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



module.exports = itemRouter;
