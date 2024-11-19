// src/routes/userRoutes.js
const express = require('express');
const { createItem, getAllItems, getItemById, getItemByOwner, updateItem, deleteItem } = require('../controllers/itemController');

const itemRouter = express.Router();

// Route to create an item
itemRouter.post('/create', createItem);

// Route to get all items
itemRouter.get('/get-all', getAllItems);

// Route to get items by owner
itemRouter.get('/owner/:owner', getItemByOwner);

// Route to get an item by id
itemRouter.get('/:id', getItemById);

// Route to update an item
itemRouter.put('/:id', updateItem);

// Route to delete an item
itemRouter.delete('/:id', deleteItem);



module.exports = itemRouter;
