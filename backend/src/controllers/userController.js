// const bcrypt = require("bcrypt");
import bcrypt from 'bcrypt'
// const { supabase } = require("../config/db");
import {supabase} from '../config/db.js'
import { uploadToStorage } from '../config/storage.js';
// import supabase from '../config/db.js'
// Register a new user, ensuring no repeated email, username, or phone
// const { uploadToStorage } = require('../config/storage'); 
const createUser = async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;

    // Check if the user already exists
    const { data: existingUser, error: userError } = await supabase
      .from("users")
      .select("*")
      .or(`email.eq.${email},phone.eq.${phone},username.eq.${username}`)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

       // ✅ Insert user and return the new record

       const { data: newUser, error } = await supabase

       .from("users")
 
       .insert([
 
         {
 
           username,
 
           phone,
 
           email,
 
           password: hashedPassword,
 
         },
 
       ])
 
       .select() // ✅ This ensures Supabase returns the created user

    if (error) throw error;

    
    // ✅ Send back the new user data

    res.status(201).json({ 

      message: "User registered successfully", 

      data: newUser[0] // ✅ Send only the user object, not an array

    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Log in user by comparing hashed passwords
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user
    const { data: user, error } = await supabase
      .from("users")
      // .select("id, username, phone, email, password,balance,credit_score,is_active,photo")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.is_active) {
      return res.status(403).json({ message: "Account is deactivated. Please contact support." });
    }
    

    // Check password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    delete user.password; // Remove password from response

    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// const updateUser = async (req, res) => {
//     try {
//         const { phone, email, password } = req.body;
//         const userId = req.user?.id; // Ensure userId is retrieved correctly

       

//         // Fetch user details
//         const { data: user, error: userError } = await supabase
//             .from("users")
//             .select("id, username, phone, email, password")
//             .eq("id", userId)
//             .single();

//         if (userError || !user) {
//             return res.status(404).json({ message: "User not found" });
//         }

//         // Prevent username update
//         if (req.body.username && req.body.username !== user.username) {
//             return res.status(400).json({ message: "Username cannot be changed" });
//         }

//         // Update user details
//         const updatedData = {
//             phone: phone || user.phone,
//             email: email || user.email,
//             password: password || user.password,
//         };

//         // If a new password is provided, hash it
//         if (password) {
//             updatedData.password = await bcrypt.hash(password, 10);
//         }

//         const { error: updateError } = await supabase
//             .from("users")
//             .update(updatedData)
//             .eq("id", userId);

//         if (updateError) throw updateError;

//         res.status(200).json({ message: "User details updated successfully" });
//     } catch (err) {
//         res.status(400).json({ message: err.message });
//     }
// };

const updateUser = async (req, res) => {
  try {
      
      const { id } = req.params; // Get ID from URL
      const { phone, email, age, gender, marital_status, education_level, employment_status,city } = req.body;
    
      if (!id) {
          return res.status(400).json({ message: "User ID is required" });
      }

      const { error } = await supabase
          .from("users")
          .update({ phone, email, age, gender, marital_status, education_level, employment_status, city })
          .eq("id", id); // Match ID from request body

      if (error) throw error;

      const { data: updatedUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("id", id)
          .single();

      if (fetchError) throw fetchError;
      
    
      res.status(200).json(updatedUser);
  } catch (error) {
      res.status(500).json({ message: "Error updating profile", error: error.message });
  }
};

// Update user details
const updateUserDetails = async (req, res) => {
  try {
    const { username, phone, email, password } = req.body;
    const userId = req.user.id; // Extract user ID from token

    // Fetch user
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user details
    const updatedData = {
      username: username || user.username,
      phone: phone || user.phone,
      email: email || user.email,
    };

    // If a new password is provided, hash it
    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    const { error: updateError } = await supabase
      .from("users")
      .update(updatedData)
      .eq("id", userId);

    if (updateError) throw updateError;

    res.status(200).json({ message: "User details updated successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update user profile picture
const updatePhoto = async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Request file:", req.file); 
  try {
    const { username } = req.body;
    const photo = req.file; // Multer adds this to req

    if (!photo) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Set filename as username + timestamp
    const filename = `${username}-${Date.now()}`;
    photo.originalname = `${filename}.${photo.originalname.split(".").pop()}`;

    const photoUrl = await uploadToStorage(photo, "profilepictures");

    // Update user record
    const { error } = await supabase
      .from("users")
      .update({ photo: photoUrl })
      .eq("username", username);

    if (error) throw error;

    res.status(200).json({ photoUrl });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("user ID :", id);
    // Fetch user's profile picture URL from Supabase
    const { data, error } = await supabase
      .from('users')
      .select('photo')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return res.status(500).json({ error: 'Error fetching user data' });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profilePicturePath = data.photo;

    // Delete image from Supabase Storage if it exists
    if (profilePicturePath) {
      const fileName = profilePicturePath.split('/').pop(); // Extract file name from URL

      const { error: deleteError } = await supabase
        .storage
        .from('photos') // Adjust bucket name if needed
        .remove([fileName]);

      if (deleteError) {
        console.error('Error deleting image from Supabase:', deleteError);
      }
    }

    // Update user record to remove profile picture reference
    const { error: updateError } = await supabase
      .from('users')
      .update({ photo: null })
      .eq('id', id);

    if (updateError) {
      return res.status(500).json({ error: 'Failed to update user record' });
    }

    res.json({ message: 'Profile picture removed successfully' });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// export { createUser, loginUser, updateUser, updatePhoto, updateUserDetails };
export { createUser, loginUser, updateUser, updatePhoto, updateUserDetails,deleteImage };
