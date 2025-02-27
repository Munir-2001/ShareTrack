// const { supabase } = require("../config/db");
import {supabase} from '../config/db.js'


const getItemOwnerPhoneNumber = async (req, res) => {
    try {
        const { itemName } = req.body; // 🔥 Accept `itemName` instead of `itemId`

        if (!itemName) {
            return res.status(400).json({ message: "Item name is required" });
        }

        console.log(`🔍 Searching for item: ${itemName}`);

        // ✅ Fetch item details using `name` instead of `id`
        const { data: item, error: itemError } = await supabase
            .from("items")
            .select("id, owner_id") 
            .eq("name", itemName)
            .single(); // Ensure we fetch one item

        if (itemError) {
            console.error("❌ Supabase Error:", itemError);
            return res.status(500).json({ message: "Database error while fetching item." });
        }

        if (!item) {
            console.log(`❌ Item with name '${itemName}' not found.`);
            return res.status(404).json({ message: "Item not found" });
        }

        console.log(`✅ Found Item: ${JSON.stringify(item)}`);

        // ✅ Fetch owner's phone number
        const { data: owner, error: ownerError } = await supabase
            .from("users")
            .select("id, username, phone") // ✅ Ensure correct column name
            .eq("id", item.owner_id)
            .single();

        if (ownerError) {
            console.error("❌ Supabase Error:", ownerError);
            return res.status(500).json({ message: "Database error while fetching owner." });
        }

        if (!owner) {
            console.log(`❌ Owner with ID ${item.owner_id} not found.`);
            return res.status(404).json({ message: "Owner not found" });
        }

        console.log(`✅ Found Owner: ${JSON.stringify(owner)}`);

        return res.status(200).json({
            owner_id: owner.id,
            owner_username: owner.username,
            owner_phone: owner.phone,  // ✅ Fix: Ensure correct key name
        });

    } catch (error) {
        console.error("❌ Error fetching item owner's phone number:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// const updateItemStatus = async (req, res) => {
//     try {
//         const { itemId, is_available } = req.body;

//         if (!itemId) {
//             return res.status(400).json({ message: "Item ID is required" });
//         }

//         console.log(`🔍 Updating item with ID: ${itemId}, New Status: ${is_available}`);

//         // ✅ Check if item exists first
//         const { data: existingItem, error: fetchError } = await supabase
//             .from("items")
//             .select("id, is_available")
//             .eq("id", itemId)
//             .single();

//         if (fetchError || !existingItem) {
//             console.error(`❌ Item with ID ${itemId} not found.`);
//             return res.status(404).json({ message: "Item not found" });
//         }

//         console.log(`✅ Item Found: ${JSON.stringify(existingItem)}`);

//         // ✅ Update item status in the database
//         const { data, error } = await supabase
//             .from("items")
//             .update({ is_available: isAvailable })
//             .eq("id", itemId)
//             .select();

//         if (error) {
//             console.error(`❌ Database Update Error: ${error.message}`);
//             throw error;
//         }

//         console.log(`✅ Item status updated: ${JSON.stringify(data)}`);

//         res.status(200).json({ message: "Item status updated successfully", data });
//     } catch (err) {
//         console.error(`❌ Server Error: ${err.message}`);
//         res.status(500).json({ message: "Error updating item status", error: err.message });
//     }
// };



// Create Item
const updateItemStatus = async (req, res) => {
    try {
        console.log("✅ Received request to update item status");

        const { itemId, is_available } = req.body;

        if (!itemId) {
            console.error("❌ Missing itemId in request");
            return res.status(400).json({ message: "Item ID is required" });
        }

        console.log(`🔍 Checking if item exists: ID = ${itemId}`);

        // Check if item exists first
        const { data: existingItem, error: fetchError } = await supabase
            .from("rental_items")
            .select("id, is_available")
            .eq("id", itemId)
            .single();

        if (fetchError || !existingItem) {
            console.error(`❌ Item with ID ${itemId} not found.`);
            return res.status(404).json({ message: "Item not found" });
        }

        console.log(`✅ Item Found: ${JSON.stringify(existingItem)}`);

        // Update item status
        const { data, error } = await supabase
            .from("items")
            .update({ is_available }) 
            .eq("id", itemId)
            .select();

        if (error) {
            console.error(`❌ Database Update Error: ${error.message}`);
            throw error;
        }

        console.log(`✅ Item status updated: ${JSON.stringify(data)}`);

        res.status(200).json({ message: "Item status updated successfully", data });
    } catch (err) {
        console.error(`❌ Server Error: ${err.message}`);
        res.status(500).json({ message: "Error updating item status", error: err.message });
    }
};




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

// module.exports = {getItemOwnerPhoneNumber,updateItemStatus, createItem, getAllItems, getItemById, getItemByOwner, updateItem, deleteItem };
export {getItemOwnerPhoneNumber,updateItemStatus, createItem, getAllItems, getItemById, getItemByOwner, updateItem, deleteItem };
