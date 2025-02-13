// const { supabase } = require("../config/db");

import {supabase} from '../config/db.js'

// // ✅ Get all rental items
// const getRentalItems = async (req, res) => {
//     try {
//         const { data, error } = await supabase.from("rental_items").select("*");

//         if (error) {
//             console.error("❌ Supabase Error:", error);
//             return res.status(500).json({ message: "Database error while fetching rental items." });
//         }

//         return res.status(200).json(data);
//     } catch (error) {
//         console.error("❌ Error fetching rental items:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// // ✅ Submit a rental offer
// const submitRentalOffer = async (req, res) => {
//     try {
//         const { item_id, renter_id, proposed_price } = req.body;

//         if (!item_id || !renter_id || !proposed_price) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const { data, error } = await supabase
//             .from("rental_offers")
//             .insert([{ item_id, renter_id, proposed_price, status: "pending" }])
//             .select();

//         if (error) {
//             console.error("❌ Error submitting rental offer:", error);
//             return res.status(500).json({ message: "Database error while submitting rental offer." });
//         }

//         return res.status(201).json({ message: "Rental offer submitted!", data });
//     } catch (error) {
//         console.error("❌ Internal Server Error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// // ✅ Accept a rental offer
// const acceptRentalOffer = async (req, res) => {
//     try {
//         const { offer_id, rental_start, rental_end } = req.body;

//         if (!offer_id || !rental_start || !rental_end) {
//             return res.status(400).json({ message: "All fields are required" });
//         }

//         const { data: offer, error: offerError } = await supabase
//             .from("rental_offers")
//             .select("*")
//             .eq("id", offer_id)
//             .single();

//         if (offerError || !offer) {
//             return res.status(404).json({ message: "Offer not found." });
//         }

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

// // ✅ Reject a rental offer
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

// // ✅ Get all offers for a rental item
// const getOffersForItem = async (req, res) => {
//     try {
//         const { item_id } = req.params;

//         const { data, error } = await supabase
//             .from("rental_offers")
//             .select("*")
//             .eq("item_id", item_id);

//         if (error) {
//             return res.status(500).json({ message: "Database error fetching offers." });
//         }

//         return res.status(200).json(data);
//     } catch (error) {
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };


const getRentalItems = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("rental_items")
            .select("*")
            .eq("status", "available"); // ✅ Only fetch available items

        if (error) {
            console.error("❌ Supabase Error:", error);
            return res.status(500).json({ message: "Database error while fetching rental items." });
        }

        return res.status(200).json(data);
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



// const getUserRentalOffers = async (req, res) => {
//     try {
//         const { user_id } = req.params;

//         // ✅ Get incoming offers (where user is the owner of the rental item & offer is pending)
//         const { data: incoming, error: incomingError } = await supabase
//             .from("rental_offers")
//             .select(`
//                 id, 
//                 item_id, 
//                 proposed_price, 
//                 status, 
//                 created_at, 
//                 users!rental_offers_renter_id_fkey(username),
//                 rental_items!inner(owner_id, item_name, rental_price)  -- Include rental_price
//             `)
//             .eq("rental_items.owner_id", user_id)
//             .eq("status", "pending")  // ✅ Only pending offers
//             .order("created_at", { ascending: false });

//         // ✅ Get outgoing offers (where user is the renter)
//         const { data: outgoing, error: outgoingError } = await supabase
//             .from("rental_offers")
//             .select(`
//                 id, 
//                 item_id, 
//                 proposed_price, 
//                 status, 
//                 created_at, 
//                 rental_items(item_name, rental_price)  -- Include rental_price
//             `)
//             .eq("renter_id", user_id)
//             .eq("status", "pending")  // ✅ Only pending offers
//             .order("created_at", { ascending: false });

//         if (incomingError || outgoingError) {
//             console.error("❌ Error fetching rental offers:", incomingError || outgoingError);
//             return res.status(500).json({ message: "Error fetching offers" });
//         }

//         return res.status(200).json({ 
//             incoming: incoming.map(offer => ({
//                 id: offer.id,
//                 item_id: offer.item_id,
//                 item_name: offer.rental_items?.item_name,
//                 rental_price: offer.rental_items?.rental_price,  // ✅ Include original price
//                 proposed_price: offer.proposed_price,
//                 status: offer.status,
//                 renter_name: offer.users?.username || "Unknown User",
//                 created_at: offer.created_at
//             })),
//             outgoing: outgoing.map(offer => ({
//                 id: offer.id,
//                 item_id: offer.item_id,
//                 item_name: offer.rental_items?.item_name,
//                 rental_price: offer.rental_items?.rental_price,  // ✅ Include original price
//                 proposed_price: offer.proposed_price,
//                 status: offer.status,
//                 created_at: offer.created_at
//             }))
//         });
//     } catch (error) {
//         console.error("❌ Internal Server Error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// const getUserRentalOffers = async (req, res) => {
//     try {
//         const { user_id } = req.params;

