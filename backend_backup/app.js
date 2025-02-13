const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();
const mongoURI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5001;

mongoose.connect(mongoURI).then(() => {
    console.log('MongoDB Connected');
}).catch((err) => {
    console.log('MongoDB Connection Error: ', err);
});



app.get('/', (req, res) => {
    res.send('Hello World');
});


app.listen(PORT, () => {
    console.log('Server running on port 5001');
});