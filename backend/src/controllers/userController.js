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
      const { username, firstname, lastname, phone, email, password, nic, address, dob } = req.body;

      // ✅ Step 1: Check if the user already exists
      const { data: existingUser, error: userError } = await supabase
          .from("users")
          .select("*")
          .or(`email.eq.${email},phone.eq.${phone},username.eq.${username},nic.eq.${nic}`)
          .single();

      if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
      }

      // ✅ Step 2: Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // ✅ Step 3: Insert user into Supabase
      const { data: newUser, error: insertError } = await supabase
          .from("users")
          .insert([
              {
                  username,
                  firstname,
                  lastname,
                  phone,
                  email,
                  password: hashedPassword,
                  nic,
                  address,
                  dob,
              }
          ])
          .select();

      if (insertError) throw insertError;

      console.log("✅ User registered successfully:", newUser[0]);

      // ✅ Step 4: Call NIUM API using the registered user data (updates user inside this function)
      await createNiumCustomer(newUser[0]);

      res.status(201).json({
          message: "User registered successfully",
          data: newUser[0]
      });

  } catch (err) {
      console.error("❌ Error creating user:", err);
      res.status(400).json({ message: err.message });
  }
};

const createNiumCustomer = async (userData) => {
  const CLIENT_HASH_ID = '4f65e729-869a-4a62-a12e-032abfccd401';  // Load from .env

  const url = `https://gateway.nium.com/api/v4/client/${CLIENT_HASH_ID}/customer`;

  const headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': 'WPVLt88We83qV3Q7eqAKV5o08U4Z5hvJ5GBaf9Wj'
  };

  const body = {
      billingAddress1: userData.address,
      billingCity: "Karachi",
      billingCountry: "PK",
      billingState: "SD",
      billingZipCode: "74600",
      correspondenceAddress1: userData.address,
      correspondenceCity: "Karachi",
      correspondenceCountry: "PK",
      correspondenceState: "SD",
      correspondenceZipCode: "75290",
      dateOfBirth: '1995-03-25',  // ✅ Use actual DOB from user
      deliveryAddress1: userData.address,
      deliveryCity: "Karachi",
      deliveryCountry: "PK",
      countryCode: "PK",
      deliveryState: "SD",
      deliveryZipCode: "74600",
      email: userData.email,
      firstName: userData.firstname,
      gender: "Male",
      lastName: userData.lastname,
      mobile: userData.phone,
      nationality: "PK",
      preferredName: userData.username,
      verificationConsent: true,
      identificationDoc: [
          {
              identificationType: 'National Id',
              identificationValue: userData.nic,
          }
      ]
  };

  console.log("📤 Sending Data to NIUM API:", JSON.stringify(body, null, 2));

  try {
      const response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body)
      });

      if (!response.ok) {
          throw new Error(`NIUM API Error: ${response.status}`);
      }

      const niumData = await response.json();
      console.log("✅ NIUM Customer Created:", niumData);

      // ✅ Step 5: Update User in Supabase with NIUM `customerHashId` & `walletHashId`
      const { data: updatedUser, error: updateError } = await supabase
          .from("users")
          .update({
              customerHashId: niumData.customerHashId,
              walletHashId: niumData.walletHashId
          })
          .eq("email", userData.email)
          .select();

      if (updateError) throw updateError;

      console.log("✅ User updated successfully in Supabase:", updatedUser[0]);

      return niumData;

  } catch (error) {
      console.error("❌ NIUM API Error:", error);
      throw error;
  }
};

export const getReceivablesPayables = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch transactions where the user is either sender or receiver
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) throw error;

    let receivables = 0;
    let payables = 0;

    transactions.forEach((transaction) => {
      const { sender_id, receiver_id, amount, status } = transaction;

      if (sender_id == userId) {
        if (status === "approved") {
          payables += amount; // User owes this amount (sent money)
        }
        if (status === "pending") {
          receivables += amount; // User expects this amount back
        }
      }

      if (receiver_id == userId) {
        if (status === "approved") {
          receivables += amount; // Someone owes this amount to the user
        }
        if (status === "pending") {
          payables += amount; // User still needs to pay this amount
        }
      }
    });

    // Ensure receivables don't go negative
    receivables = Math.max(receivables, 0);

    console.log('Receivables:', receivables);
    console.log('Payables:', payables);

    res.status(200).json({ receivables, payables });
  } catch (err) {
    res.status(500).json({ message: "Error fetching data", error: err.message });
  }
};

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