//         // ✅ Get incoming offers (where user is the owner of the rental item & offer is pending)
//         const { data: incoming, error: incomingError } = await supabase
//             .from("rental_offers")
//             .select(`
//                 id, 
//                 item_id, 
//                 proposed_price, 
//                 status, 
//                 created_at, 
//                 users!rental_offers_renter_id_fkey(username),
//                 rental_items!inner(owner_id, item_name, rental_price)  
//             `)
//             .eq("rental_items.owner_id", user_id)
//             .eq("status", "pending")  // ✅ Only pending offers
//             .order("created_at", { ascending: false });

//         // ✅ Get outgoing offers (where user is the renter)
//         const { data: outgoing, error: outgoingError } = await supabase
//             .from("rental_offers")
//             .select(`
//                 id, 
//                 item_id, 
//                 proposed_price, 
//                 status, 
//                 created_at, 
//                 rental_items(item_name, rental_price, owner_id),
//                 users!rental_items_owner_id_fkey(username)  -- ✅ Get owner's name
//             `)
//             .eq("renter_id", user_id)
//             .eq("status", "pending")  // ✅ Only pending offers
//             .order("created_at", { ascending: false });

//         if (incomingError || outgoingError) {
//             console.error("❌ Error fetching rental offers:", incomingError || outgoingError);
//             return res.status(500).json({ message: "Error fetching offers" });
//         }

//         return res.status(200).json({ 
//             incoming: incoming.map(offer => ({
//                 id: offer.id,
//                 item_id: offer.item_id,
//                 item_name: offer.rental_items?.item_name,
//                 rental_price: offer.rental_items?.rental_price,  // ✅ Include original price
//                 proposed_price: offer.proposed_price,
//                 status: offer.status,
//                 renter_name: offer.users?.username || "Unknown User",  // ✅ Get renter name
//                 created_at: offer.created_at
//             })),
//             outgoing: outgoing.map(offer => ({
//                 id: offer.id,
//                 item_id: offer.item_id,
//                 item_name: offer.rental_items?.item_name,
//                 rental_price: offer.rental_items?.rental_price,  // ✅ Include original price
//                 proposed_price: offer.proposed_price,
//                 status: offer.status,
//                 owner_name: offer.users?.username || "Unknown Owner",  // ✅ Get owner's name
//                 created_at: offer.created_at
//             }))
//         });
//     } catch (error) {
//         console.error("❌ Internal Server Error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

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



const acceptRentalOffer = async (req, res) => {
    try {
        const { offer_id, rental_start, rental_end } = req.body;

        if (!offer_id || !rental_start || !rental_end) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // ✅ Step 1: Get offer details
        const { data: offer, error: offerError } = await supabase
            .from("rental_offers")
            .select("*")
            .eq("id", offer_id)
            .single();

        if (offerError || !offer) {
            return res.status(404).json({ message: "Offer not found." });
        }

        // ✅ Step 2: Update the rental item's status to 'rented'
        const { error: itemError } = await supabase
            .from("rental_items")
            .update({ status: "rented" })
            .eq("id", offer.item_id);

        if (itemError) {
            console.error("❌ Error updating item status:", itemError);
            return res.status(500).json({ message: "Failed to update item status." });
        }

        // ✅ Step 3: Insert rental record in rental_histories
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
            return res.status(500).json({ message: "Database error while approving rental." });
        }

        // ✅ Step 4: Update offer status to 'accepted'
        await supabase
            .from("rental_offers")
            .update({ status: "accepted" })
            .eq("id", offer_id);

        return res.status(200).json({ message: "Offer accepted!", rentalData });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
const rejectRentalOffer = async (req, res) => {
    try {
        const { offer_id } = req.body;

        if (!offer_id) {
            return res.status(400).json({ message: "Offer ID is required" });
        }

        const { data, error } = await supabase
            .from("rental_offers")
            .update({ status: "rejected" })
            .eq("id", offer_id);

        if (error) {
            console.error("❌ Error rejecting rental offer:", error);
            return res.status(500).json({ message: "Database error while rejecting rental offer." });
        }

        return res.status(200).json({ message: "Offer rejected!", data });
    } catch (error) {
        console.error("❌ Internal Server Error:", error);
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



// module.exports = { getRentalItems,getUserRentalOffers, submitRentalOffer, acceptRentalOffer, rejectRentalOffer, getOffersForItem };
export { getRentalItems,getUserRentalOffers, submitRentalOffer, acceptRentalOffer, rejectRentalOffer, getOffersForItem };
