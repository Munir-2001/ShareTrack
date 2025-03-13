import {supabase} from '../config/db.js'
import { uploadToStorage } from '../config/storage.js';

const getRentalItems = async (req, res) => {
    try {
        const { username } = req.query; // Get the username from request query params

        console.log("🔍 Requested Username:", username);

        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        // ✅ Fetch the user's city from the users table
        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("city")
            .eq("username", username)
            .single();

        if (userError || !userData) {
            console.error("❌ Error fetching user city:", userError);
            return res.status(404).json({ message: "User not found" });
        }

        const userCity = userData.city;
        console.log("📌 User's City:", userCity);

        // ✅ Fetch rental items with owner usernames
        const { data: rentalItems, error: rentalError } = await supabase
            .from("rental_items")
            .select("*, users(username)")
            .eq("status", "available");

        if (rentalError) {
            console.error("❌ Supabase Error:", rentalError);
            return res.status(500).json({ message: "Database error while fetching rental items." });
        }

        console.log("✅ Fetched Rental Items:", rentalItems.length);

        // ✅ Prioritize rentals from user's city
        const sortedItems = rentalItems.sort((a, b) => {
            if (a.location === userCity && b.location !== userCity) return -1;
            if (b.location === userCity && a.location !== userCity) return 1;
            return a.rental_price - b.rental_price; // ✅ Sort by price within groups
        });

        return res.status(200).json(sortedItems);
    } catch (error) {
        console.error("❌ Error fetching rental items:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



const submitRentalOffer = async (req, res) => {
    try {
        const { item_id, renter_id, proposed_price } = req.body;

        if (!item_id || !renter_id || !proposed_price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Check if the item is still available
        const { data: item, error: itemError } = await supabase
            .from("rental_items")
            .select("status")
            .eq("id", item_id)
            .single();

        if (itemError || !item) {
            return res.status(404).json({ message: "Item not found." });
        }

        if (item.status === "rented") {
            return res.status(400).json({ message: "This item is already rented and not accepting new offers." });
        }

        // ✅ Insert the rental offer
        const { data, error } = await supabase
            .from("rental_offers")
            .insert([{ item_id, renter_id, proposed_price, status: "pending" }])
            .select();

        if (error) {
            console.error("❌ Error submitting rental offer:", error);
            return res.status(500).json({ message: "Database error while submitting rental offer." });
        }

        return res.status(201).json({ message: "Rental offer submitted!", data });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const getUserRentalOffers = async (req, res) => {
    try {
        const { user_id } = req.params;

        // ✅ Get incoming offers (where user is the owner of the rental item & offer is pending)
        const { data: incoming, error: incomingError } = await supabase
            .from("rental_offers")
            .select(`
                id, 
                item_id, 
                proposed_price, 
                status, 
                created_at, 
                users!rental_offers_renter_id_fkey(username),
                rental_items!inner(owner_id, item_name, rental_price)  
            `)
            .eq("rental_items.owner_id", user_id)
            .eq("status", "pending")  // ✅ Only pending offers
            .order("created_at", { ascending: false });

        // ✅ Get outgoing offers (where user is the renter & offer is pending)
        const { data: outgoing, error: outgoingError } = await supabase
            .from("rental_offers")
            .select(`
                id, 
                item_id, 
                proposed_price, 
                status, 
                created_at, 
                rental_items!inner(item_name, rental_price, owner_id),
                users!rental_offers_renter_id_fkey(username)  -- ✅ Get renter's name
            `)
            .eq("renter_id", user_id)
            .eq("status", "pending")  // ✅ Only pending offers
            .order("created_at", { ascending: false });

        if (incomingError || outgoingError) {
            console.error("❌ Error fetching rental offers:", incomingError || outgoingError);
            return res.status(500).json({ message: "Error fetching offers" });
        }

        return res.status(200).json({ 
            incoming: incoming.map(offer => ({
                id: offer.id,
                item_id: offer.item_id,
                item_name: offer.rental_items?.item_name,
                rental_price: offer.rental_items?.rental_price,  // ✅ Include original price
                proposed_price: offer.proposed_price,
                status: offer.status,
                renter_name: offer.users?.username || "Unknown User",  // ✅ Get renter name
                created_at: offer.created_at
            })),
            outgoing: outgoing.map(offer => ({
                id: offer.id,
                item_id: offer.item_id,
                item_name: offer.rental_items?.item_name,
                rental_price: offer.rental_items?.rental_price,  // ✅ Include original price
                proposed_price: offer.proposed_price,
                status: offer.status,
                renter_name: offer.users?.username || "Unknown User",  // ✅ Get renter's name (Corrected!)
                created_at: offer.created_at
            }))
        });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


// const acceptRentalOffer = async (req, res) => {
//     try {
//         const { offer_id, rental_start, rental_end } = req.body;

//         if (!offer_id || !rental_start || !rental_end) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         // ✅ Step 1: Get offer details
//         const { data: offer, error: offerError } = await supabase
//             .from("rental_offers")
//             .select("*")
//             .eq("id", offer_id)
//             .single();

//         if (offerError || !offer) {
//             return res.status(404).json({ message: "Offer not found." });
//         }

//         // ✅ Step 2: Update the rental item's status to 'rented'
//         const { error: itemError } = await supabase
//             .from("rental_items")
//             .update({ status: "rented" })
//             .eq("id", offer.item_id);

//         if (itemError) {
//             console.error("❌ Error updating item status:", itemError);
//             return res.status(500).json({ message: "Failed to update item status." });
//         }

//         // ✅ Step 3: Insert rental record in rental_histories
//         const { data: rentalData, error: rentalError } = await supabase
//             .from("rental_histories")
//             .insert([
//                 {
//                     item_id: offer.item_id,
//                     renter_id: offer.renter_id,
//                     rental_start,
//                     rental_end,
//                     total_amount_paid: offer.proposed_price,
//                     payment_status: "pending",
//                     offer_id: offer.id
//                 }
//             ])
//             .select();

//         if (rentalError) {
//             return res.status(500).json({ message: "Database error while approving rental." });
//         }

//         // ✅ Step 4: Update offer status to 'accepted'
//         await supabase
//             .from("rental_offers")
//             .update({ status: "accepted" })
//             .eq("id", offer_id);

//         return res.status(200).json({ message: "Offer accepted!", rentalData });
//     } catch (error) {
//         console.error("❌ Internal Server Error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };
// const rejectRentalOffer = async (req, res) => {
//     try {
//         const { offer_id } = req.body;

//         if (!offer_id) {
//             return res.status(400).json({ message: "Offer ID is required" });
//         }

//         const { data, error } = await supabase
//             .from("rental_offers")
//             .update({ status: "rejected" })
//             .eq("id", offer_id);

//         if (error) {
//             console.error("❌ Error rejecting rental offer:", error);
//             return res.status(500).json({ message: "Database error while rejecting rental offer." });
//         }

//         return res.status(200).json({ message: "Offer rejected!", data });
//     } catch (error) {
//         console.error("❌ Internal Server Error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

const acceptRentalOffer = async (req, res) => {
    try {
        const { offer_id, rental_start, rental_end } = req.body;

        if (!offer_id || !rental_start || !rental_end) {
            console.log("❌ Missing required fields in acceptRentalOffer:", { offer_id, rental_start, rental_end });
            return res.status(400).json({ message: "All fields are required" });
        }

        console.log(`📌 Fetching offer details for offer_id: ${offer_id}`);
        const { data: offer, error: offerError } = await supabase
            .from("rental_offers")
            .select("*")
            .eq("id", offer_id)
            .single();

        if (offerError || !offer) {
            console.error("❌ Offer not found:", offerError);
            return res.status(404).json({ message: "Offer not found." });
        }

        console.log(`📌 Updating rental item ${offer.item_id} status to 'rented'`);
        const { error: itemError } = await supabase
            .from("rental_items")
            .update({ is_available: false, status: "rented" }) // Make item unavailable
            .eq("id", offer.item_id);

        if (itemError) {
            console.error("❌ Error updating item status:", itemError);
            return res.status(500).json({ message: "Failed to update item status." });
        }

        console.log(`📌 Creating rental history record for item ${offer.item_id}`);
        const { data: rentalData, error: rentalError } = await supabase
            .from("rental_histories")
            .insert([
                {
                    item_id: offer.item_id,
                    renter_id: offer.renter_id,
                    rental_start,
                    rental_end,
                    total_amount_paid: offer.proposed_price,
                    payment_status: "pending",
                    offer_id: offer.id
                }
            ])
            .select();

        if (rentalError) {
            console.error("❌ Error creating rental history:", rentalError);
            return res.status(500).json({ message: "Database error while approving rental." });
        }

        console.log(`📌 Updating offer status to 'accepted' for offer ${offer_id}`);
        await supabase
            .from("rental_offers")
            .update({ status: "accepted" })
            .eq("id", offer_id);

        console.log("✅ Offer accepted successfully!");
        return res.status(200).json({ message: "Offer accepted!", rentalData });
    } catch (error) {
        console.error("❌ Internal Server Error in acceptRentalOffer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const rejectRentalOffer = async (req, res) => {
    try {
        const { offer_id } = req.body;

        if (!offer_id) {
            console.log("❌ Missing offer_id in rejectRentalOffer");
            return res.status(400).json({ message: "Offer ID is required" });
        }

        console.log(`📌 Rejecting rental offer with ID: ${offer_id}`);
        const { data, error } = await supabase
            .from("rental_offers")
            .update({ status: "rejected" })
            .eq("id", offer_id);

        if (error) {
            console.error("❌ Error rejecting rental offer:", error);
            return res.status(500).json({ message: "Database error while rejecting rental offer." });
        }

        console.log("✅ Offer rejected successfully!");
        return res.status(200).json({ message: "Offer rejected!", data });
    } catch (error) {
        console.error("❌ Internal Server Error in rejectRentalOffer:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const getOffersForItem = async (req, res) => {
    try {
        const { item_id } = req.params;

        const { data, error } = await supabase
            .from("rental_offers")
            .select("*")
            .eq("item_id", item_id);

        if (error) {
            return res.status(500).json({ message: "Database error fetching offers." });
        }

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }
};


const createRentalItem = async (req, res) => {
    console.log("InSie BAckend");
    try {
        const { owner_id, item_name, category, rental_price, location } = req.body;
        const photo = req.file; // Image uploaded via Multer

        // Validation: Ensure all required fields are provided
        if (!owner_id || !item_name || !category || !rental_price || !location) {
            return res.status(400).json({ error: "All fields are required." });
        }

        const status = "under_review"; // Default status for new items
        let photoUrl = null;

        // If a photo is uploaded, upload to storage
        if (photo) {
            const filename = `${item_name}-${Date.now()}.${photo.originalname.split(".").pop()}`;
            photo.originalname = filename;
            photoUrl = await uploadToStorage(photo, "rentalitems");
        }

        // Insert data into Supabase
        const { data, error } = await supabase
            .from("rental_items")
            .insert([{ owner_id, item_name, category, rental_price, location, status, photo: photoUrl }])
            .select();

        if (error) {
            console.error("Error inserting rental item:", error);
            return res.status(500).json({ error: "Failed to create rental item." });
        }

        res.status(201).json({ message: "Rental item created successfully", item: data[0] });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

//  const getUserRentalHistoryOffers = async (req, res) => {
//   try {
//     const { user_id } = req.params;

//     // ✅ Fetch Incoming Offers (User is the Owner)
//     const { data: incoming, error: incomingError } = await supabase
//       .from("rental_offers")
//       .select(`
//         id, 
//         item_id, 
//         proposed_price, 
//         status, 
//         created_at, 
//         renter_id, 
//         rental_items!inner(owner_id, item_name),
//         users!rental_offers_renter_id_fkey(username)  
//       `)
//       .eq("rental_items.owner_id", user_id)
//       .in("status", ["accepted", "rejected"]) // ✅ Only accepted & rejected
//       .order("created_at", { ascending: false });

//     // ✅ Fetch Outgoing Offers (User is the Renter)
//     const { data: outgoing, error: outgoingError } = await supabase
//       .from("rental_offers")
//       .select(`
//         id, 
//         item_id, 
//         proposed_price, 
//         status, 
//         created_at, 
//         owner_id,
//         rental_items!inner(item_name, owner_id),
//         users!rental_offers_renter_id_fkey(username)  
//       `)
//       .eq("renter_id", user_id)
//       .in("status", ["accepted", "rejected"]) // ✅ Only accepted & rejected
//       .order("created_at", { ascending: false });

//     if (incomingError || outgoingError) {
//       console.error("❌ Error fetching rental offers:", incomingError || outgoingError);
//       return res.status(500).json({ message: "Error fetching offers" });
//     }

//     return res.status(200).json({
//       incoming: incoming?.map(offer => ({
//         id: offer.id,
//         item_id: offer.item_id,
//         item_name: offer.rental_items?.item_name,
//         proposed_price: offer.proposed_price,
//         status: offer.status,
//         renter_id: offer.renter_id,
//         renter_name: offer.users?.username || "Unknown User",
//         owner_id: offer.rental_items?.owner_id,
//         owner_name: "You",
//         created_at: offer.created_at,
//       })) || [],
//       outgoing: outgoing?.map(offer => ({
//         id: offer.id,
//         item_id: offer.item_id,
//         item_name: offer.rental_items?.item_name,
//         proposed_price: offer.proposed_price,
//         status: offer.status,
//         renter_id: user_id,
//         renter_name: "You",
//         owner_id: offer.owner_id,
//         owner_name: offer.users?.username || "Unknown Owner",
//         created_at: offer.created_at,
//       })) || []
//     });
//   } catch (error) {
//     console.error("❌ Internal Server Error:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getUserRentalItems = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: "User ID is required." });
        }

        // ✅ Fetch all rental items created by this user
        const { data, error } = await supabase
            .from("rental_items")
            .select("*")
            .eq("owner_id", user_id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("❌ Supabase Error:", error);
            return res.status(500).json({ message: "Database error while fetching rental items." });
        }

        return res.status(200).json(data);
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// ✅ Export the function

const getUserRentalHistoryOffers = async (req, res) => {
    try {
        const { user_id } = req.params;

        // ✅ Fetch Incoming Offers (User is the Owner)
        const { data: incoming, error: incomingError } = await supabase
            .from("rental_offers")
            .select(`
                id, 
                item_id, 
                proposed_price, 
                status, 
                created_at, 
                users!rental_offers_renter_id_fkey(username),  
                rental_items!inner(owner_id, item_name, rental_price)  
            `)
            .eq("rental_items.owner_id", user_id)  // ✅ Only get offers where user is the owner
            .in("status", ["accepted", "rejected"]) // ✅ Fetch only accepted & rejected offers
            .order("created_at", { ascending: false });

        // ✅ Fetch Outgoing Offers (User is the Renter)
        const { data: outgoing, error: outgoingError } = await supabase
            .from("rental_offers")
            .select(`
                id, 
                item_id, 
                proposed_price, 
                status, 
                created_at, 
                rental_items!inner(item_name, rental_price, owner_id),  
                users!rental_offers_renter_id_fkey(username)  
            `)
            .eq("renter_id", user_id) // ✅ Get only offers where the user made the request
            .in("status", ["accepted", "rejected"]) // ✅ Fetch only accepted & rejected offers
            .order("created_at", { ascending: false });

        if (incomingError || outgoingError) {
            console.error("❌ Error fetching rental offers:", incomingError || outgoingError);
            return res.status(500).json({ message: "Error fetching offers" });
        }

        return res.status(200).json({ 
            incoming: incoming.map(offer => ({
                id: offer.id,
                item_id: offer.item_id,
                item_name: offer.rental_items?.item_name,
                rental_price: offer.rental_items?.rental_price,
                proposed_price: offer.proposed_price,
                status: offer.status,
                renter_name: offer.users?.username || "Unknown User", // ✅ Renter who made the request
                created_at: offer.created_at
            })),
            outgoing: outgoing.map(offer => ({
                id: offer.id,
                item_id: offer.item_id,
                item_name: offer.rental_items?.item_name,
                rental_price: offer.rental_items?.rental_price,
                proposed_price: offer.proposed_price,
                status: offer.status,
                owner_name: offer.users?.username || "Unknown Owner", // ✅ Owner of the item
                created_at: offer.created_at
            }))
        });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

// module.exports = { getRentalItems,getUserRentalOffers, submitRentalOffer, acceptRentalOffer, rejectRentalOffer, getOffersForItem };
export { getRentalItems,getUserRentalOffers,getUserRentalHistoryOffers, createRentalItem, submitRentalOffer, acceptRentalOffer, rejectRentalOffer, getOffersForItem };
