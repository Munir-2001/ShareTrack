// // src/config/db.js
// const mongoose = require('mongoose');
// const mongoURI = process.env.MONGO_URI;

// const connectDB = async () => {
//     mongoose.connect(mongoURI).then(() => {
//         console.log('MongoDB Connected');
//     }).catch((err) => {
//         console.log('MongoDB Connection Error: ', err);
//     });

// };

// module.exports = connectDB;
import dotenv from "dotenv";
dotenv.config();
import { createClient } from "@supabase/supabase-js";

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_KEY || "";

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase URL or API key in environment variables");
}

// Create Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);