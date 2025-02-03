// const { supabase } = require("../config/db");

// // Create Item
// const createItem = async (req, res) => {
//     try {
//         const { item_name, category, rental_price, location, owner_id } = req.body;
//         const { data, error } = await supabase.from("rental_items").insert([{ item_name, category, rental_price, location, owner_id }]).select();
//         if (error) throw error;
//         console.log("Item created:", data); // Logging
//         res.status(201).json(data);
//     } catch (err) {
//         console.error("Error creating item:", err.message); // Logging
//         res.status(400).json({ message: err.message });
//     }
// };

// // Get All Items
// const getAllItems = async (req, res) => {
//     try {
//         const { data, error } = await supabase.from("rental_items").select("*");
//         if (error) throw error;
//         console.log("Fetched all items:", data); // Logging
//         res.json(data);
//     } catch (err) {
//         console.error("Error fetching items:", err.message); // Logging
//         res.status(500).json({ message: err.message });
//     }
// };

// // Get Item by ID
// const getItemById = async (req, res) => {
//     try {
//         const { data, error } = await supabase.from("rental_items").select("*").eq("id", req.params.id).single();
//         if (error || !data) throw new Error("Item not found");
//         console.log("Fetched item by ID:", data); // Logging
//         res.json(data);
//     } catch (err) {
//         console.error("Error fetching item by ID:", err.message); // Logging
//         res.status(404).json({ message: "Item not found" });
//     }
// };

// // Get Items by Owner
// const getItemByOwner = async (req, res) => {
//     try {
//         const { data, error } = await supabase.from("rental_items").select("*").eq("owner_id", req.params.owner_id);
//         if (error) throw error;
//         console.log("Fetched items by owner:", data); // Logging
//         res.json(data);
//     } catch (err) {
//         console.error("Error fetching items by owner:", err.message); // Logging
//         res.status(404).json({ message: "Items not found" });
//     }
// };

// // Update Item
// const updateItem = async (req, res) => {
//     try {
//         const updates = req.body;
//         const { data, error } = await supabase.from("rental_items").update(updates).eq("id", req.params.id).select();
//         if (error || !data) throw new Error("Item not found");
//         console.log("Updated item:", data); // Logging
//         res.json(data);
//     } catch (err) {
//         console.error("Error updating item:", err.message); // Logging
//         res.status(404).json({ message: "Item not found" });
//     }
// };

// // Delete Item
// const deleteItem = async (req, res) => {
//     try {
//         const { data, error } = await supabase.from("rental_items").delete().eq("id", req.params.id);
//         if (error || !data) throw new Error("Item not found");
//         console.log("Deleted item:", data); // Logging
//         res.json({ message: "Item deleted" });
//     } catch (err) {
//         console.error("Error deleting item:", err.message); // Logging
//         res.status(404).json({ message: "Item not found" });
//     }
// };

// module.exports = { createItem, getAllItems, getItemById, getItemByOwner, updateItem, deleteItem };

const { supabase } = require("../config/db");

// Create Item
const createItem = async (req, res) => {
    try {
        const { name, description, price, category, owner_id, city, state, country, is_available } = req.body;
        const { data, error } = await supabase.from("items").insert([{ name, description, price, category, owner_id, city, state, country, is_available }]).select();
        if (error) throw error;
        res.status(201).json(data);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get All Items
const getAllItems = async (req, res) => {
    try {
        const { data, error } = await supabase.from("items").select("*");
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Get Item by ID
const getItemById = async (req, res) => {
    try {
        const { data, error } = await supabase.from("items").select("*").eq("id", req.params.id).single();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(404).json({ message: "Item not found" });
    }
};

// Get Items by Owner
const getItemByOwner = async (req, res) => {
    try {
        const { data, error } = await supabase.from("items").select("*").eq("owner_id", req.params.owner_id);
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(404).json({ message: "Items not found" });
    }
};

// Update Item
const updateItem = async (req, res) => {
    try {
        const updates = req.body;
        const { data, error } = await supabase.from("items").update(updates).eq("id", req.params.id).select();
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(404).json({ message: "Item not found" });
    }
};

// Delete Item
const deleteItem = async (req, res) => {
    try {
        const { data, error } = await supabase.from("items").delete().eq("id", req.params.id);
        if (error) throw error;
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(404).json({ message: "Item not found" });
    }
};

module.exports = { createItem, getAllItems, getItemById, getItemByOwner, updateItem, deleteItem };
