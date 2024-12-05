// src/index.js
const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const itemRoutes = require('./routes/itemRoutes');
const relationshipRoutes = require('./routes/relationshipRoutes');



const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());


// Routes
app.use('/api/auth', userRoutes);
app.use('/api/item', itemRoutes);
app.use('/api/relationship', relationshipRoutes);




// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
