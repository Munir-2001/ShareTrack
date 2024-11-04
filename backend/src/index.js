// src/index.js
const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const cors = require('cors');
const { createUser } = require('./controllers/userController');

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
// const corsOptions = {
//     origin: '*',
//     optionsSuccessStatus: 200,
// };
// app.use(cors(corsOptions));


// Routes
app.use('/api/auth', userRoutes);


// app.post('/api/auth/register', (req, res) => {
//     createUser(req, res);
// })

// Home route
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
