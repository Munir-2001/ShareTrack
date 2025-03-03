// const { supabase } = require("../config/db");
import {supabase} from '../config/db.js'
import bcrypt from "bcrypt";  
import jwt from "jsonwebtoken"; 

/**
 * Admin Login
 */
export const adminLogin = async (req, res) => {
    const { email, password } = req.body;
  
    // ✅ Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
  
    try {
      // ✅ Check if user exists in Supabase
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
  
      if (error || !user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // ✅ Check if user is an admin
      if (!user.role=="admin") {
        return res.status(403).json({ error: "Access denied: Not an admin" });
      }
  
      // ✅ Validate password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
  
      // ✅ Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );
  
      res.status(200).json({ message: "Admin login successful", token });
    } catch (error) {
      console.error("❌ Error during admin login:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
/**
 * Get all users
 */
 const getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update user account status
 */
const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const { error } = await supabase
      .from("users")
      .update({ is_active: isActive })
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: `User ${isActive ? "activated" : "deactivated"} successfully` });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getUserDetails = async (req, res) => {
  const { id } = req.params;

  try {
    // ✅ Fetch user details from Supabase
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * Get reported users
 */
const getReportedUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("reports").select("id, user_id, reason, status");

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching reported users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Resolve a user report
 */
const resolveReport = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("reports")
      .update({ status: "resolved" })
      .eq("id", id);

    if (error) throw error;

    res.status(200).json({ message: "Report resolved successfully" });
  } catch (error) {
    console.error("Error resolving report:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//  const admingetPendingRentals = async (req, res) => {
//     try {
//       const { data, error } = await supabase
//         .from("rental_items")
//         .select("*")
//         .eq("status", "under_review"); // ✅ Fetch only items under review
  
//       if (error) throw error;
  
//       res.status(200).json(data);
//     } catch (error) {
//       console.error("Error fetching pending rentals:", error);
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   };
  

const admingetPendingRentals = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("rental_items")
      .select("*, users:owner_id(username, email)") // ✅ Fetch owner details
      .eq("status", "under_review");

    if (error) throw error;

    // ✅ Remove `users` object, but keep extracted owner details
    const formattedData = data.map(({ users, ...rental }) => ({
      ...rental, // ✅ Keep all existing fields
      owner_name: users?.username || "Unknown", // ✅ Extracted owner's username
      owner_email: users?.email || "Unknown",   // ✅ Extracted owner's email
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error("Error fetching pending rentals:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const adminapproveRental = async (req, res) => {
    const { id } = req.params;
  
    try {
      const { error } = await supabase
        .from("rental_items")
        .update({ status: "available", rejection_reason: null }) 
        .eq("id", id);
  //status set as available so we can continue flow. no need for approved.
      if (error) throw error;
  
      res.status(200).json({ message: "Rental item approved successfully" });
    } catch (error) {
      console.error("Error approving rental:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
   const adminrejectRental = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
  
    if (!reason) {
      return res.status(400).json({ error: "Rejection reason is required" });
    }
  
    try {
      const { error } = await supabase
        .from("rental_items")
        .update({ status: "rejected", rejection_reason: reason }) // ✅ Store rejection reason
        .eq("id", id);
  
      if (error) throw error;
  
      res.status(200).json({ message: "Rental item rejected successfully" });
    } catch (error) {
      console.error("Error rejecting rental:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  
  // const getTransactions = async (req, res) => {
  //   try {
  //     const { page = 1, pageSize = 10, amount, sender, receiver } = req.query;
  //     const offset = (parseInt(page) - 1) * parseInt(pageSize);
  //     const limit = parseInt(pageSize); // Ensure proper row limit
  
  //     let query = supabase
  //       .from("transactions")
  //       .select(
  //         "id, sender_id, receiver_id, amount, status, transaction_type, created_at, users_sender:sender_id(username), users_receiver:receiver_id(username)",
  //         { count: "exact" }
  //       )
  //       .range(offset, offset + limit - 1); // ✅ Apply proper limit
  
  //     if (amount) query = query.eq("amount", amount);
  //     if (sender) query = query.ilike("users_sender.username", `%${sender}%`);
  //     if (receiver) query = query.ilike("users_receiver.username", `%${receiver}%`);
  
  //     const { data, count, error } = await query;
  
  //     if (error) throw error;
  
  //     res.status(200).json({
  //       transactions: data.map((tx) => ({
  //         ...tx,
  //         sender_username: tx.users_sender?.username || "Unknown",
  //         receiver_username: tx.users_receiver?.username || "Unknown",
  //       })),
  //       totalPages: Math.ceil(count / limit), // ✅ Ensure correct total pages
  //     });
  //   } catch (error) {
  //     console.error("Error fetching transactions:", error);
  //     res.status(500).json({ error: "Internal Server Error" });
  //   }
  // };
  const getTransactions = async (req, res) => {
    try {
        // Fetch all transactions from the database without pagination
        let query = supabase
            .from("transactions")
            .select(
                "id, sender_id, receiver_id, amount, status, transaction_type, created_at, users_sender:sender_id(username), users_receiver:receiver_id(username)"
            );

        const { data, error } = await query;

        if (error) throw error;

        // Transform the response to include sender & receiver usernames
        const transactions = data.map((tx) => ({
            id: tx.id,
            amount: tx.amount,
            status: tx.status,
            transaction_type: tx.transaction_type,
            created_at: tx.created_at,
            sender_id: tx.sender_id,
            sender_username: tx.users_sender?.username || "Unknown",
            receiver_id: tx.receiver_id,
            receiver_username: tx.users_receiver?.username || "Unknown",
        }));

        res.status(200).json({ transactions });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


  

  
export {resolveReport,getReportedUsers,updateUserStatus,getAllUsers,admingetPendingRentals,adminapproveRental,getTransactions,adminrejectRental}