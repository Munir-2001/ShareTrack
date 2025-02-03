// // src/routes/userRoutes.js
// const express = require('express');
// const { createItem, getAllItems, getItemById, getItemByOwner, updateItem, deleteItem } = require('../controllers/itemController');

// const itemRouter = express.Router();

// // Route to create an item
// itemRouter.post('/create', createItem);

// // Route to get all items
// itemRouter.get('/get-all', getAllItems);

// // Route to get items by owner
// itemRouter.get('/owner/:owner', getItemByOwner);

// // Route to get an item by id
// itemRouter.get('/:id', getItemById);

// // Route to update an item
// itemRouter.put('/:id', updateItem);

// // Route to delete an item
// itemRouter.delete('/:id', deleteItem);

// const express = require('express');
// const { createItem, getAllItems, getItemById, getItemByOwner, updateItem, deleteItem } = require('../controllers/itemController');

// const itemRouter = express.Router();

// // Route to create an item
// itemRouter.post('/create', createItem);

// // Route to get all items
// itemRouter.get('/get-all', getAllItems);

// // Route to get items by owner
// itemRouter.get('/owner/:owner_id', getItemByOwner);

// // Route to get an item by id
// itemRouter.get('/:id', getItemById);

// // Route to update an item
// itemRouter.put('/:id', updateItem);

// // Route to delete an item
// itemRouter.delete('/:id', deleteItem);

// module.exports = itemRouter;


const express = require('express');
const {
    createItem,
    getAllItems,
    getItemById,
    getItemByOwner,
    updateItem,
    deleteItem
} = require('../controllers/itemController');

const itemRouter = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Items
 *     description: API for managing rental items
 */

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
 *               - item_name
 *               - category
 *               - rental_price
 *               - location
 *               - owner_id
 *             properties:
 *               item_name:
 *                 type: string
 *                 description: Name of the item
 *               category:
 *                 type: string
 *                 description: Category of the item
 *               rental_price:
 *                 type: number
 *                 description: Price to rent the item
 *               location:
 *                 type: string
 *                 description: Location where the item is available
 *               owner_id:
 *                 type: integer
 *                 description: ID of the item owner
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Bad request, validation error
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   item_name:
 *                     type: string
 *                   category:
 *                     type: string
 *                   rental_price:
 *                     type: number
 *                   location:
 *                     type: string
 *                   owner_id:
 *                     type: integer
 */
itemRouter.get('/get-all', getAllItems);

/**
 * @swagger
 * /api/item/owner/{owner_id}:
 *   get:
 *     summary: Retrieve all items owned by a specific user
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: owner_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the owner whose items are being retrieved
 *     responses:
 *       200:
 *         description: List of items owned by the user
 *       404:
 *         description: Items not found
 */
itemRouter.get('/owner/:owner_id', getItemByOwner);

/**
 * @swagger
 * /api/item/{id}:
 *   get:
 *     summary: Retrieve a single item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the item to retrieve
 *     responses:
 *       200:
 *         description: Item retrieved successfully
 *       404:
 *         description: Item not found
 */
itemRouter.get('/:id', getItemById);

/**
 * @swagger
 * /api/item/{id}:
 *   put:
 *     summary: Update an existing rental item
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the item to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               item_name:
 *                 type: string
 *                 description: Name of the item
 *               category:
 *                 type: string
 *                 description: Category of the item
 *               rental_price:
 *                 type: number
 *                 description: Price to rent the item
 *               location:
 *                 type: string
 *                 description: Location where the item is available
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       400:
 *         description: Bad request, validation error
 *       404:
 *         description: Item not found
 */
itemRouter.put('/:id', updateItem);

/**
 * @swagger
 * /api/item/{id}:
 *   delete:
 *     summary: Delete an item by ID
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the item to delete
 *     responses:
 *       200:
 *         description: Item deleted successfully
 *       404:
 *         description: Item not found
 */
itemRouter.delete('/:id', deleteItem);

module.exports = itemRouter;
