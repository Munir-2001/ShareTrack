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

// const getItemOwnerPhoneNumber = async (req, res) => {
//     try {
//         const { itemId } = req.body; // 📌 Accept `itemId` in request

//         if (!itemId) {
//             return res.status(400).json({ message: "Item ID is required" });
//         }

//         // ✅ Fetch item details to get the owner's ID
//         const { data: item, error: itemError } = await supabase
//             .from("items")
//             .select("owner_id") 
//             .eq("id", itemId)
//             .single();

//         if (!item || itemError) {
//             return res.status(404).json({ message: "Item not found" });
//         }

//         // ✅ Fetch owner's phone number
//         const { data: owner, error: ownerError } = await supabase
//             .from("users")
//             .select("id, username, phonenumber")
//             .eq("id", item.owner_id)
//             .single();

//         if (!owner || ownerError) {
//             return res.status(404).json({ message: "Owner not found" });
//         }

//         return res.status(200).json({
//             owner_id: owner.id,
//             owner_username: owner.username,
//             owner_phone: owner.phonenumber,
//         });

//     } catch (error) {
//         console.error("Error fetching item owner's phone number:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };


// const getItemOwnerPhoneNumber = async (req, res) => {
//     try {
//         const { itemName } = req.body; // 🔥 Accept `itemName` instead of `itemId`

//         if (!itemName) {
//             return res.status(400).json({ message: "Item name is required" });
//         }

//         console.log(`🔍 Searching for item: ${itemName}`);

//         // ✅ Fetch item details using `name` instead of `id`
//         const { data: item, error: itemError } = await supabase
//             .from("items")
//             .select("id, owner_id") 
//             .eq("name", itemName)
//             .single(); // Ensure we fetch one item

//         if (itemError) {
//             console.error("❌ Supabase Error:", itemError);
//             return res.status(500).json({ message: "Database error while fetching item." });
//         }

//         if (!item) {
//             console.log(`❌ Item with name '${itemName}' not found.`);
//             return res.status(404).json({ message: "Item not found" });
//         }

//         console.log(`✅ Found Item: ${JSON.stringify(item)}`);

//         // ✅ Fetch owner's phone number
//         const { data: owner, error: ownerError } = await supabase
//             .from("users")
//             .select("id, username, phone")
//             .eq("id", item.owner_id)
//             .single();

//         if (ownerError) {
//             console.error("❌ Supabase Error:", ownerError);
//             return res.status(500).json({ message: "Database error while fetching owner." });
//         }

//         if (!owner) {
//             console.log(`❌ Owner with ID ${item.owner_id} not found.`);
//             return res.status(404).json({ message: "Owner not found" });
//         }

//         console.log(`✅ Found Owner: ${JSON.stringify(owner)}`);

//         return res.status(200).json({
//             owner_id: owner.id,
//             owner_username: owner.username,
//             owner_phone: owner.phone,
//         });

//     } catch (error) {
//         console.error("❌ Error fetching item owner's phone number:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };


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

module.exports = {getItemOwnerPhoneNumber, createItem, getAllItems, getItemById, getItemByOwner, updateItem, deleteItem };
