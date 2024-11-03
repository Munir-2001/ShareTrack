// src/config/db.js
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;

const connectDB = async () => {
    mongoose.connect(mongoURI).then(() => {
        console.log('MongoDB Connected');
    }).catch((err) => {
        console.log('MongoDB Connection Error: ', err);
    });

};

module.exports = connectDB;
