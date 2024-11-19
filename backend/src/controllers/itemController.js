const Item = require('../models/Item');

//CRUD

const createItem = async (req, res) => {
    try {
        const { name, description, price, category, photos, owner, city, state, country, isAvailable, availableDates, bookings, rating } = req.body;
        const item = new Item({ name, description, price, category, photos, owner, city, state, country, isAvailable, availableDates, bookings, rating });
        await item.save();
        res.status(201).json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

const getAllItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        res.json(item);
    } catch (err) {
        res.status(404).json({ message: 'Item not found' });
    }
}

const getItemByOwner = async (req, res) => {
    try {
        const items = await Item.find({ owner: req.params.owner });
        res.json(items);
    } catch (err) {
        res.status(404).json({ message: 'Item not found' });
    }
}

const updateItem = async (req, res) => {
    try {
        const { name, description, price, category, photos, owner, city, state, country, isAvailable, availableDates, bookings, rating } = req.body;
        const item = await Item.findById(req.params.id);
        if (name) item.name = name;
        if (description) item.description = description;
        if (price) item.price = price;
        if (category) item.category = category;
        if (photos) item.photos = photos;
        if (owner) item.owner = owner;
        if (city) item.city = city;
        if (state) item.state = state;
        if (country) item.country = country;
        if (isAvailable) item.isAvailable = isAvailable;
        if (availableDates) item.availableDates = availableDates;
        if (bookings) item.bookings = bookings;
        if (rating) item.rating = rating;
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(404).json({ message: 'Item not found' });
    }
}

const deleteItem = async (req, res) => {
    try {
        await
            Item.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    }
    catch (err) {
        res.status(404).json({ message: 'Item not found' });
    }
}




module.exports = { createItem, getAllItems, getItemById, getItemByOwner, updateItem, deleteItem };
